# 07 - Products List Page (SSR)

- [x] (Required)

Implement SSR product list page with server-side data fetching and infinite scrolling.

## Dependencies
- Task 02 (API Layer) - server-side API utilities
- Task 03 (Mock API Routes) - products endpoints
- Task 06 (Middleware Protection) - route protection in place
- Task 10 (Shared Components) - Pagination, LoadingSpinner components

## Subtasks
| # | Subtask | Status | Depends On |
|---|---------|--------|------------|
| 7.1 | Create `src/features/products/types.ts` with Product type | [x] (Required) | Task 01 |
| 7.2 | Create unified date/currency formatters in `src/lib/formatters.ts` | [x] (Required) | Task 01 |
| 7.3 | Create `src/features/products/api/server.ts` with server fetching functions | [x] (Required) | 7.1, Task 02.5 |
| 7.4 | Create `src/features/products/components/ProductCard.tsx` | [x] (Required) | 7.1, 7.2 |
| 7.5 | Create `src/features/products/components/ProductList.tsx` | [x] (Required) | 7.4 |
| 7.6 | Create `app/(protected)/products/page.tsx` with SSR | [x] (Required) | 7.3, 7.5, Task 10 (Pagination) |
| 7.7 | Implement infinite scrolling with React Query | [x] (Required) | 7.6, Task 10 |
| 7.8 | Export via barrel file `src/features/products/index.ts` | [x] (Required) | 7.1, 7.5 |

## Commit
`feat: implement products list page with SSR and pagination`
