# Product Dashboard

A product management dashboard built with **Next.js 16 (App Router)** and **React 19**. Users sign in, then list, create, edit and delete products. Admins also manage orders and see a stats overview.

It was built in January 2026 as a frontend engineering challenge. The original brief is in [CHALLENGE.md](CHALLENGE.md).

## Features

- **Authentication:** login and register, with a JWT stored in an HTTP-only cookie. Routes are protected by Next.js middleware.
- **Products:** a list rendered on the server, with infinite scrolling, create and edit forms, and delete with optimistic updates.
- **Orders** (admin only): view orders and update their status.
- **Dashboard:** stats overview.
- **Role-based access:** enforced in the API first, then reflected in the UI.
- **Mock backend:** Next.js route handlers (`app/api`) that persist to JSON files in `data/`.

## Tech stack

| Area | Library |
|---|---|
| Framework | Next.js 16, React 19, TypeScript (strict) |
| Data fetching | TanStack Query |
| Forms and validation | React Hook Form, Zod |
| Styling | Tailwind CSS 4 |
| Auth | jose (JWT), bcryptjs |
| Notifications | Sonner |
| Tests | Jest, Testing Library |

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open http://localhost:3000. See [SETUP.md](SETUP.md) for details and [DECISIONS.md](DECISIONS.md) for the architectural decisions behind the code.

## Tests

```bash
npm test
npm run test:coverage
```
