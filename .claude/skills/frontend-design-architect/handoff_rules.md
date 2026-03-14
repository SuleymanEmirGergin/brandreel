# Handoff Rules

This document defines when and how the `frontend-design-architect` agent should hand off work to the `frontend-ui-builder` subagent.

The goal is to separate **design thinking** from **implementation structure**.

---

# Agent Roles

## Frontend Design Architect

Responsible for:

- product UI direction
- style DNA
- screen structure
- component system
- responsive logic
- design tokens
- UX hierarchy

This agent defines **what the interface should be**.

---

## Frontend UI Builder

Responsible for:

- translating design direction into code structure
- React / Next.js component architecture
- Tailwind / shadcn mapping
- Expo / React Native screen structure
- folder structure
- token implementation

This agent defines **how the interface should be built**.

---

# When To Hand Off

Hand off to `frontend-ui-builder` when the user asks for:

- component architecture
- folder structure
- code-ready UI structure
- React component breakdown
- Next.js page architecture
- Tailwind implementation strategy
- design token implementation
- Expo / React Native screen mapping

Example user requests:

“Next.js + Tailwind için dashboard mimarisi çıkar.”

“React component yapısını öner.”

“Mobil ekranların React Native yapısını çıkar.”

---

# When NOT To Hand Off

Do not hand off when the user still needs:

- UI concept
- layout direction
- visual hierarchy
- style extraction
- design critique
- redesign suggestions

Example:

User:  
“Bu UI amatör duruyor.”

Correct behavior:

`frontend-design-architect`  
→ analyzes and improves the design.

No handoff yet.

---

# Handoff Sequence

Follow this order:

1️⃣ Define product type  
2️⃣ Define platform  
3️⃣ Define style DNA  
4️⃣ Define screen structure  
5️⃣ Define component system

Only then:

6️⃣ Hand off to implementation agent

---

# Required Handoff Package

Before handing off, ensure the following information exists.

## Product Context

- product type
- platform
- main goal

Example:

Product: SaaS analytics dashboard  
Platform: web app  
Goal: productivity

---

## Style DNA

- typography style
- color palette
- spacing rhythm
- radius
- shadow behavior

---

## Screen Structure

Examples:

- dashboard overview
- project list
- analytics page
- settings page

---

## Component Inventory

Examples:

- sidebar navigation
- top navigation
- stat cards
- data table
- filters
- modal dialogs
- forms
- empty states

---

## Design Tokens

Examples:

- color tokens
- spacing scale
- typography scale
- border radius

---

# Handoff Output Format

Use this structure:

## Product

Type:
Platform:
Goal:

---

## Style DNA

Typography:
Color palette:
Spacing system:
Radius:
Elevation:

---

## Screens

List main screens or sections.

---

## Components

List reusable UI components.

---

## Tokens

List design tokens if relevant.

---

## Stack Target

Examples:

- Next.js + Tailwind + shadcn
- React + Tailwind
- Expo + React Native

---

# Example Handoff

Product  
SaaS analytics dashboard

Platform  
Web app

Goal  
High information density and fast scanning

Style DNA  
Neutral palette, sharp radius, minimal shadows, strong typography

Screens

- overview
- projects
- analytics
- billing
- settings

Components

- sidebar
- stat cards
- table
- filters
- modal

Tokens

- 8pt spacing
- slate neutral palette
- blue accent

Stack

Next.js + Tailwind + shadcn

---

# Handoff Philosophy

The design agent defines:

- vision
- hierarchy
- structure

The implementation agent defines:

- code structure
- component files
- theme setup
- implementation order

Separation of responsibilities ensures:

- cleaner design thinking
- better engineering output
- scalable UI systems
