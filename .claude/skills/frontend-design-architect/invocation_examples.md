# Invocation Examples

This file describes when the `frontend-design-architect` skill should activate.

The goal is to help the agent correctly detect UI design tasks.

---

# Situations Where The Skill SHOULD Activate

## 1. New Interface Requests

User asks for a new UI design.

Examples:

- "AI destekli bir SaaS için landing page tasarla."
- "Modern bir dashboard UI öner."
- "Bir mobil app için onboarding ekranı tasarla."
- "Fintech uygulaması için web arayüzü tasarla."

Recommended Mode:

- Generate
- Conversion Mode (if landing page)
- App UX Mode (if dashboard)

---

## 2. Reference-Based UI Requests

User wants a UI similar to a reference.

Examples:

- "Stripe hissi veren bir landing page tasarla."
- "Bu siteye benzer ama birebir olmayan bir tasarım yap."
- "Linear tarzı bir dashboard tasarla."
- "Bu ekranın stilini yakala."

Recommended Mode:

- Mimic Mode

---

## 3. Style Extraction

User wants to extract style from an interface.

Examples:

- "Bu siteden font ve renk sistemini çıkar."
- "Bu tasarımın spacing mantığını analiz et."
- "Bu UI'daki component stilini açıkla."

Recommended Mode:

- Extract behavior
- Mimic Mode

---

## 4. UI Improvement Requests

User already has an interface and wants improvement.

Examples:

- "Bu UI çok amatör duruyor."
- "Bu landing page'i premiumlaştır."
- "Dashboard'ımın UX'ini iyileştir."

Recommended Mode:

- Revamp Mode

---

## 5. Mobile App UI Design

User wants mobile interface design.

Examples:

- "Bir fitness app için mobil UI tasarla."
- "Habit tracker için onboarding flow tasarla."
- "Mobil dashboard ekranı öner."

Recommended Mode:

- Mobile-first Mode

---

## 6. Design System Requests

User wants a reusable design system.

Examples:

- "Web ve mobil için ortak design system kur."
- "Bir component sistemi oluştur."
- "Design token yapısı öner."

Recommended Mode:

- System Mode

---

## 7. Implementation-Aware Design

User wants UI direction that matches a specific frontend stack.

Examples:

- "Next.js + Tailwind için dashboard tasarla."
- "React Native için mobil UI öner."
- "shadcn uyumlu UI sistemi kur."

Recommended Mode:

- System Mode
- App UX Mode

---

# Situations Where The Skill SHOULD NOT Activate

## 1. Backend-only requests

Examples:

- "PostgreSQL schema tasarlar mısın?"
- "API architecture nasıl olmalı?"

Reason:
No frontend design intent.

---

## 2. Pure debugging

Examples:

- "React hook infinite render yapıyor."
- "Bu CSS çalışmıyor."

Reason:
This is debugging, not design direction.

---

## 3. Graphic design requests

Examples:

- "Logo tasarla."
- "Poster yap."

Reason:
This skill focuses on **product UI**, not branding assets.

---

## 4. Exact cloning

Examples:

- "Stripe UI'ını birebir yap."

Reason:
The skill should not support direct cloning.

Instead offer **reference-inspired design**.

---

# Mixed Requests

Sometimes the user asks for both:

- UI design direction
- Implementation structure

Example:

"Next.js + Tailwind için SaaS dashboard tasarla."

In this case:

1️⃣ `frontend-design-architect`  
→ Defines style, layout, and components

2️⃣ `frontend-ui-builder`  
→ Converts design direction into implementation structure
