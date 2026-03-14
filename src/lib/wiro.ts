/**
 * Wiro.ai API client — server-side only.
 * Auth: WIRO_API_KEY. Wiro dashboard uses x-api-key header (set WIRO_USE_X_API_KEY=true or leave default).
 * Task flow: Run returns taskid + socketaccesstoken → poll POST /v1/Task/Detail with tasktoken (socketaccesstoken).
 */

const WIRO_BASE = process.env.WIRO_BASE_URL ?? 'https://api.wiro.ai';

/** Wiro Task/Detail endpoint (tasktoken = socketaccesstoken from Run response) */
const WIRO_TASK_DETAIL_PATH = '/v1/Task/Detail';

// ---- Types ----

export type WiroErrorCode =
  | 'auth_error'
  | 'upstream_error'
  | 'timeout_error'
  | 'invalid_response'
  | 'task_failed';

export type WiroResponseNormalized =
  | { ok: true; text: string; raw: unknown }
  | { ok: false; error: string; code?: WiroErrorCode; raw: unknown }
  | { ok: false; async: true; taskId: string; taskToken: string; raw: unknown };

export class WiroAuthError extends Error {
  readonly code: WiroErrorCode = 'auth_error';
  constructor(message: string = 'Wiro API key invalid or rejected') {
    super(message);
    this.name = 'WiroAuthError';
  }
}

export class WiroUpstreamError extends Error {
  readonly code: WiroErrorCode = 'upstream_error';
  readonly status: number;
  readonly body: string;
  constructor(status: number, body: string) {
    super(`Wiro API error (${status}): ${body || 'No body'}`);
    this.name = 'WiroUpstreamError';
    this.status = status;
    this.body = body;
  }
}

