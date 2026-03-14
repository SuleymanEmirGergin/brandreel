# System Mode

This mode is used when the user wants a **design system**, **design tokens**, or a **reusable UI component architecture**.

Instead of designing isolated screens, the agent should construct a **coherent visual system** that can scale across multiple pages, features, and platforms.

---

# When To Use

Use this mode when the user asks for:

- a design system
- design tokens
- UI consistency rules
- component architecture
- cross-platform UI language

Example requests:

- “Bir design system oluştur.”
- “Web ve mobil için ortak UI sistemi kur.”
- “Design token yapısı çıkar.”
- “Component sistemi tasarla.”
- “Reusable UI mimarisi öner.”

---

# Core Philosophy

System Mode treats the UI as a **design language**, not a collection of screens.

A strong design system ensures:

- visual consistency
- faster development
- reusable components
- scalable UI architecture

The design must function as a **system of rules**.

---

# System Design Order

Always build the system in this order.

## 1. Design Tokens

Define the core tokens that drive the system.

Tokens typically include:

- colors
- typography scale
- spacing scale
- radius
- shadows
- motion

Tokens should be reusable and platform-agnostic.

---

## 2. Typography System

Define typography hierarchy.

Include:

- font family
- heading scale
- body text scale
- line height
- weight variations

Goal:

Strong readability and hierarchy.

---

## 3. Spacing System

Define spacing rhythm.

Most systems use an **8pt spacing scale**.

Example spacing tokens:

4  
8  
12  
16  
24  
32  
48  
64

Spacing should remain consistent across layouts.

---

## 4. Shape Language

Define component geometry.

Examples:

- sharp corners
- soft rounded corners
- minimal borders
- flat surfaces
- layered surfaces

This defines the **visual personality** of the product.

---

## 5. Surface & Elevation

Define how UI surfaces behave.

Examples:

- background surfaces
- cards
- modals
- floating layers

Determine:

- shadow strength
- border visibility
- layering hierarchy

---

## 6. Component System

Define reusable components.

Typical components include:

- buttons
- inputs
- dropdowns
- cards
- navigation
- tabs
- tables
- modals
- alerts
- badges
- empty states

Each component should follow the system tokens.

---

## 7. Layout Patterns

Define layout rules.

Examples:

- grid system
- section spacing
- container widths
- column behavior

Layouts should maintain rhythm and alignment.

---

# Cross-Platform Consistency

When the system supports both web and mobile:

Preserve:

- typography hierarchy
- color palette
- spacing rhythm
- shape language

Adapt:

- layout density
- navigation patterns
- interaction models

---

# Token Example

Example token structure:

Colors:

- primary
- secondary
- accent
- background
- surface
- border
- muted

Typography:

- text-xs
- text-sm
- text-base
- text-lg
- text-xl
- text-2xl
- text-4xl

Spacing:

- space-1
- space-2
- space-3
- space-4
- space-6
- space-8

Radius:

- radius-sm
- radius-md
- radius-lg

---

# Output Structure

When using System Mode, structure the response like this.

## 1. System Summary

Explain the design philosophy.

---

## 2. Design Tokens

List core tokens.

Examples:

- colors
- spacing
- typography
- radius

---

## 3. Typography System

Define heading and body hierarchy.

---

## 4. Component System

Describe reusable components.

---

## 5. Layout Patterns

Define grid and layout rhythm.

---

## 6. Platform Adaptation

Explain how the system works across:

- web
- mobile
- tablet

---

# Anti-Patterns

Avoid:

- defining tokens without structure
- mixing too many colors
- inconsistent spacing scales
- ad-hoc components

A design system must be **predictable and repeatable**.

---

# Success Criteria

A good System Mode response should:

- define reusable tokens
- create consistent components
- support scalable UI architecture
- work across multiple screens
