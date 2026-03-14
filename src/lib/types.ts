// ========================================
// BrandReel — TypeScript Interfaces
// ========================================

export interface BrandKit {
  name: string;
  domain: string;
  logo: string;
  colors: string[];
  slogan: string;
  industry: string;
}

export interface Script {
  id: number;
  hook: string;
  body: string;
  cta: string;
}

export interface ImageResult {
  id: number;
  url: string;
  prompt: string;
  scriptId: number;
}

export interface VideoResult {
  id: number;
  url: string;
  thumbnailUrl: string;
  duration: number;
  scriptId: number;
}

export interface GenerationBundle {
  brandKit: BrandKit;
  scripts: Script[];
  images: ImageResult[];
  videos: VideoResult[];
  downloadUrl: string;
  stats: {
    totalImages: number;
    totalVideos: number;
    totalTexts: number;
    generationTime: number;
    estimatedCost: number;
  };
}

export type PipelineStep =
  | 'analyze'
  | 'script'
  | 'visual'
  | 'video'
  | 'package';

export interface PipelineStatus {
  currentStep: PipelineStep;
  progress: number;
  completedSteps: PipelineStep[];
  previewImages: ImageResult[];
}