export class WiroInvalidResponseError extends Error {
  readonly code: WiroErrorCode = 'invalid_response';
  constructor(message: string, public raw?: unknown) {
    super(message);
    this.name = 'WiroInvalidResponseError';
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function getString(obj: Record<string, unknown>, ...paths: string[]): string | null {
  for (const path of paths) {
    const parts = path.split('.');
    let cur: unknown = obj;
    for (const p of parts) {
      if (cur == null || typeof cur !== 'object') break;
      cur = (cur as Record<string, unknown>)[p];
    }
    if (typeof cur === 'string' && cur.trim().length > 0) return cur.trim();
  }
  return null;
}

/** Mask token for logs: first 6 chars + "..." */
export function maskToken(token: string): string {
  if (token.length <= 6) return '***';
  return token.slice(0, 6) + '...';
}

function getToken(): string | null {
  const raw = process.env.WIRO_API_KEY;
  if (raw == null || typeof raw !== 'string') return null;
  const t = raw.trim();
  return t === '' ? null : t;
}

export function hasWiroKey(): boolean {
  return getToken() != null;
}

function getAuthHeaders(): { headers: Record<string, string>; token: string } {
  const token = getToken();
  if (!token) {
    throw new WiroAuthError('WIRO_API_KEY is not set');
  }
  const useXApiKey = process.env.WIRO_USE_X_API_KEY !== 'false';
  return {
    headers: {
      'Content-Type': 'application/json',
      ...(useXApiKey ? { 'x-api-key': token } : { Authorization: `Bearer ${token}` }),
    },
    token,
  };
}

// ---- Response normalizer ----

const TEXT_PATHS = [
  'text',
  'output_text',
  'output',
  'content',
  'message',
  'response',
  'data.text',
  'data.output_text',
  'data.output',
  'data.content',
  'data.message',
  'data.response',
  'result.text',
  'result.output_text',
  'result.output',
  'result.content',
  'result.message',
  'result.response',
  'result',
];

function extractTextFromObject(obj: Record<string, unknown>): string | null {
  for (const path of TEXT_PATHS) {
    const value = getString(obj, path);
    if (value != null) return value;
  }
  const result = obj.result;
  if (typeof result === 'string' && result.trim().length > 0) return result.trim();
  return null;
}

/**
 * Normalizes Wiro API response: extracts text from various shapes or detects async task / errors.
 */
export function normalizeWiroResponse(raw: unknown): WiroResponseNormalized {
  if (!isRecord(raw)) {
    return { ok: false, error: 'Response is not an object', code: 'invalid_response', raw };
  }

  const errors = raw.errors;
  const result = raw.result;
  const taskid =
    typeof raw.taskid === 'string'
      ? raw.taskid
      : typeof raw.task_id === 'string'
        ? raw.task_id
        : undefined;
  const taskToken =
    typeof raw.socketaccesstoken === 'string' && raw.socketaccesstoken.trim()
      ? raw.socketaccesstoken.trim()
      : undefined;
  const hasAsyncKeys = (taskid != null || taskToken != null) && taskToken != null;

  if (Array.isArray(errors) && errors.length > 0) {
    const first = errors[0];
    const message =
      isRecord(first) && typeof first.message === 'string'
        ? first.message
        : typeof first === 'string'
          ? first
          : `Wiro error (code ${isRecord(first) ? (first as { code?: unknown }).code : 'unknown'})`;
    const code = result === false ? 'auth_error' : 'upstream_error';
    return { ok: false, error: message, code: code as WiroErrorCode, raw };
  }

  const text = extractTextFromObject(raw);
  if (text != null) {
    return { ok: true, text, raw };
  }

  if (hasAsyncKeys && taskToken) {
    return { ok: false, async: true, taskId: taskid ?? '', taskToken, raw };
  }

  const keys = Object.keys(raw).join(', ');
  return {
    ok: false,
    error: `Wiro response has no text field. Keys: ${keys}`,
    code: 'invalid_response',
    raw,
  };
}

// ---- Task polling (Wiro: POST /v1/Task/Detail with tasktoken = socketaccesstoken) ----

const POLL_MAX_RETRIES = Number(process.env.WIRO_POLL_MAX_RETRIES) || 20;
const POLL_DELAY_MS = Number(process.env.WIRO_POLL_DELAY_MS) || 2000;
const POLL_TIMEOUT_MS = Number(process.env.WIRO_POLL_TIMEOUT_MS) ?? 60000;

const TASK_STATUS_DONE = ['task_postprocess_end', 'task_end', 'task_complete'];

function isTaskDone(status: unknown): boolean {
  if (typeof status !== 'string') return false;
  const s = status.trim().toLowerCase();
  return TASK_STATUS_DONE.some((d) => s === d || s.endsWith('_end'));
}

/** Returns extracted text when task is done, or null if still in progress / no text (e.g. image-only output). */
function extractTextFromTaskDetail(raw: unknown): string | null {
  if (!isRecord(raw)) return null;
  const list = raw.tasklist;
  if (!Array.isArray(list) || list.length === 0) return null;
  const task = list[0] as Record<string, unknown>;
  const status = task.status;
  if (!isTaskDone(status)) return null;

  const outputs = task.outputs;
  if (Array.isArray(outputs) && outputs.length > 0) {
    const first = outputs[0] as Record<string, unknown>;
    if (typeof first.text === 'string' && first.text.trim()) return first.text.trim();
    if (typeof first.content === 'string' && first.content.trim()) return first.content.trim();
  }
  const params = task.parameters as Record<string, unknown> | undefined;
  if (params) {
    const text =
      typeof params.output === 'string'
        ? params.output
        : typeof params.text === 'string'
          ? params.text
          : typeof params.result === 'string'
            ? params.result
            : null;
    if (text && text.trim()) return text.trim();
  }
  const debug = task.debugoutput;
  if (typeof debug === 'string' && debug.trim()) return debug.trim();
  return null;
}

async function fetchTaskDetail(taskToken: string): Promise<unknown> {
  const { headers } = getAuthHeaders();
  const base = WIRO_BASE.replace(/\/$/, '');
  const path = process.env.WIRO_TASK_DETAIL_PATH ?? WIRO_TASK_DETAIL_PATH;
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ tasktoken: taskToken }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 401) throw new WiroAuthError('Wiro API key invalid or rejected');
    throw new WiroUpstreamError(res.status, text);
  }
  return res.json();
}

