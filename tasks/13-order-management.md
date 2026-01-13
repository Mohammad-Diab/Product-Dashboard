# 13 - Order Management (Bonus)

- [x] (Optional)

Implement order listing and detail pages as bonus feature.

## Dependencies
- Task 01-10 (All core tasks completed)
- Task 11 (Unit Tests) - recommended before bonus
- Follows same patterns as Products feature (Task 07-09)

## Subtasks
| # | Subtask | Status | Depends On |
|---|---------|--------|------------|
| 13.1 | Create `src/features/orders/types.ts` with Order type | [x] (Optional) | Task 01 |
| 13.2 | Create `src/data/orders.json` mock data | [x] (Optional) | 13.1 |
| 13.3 | Create `app/api/orders/route.ts` (GET) | [x] (Optional) | 13.2, Task 03.2 |
| 13.4 | Create `app/api/orders/[id]/route.ts` (GET, PUT) | [x] (Optional) | 13.3 |
| 13.5 | Create `src/features/orders/api/server.ts` | [x] (Optional) | 13.1, Task 02.5 |
| 13.6 | Create `src/features/orders/components/OrderList.tsx` | [x] (Optional) | 13.1, Task 07.2 |
| 13.7 | Create `src/features/orders/components/OrderCard.tsx` | [x] (Optional) | 13.1 |
| 13.8 | Create `app/(protected)/orders/page.tsx` with SSR | [x] (Optional) | 13.5, 13.6, Task 10.6 |
| 13.9 | Create `app/(protected)/orders/[id]/page.tsx` | [x] (Optional) | 13.5, 13.7 |
| 13.10 | Add order status update functionality | [x] (Optional) | 13.4, 13.9 |

## Commit
`feat: add order management pages`
