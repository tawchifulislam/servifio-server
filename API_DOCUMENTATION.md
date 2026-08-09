# Servifio API Documentation

Base URL (local): `http://localhost:5000`
Base URL (production): `https://<your-render-url>.onrender.com`

## Response Format

All responses follow this structure:

```json
{
  "success": true,
  "message": "Description of what happened",
  "data": {}
}
```

Error responses:

```json
{
  "success": false,
  "message": "Description of the error"
}
```

## Authentication

Protected routes require a JWT token in the request header:

```
Authorization: Bearer <token>
```

The token is returned from the register and login endpoints. It encodes `userId` and `role`, and expires based on `JWT_EXPIRES_IN` (default 7 days).

Roles: `CUSTOMER`, `PROVIDER`, `ADMIN`

---

## Auth Endpoints (`/api/auth`)

### Register

| | |
| --- | --- |
| **Method** | POST |
| **Endpoint** | `/api/auth/register` |
| **Auth required** | No |

#### Request Body

```json
{
  "name": "Rafiq Ahmed",
  "email": "customer@servifio.com",
  "password": "test1234",
  "phone": "01700000000"
}
```

`phone` is optional. New users default to `CUSTOMER` role.

### Success Response - 201 Created

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Rafiq Ahmed",
      "email": "customer@servifio.com",
      "phone": "01700000000",
      "role": "CUSTOMER",
      "isDeleted": false,
      "createdAt": "2026-08-08T13:20:39.448Z",
      "updatedAt": "2026-08-08T13:20:39.448Z"
    },
    "token": "eyJhbGciOi..."
  }
}
```

## Error Responses

| Status | Reason |
| --- | --- |
| 409 | Email already registered |
| 500 | Server error |

### Login

| | |
| --- | --- |
| **Method** | POST |
| **Endpoint** | `/api/auth/login` |
| **Auth required** | No |

### Request Body

```json
{
  "email": "customer@servifio.com",
  "password": "test1234"
}
```

#### Success Response - 200 OK

Same shape as register response.

#### Error Responses

| Status | Reason |
| --- | --- |
| 404 | User not found |
| 401 | Invalid credentials |
| 500 | Server error |

---

## Category Endpoints (`/api/categories`)

### Create Category

| | |
| --- | --- |
| **Method** | POST |
| **Endpoint** | `/api/categories` |
| **Auth required** | Yes - `ADMIN` only |

#### Request Body

```json
{
  "name": "Plumbing",
  "description": "Pipe fitting, leak repair, and installation services",
  "icon": "wrench"
}
```

`description` and `icon` are optional.

**Success Response - 201 Created**

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "uuid",
    "name": "Plumbing",
    "description": "Pipe fitting, leak repair, and installation services",
    "icon": "wrench",
    "isDeleted": false,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Error Responses**

| Status | Reason |
| --- | --- |
| 401 | No/invalid token |
| 403 | Not an admin |
| 409 | Category name already exists |

### Get All Categories

| | |
| --- | --- |
| **Method** | GET |
| **Endpoint** | `/api/categories` |
| **Auth required** | No |

**Success Response - 200 OK** - array of category objects (excludes soft-deleted).

### Get Category By ID

| | |
| --- | --- |
| **Method** | GET |
| **Endpoint** | `/api/categories/:id` |
| **Auth required** | No |

**Error Responses**: `404` if not found or deleted.

### Update Category

| | |
| --- | --- |
| **Method** | PATCH |
| **Endpoint** | `/api/categories/:id` |
| **Auth required** | Yes - `ADMIN` only |

**Request Body** (any subset)

```json
{
  "name": "Plumbing & Pipefitting",
  "description": "Updated description"
}
```

### Delete Category (Soft Delete)

| | |
| --- | --- |
| **Method** | DELETE |
| **Endpoint** | `/api/categories/:id` |
| **Auth required** | Yes - `ADMIN` only |

Sets `isDeleted: true`; record is not removed from the database.

---

## Service Endpoints (`/api/services`)

### Create Service

| | |
| --- | --- |
| **Method** | POST |
| **Endpoint** | `/api/services` |
| **Auth required** | Yes - `PROVIDER` only |

**Request Body**

```json
{
  "title": "Emergency Pipe Repair",
  "description": "24/7 emergency plumbing repair service at your doorstep",
  "price": 500,
  "categoryId": "uuid-of-category"
}
```

**Success Response - 201 Created** - service object, `providerId` set from the authenticated user.

**Error Responses**

| Status | Reason |
| --- | --- |
| 401 | No/invalid token |
| 403 | Not a provider |
| 404 | Category not found |

### Get All Services

| | |
| --- | --- |
| **Method** | GET |
| **Endpoint** | `/api/services` |
| **Auth required** | No |

Returns only `ACTIVE`, non-deleted services, including `category` and `provider` (name/email/phone only, password excluded).

### Get Service By ID

| | |
| --- | --- |
| **Method** | GET |
| **Endpoint** | `/api/services/:id` |
| **Auth required** | No |

**Error Responses**: `404` if not found or deleted.

### Update Service

| | |
| --- | --- |
| **Method** | PATCH |
| **Endpoint** | `/api/services/:id` |
| **Auth required** | Yes - `PROVIDER` (owner only) or `ADMIN` |

**Request Body** (any subset)

```json
{
  "price": 600,
  "status": "INACTIVE"
}
```

**Error Responses**

| Status | Reason |
| --- | --- |
| 403 | Not the owning provider or an admin |
| 404 | Service not found |

### Delete Service (Soft Delete)

| | |
| --- | --- |
| **Method** | DELETE |
| **Endpoint** | `/api/services/:id` |
| **Auth required** | Yes - `PROVIDER` (owner only) or `ADMIN` |

---

## Booking Endpoints (`/api/bookings`)

### Create Booking

| | |
| --- | --- |
| **Method** | POST |
| **Endpoint** | `/api/bookings` |
| **Auth required** | Yes - `CUSTOMER` only |

**Request Body**

```json
{
  "serviceId": "uuid-of-service",
  "scheduledDate": "2026-08-15T10:00:00Z",
  "note": "Kitchen sink leaking badly"
}
```

`note` is optional. Booking is created with status `PENDING`.

**Error Responses**: `404` if the service does not exist, is deleted, or is `INACTIVE`.

### Get My Bookings

| | |
| --- | --- |
| **Method** | GET |
| **Endpoint** | `/api/bookings/my-bookings` |
| **Auth required** | Yes - any authenticated role |

Behavior depends on the requester's role:

- `CUSTOMER`: bookings they created
- `PROVIDER`: bookings placed against their services
- `ADMIN`: same as customer view (their own bookings, if any)

### Get Booking By ID

| | |
| --- | --- |
| **Method** | GET |
| **Endpoint** | `/api/bookings/:id` |
| **Auth required** | Yes - any authenticated role |

### Update Booking Status

| | |
| --- | --- |
| **Method** | PATCH |
| **Endpoint** | `/api/bookings/:id/status` |
| **Auth required** | Yes - the customer, the owning provider, or `ADMIN` |

**Request Body**

```json
{
  "status": "ACCEPTED"
}
```

**Valid status transitions**

| From | Allowed to |
| --- | --- |
| PENDING | ACCEPTED, REJECTED, CANCELLED |
| ACCEPTED | COMPLETED, CANCELLED |
| REJECTED | (final) |
| COMPLETED | (final) |
| CANCELLED | (final) |

**Error Responses**

| Status | Reason |
| --- | --- |
| 403 | Not the customer, owning provider, or admin |
| 400 | Invalid status transition |
| 404 | Booking not found |

### Delete Booking (Soft Delete)

| | |
| --- | --- |
| **Method** | DELETE |
| **Endpoint** | `/api/bookings/:id` |
| **Auth required** | Yes - the customer who made it, or `ADMIN` |

---

## Review Endpoints (`/api/reviews`)

### Create Review

| | |
| --- | --- |
| **Method** | POST |
| **Endpoint** | `/api/reviews` |
| **Auth required** | Yes - `CUSTOMER` only |

**Request Body**

```json
{
  "bookingId": "uuid-of-completed-booking",
  "rating": 5,
  "comment": "Excellent service, arrived on time and fixed the leak quickly"
}
```

`comment` is optional. `rating` must be an integer between 1 and 5.

**Error Responses**

| Status | Reason |
| --- | --- |
| 400 | Rating out of range, or booking not `COMPLETED` |
| 403 | Booking does not belong to the requester |
| 404 | Booking not found |
| 409 | A review already exists for this booking |

### Get Reviews By Service

| | |
| --- | --- |
| **Method** | GET |
| **Endpoint** | `/api/reviews/service/:serviceId` |
| **Auth required** | No |

Returns non-deleted reviews for a service, with reviewer name.

### Get Review By ID

| | |
| --- | --- |
| **Method** | GET |
| **Endpoint** | `/api/reviews/:id` |
| **Auth required** | No |

### Delete Review (Soft Delete)

| | |
| --- | --- |
| **Method** | DELETE |
| **Endpoint** | `/api/reviews/:id` |
| **Auth required** | Yes - the reviewer, or `ADMIN` |

---

## Data Models Summary

| Model | Key Fields | Enums |
| --- | --- | --- |
| User | name, email (unique), password (hashed), phone, role | Role: CUSTOMER, PROVIDER, ADMIN |
| Category | name (unique), description, icon | - |
| Service | title, description, price, status, providerId, categoryId | ServiceStatus: ACTIVE, INACTIVE |
| Booking | scheduledDate, note, status, customerId, serviceId | BookingStatus: PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED |
| Review | rating, comment, bookingId (unique), customerId, serviceId | - |

All models include `isDeleted` (soft delete), `createdAt`, and `updatedAt`.
