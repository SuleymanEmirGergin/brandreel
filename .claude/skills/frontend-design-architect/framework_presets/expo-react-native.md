# Framework Preset: Expo + React Native

Use this preset when the user wants implementation-aware UI direction for a mobile application built with Expo or React Native.

This preset helps the design agent produce outputs that map naturally into screen-based mobile architecture instead of web-first layouts.

---

# When To Use

Use this preset when the user mentions:

- Expo
- React Native
- mobile app UI
- onboarding flow
- tab navigation
- bottom sheets
- mobile dashboard
- app screens

Example requests:

- “Expo ile yapılacak bir finans app’i için mobil UI tasarla.”
- “React Native onboarding flow öner.”
- “Mobil app için component-friendly ekran yapısı ver.”
- “Bottom tab navigation kullanan bir app tasarla.”

---

# Core Assumptions

Assume the product likely uses:

- screen-based navigation
- stack and tab navigation
- touch-first interactions
- reusable mobile primitives
- token-based theme structure
- safe-area-aware layouts

The design should feel **native-friendly, touch-friendly, and screen-oriented**.

---

# Design Philosophy For This Stack

This stack works best when the design direction is:

- mobile-first
- ergonomically sound
- vertically structured
- reusable across screens
- easy to translate into screen components

Prefer:

- clear top-level flows
- strong touch targets
- compact but readable hierarchy
- bottom navigation when appropriate
- cards, lists, sheets, and stacked content

Avoid:

- web-style multi-column thinking by default
- tiny interaction targets
- dense desktop-like tables
- navigation models that feel awkward on mobile

---

# Output Additions

When this preset is active, the agent should add implementation-aware guidance such as:

- likely screen flow
- navigation model suggestions
- reusable mobile components
- token suggestions for mobile themes
- touch ergonomics notes
- small phone vs large phone behavior
- bottom sheet / modal usage guidance

---

# Recommended Component Thinking

Think in reusable mobile primitives such as:

## Navigation

- bottom tabs
- stack screens
- modal flows
- segmented controls
- top tabs when needed

## Inputs / Actions

- primary button
- secondary button
- text input
- search field
- toggles
- segmented switch

## Surfaces

- cards
- grouped lists
- bottom sheets
- modals
- alert dialogs

## Feedback / State

- snackbars
- inline validation
- progress indicators
- empty states
- skeleton loaders
- pull-to-refresh states

These components should feel natural in a React Native screen architecture.

---

# Mobile-Friendly Design Guidance

When generating design direction, prefer patterns that are easy to express in utility-first styling.

Examples:

- vertical stacking
- strong spacing rhythm
- clear section grouping
- limited information per screen
- large enough tap targets
- predictable screen hierarchy

Good design decisions for this stack:

- 44px+ comfortable touch areas
- bottom-aligned primary actions when appropriate
- compact navigation depth
- clear distinction between primary and secondary actions
- layouts that respect safe areas

Avoid web-like density unless the user explicitly wants a data-heavy power-user app.

---

# Navigation Guidance

If the user does not specify navigation, prefer models such as:

## Bottom Tabs

Use for 3–5 top-level destinations.

Examples:

- Home
- Search
- Activity
- Profile

## Stack Navigation

Use for detail flows.

Example:
Home → Detail → Edit

## Bottom Sheets / Modal Layers

Use for quick actions, filters, and contextual settings.

Navigation should minimize friction and feel native.

---

# Screen Structure Thinking

For Expo / React Native-friendly outputs, describe the product in terms of screens and flows.

Examples:

Consumer app:

- splash
- onboarding
- auth
- home
- detail
- profile
- settings

Productivity app:

- dashboard
- tasks
- task detail
- calendar
- notifications
- settings

This makes the design direction easier to implement.

---

# Responsive / Device Guidance

Because this stack targets mobile devices first, outputs should explicitly address:

- small phone behavior
- large phone behavior
- tablet adaptation if relevant

Examples:

Small phone:

- tighter vertical rhythm
- fewer simultaneous elements
- simplified cards

Large phone:

- more breathing room
- slightly richer summaries

Tablet:

- two-column layouts
- side panels
- expanded dashboards

---

# Token Mapping Guidance

This preset works best when the design agent defines tokens that can easily map to:

- `theme.ts`
- `tokens.ts`
- shared constants
- style dictionaries
- design token objects for React Native

Useful token groups include:

- colors
- spacing
- radius
- typography
- shadows/elevation
- motion timings

---

# Expo / React Native Implementation Notes

When useful, outputs may reference implementation-aware ideas such as:

- Expo Router or React Navigation friendly flows
- screen-based component composition
- reusable UI primitives
- token-driven styles
- shared layout wrappers
- safe area containers
- sheet/modal presentation patterns

Do not jump into full code unless the user asks.

---

# Good Output Behavior

When this preset is active, strong outputs should include:

- screen-by-screen logic
- navigation model
- touch-friendly component behavior
- mobile-aware spacing and hierarchy
- token-ready design system notes
- implementation hints that fit React Native mental models

---

# Anti-Patterns

Avoid:

- desktop dashboard thinking on every screen
- multi-column layouts by default
- tiny text and tiny buttons
- hover-dependent interactions
- overcomplicated gestures
- component logic that assumes HTML/CSS behavior directly

The design should feel premium **and** native-friendly.

---

# Success Criteria

A strong response using this preset should:

- fit a mobile app mental model
- map naturally to screens and flows
- stay touch-friendly
- remain token and component oriented
- support clean implementation in Expo or React Native
