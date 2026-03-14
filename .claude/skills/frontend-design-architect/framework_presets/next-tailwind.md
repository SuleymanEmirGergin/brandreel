# Framework Preset: Next.js + Tailwind + shadcn

Use this preset when the user wants implementation-aware frontend design direction for a modern web product built with Next.js, Tailwind CSS, and optionally shadcn/ui.

This preset helps the design agent produce outputs that map naturally into component-based React architecture.

---

# When To Use

Use this preset when the user mentions:

- Next.js
- React
- Tailwind
- shadcn
- SaaS dashboard
- admin panel
- landing page with component structure

Example requests:

- “Next.js + Tailwind için dashboard tasarla.”
- “shadcn uyumlu admin panel öner.”
- “React için component-friendly landing page tasarla.”

---

# Core Assumptions

Assume the product likely uses:

- component-based page architecture
- reusable UI primitives
- utility-first styling
- theme or token-based color system
- scalable folder structure

The design should support **clean implementation**, not purely visual experimentation.

---

# Design Philosophy For This Stack

This stack works best when the design direction is:

- token-friendly
- component-oriented
- structurally clear
- easy to break into sections and primitives

Prefer:

- clean hierarchy
- reusable cards
- predictable spacing
- simple state variations
- manageable visual complexity

Avoid:

- hyper-custom one-off sections
- over-decorated components
- layout tricks that are hard to maintain

---

# Output Additions

When this preset is active, the agent should add implementation-aware guidance such as:

- likely component boundaries
- token usage suggestions
- likely route/page breakdown
- reusable section structure
- state handling patterns
- responsive collapse behavior

---

# Recommended Component Thinking

Think in reusable primitives such as:

## Layout

- page shell
- section wrapper
- container
- sidebar layout
- topbar layout
- dashboard grid

## Inputs

- button
- input
- textarea
- select
- checkbox
- switch

## Surfaces

- card
- panel
- modal
- drawer
- popover

## Data / Feedback

- table
- tabs
- badge
- toast
- alert
- skeleton
- empty state

These components should feel easy to represent with React + Tailwind + shadcn style primitives.

---

# Tailwind-Friendly Design Guidance

When generating design direction, prefer patterns that are easy to express in utility-first styling.

Examples:

- consistent spacing scale
- controlled color tokens
- simple shadow system
- limited radius scale
- repeatable section paddings

Good design decisions for this stack:

- 8pt spacing rhythm
- 2–4 radius levels
- neutral surface system
- one primary accent + support neutrals

Avoid excessive one-off visual rules that become hard to maintain in class-based styling.

---

# shadcn Compatibility Guidance

If the user mentions shadcn, prefer design directions that map well to shadcn/ui primitives.

Examples:

- Dialog
- Sheet
- Drawer
- Dropdown Menu
- Tabs
- Table
- Tooltip
- Toast
- Alert
- Card
- Button
- Input

Do not force the entire design into default shadcn visuals.

Instead:

- preserve the design system
- use shadcn as a structural primitive layer

---

# Routing / Page Structure Thinking

For Next.js-friendly outputs, describe screens in ways that can map to routes and route groups.

Examples:

Marketing site:

- homepage
- pricing
- features
- contact

Dashboard:

- overview
- projects
- billing
- analytics
- settings

This makes the design direction easier to implement.

---

# Responsive Guidance

Because this stack often targets responsive web UIs, outputs should explicitly address:

- mobile stacking
- tablet layout shifts
- desktop multi-column expansion
- sidebar collapse patterns
- table simplification

The design should scale cleanly across breakpoints.

---

# Token Mapping Guidance

This preset works best when the design agent defines tokens that can easily map to:

- Tailwind theme extensions
- CSS variables
- `tokens.ts`
- `theme.ts`

Useful token groups include:

- colors
- spacing
- radius
- shadows
- typography

---

# Good Output Behavior

When this preset is active, strong outputs should include:

- screen/page structure
- reusable component groups
- likely shadcn-compatible primitives
- Tailwind-friendly token logic
- responsive behavior
- implementation notes that do not become full code unless requested

---

# Anti-Patterns

Avoid:

- purely aesthetic advice with no structure
- component-agnostic design language
- impossible-to-maintain layout tricks
- over-customized UI that defeats reusable component systems

The design should feel premium **and** buildable.

---

# Success Criteria

A strong response using this preset should:

- fit a React/Next.js mental model
- map naturally to reusable components
- stay Tailwind-friendly
- remain design-system oriented
- support clean implementation with or without shadcn
