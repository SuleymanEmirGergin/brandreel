# Example: Analyze Reference

## User Request

“Bu ekran görüntüsündeki (veya stripe.com landing page) tasarım dilini analiz et. Font, renk, spacing ve buton stilini çıkar.”

---

## Expected Task Type

Extract / Analyze

---

## Expected Mode

Mimic Mode

---

## Expected Output Scope

The response should extract the design DNA from the reference and explain the rules behind the visual language.

It should include:

- Typography hierarchy
- Color palette and contrast logic
- Spacing rhythm and grid discipline
- Component character (radius, shadows, borders)
- Navigation and layout structure

It should not generate a new UI, but provide the rules to build one.

---

## Expected Response Structure

1. Visual Tone Summary
2. Typography DNA
3. Color Strategy
4. Spacing & Rhythm
5. Component Grammar
6. Navigation & Layout Patterns

---

## Good Response Characteristics

A strong answer should:

- identify specific font categories (e.g., geometric sans-serif)
- explain color relationships (e.g., deep charcoal neutrals with high-chroma primary blue)
- describe radius and shadow logic (e.g., 8px soft radius, multi-layered diffuse shadows)
- capture the “vibe” (e.g., professional, technical, high-trust)
- provide actionable design tokens

---

## Example Good Output Direction

- Typography: Inter or similar, large headings, tight letter-pacing on display styles
- Colors: Neutral grey scale (900 to 50), accent Primary Violet (600)
- Components: Low-elevation cards, hairline borders (1px), subtle hover interactions
- Spacing: 8pt grid, generous horizontal padding in hero sections

---

## Bad Response Characteristics

Avoid:

- saying "it looks modern and clean" without technical details
- giving random hex codes without explaining their role
- missing the typography personality
- failing to identify the layout structure