async function pollTaskResult(taskToken: string, taskIdForLog: string): Promise<string> {
  const start = Date.now();
  for (let i = 0; i < POLL_MAX_RETRIES; i++) {
    if (Date.now() - start > POLL_TIMEOUT_MS) {
      throw new WiroInvalidResponseError(`Task ${taskIdForLog} timed out after ${POLL_TIMEOUT_MS}ms`);
    }
    const raw = await fetchTaskDetail(taskToken);
    if (isRecord(raw) && Array.isArray(raw.errors) && raw.errors.length > 0) {
      const first = raw.errors[0] as Record<string, unknown>;
      const msg = typeof first.message === 'string' ? first.message : 'Task detail error';
      throw new WiroInvalidResponseError(msg, raw);
    }
    const text = extractTextFromTaskDetail(raw);
    if (text != null) return text;
    await new Promise((r) => setTimeout(r, POLL_DELAY_MS));
  }
  throw new WiroInvalidResponseError(
    `Task ${taskIdForLog} did not complete within ${POLL_MAX_RETRIES} attempts`
  );
}

// ---- Run model ----

/**
 * Calls Wiro Run API. Throws WiroAuthError on 401, WiroUpstreamError on other non-2xx.
 */
export async function runModel<T = unknown>(
  modelSlug: string,
  body: Record<string, unknown>
): Promise<T> {
  const { headers, token } = getAuthHeaders();
  const url = `${WIRO_BASE.replace(/\/$/, '')}/v1/Run/${modelSlug}`;

  const runTimeoutMs = Number(process.env.WIRO_RUN_TIMEOUT_MS) || 90000; // 90s; Wiro yanıt vermezse asılı kalmayı önler
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(runTimeoutMs),
  });

  const responseKeys: string[] = [];
  let responseBody: string | null = null;

  if (!res.ok) {
    responseBody = await res.text();
    try {
      const parsed = JSON.parse(responseBody) as Record<string, unknown>;
      responseKeys.push(...Object.keys(parsed));
    } catch {
      // ignore
    }
    if (res.status === 401) {
      console.error(
        '[wiro] 401 Unauthorized — endpoint:',
        url,
        '| response keys:',
        responseKeys.length ? responseKeys.join(', ') : 'n/a'
      );
      throw new WiroAuthError('Wiro API key invalid or rejected');
    }
    console.error(
      '[wiro] upstream_error — endpoint:',
      url,
      '| status:',
      res.status,
      '| response keys:',
      responseKeys.length ? responseKeys.join(', ') : 'n/a'
    );
    throw new WiroUpstreamError(res.status, responseBody || res.statusText);
  }

  const data = (await res.json()) as T;
  if (isRecord(data)) {
    responseKeys.push(...Object.keys(data));
  }
  if (process.env.NODE_ENV === 'development') {
    console.log('[wiro] success — endpoint:', url, '| status:', res.status, '| keys:', responseKeys.join(', '));
  }
  return data;
}

export const WIRO_LLM_MODEL_DEFAULT = 'google/gemini-3-pro';
export const WIRO_FLUX_MODEL = 'black-forest-labs/flux-2-klein-base-9b';
export const WIRO_SEEDANCE_MODEL = 'bytedance/seedance-pro-v1.5-uncensored';

/** LLM için kullanılacak model: WIRO_LLM_MODEL env yoksa varsayılan (Gemini). Wiro üzerinden farklı model denemek için .env.local'de ayarlayın. */
export function getLLMModelSlug(): string {
  const env = process.env.WIRO_LLM_MODEL;
  if (env && typeof env === 'string' && env.trim()) return env.trim();
  return WIRO_LLM_MODEL_DEFAULT;
}

/** Görsel üretimi için kullanılacak model: WIRO_IMAGE_MODEL env yoksa FLUX. */
export function getImageModelSlug(): string {
  const env = process.env.WIRO_IMAGE_MODEL;
  if (env && typeof env === 'string' && env.trim()) return env.trim();
  return WIRO_FLUX_MODEL;
}

