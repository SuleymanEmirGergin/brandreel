# Mobile-first Mode

This mode is used when the primary interface is a mobile application or when the mobile experience should define the design system.

The goal is to design for **small screens first**, then explain how the design expands to larger screens.

---

# When To Use

Use this mode when the user asks for:

- mobile UI
- mobile onboarding flows
- mobile dashboards
- React Native interfaces
- Expo apps
- mobile-first web experiences

Example user requests:

- “Bir fitness app için mobil UI tasarla.”
- “Habit tracker için onboarding flow öner.”
- “Expo ile yapılacak mobil app için ekran yapısı ver.”
- “Mobil dashboard ekranı tasarla.”

---

# Core Philosophy

Mobile-first design means:

1. Start with **phone constraints**
2. Design for **thumb interaction**
3. Optimize for **vertical flows**
4. Minimize **cognitive load**
5. Ensure **fast task completion**

Mobile design should prioritize **clarity and speed**.

---

# Mobile Constraints

Mobile devices introduce limitations that must shape the design.

Important constraints:

- small screen size
- limited horizontal space
- touch interaction
- shorter attention span
- context switching

Good mobile interfaces are:

- compact
- scannable
- touch-friendly

---

# Touch Ergonomics

Design with thumb reach in mind.

Key principles:

- primary actions near bottom area
- large tap targets
- minimal precise interactions

Recommended touch target size:

- minimum 44px height
- comfortable padding

Avoid:

- tiny buttons
- crowded input fields
- multi-step gestures

---

# Vertical Flow

Mobile UI should relay on **vertical stacking**.

Typical patterns:

- stacked cards
- vertical content lists
- bottom sheets
- expandable sections

Avoid:

- dense multi-column layouts
- horizontal overflow

---

# Navigation Models

Mobile navigation differs from desktop.

Common patterns:

## Bottom Navigation

Used for:

- 3–5 primary sections

Examples:

- Home
- Search
- Activity
- Profile

---

## Tab Navigation

Used for switching content inside a screen.

Example:

- Overview
- Stats
- History

---

## Stack Navigation

Used for hierarchical flows.

Example:

Home  
→ Detail  
→ Settings

---

## Bottom Sheets

Used for quick interactions.

Examples:

- filters
- actions
- quick settings

---

# Screen Structure

Mobile design should define **clear screen flows**.

Typical structure includes:

- splash / loading
- onboarding
- authentication
- home / dashboard
- detail views
- settings
- profile

Each screen must have:

- clear purpose
- minimal clutter
- focused actions

---

# Content Density

Mobile UI should avoid excessive density.

Best practices:

- use whitespace
- prioritize key information
- collapse secondary content

Examples:

Instead of showing full data tables, use:

- cards
- summary blocks
- expandable sections

---

# Component Behavior

Mobile components should prioritize touch usability.

Common components:

- cards
- buttons
- input fields
- toggle switches
- bottom sheets
- modals
- tabs

Buttons should be clearly distinguishable.

Inputs should be optimized for mobile keyboards.

---

# Mobile States

Always consider states such as:

- loading
- empty state
- error state
- offline state

These states are more noticeable on mobile due to limited screen space.

---

# Output Structure

When using Mobile-first Mode, structure the response like this.

## 1. Mobile Design Summary

Explain the product type and the mobile-first philosophy.

---

## 2. Core Screens / Flow

Describe the main screens.

Example:

- onboarding
- home
- tracking
- stats
- profile

---

## 3. Component Behavior

Explain how mobile components should behave.

Examples:

- bottom navigation
- cards
- action buttons
- sheets

---

## 4. Navigation Model

Describe navigation patterns.

Examples:

- bottom tabs
- stacked screens
- modal flows

---

## 5. Tablet Adaptation

Explain how the UI expands to tablet.

Possible changes:

- side navigation
- split layout
- larger grids

---

## 6. Desktop Expansion

Explain how the design could scale to desktop or web.

Examples:

- multi-column layouts
- richer dashboards
- expanded navigation

---

# Anti-Patterns

Avoid:

- desktop layouts squeezed into mobile
- tiny touch targets
- too many navigation layers
- horizontal scrolling interfaces

---

# Success Criteria

A good Mobile-first Mode answer should:

- prioritize touch usability
- create clear screen flows
- reduce cognitive load
- support fast interactions
- scale cleanly to larger screens
