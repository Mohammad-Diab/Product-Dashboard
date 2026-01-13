# 05 - Authentication Pages

- [x] (Required)

Implement login, register, and dashboard pages with React Hook Form + Zod validation.

## Dependencies
- Task 03 (Mock API Routes) - auth endpoints
- Task 04 (Auth Context) - useAuth hook, login/register actions
- Task 10 (Shared Components) - Button, Input, FormField components

## Subtasks
| # | Subtask | Status | Depends On |
|---|---------|--------|------------|
| 5.1 | Create Zod schemas in `src/features/auth/schemas/` | [x] (Required) | Task 04.1 |
| 5.2 | Create `src/features/auth/components/LoginForm.tsx` (client) | [x] (Required) | 5.1, Task 04.6, Task 10 |
| 5.3 | Create `src/features/auth/components/RegisterForm.tsx` (client) | [x] (Required) | 5.1, Task 04.6, Task 10 |
| 5.4 | Create `app/(auth)/layout.tsx` for auth pages | [x] (Required) | Task 01 |
| 5.5 | Create `app/(auth)/login/page.tsx` with login form | [x] (Required) | 5.2, 5.4 |
| 5.6 | Create `app/(auth)/register/page.tsx` with register form | [x] (Required) | 5.3, 5.4 |
| 5.7 | Create `app/(protected)/layout.tsx` for protected pages | [x] (Required) | Task 04.4 |
| 5.8 | Create `app/(protected)/dashboard/page.tsx` | [x] (Required) | 5.7, Task 04.6 |
| 5.9 | Handle server-side validation errors in forms | [x] (Required) | 5.5, 5.6, Task 03 |

## Commit
`feat: implement authentication pages with form validation`
