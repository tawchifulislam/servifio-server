# Servifio - Backend API

REST API for **Servifio**, a local service marketplace connecting customers with vetted providers (plumbing, tutoring, cleaning, and more). Role-based access, a booking lifecycle state machine, and post-service reviews.

**API:** [servifio-server.onrender.com](https://servifio-server.onrender.com) · **Frontend:** [servifio.vercel.app](https://servifio.vercel.app) · **Docs:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Stack

Express.js · TypeScript · PostgreSQL (Neon) · Prisma 7 · JWT + bcrypt

## Features

- Role-based access (`CUSTOMER`, `PROVIDER`, `ADMIN`) with ownership-level authorization
- Full CRUD for categories, services, bookings, reviews
- Booking status state machine with enforced valid transitions
- Soft delete + consistent `{ success, message, data }` response format

## Setup

```bash
git clone <repo-url>
cd servifio-server
npm install
```

`.env`:

```dotenv
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
JWT_EXPIRES_IN="7d"
```

```bash
npx prisma migrate dev
npm run dev        # http://localhost:5000
```

## Structure

```text
prisma/schema.prisma       5 models, 3 enums
src/
├── app.ts, server.ts
├── routes/                one router per resource
├── services/               service + controller per resource
└── lib/                    prisma client, auth middleware, response helpers
```

Full endpoint reference: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) · Frontend repo: [servifio-client](https://github.com/tawchifulislam/servifio-client)
