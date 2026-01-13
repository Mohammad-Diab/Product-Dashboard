# 03 - Mock API Route Handlers

- [x] (Required)

Implement Next.js Route Handlers as mock API with JSON file persistence for auth and products.

## Dependencies
- Task 01 (Project Setup) - folder structure
- Task 02 (API Layer) - API types and response wrappers

## Subtasks
| # | Subtask | Status | Depends On |
|---|---------|--------|------------|
| 3.1 | Create `src/data/` folder with `users.json` and `products.json` | [x] (Required) | Task 01 |
| 3.2 | Create shared API utilities `app/api/_lib/` (cookie helpers, JSON helpers) | [x] (Required) | Task 02 |
| 3.3 | Implement HTTP-only cookie handling for auth token | [x] (Required) | 3.2 |
| 3.4 | Create `app/api/auth/login/route.ts` (POST) | [x] (Required) | 3.1, 3.3 |
| 3.5 | Create `app/api/auth/register/route.ts` (POST) | [x] (Required) | 3.1, 3.3 |
| 3.6 | Create `app/api/auth/me/route.ts` (GET) | [x] (Required) | 3.3 |
| 3.7 | Create `app/api/auth/logout/route.ts` (POST) | [x] (Required) | 3.3 |
| 3.8 | Create `app/api/products/route.ts` (GET, POST) | [x] (Required) | 3.1, 3.2 |
| 3.9 | Create `app/api/products/[id]/route.ts` (GET, PUT, DELETE) | [x] (Required) | 3.8 |

## Commit
`feat: implement mock API route handlers with JSON persistence`
