# 09 - Product Delete with Optimistic Updates

- [x] (Required)

Implement product deletion with optimistic updates using React Query.

## Dependencies
- Task 07 (Products List) - ProductCard, ProductList components
- Task 08 (Product Forms) - React Query setup, mutation patterns, client API

## Subtasks
| # | Subtask | Status | Depends On |
|---|---------|--------|------------|
| 9.1 | Add delete endpoint to `src/features/products/api/client.ts` | [x] (Required) | Task 08.2 |
| 9.2 | Create `src/features/products/hooks/useDeleteProduct.ts` | [x] (Required) | 9.1, Task 08.3 |
| 9.3 | Implement optimistic update in mutation | [x] (Required) | 9.2 |
| 9.4 | Add rollback on error | [x] (Required) | 9.3 |
| 9.5 | Create delete confirmation UI component | [x] (Required) | Task 10 (Modal/Button) |
| 9.6 | Integrate delete action in ProductCard/ProductList | [x] (Required) | 9.4, 9.5, Task 07.4 |

## Commit
`feat: add product deletion with optimistic updates`
