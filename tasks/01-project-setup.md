# 01 - Project Setup & Configuration

- [x] (Required)

Set up the foundational project structure, dependencies, and configuration files following CODE_RULES.md conventions.

## Dependencies
- None (this is the first task)

## Subtasks
| # | Subtask | Status | Depends On |
|---|---------|--------|------------|
| 1.1 | Create `src/` folder structure: `features/`, `components/`, `lib/`, `types/` | [x] (Required) | None |
| 1.2 | Install dependencies: @tanstack/react-query, react-hook-form, zod | [x] (Required) | None |
| 1.3 | Configure `tsconfig.json` with `strict: true` and path aliases | [x] (Required) | 1.1 |
| 1.4 | Set up Jest with React Testing Library | [x] (Required) | 1.2 |
| 1.5 | Create centralized env config file (`src/config/env.ts`) | [x] (Required) | 1.1, 1.3 |
| 1.6 | Configure Tailwind CSS with project theme | [x] (Required) | 1.1 |

## Commit
`chore: initialize project structure and dependencies`
