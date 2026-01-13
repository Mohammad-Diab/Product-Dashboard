# 04 - Authentication Context

- [ ] (Required)

Create React Context for global auth state management with user, token, and isAuthenticated.

## Dependencies
- Task 01 (Project Setup) - folder structure, TypeScript config
- Task 02 (API Layer) - client-side API utilities

## Subtasks
| # | Subtask | Status | Depends On |
|---|---------|--------|------------|
| 4.1 | Create auth types in `src/features/auth/types.ts` | [ ] (Required) | Task 01 |
| 4.2 | Create `src/features/auth/context/auth-context.tsx` | [ ] (Required) | 4.1 |
| 4.3 | Create auth API functions in `src/features/auth/api/` | [ ] (Required) | 4.1, Task 02 |
| 4.4 | Create `src/features/auth/context/auth-provider.tsx` (client component) | [ ] (Required) | 4.2, 4.3 |
| 4.5 | Implement login, logout, register actions | [ ] (Required) | 4.4 |
| 4.6 | Create `useAuth` hook | [ ] (Required) | 4.4 |
| 4.7 | Export via barrel file `src/features/auth/index.ts` | [ ] (Required) | 4.5, 4.6 |

## Commit
`feat: add authentication context and provider`
