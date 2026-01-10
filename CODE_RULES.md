# Code & Engineering Rules

> Goal: **Simple, clean, and powerful code** — no unnecessary complexity.

---

## 1. Core Principles
- Clean Code is mandatory
- Simplicity over cleverness
- No over-engineering
- Single responsibility per file/function
- Code must be easy to read and reason about
- Use always the newest stable techniques and libraries

---

## 2. Project Structure
- Next.js **App Router**
- Every feature lives in: `src/features/<feature>/`
- `components/` is for truly shared components only
- No feature logic inside shared components

---

## 3. Server vs Client Components
- **Server Components by default**
- `"use client"` is **forbidden by default**
- Client Components only when strictly necessary (forms, interactions)
- Pages and data fetching stay on the server

---

## 4. API & Data Fetching
- ❌ No `fetch` inside components
- All API calls go through a centralized API layer
- Clear separation between server and client API calls
- Next.js Route Handlers are used as a mock API

---

## 5. State Management
- Server data → **React Query only**
- ❌ No `useState` for server-originated data
- `useState` is for UI state only
- Auth state via **React Context only**
- ❌ No Redux / Zustand

---

## 6. Styling
- **Tailwind CSS only**
- No CSS Modules or styled-components

---

## 7. TypeScript
- `strict: true`
- No random `any`
- Exceptions must be minimal and justified

---

## 8. Naming & Imports
- Folders: `kebab-case`
- Components: `PascalCase`
- Hooks: `camelCase` prefixed with `use`
- **Named exports only**
- Default exports allowed only for Next.js files (`page.tsx`, `layout.tsx`)
- ❌ No deep relative imports (`../../../`)
- One level (`./`, `../`) is allowed
- Otherwise use absolute imports

---

## 9. Barrel Files
- `index.ts` is allowed for re-exports only
- No logic, no side effects

---

## 10. Testing
- **Jest is the standard**
- Tests are written during development
- No core feature without tests
- Test behavior, not implementation

---

## 11. Commits
- **Conventional Commits** are required: `feat:, fix:, test:, refactor:, docs:, chore:`
- Small, focused commits only
- No vague commit messages

---

## 12. Comments
- Comments only when necessary
- Explain **why**, not **what**
- Keep them minimal

---

## 13. Errors & Logging
- ❌ No `console.log`
- `console.error` allowed only for real errors
- Errors must never be silently ignored

---

## 14. Environment Variables
- Managed via a single centralized file
- ❌ No direct `process.env` usage

---

## 15. Infinite scrolling
- **Infinite Scrolling only**
- No pagination

---

## 16. Dates & Currency
- Unified formatting for dates and currency
- Easily changeable by developers only
- No user-level configuration

---

## 17. Scope Control
- ❌ No role-based logic unless explicitly required
- Anything not required is out of scope

---

## 18. Documentation
- Any non-obvious decision must be documented in `DECISIONS.md`

---

## Golden Rule
> Write code that is **simple, clear, and strong**.  
> Clarity is more valuable than cleverness.