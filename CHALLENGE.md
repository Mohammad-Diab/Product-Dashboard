# Frontend Engineering Challenge

## Objective
Design and implement a production‑grade frontend product management dashboard that gives the user the ability to List - Create - Update - Delete products.

This challenge intentionally mirrors real‑world constraints. Architectural decisions, code quality, and correctness matter as much as visual output.

---

## Functional Requirements

### 1. Authentication

#### Pages
- `/login`
- `/register`
- `/dashboard` (protected)

#### Behavior
- Users must authenticate to access protected routes.
- Auth token must be stored securely (HTTP‑only cookie preferred).
- Implement **route protection via Next.js middleware**.
- Redirect unauthenticated users to `/login`.

#### Validation
- Login:
  - Email (required, valid format)
  - Password (required, min 8 chars)
- Register:
  - Name (required)
  - Email
  - Password
  - Confirm password (must match)

---

### 2. Product Management (Mandatory to implement)

#### Pages
- `/products` – list products (SSR)
- `/products/new` – create product
- `/products/[id]/edit` – edit product

#### Product Model
```ts
{
  id: string
  name: string
  description: string
  price: number
  status: "active" | "inactive"
  createdAt: string
}
```

#### Features
- Fetch products on the **server** using SSR
- Client‑side mutations for create/update/delete
- Optimistic updates when deleting a product
- Pagination or infinite scroll

---

### 3. Order Management(Bonus feature)

#### Pages
- `/orders` – list orders (SSR)
- `/orders/[id]` – view order details
- `/orders/[id]/edit` – update order status (optional, role-based)

#### Order Model
```ts
{
  id: string
  orderNumber: string
  customerId: string
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  totalAmount: number
  currency: string
  items: {
    productId: string
    productName: string
    quantity: number
    unitPrice: number
  }[]
  createdAt: string
  updatedAt: string
}
```

### 4. Forms & Validation

- Use React Hook Form + Zod for **all** forms
- Proper error messages
- Disable submit while loading
- Handle server‑side validation errors

Product form rules:
- Name: required, min 3 chars
- Description: optional, max 500 chars
- Price: required, positive number
- Status: required

Order form rules:
- Quantity: minimum number of for each selected product should be 1
- Total Price: should be higher than zero
---

### 5. API Layer

- Create a centralized API client
- Separate **server‑side** and **client‑side** API calls
- Handle:
  - 401 (logout)
  - 400 (validation errors)
  - 500 (generic fallback)

Mock API is acceptable:
- JSON Server
- MirageJS
- Custom Next.js Route Handlers

---

### 6. State Management

- Global auth state (user, token, isAuthenticated)
- Product cache via React Query
- Avoid prop drilling
- Clear separation of UI state vs server state
---

### 7. Middleware & SSR

- Middleware must:
  - Protect routes
  - Read auth cookie
  - Redirect appropriately

- SSR must be used for:
  - Product list page
  - Authenticated user session retrieval

### 8. Performance
- Performance is mandatory when for each component render and data loading
---

## Non‑Functional Requirements

- Strong folder structure
- Type safety everywhere
- Meaningful commit history
- Clean separation of concerns
- No unnecessary re‑renders

---

## Acceptance Criteria

### Scoring Breakdown (Mandatory)

| Area | Weight |
|-----|-------|
| Functional coverage (all required features implemented and working) | **40%** |
| Error handling & resilience (API, auth, edge cases) | **15%** |
| Clean code (readability, consistency, typing, naming) | **15%** |
| Unit tests (coverage **and** test code quality) | **15%** |
| Clean project architecture (separation of concerns, scalability) | **15%** |

> **Important:** Unit tests are **mandatory**. Submissions without a meaningful test suite should be considered **incomplete**, regardless of functional correctness.

---

## Bonus Points

- Role‑based access control
- E2E tests (Playwright)
- Accessibility considerations

---

## Submission

- GitHub repository
- DECISIONS.md file explaining decisions
- SETUP.md for setup instructions

Time expectation: **4 days**

---

## Note
you can choose the suitable libraries for you (not forced to use the ones in the file)