function extractOutputUrlsFromTaskDetail(raw: unknown): string[] {
  if (!isRecord(raw)) return [];
  const list = raw.tasklist;
  if (!Array.isArray(list) || list.length === 0) return [];
  const task = list[0] as Record<string, unknown>;
  const outputs = task.outputs;
  if (!Array.isArray(outputs)) return [];
  return outputs
    .map((o) => (o as Record<string, unknown>).url)
    .filter((u): u is string => typeof u === 'string' && u.trim().length > 0);
}

/**
 * Run Wiro image model (e.g. FLUX) with multipart body, then poll Task/Detail until done.
 * inputImageUrls: up to 4 image URLs. Returns first output image URL(s) from task.
 */
export async function runImageModel(
  modelSlug: string,
  options: {
    prompt: string;
    negativePrompt?: string;
    inputImageUrls?: string[];
    steps?: number;
    scale?: number;
    samples?: number;
    width?: number;
    height?: number;
    seed?: number;
  }
): Promise<string[]> {
  const token = getToken();
  if (!token) throw new WiroAuthError('WIRO_API_KEY is not set');
  const useXApiKey = process.env.WIRO_USE_X_API_KEY !== 'false';
  const form = new FormData();
  form.append('prompt', options.prompt);
  if (options.negativePrompt?.trim()) form.append('negative_prompt', options.negativePrompt.trim());
  if (options.steps != null) form.append('steps', String(options.steps));
  if (options.scale != null) form.append('scale', String(options.scale));
  if (options.samples != null) form.append('samples', String(options.samples ?? 1));
  if (options.width != null) form.append('width', String(options.width));
  if (options.height != null) form.append('height', String(options.height));
  if (options.seed != null) form.append('seed', String(options.seed));
  const urls = options.inputImageUrls ?? [];
  for (let i = 0; i < Math.min(4, urls.length); i++) {
    form.append('inputImage', urls[i]);
  }
  const headers: Record<string, string> = useXApiKey ? { 'x-api-key': token } : { Authorization: `Bearer ${token}` };
  const base = WIRO_BASE.replace(/\/$/, '');
  const runUrl = `${base}/v1/Run/${modelSlug}`;
  const res = await fetch(runUrl, { method: 'POST', headers, body: form });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 401) throw new WiroAuthError('Wiro API key invalid or rejected');
    throw new WiroUpstreamError(res.status, text);
  }
  const raw = (await res.json()) as Record<string, unknown>;
  const normalized = normalizeWiroResponse(raw);
  if (normalized.ok) return [normalized.text];
  if ('async' in normalized && normalized.async && normalized.taskToken) {
    const start = Date.now();
    for (let i = 0; i < POLL_MAX_RETRIES; i++) {
      if (Date.now() - start > POLL_TIMEOUT_MS) {
        throw new WiroInvalidResponseError(`Image task timed out after ${POLL_TIMEOUT_MS}ms`);
      }
      const detail = await fetchTaskDetail(normalized.taskToken);
      if (isRecord(detail) && Array.isArray(detail.errors) && detail.errors.length > 0) {
        const first = detail.errors[0] as Record<string, unknown>;
        throw new WiroInvalidResponseError(
          typeof first.message === 'string' ? first.message : 'Task detail error',
          detail
        );
      }
      const urlsOut = extractOutputUrlsFromTaskDetail(detail);
      if (urlsOut.length > 0) return urlsOut;
      await new Promise((r) => setTimeout(r, POLL_DELAY_MS));
    }
    throw new WiroInvalidResponseError('Image task did not complete within max retries');
  }
  throw new WiroInvalidResponseError(normalized.error ?? 'Wiro image run failed', normalized.raw);
}

/**
 * Run Wiro video model (e.g. ByteDance Seedance) with multipart body, then poll Task/Detail until done.
 * inputImage: 1 URL (first frame). inputImageLast: 1 URL (last frame). Returns output video/image URL(s).
 */
