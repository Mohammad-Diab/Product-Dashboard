# Setup Guide

Quick setup guide for developers.

---

## Prerequisites

- Node.js 20.x+
- npm 10.x+

---

## Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Watermelon-Market/frontend-challenge-mohammad-diab.git
```

2. **Navigate to project directory:**
```bash
cd frontend-challenge-mohammad-diab
```

3. **Checkout development branch:**
```bash
git checkout development
```

4. **Install dependencies:**
```bash
npm install
```

5. **Setup environment variables:**
```bash
cp .env.example .env.local
```

6. **Verify mock data:**
Mock data is pre-configured in `data/` directory (users, products, orders). See [Mock Data](#mock-data) section for credentials and examples.

---

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Default values in `.env.local`:

```bash
NODE_ENV=development
NEXT_PUBLIC_API_BASE_URL=/api
SERVER_API_BASE_URL=http://localhost:3000/api

# Authentication
AUTH_COOKIE_NAME=auth-token
JWT_SECRET=your-secret-key-here
```

---

## Running the Application

### Development
```bash
npm run dev
```
App runs at [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
```

---

## Running Tests

```bash
# Run all tests
npm test

# Coverage report
npm run test:coverage
```

---

## Mock Data

### Users (`data/users.json`)

**Admin:**
```json
{
    "id": "a12d0565-da83-4e3a-b23f-e1056c2360eb",
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "$2b$10$jjanOUL1fe6yCjogPpZ3LOLZooBlTO/ZhECIUlU8XXCZBQXvO6fLe",
    "role": "admin",
    "createdAt": "2026-01-10T00:00:00.000Z"
}
```

**Regular User:**
```json
  {
    "id": "12383f1e-2eb7-490f-b2c3-cec77f94b1b3",
    "name": "Mohammad Diab",
    "email": "mohammad.diab.me@gmail.com",
    "password": "$2b$10$6afthvZZfqGAW5PqhZCqveVqm64nitc3OxMOlqZTBcBdCsXa1Z41S",
    "role": "user",
    "createdAt": "2026-01-13T04:28:06.909Z"
  }
```

### Products (`data/products.json`)

```json

  {
    "id": "12383f1e-2eb7-490f-b2c3-cec77f94b1b4",
    "name": "Ergonomic Office Chair",
    "description": "Mesh office chair with lumbar support, adjustable armrests, and tilt mechanism.",
    "price": 249.99,
    "status": "inactive",
    "createdBy": "a12d0565-da83-4e3a-b23f-e1056c2360eb",
    "createdAt": "2024-06-01T11:35:00Z"
  },
  {
    "id": "12383f1e-2eb7-490f-b2c3-cec77f94b1b5",
    "name": "Smart Power Strip",
    "description": "WiFi-enabled power strip with individual outlet control and energy monitoring.",
    "price": 44.99,
    "status": "active",
    "createdBy": "12383f1e-2eb7-490f-b2c3-cec77f94b1b3",
    "createdAt": "2024-06-10T14:20:00Z"
  }

```

### Orders (`data/orders.json`)

```json
  {
    "id": "12383f1e-2eb7-490f-b2c3-cec77f94b1b8",
    "orderNumber": "ORD-2024-001",
    "customerId": "12383f1e-2eb7-490f-b2c3-cec77f94b1b3",
    "status": "pending",
    "totalAmount": 449.98,
    "currency": "USD",
    "items": [
      {
        "productId": "12383f1e-2eb7-490f-b2c3-cec77f94b1b4",
        "productName": "Ergonomic Office Chair",
        "quantity": 2,
        "unitPrice": 149.99
      },
      {
        "productId": "12383f1e-2eb7-490f-b2c3-cec77f94b1b5",
        "productName": "Smartwatch Fitness Tracker",
        "quantity": 1,
        "unitPrice": 149.99
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2026-01-13T04:44:13.059Z"
  }
```

---

## Key Features

- **Auth:** `/login`, `/register` (JWT + HTTP-only cookies)
- **Products:** `/products` (CRUD operations)
- **Orders:** `/orders` (Admin only, view and update status)
- **Dashboard:** `/dashboard` or `/` (Stats overview)

---
