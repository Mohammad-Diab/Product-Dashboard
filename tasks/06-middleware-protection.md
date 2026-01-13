# 06 - Middleware & Route Protection

- [x] (Required)

Implement Next.js middleware for route protection, cookie reading, and redirects.

## Dependencies
- Task 03 (Mock API Routes) - cookie format and auth token structure
- Task 04 (Auth Context) - auth state shape and user types

## Subtasks
| # | Subtask | Status | Depends On |
|---|---------|--------|------------|
| 6.1 | Define route patterns constants in `src/lib/routes.ts` | [x] (Required) | Task 01 |
| 6.2 | Create `middleware.ts` at project root | [x] (Required) | 6.1 |
| 6.3 | Read auth cookie and validate session | [x] (Required) | 6.2, Task 03.3 |
| 6.4 | Redirect unauthenticated users to `/login` | [x] (Required) | 6.3 |
| 6.5 | Redirect authenticated users away from auth pages | [x] (Required) | 6.3 |

## Commit
`feat: add middleware for route protection`