export async function runVideoModel(
  modelSlug: string,
  options: {
    prompt: string;
    inputImageUrl?: string;
    inputImageLastUrl?: string;
    resolution?: string;
    ratio?: string;
    duration?: number;
    generateAudio?: boolean;
    watermark?: boolean;
    seed?: number;
    cameraFixed?: boolean;
  }
): Promise<string[]> {
  const token = getToken();
  if (!token) throw new WiroAuthError('WIRO_API_KEY is not set');
  const useXApiKey = process.env.WIRO_USE_X_API_KEY !== 'false';
  const form = new FormData();
  form.append('prompt', options.prompt);
  if (options.inputImageUrl) form.append('inputImage', options.inputImageUrl);
  if (options.inputImageLastUrl) form.append('inputImageLast', options.inputImageLastUrl);
  if (options.resolution != null) form.append('resolution', options.resolution);
  if (options.ratio != null) form.append('ratio', options.ratio);
  if (options.duration != null) form.append('duration', String(options.duration));
  if (options.generateAudio != null) form.append('generateAudio', String(options.generateAudio));
  if (options.watermark != null) form.append('watermark', String(options.watermark));
  if (options.seed != null) form.append('seed', String(options.seed));
  if (options.cameraFixed != null) form.append('cameraFixed', String(options.cameraFixed));
  const headers: Record<string, string> = useXApiKey ? { 'x-api-key': token } : { Authorization: `Bearer ${token}` };
  const base = WIRO_BASE.replace(/\/$/, '');
  const runUrl = `${base}/v1/Run/${modelSlug}`;
  const res = await fetch(runUrl, { method: 'POST', headers, body: form });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 401) throw new WiroAuthError('Wiro API key invalid or rejected');
    throw new WiroUpstreamError(res.status, text);
  }
  const raw = (await res.json()) as Record<string, unknown>;
  const normalized = normalizeWiroResponse(raw);
  if (normalized.ok) return [normalized.text];
  if ('async' in normalized && normalized.async && normalized.taskToken) {
    const start = Date.now();
    for (let i = 0; i < POLL_MAX_RETRIES; i++) {
      if (Date.now() - start > POLL_TIMEOUT_MS) {
        throw new WiroInvalidResponseError(`Video task timed out after ${POLL_TIMEOUT_MS}ms`);
      }
      const detail = await fetchTaskDetail(normalized.taskToken);
      if (isRecord(detail) && Array.isArray(detail.errors) && detail.errors.length > 0) {
        const first = detail.errors[0] as Record<string, unknown>;
        throw new WiroInvalidResponseError(
          typeof first.message === 'string' ? first.message : 'Task detail error',
          detail
        );
      }
      const urlsOut = extractOutputUrlsFromTaskDetail(detail);
      if (urlsOut.length > 0) return urlsOut;
      await new Promise((r) => setTimeout(r, POLL_DELAY_MS));
    }
    throw new WiroInvalidResponseError('Video task did not complete within max retries');
  }
  throw new WiroInvalidResponseError(normalized.error ?? 'Wiro video run failed', normalized.raw);
}

/**
 * Run LLM prompt and return final text. Handles sync response, async task (taskid) with polling,
 * and multiple response shapes (text, output_text, content, result.text, etc.).
 */
export async function runLLMPrompt(prompt: string): Promise<string> {
  const body: Record<string, unknown> = { prompt };

  const raw = await runModel<unknown>(getLLMModelSlug(), body);
  const normalized = normalizeWiroResponse(raw);

  if (normalized.ok) {
    return normalized.text;
  }

  if (normalized.code === 'auth_error') {
    throw new WiroAuthError(normalized.error ?? 'Wiro API key invalid or rejected');
  }

  if ('async' in normalized && normalized.async && normalized.taskToken) {
    return pollTaskResult(normalized.taskToken, normalized.taskId || 'task');
  }

  throw new WiroInvalidResponseError(normalized.error ?? 'Unknown Wiro response', normalized.raw);
}
