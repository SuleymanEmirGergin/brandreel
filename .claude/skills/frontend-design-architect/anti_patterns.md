# Anti Patterns

This file defines behaviors that the `frontend-design-architect` skill must avoid.

The goal is to prevent low-quality design responses, accidental cloning, and UX mistakes.

---

# 1. Accidental Cloning

Never recreate an existing product layout exactly.

Bad:

- Copying the exact section order
- Replicating the exact hero layout
- Mirroring component positions

Good:

- Extract the style DNA
- Reinterpret the layout
- Preserve the _feeling_, not the structure

Example:

Bad  
“Stripe'ın aynısını yapalım.”

Good  
“Stripe'ın premium hissini yeni bağlamda yeniden yorumlayalım.”

---

# 2. Vague Design Language

Avoid meaningless design phrases.

Bad answers include:

- “modern look”
- “clean UI”
- “sleek interface”
- “premium feel”

These must always be backed by **concrete design decisions**.

Example:

Bad  
“Modern bir tasarım.”

Good  
“Large sans-serif typography, neutral palette, soft shadows, 8pt spacing system.”

---

# 3. Decoration Without Product Logic

Never add visual effects purely for aesthetics.

Avoid:

- random gradients
- excessive glassmorphism
- heavy shadows
- flashy UI elements

Every design choice must support:

- usability
- clarity
- hierarchy
- product goal

---

# 4. Ignoring Platform Differences

Do not treat all platforms the same.

Bad:

- Same layout for web and mobile
- Desktop navigation on mobile

Correct behavior:

Web → section rhythm and storytelling  
Web app → information density and productivity  
Mobile → touch ergonomics and vertical flow

---

# 5. Overly Generic UI Advice

Avoid answers that look like a generic blog post.

Bad:

“Use cards and a modern color palette.”

Good:

“Use stat cards with subtle elevation and a neutral background to improve scanability.”

---

# 6. Screen-Only Thinking

Do not design isolated screens.

Always think in:

- flows
- systems
- reusable components

Example:

Bad:
“Home screen şöyle olsun.”

Good:
“Home screen + card component + navigation pattern.”

---

# 7. UX-Blind Premiumization

Premium does not mean:

- less readable
- less contrast
- more decoration

Avoid:

- tiny typography
- low contrast text
- unnecessary animation

Premium should improve:

- hierarchy
- clarity
- scanability

---

# 8. Ignoring Component Systems

Avoid designing purely visual layouts without components.

Always consider:

- buttons
- inputs
- cards
- navigation
- modals
- states

UI must be **component-based**.

---

# 9. Implementation-Unaware Design

When the user wants stack-aware UI direction, do not ignore the stack.

Example request:

“Next.js + Tailwind dashboard.”

Bad answer:
Pure visual design.

Good answer:
Component + token thinking compatible with Tailwind.

---

# 10. Overlong Answers

If the user asks for something narrow, keep the answer narrow.

Examples:

User asks:
“Font sistemi çıkar.”

Bad:
Full page architecture.

Good:
Typography hierarchy only.

---

# 11. Mode Chaos

Avoid mixing all modes together.

Choose the **dominant mode**.

Example:

Landing page request  
→ Conversion Mode

Dashboard request  
→ App UX Mode

Reference-based request  
→ Mimic Mode
