# 14 - Role-Based Access Control (Bonus)

- [x] (Optional)

Implement role-based access control with admin and regular user roles.

## Dependencies
- Task 01-10 (All core tasks completed)
- Task 13 (Order Management) - for admin order access
- Follows existing auth patterns (Task 04-05)

## Role Definitions

### Admin Role
- Can access `/orders` page and update order status
- Can see all products in system (with toggle to filter own products)
- Can manage all products (create, update, delete any product)

### Regular User Role
- Can create products (owned by them)
- Can update/delete only their own products
- Can see only their own products
- Cannot access `/orders` page

### Registration Rules
- New users are always registered as `user` role
- No UI to create admin users (manual data entry only)

## Subtasks
| # | Subtask | Status | Depends On |
|---|---------|--------|------------|
| 14.1 | Add `role` field to User type (`admin` \| `user`) | [x] | Task 01 |
| 14.2 | Update `src/data/users.json` with role field and create admin user | [x] | 14.1 |
| 14.3 | Update `app/api/_lib/schemas.ts` with role in UserSchema | [x] | 14.1 |
| 14.4 | Add `createdBy` field to Product type | [x] | 14.1 |
| 14.5 | Update `src/data/products.json` with createdBy field | [x] | 14.4 |
| 14.6 | Update `app/api/_lib/schemas.ts` with createdBy in ProductSchema | [x] | 14.4 |
| 14.7 | Update auth context to include user role | [x] | 14.1, Task 04 |
| 14.8 | Update `/api/auth/me` to return role | [x] | 14.3 |
| 14.9 | Update `/api/auth/register` to always set role as `user` | [x] | 14.3 |
| 14.10 | Update `/api/products` GET to filter by createdBy for regular users | [x] | 14.5, 14.7 |
| 14.11 | Update `/api/products` POST to set createdBy from authenticated user | [x] | 14.5 |
| 14.12 | Update `/api/products/[id]` PUT/DELETE to check ownership for regular users | [x] | 14.5 |
| 14.13 | Create `src/features/auth/hooks/useRole.ts` helper hook | [x] | 14.7 |
| 14.14 | Update middleware to protect `/orders` route for admin only | [x] | 14.7, Task 06 |
| 14.15 | Add "Show All Products" toggle for admin in products page | [x] | 14.10, 14.13 |
| 14.16 | Update ProductCard to show edit/delete only for owned products (or admin) | [x] | 14.13 |
| 14.17 | Hide Orders nav link for regular users | [x] | 14.13 |

## Model Changes

### User Model
```ts
{
  id: string
  name: string
  email: string
  password: string
  role: "admin" | "user"  // NEW
  createdAt: string
}
```

### Product Model
```ts
{
  id: string
  name: string
  description: string
  price: number
  status: "active" | "inactive"
  createdBy: string  // NEW - user id
  createdAt: string
}
```

## Endpoint Behavior Changes

| Endpoint | Admin | Regular User |
|----------|-------|--------------|
| GET /products | All products (or filtered via query param) | Only own products |
| POST /products | Creates with own userId | Creates with own userId |
| PUT /products/[id] | Can update any | Can update only own (403 otherwise) |
| DELETE /products/[id] | Can delete any | Can delete only own (403 otherwise) |
| GET /orders | Full access | 403 Forbidden |
| PUT /orders/[id] | Can update status | 403 Forbidden |

## UI Changes

| Component | Admin | Regular User |
|-----------|-------|--------------|
| Navigation | Shows Orders link | Hides Orders link |
| Products Page | Toggle: "Show All / My Products" | No toggle, sees own only |
| ProductCard | Edit/Delete on all products | Edit/Delete only on own |
| Orders Page | Full access | Redirect to dashboard |

## Commits
```
feat: add role field to user model
feat: add createdBy field to product model
feat: implement role-based API access control
feat: add admin product toggle and UI restrictions
```
