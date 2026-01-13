# Architectural Decisions

This document explains key decisions made during development that differ from or extend the requirements in README.md.

---

## Package Manager: npm (not pnpm/yarn)

**Decision:** Use npm despite pnpm being faster and more efficient.

**Reasoning:** Maximum compatibility for reviewers. npm is guaranteed to be installed with Node.js, requiring zero additional setup. While pnpm offers better disk usage and faster installs, it adds a setup barrier for evaluation.

---

## Middleware Despite Deprecation Warning

**Decision:** Continue using `middleware.ts` instead of the newer `proxy` convention.

**Reasoning:** The README explicitly requires "route protection via Next.js middleware" using the middleware pattern. Since this is a requirement constraint, we prioritize meeting the specification over adopting the latest Next.js convention. In production, we would migrate to `proxy`.

---

## Feature-Based Architecture

**Decision:** Organize code by feature, not by technical layer.

**Structure:**
```
src/features/
  auth/        # Everything auth-related
    api/
    components/
    hooks/
    schemas/
  products/    # Self-contained product module
  orders/      # Self-contained order module
```

**Reasoning:**
- Follows a feature-based structure to keep related code organized and easy to maintain
- Makes code easier to find (all product logic in one place)
- Reduces coupling between features
- Facilitates feature removal or refactoring

**Alternative Rejected:** Layer-based structure (components/, hooks/, api/) makes it harder to understand feature boundaries and increases cross-module dependencies.

---

## Mock API: Next.js Route Handlers (Not JSON Server)

**Decision:** Implement mock API using Next.js Route Handlers instead of external tools.

**Reasoning:**
- No additional dependencies or processes to run
- Full TypeScript support with shared types
- Production-ready pattern (easy to swap for real backend)
- Integrated error handling and validation
- Simulates real backend behavior (JWT validation, RBAC, etc.)

**Implementation:** JSON files in `/data/` act as database, Route Handlers in `app/api/` handle requests with proper validation and authentication.

---

## Admin User Management: Manual Data Only

**Decision:** No UI for creating admin users. Admin accounts must be manually added to `/data/users.json`.

**Reasoning:**
- Security: Prevents privilege escalation attacks via registration
- Out of scope: README doesn't require admin user creation UI
- Simplicity: Avoids complex admin provisioning logic
- Real-world pattern: Admin accounts are typically provisioned by DevOps/IT, not self-service

**Admin Example:**
```json
{
    "id": "a12d0565-da83-4e3a-b23f-e1056c2360eb",
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "$2b$10$jjanOUL1fe6yCjogPpZ3LOLZooBlTO/ZhECIUlU8XXCZBQXvO6fLe", // hashed 'admin123456'
    "role": "admin",
    "createdAt": "2026-01-10T00:00:00.000Z"
  }
```

---

## Server vs Client API Separation

**Decision:** Maintain two separate API clients (`client.ts` and `server.ts`).

**Reasoning:**
- Server Components cannot use client-side APIs (cookies(), window object)
- Client Components need automatic logout on 401 errors
- Different error handling strategies for each context
- Prevents shipping server-side code to the client bundle

**Pattern:**
```typescript
// In Server Components
import { serverApi } from '@/lib/api/server';

// In Client Components
import { apiClient } from '@/lib/api/client';
```

---

## State Management: No Redux/Zustand

**Decision:** Use React Query + Context instead of Redux/Zustand.

**Reasoning:**
- React Query eliminates 90% of state management needs
- Context sufficient for simple auth state
- Avoids boilerplate and additional dependencies
- Simpler mental model

**Pattern:**
- **Server data** → React Query (products, orders, user)
- **Global client state** → Context (auth)
- **Local UI state** → useState (modals, form fields)

---

## Authorization Enforcement: Backend First

**Decision:** All authorization checks happen in API routes, not just frontend.

**Example:** Product edit page checks ownership in `GET /api/products/[id]`, not in the page component.

**Reasoning:**
- Security: Frontend checks are bypassable
- Single source of truth
- Prevents data leaks
- Consistent behavior across SSR and client-side navigation

**Implementation:**
- Middleware: Route-level protection (admin-only routes)
- API Routes: Resource-level authorization (ownership checks)
- Frontend: UI conditionals for UX only (not security)

---

## Date/Currency Formatting: Centralized Utilities

**Decision:** Single source of truth for formatting (`src/lib/formatters.ts`).

**Functions:**
- `formatPrice(amount)` → "$1,234.56"
- `formatDate(date)` → "Jan 15, 2025"
- `formatDateTime(date)` → "Jan 15, 2025 at 3:45 PM"

**Reasoning:**
- Easy to change globally (e.g., switch to EUR, change date format)
- Consistent display across the app
- Type-safe (TypeScript ensures correct usage)

---

## List Navigation: Infinite Scrolling

**Decision:** Use infinite scrolling instead of traditional numeric pagination.

**Reasoning:**
- Provides a seamless flow for browsing large lists of products and orders without interruption.
- More suitable for exploration-based interfaces (like product catalogs) compared to precise record location.
- Leverages `useInfiniteQuery` to efficiently cache pages and prevent layout shifts.
- Eliminates small tap targets (page numbers) which are difficult to use on touch devices.

---

## TypeScript: Strict Mode Everywhere

**Decision:** Enable all strict TypeScript options.

**Configuration:**
```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "noImplicitAny": true
}
```

**Reasoning:**
- Catches bugs at compile time
- Better IntelliSense and autocomplete
- Self-documenting code

**Pattern:** Infer types from Zod schemas using `z.infer<typeof schema>` to maintain single source of truth.

---

## Library Choices

### Authentication & Security

**bcryptjs:** Password hashing
- Industry-standard hashing algorithm
- Adjustable complexity (salt rounds)
- Synchronous API (simpler for mock backend)
- Alternative rejected: `bcrypt` (requires native compilation, harder setup)

**jose:** JWT handling
- Modern, standards-compliant JWT library
- Works in Edge Runtime (Next.js middleware)
- Built-in security (validates claims, expiration)

### Forms & Validation

**React Hook Form:** Form state management
- Minimal re-renders (uncontrolled inputs)
- Built-in validation integration
- TypeScript support
- 10x smaller than Formik

**@hookform/resolvers:** Connects React Hook Form + Zod seamlessly

### State Management

**TanStack Query (React Query):** Server state

### UI Feedback

**react-hot-toast:** Toast notifications
- Lightweight (3KB)
- Beautiful default design
- Accessible (ARIA labels)
- Alternative rejected: react-toastify (3x larger)

### Testing

**Jest:** Test runner and assertion library

**Decision:** Use Jest as the primary testing framework instead of alternatives like Vitest, Mocha, or Jasmine.

**Reasoning:**
- Industry standard for React/Next.js applications (most mature ecosystem)
- Zero-configuration setup with Next.js (official recommendation)
- Built-in mocking, assertion utilities, and code coverage
- Fast parallel test execution with watch mode
- Excellent TypeScript support out of the box
- Large community and extensive documentation
- I'm familiar with Jest (faster development, fewer issues)
- Alternative rejected: Vitest (faster but newer, smaller ecosystem, potential compatibility issues)

---

## Summary

Every decision prioritizes:
1. **Meeting Requirements:** Middleware pattern, SSR, auth as specified
2. **Simplicity:** npm, Route Handlers, minimal state management
3. **Security:** Backend authorization, HTTP-only cookies, no admin UI
4. **Maintainability:** Feature-based structure, behavioral tests, strict types
