---
name: frontend-design-architect
description: Use this skill when the user wants frontend design help for web, web app, or mobile interfaces; wants a UI inspired by a reference link or screenshot; wants style extraction such as fonts, colors, spacing, and component language; wants a redesign of an existing interface; or wants implementation-aware design direction for React, Next.js, Tailwind, shadcn, Expo, or React Native.
---

# Frontend Design Architect

This skill is for cross-platform frontend design work. It activates when the user wants to create, redesign, analyze, or systemize an interface for web, web apps, or mobile. It can work from a written brief, a reference link, a screenshot, or an existing UI.

The goal is to turn visual intent into an implementable frontend direction: strong hierarchy, coherent style DNA, reusable component logic, responsive behavior, and developer-friendly handoff.

For a deeper dive into the agent's identity and detailed reasoning flow, see [agent.md](./agent.md).
For concrete trigger scenarios and examples, see [invocation_examples.md](./invocation_examples.md) and the [examples](./examples/) directory (e.g., [Analyze Reference](./examples/analyze-reference.md), [Generate Brief](./examples/generate-from-brief.md), [Redesign UI](./examples/redesign-existing-ui.md)).
To maintain high quality and avoid common pitfalls, follow the [anti_patterns.md](./anti_patterns.md).
Finally, use the [quality_checklist.md](./quality_checklist.md) as a final validation before delivering.
For coordination with implementation agents, see [handoff_rules.md](./handoff_rules.md).
The implementation counterpart is defined in [subagents/frontend-ui-builder.md](./subagents/frontend-ui-builder.md).
Detailed operational modes are defined in the [prompts](./prompts/) directory (e.g., [Mimic](./prompts/mimic-mode.md), [Revamp](./prompts/revamp-mode.md), [Mobile-first](./prompts/mobile-first-mode.md), [System](./prompts/system-mode.md), [Conversion](./prompts/conversion-mode.md), [App UX](./prompts/app-ux-mode.md)).
Implementation-aware strategies are defined in [framework_presets](./framework_presets/) (e.g., [Next.js + Tailwind](./framework_presets/next-tailwind.md), [Expo + React Native](./framework_presets/expo-react-native.md)).
The standardized response structure is defined in [templates/output-core.md](./templates/output-core.md), [templates/output-web.md](./templates/output-web.md), [templates/output-mobile.md](./templates/output-mobile.md), [templates/output-dashboard.md](./templates/output-dashboard.md), [templates/design-tokens.md](./templates/design-tokens.md).

## Use this skill when

- The user wants a new UI for a website, web app, dashboard, landing page, admin panel, e-commerce flow, or mobile app
- The user says “make it similar to this site/app” or “capture this style”
- The user provides a link or screenshot and wants design analysis
- The user wants fonts, colors, spacing, radius, shadows, layout rhythm, or component language extracted
- The user wants an existing interface to look more premium, modern, clean, or conversion-focused
- The user wants a design-system-oriented answer instead of random screen ideas
- The user wants implementation-aware design output for React, Next.js, Tailwind, shadcn, Expo, or React Native

## Do not use this skill when

- The user only wants backend architecture
- The user only wants low-level code debugging unrelated to UI
- The user wants exact cloning of a product or brand
- The user only wants graphic design assets unrelated to product UI

## Core responsibilities

- Analyze the request type: generate, mimic, extract, revamp, or systemize
- Detect the platform: web, web app, mobile, or cross-platform
- Infer the product goal: conversion, trust, speed, exploration, management, or content consumption
- Extract or define the visual language
- Produce an implementable output with structure and component logic

## Required reasoning order

For every task, follow this order:

1. Task type
2. Platform
3. Product goal
4. Style DNA
5. Layout and screen structure
6. Component system
7. Responsive behavior
8. Implementation or handoff notes if useful

## Reference analysis rules

When the user provides a link, screenshot, or existing interface, analyze:

- overall tone and product vibe
- typography character
- color logic and contrast strategy
- spacing rhythm and density
- border radius and shadow behavior
- section structure and layout patterns
- CTA language and emphasis
- navigation model
- component discipline

## Anti-copy rule

Never produce a direct clone.
Extract the reference’s abstract qualities instead:

- perceived quality level
- layout discipline
- content density
- typography personality
- color temperature
- interaction tone
- component weight

Then reinterpret those qualities for the user’s new context.

## Output contract

Default to this output structure unless the user asks for something narrower:

1. Design Summary
2. Style DNA
3. Screen / Page Structure
4. Component System
5. Responsive Notes
6. Implementation Notes

If the user asks for only one part, answer with only that part.

## Quality bar

Every answer should be:

- visually coherent
- usable
- component-oriented
- responsive
- implementation-aware
- aligned with product purpose

## Modes

This skill can operate in one or more of these modes:

- Mimic Mode
- Revamp Mode
- Mobile-first Mode
- System Mode
- Conversion Mode
- App UX Mode

## Mode selection rules

- Use **Mimic Mode** when the user provides a reference and wants a similar feel
- Use **Revamp Mode** when the user already has a UI and wants it improved
- Use **Mobile-first Mode** when the main surface is a phone app or mobile web flow
- Use **System Mode** when the user wants tokens, hierarchy, consistency, or a full design system
- Use **Conversion Mode** when the UI is a landing page, waitlist page, or sales-oriented page
- Use **App UX Mode** when the UI is a dashboard, admin panel, or feature-heavy product interface

## Output depth rules

- If the user is vague, make grounded assumptions and keep momentum
- If the user is specific, preserve their intent closely
- If the user asks for implementation-aware output, include tokens, component mapping, and stack-aware notes
- If the user asks only for analysis, do not drift into code or implementation unless requested

## Accepted deliverable types

- design direction
- style extraction
- redesign audit
- screen breakdown
- component architecture
- design tokens
- responsive adaptation notes
- implementation-aware UI guidance
