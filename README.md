# Servifio - Backend API

A production-ready REST API for a local service marketplace, connecting customers with service providers (plumbing, tutoring, cleaning, and more). Built as a role-based platform with booking lifecycle management and post-service reviews.

## Live Links

- **API Base URL**: `https://servifio-server.onrender.com`
- **Frontend**: `<add once built>`
- **API Documentation**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Tech Stack

- **Runtime**: Node.js + Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (hosted on Neon)
- **ORM**: Prisma (with `@prisma/adapter-pg` driver adapter)
- **Auth**: JWT + bcrypt
- **Dev tooling**: tsx (hot reload)

## Features

- Role-based access control: `CUSTOMER`, `PROVIDER`, `ADMIN`
- JWT authentication (register/login)
- Full CRUD for Categories, Services, Bookings, and Reviews
- Booking status state machine (PENDING → ACCEPTED → COMPLETED, with REJECTED/CANCELLED branches)
- Ownership-based authorization (providers can only manage their own services; customers their own bookings)
- Soft delete across all models
- Consistent API response format across every endpoint

## Project Structure

```text
server/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app.ts                # Express app config, middleware, route mounting
│   ├── server.ts              # Server entry point
│   ├── routes/                # Route definitions per module
│   ├── services/
│   │   ├── user/
│   │   ├── category/
│   │   ├── service/
│   │   ├── booking/
│   │   └── review/
│   └── lib/                   # Prisma client, auth middleware, response helpers
├── prisma.config.ts
├── .env
└── package.json
```

## Getting Started (Local Setup)

1. Clone the repository

   ```bash
   git clone <repo-url>
   cd servifio-server
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables - create a `.env` file:

   ```dotenv
   DATABASE_URL="postgresql://<your-postgres-connection-string>"
   JWT_SECRET="<a-long-random-string>"
   JWT_EXPIRES_IN="7d"
   ```

4. Run database migrations

   ```bash
   npx prisma migrate dev
   ```

5. Start the dev server

   ```bash
   npm run dev
   ```

Server runs on `http://localhost:5000` by default.

## Database Schema

Five core models: `User`, `Category`, `Service`, `Booking`, `Review` - all with soft delete (`isDeleted`), timestamps, and indexed foreign keys. See [prisma/schema.prisma](./prisma/schema.prisma) for the full schema.

## API Documentation

Full endpoint reference (methods, request/response shapes, status codes) is in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).
