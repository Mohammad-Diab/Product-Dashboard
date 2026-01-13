# 02 - Centralized API Layer

- [x] (Required)

Create a centralized API client with separate server/client utilities and unified error handling.

## Dependencies
- Task 01 (Project Setup) - folder structure, TypeScript config

## Subtasks
| # | Subtask | Status | Depends On |
|---|---------|--------|------------|
| 2.1 | Create API types in `src/lib/api/types.ts` | [x] (Required) | Task 01 |
| 2.2 | Create typed API response wrapper | [x] (Required) | 2.1 |
| 2.3 | Implement error handler for 401, 400, 500 responses | [x] (Required) | 2.1 |
| 2.4 | Create `src/lib/api/client.ts` for client-side API calls | [x] (Required) | 2.2, 2.3 |
| 2.5 | Create `src/lib/api/server.ts` for server-side API calls | [x] (Required) | 2.2, 2.3 |
| 2.6 | Export via barrel file `src/lib/api/index.ts` | [x] (Required) | 2.4, 2.5 |

## Commit
`feat: add centralized API layer with error handling`
