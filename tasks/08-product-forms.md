# 08 - Product Create & Edit Forms

- [x] (Required)

Implement product creation and editing with React Hook Form, Zod, and React Query mutations.

## Dependencies
- Task 02 (API Layer) - client-side API utilities
- Task 03 (Mock API Routes) - products POST/PUT endpoints
- Task 07 (Products List) - Product types, API functions
- Task 10 (Shared Components) - Button, Input, FormField components

## Subtasks
| # | Subtask | Status | Depends On |
|---|---------|--------|------------|
| 8.1 | Create `src/features/products/schemas/product-schema.ts` | [x] (Required) | Task 07.1 |
| 8.2 | Create `src/features/products/api/client.ts` for mutations | [x] (Required) | Task 07.1, Task 02.4 |
| 8.3 | Set up React Query provider in app layout | [x] (Required) | Task 01.2 |
| 8.4 | Create `src/features/products/hooks/useCreateProduct.ts` | [x] (Required) | 8.2, 8.3 |
| 8.5 | Create `src/features/products/hooks/useUpdateProduct.ts` | [x] (Required) | 8.2, 8.3 |
| 8.6 | Create `src/features/products/components/ProductForm.tsx` (client) | [x] (Required) | 8.1, Task 10 |
| 8.7 | Create `app/(protected)/products/new/page.tsx` | [x] (Required) | 8.4, 8.6 |
| 8.8 | Create `app/(protected)/products/[id]/edit/page.tsx` | [x] (Required) | 8.5, 8.6, Task 07.3 |
| 8.9 | Handle loading states and server validation errors | [x] (Required) | 8.7, 8.8 |

## Commit
`feat: implement product create and edit forms`
