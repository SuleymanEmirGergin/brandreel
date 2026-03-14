# Design Tokens Template

Use this template when the user wants a reusable token foundation for a UI system.

The goal is to define the core visual rules that can scale across components, pages, and platforms.

---

# Token System Summary

Provide a short summary of the design system direction.

Include:

- product type
- platform scope
- visual personality

Example:

Product: B2B SaaS dashboard  
Platforms: web + mobile  
Visual personality: clean, technical, calm, high-clarity

---

# Color Tokens

Define the core color system.

## Brand / Primary

- primary
- primary-foreground

## Secondary

- secondary
- secondary-foreground

## Accent

- accent
- accent-foreground

## Surfaces

- background
- foreground
- surface
- surface-foreground

## Utility / Feedback

- success
- success-foreground
- warning
- warning-foreground
- danger
- danger-foreground
- info
- info-foreground

## Neutrals

- muted
- muted-foreground
- border
- input
- ring

Guidance:

- keep the palette controlled
- avoid too many accents
- define clear contrast relationships
- ensure tokens work in both light and dark themes if needed

---

# Typography Tokens

Define text styles and font roles.

## Font Families

- font-sans
- font-display
- font-mono

## Font Sizes

- text-xs
- text-sm
- text-base
- text-lg
- text-xl
- text-2xl
- text-3xl
- text-4xl

## Font Weights

- weight-regular
- weight-medium
- weight-semibold
- weight-bold

## Line Heights

- leading-tight
- leading-snug
- leading-normal
- leading-relaxed

Guidance:

- heading scale should create clear hierarchy
- body text should remain highly readable
- avoid overcomplicated size systems

---

# Spacing Tokens

Define spacing rhythm.

Typical spacing scale:

- space-1
- space-2
- space-3
- space-4
- space-6
- space-8
- space-10
- space-12
- space-16

Optional numeric mapping example:

- space-1 = 4
- space-2 = 8
- space-3 = 12
- space-4 = 16
- space-6 = 24
- space-8 = 32
- space-10 = 40
- space-12 = 48
- space-16 = 64

Guidance:

- prefer a consistent spacing rhythm
- use spacing to reinforce hierarchy and calmness
- avoid arbitrary paddings and margins

---

# Radius Tokens

Define corner softness.

Examples:

- radius-none
- radius-sm
- radius-md
- radius-lg
- radius-xl
- radius-full

Guidance:

- keep radius behavior consistent across components
- let radius reflect product personality
- sharp = technical / enterprise
- softer = friendly / consumer

---

# Elevation Tokens

Define depth and layering.

Examples:

- shadow-none
- shadow-sm
- shadow-md
- shadow-lg
- shadow-xl

Optional surface tokens:

- elevation-base
- elevation-raised
- elevation-overlay

Guidance:

- avoid overly dramatic shadows
- use subtle elevation for clarity
- let depth separate surfaces, not decorate them

---

# Border Tokens

Define border behavior.

Examples:

- border-default
- border-strong
- border-muted
- border-focus

Guidance:

- borders should improve structure
- avoid random border colors
- keep focus states clearly visible

---

# Motion Tokens

Define motion timing and feel.

Examples:

- motion-fast
- motion-base
- motion-slow

Optional easing tokens:

- ease-standard
- ease-emphasized
- ease-decelerate

Guidance:

- motion should feel intentional
- avoid flashy transitions
- keep UI transitions fast and supportive

---

# Component Token Mapping

Explain how tokens influence components.

Examples:

Buttons:

- primary uses `primary`
- secondary uses `secondary`
- danger uses `danger`

Cards:

- use `surface`
- use `border`
- use `shadow-sm` or `shadow-none`

Inputs:

- use `input`
- focus ring uses `ring`

Navigation:

- use neutral surface tokens
- active items use accent or primary emphasis

---

# Light / Dark Theme Notes

If relevant, explain how tokens should adapt between themes.

Guidance:

- preserve semantic relationships
- do not invert meaning
- keep contrast accessible
- maintain brand recognition across themes

---

# Platform Adaptation Notes

Explain whether tokens stay identical or adapt by platform.

Examples:

Web:

- slightly denser spacing
- sharper surfaces

Mobile:

- larger touch spacing
- stronger component separation

Cross-platform systems should preserve the same visual DNA while adapting ergonomics.

---

# Implementation Notes

Optional developer-facing notes.

Examples:

- Tailwind theme mapping
- CSS variable naming
- React Native theme object
- design token JSON structure

Possible implementation targets:

- Tailwind config
- CSS variables
- theme.ts
- tokens.ts

The token system should remain easy to map into real code.
