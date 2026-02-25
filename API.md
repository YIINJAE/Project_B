# Week 1 API Draft

This document defines the initial HTTP API contract for week 1 MVP.

## Conventions
- Base URL: `/api/v1`
- Content type: `application/json; charset=utf-8`
- Authentication: `Authorization: Bearer <access_token>`
- Idempotency for order creation: `Idempotency-Key` header (recommended)
- Time format: ISO 8601 UTC (example: `2026-02-25T06:00:00Z`)
- Currency format: integer minor units (`price_cents`, `subtotal_cents`)

## Versioning Rules
- URI versioning is mandatory (`/api/v1/...`).
- Backward-compatible changes in `v1`:
  - add optional request fields
  - add response fields
  - add new endpoints
- Breaking changes require a new major version (`/api/v2/...`), including:
  - removing or renaming fields
  - changing data type/semantics of existing fields
  - changing validation behavior that can fail previously valid requests
- Deprecation policy:
  - announce deprecation before removal
  - include response header: `Deprecation: true`
  - include response header: `Sunset: <RFC 1123 date>`

## Error Model
All non-2xx responses use this envelope:

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "quantity must be >= 1",
    "details": [
      {
        "field": "quantity",
        "reason": "must be greater than or equal to 1"
      }
    ],
    "request_id": "req_5f89f2ab"
  }
}
```

Common error codes:
- `INVALID_INPUT` (400)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `CONFLICT` (409)
- `OUT_OF_STOCK` (409)
- `RATE_LIMITED` (429)
- `INTERNAL_ERROR` (500)

## Auth Endpoints

### POST /api/v1/auth/register
Create a new customer account.

Request:
```json
{
  "email": "user@example.com",
  "password": "StrongPass123!",
  "name": "Jane Doe"
}
```

Response `201 Created`:
```json
{
  "user": {
    "id": "usr_1001",
    "email": "user@example.com",
    "name": "Jane Doe",
    "created_at": "2026-02-25T06:00:00Z"
  }
}
```

### POST /api/v1/auth/login
Authenticate and issue tokens.

Request:
```json
{
  "email": "user@example.com",
  "password": "StrongPass123!"
}
```

Response `200 OK`:
```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "rfr_abc123",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": "usr_1001",
    "email": "user@example.com",
    "name": "Jane Doe"
  }
}
```

### POST /api/v1/auth/refresh
Rotate access token using refresh token.

Request:
```json
{
  "refresh_token": "rfr_abc123"
}
```

Response `200 OK`:
```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### POST /api/v1/auth/logout
Invalidate refresh token/session.

Request:
```json
{
  "refresh_token": "rfr_abc123"
}
```

Response `204 No Content`

## Product Endpoints

### GET /api/v1/products
List products with optional filters.

Query params:
- `page` (default `1`)
- `page_size` (default `20`, max `100`)
- `category` (example: `outer`, `top`, `bottom`)
- `q` keyword search
- `sort` (`newest`, `price_asc`, `price_desc`)

Response `200 OK`:
```json
{
  "items": [
    {
      "id": "prd_2001",
      "name": "Structured Wool Blazer",
      "category": "outer",
      "price_cents": 18900,
      "currency": "USD",
      "thumbnail_url": "https://cdn.example.com/products/prd_2001.jpg",
      "in_stock": true
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total_items": 125,
    "total_pages": 7
  }
}
```

### GET /api/v1/products/{product_id}
Fetch single product detail.

Response `200 OK`:
```json
{
  "id": "prd_2001",
  "name": "Structured Wool Blazer",
  "description": "Tailored silhouette with lightweight lining.",
  "category": "outer",
  "price_cents": 18900,
  "currency": "USD",
  "images": [
    "https://cdn.example.com/products/prd_2001_1.jpg",
    "https://cdn.example.com/products/prd_2001_2.jpg"
  ],
  "variants": [
    {
      "sku": "prd_2001_blk_m",
      "size": "M",
      "color": "black",
      "stock": 12
    }
  ],
  "created_at": "2026-02-20T03:00:00Z",
  "updated_at": "2026-02-24T10:15:00Z"
}
```

## Cart Endpoints

### GET /api/v1/cart
Get active cart for authenticated user.

Response `200 OK`:
```json
{
  "id": "cart_3001",
  "user_id": "usr_1001",
  "items": [
    {
      "line_id": "line_1",
      "product_id": "prd_2001",
      "sku": "prd_2001_blk_m",
      "name": "Structured Wool Blazer",
      "quantity": 1,
      "unit_price_cents": 18900,
      "line_total_cents": 18900
    }
  ],
  "subtotal_cents": 18900,
  "discount_cents": 0,
  "shipping_cents": 0,
  "tax_cents": 0,
  "grand_total_cents": 18900,
  "updated_at": "2026-02-25T06:05:00Z"
}
```

### POST /api/v1/cart/items
Add item to cart.

Request:
```json
{
  "product_id": "prd_2001",
  "sku": "prd_2001_blk_m",
  "quantity": 1
}
```

Response `201 Created`:
```json
{
  "line_id": "line_1",
  "cart_id": "cart_3001",
  "product_id": "prd_2001",
  "sku": "prd_2001_blk_m",
  "quantity": 1
}
```

### PATCH /api/v1/cart/items/{line_id}
Update cart line quantity.

Request:
```json
{
  "quantity": 2
}
```

Response `200 OK`:
```json
{
  "line_id": "line_1",
  "quantity": 2,
  "line_total_cents": 37800
}
```

### DELETE /api/v1/cart/items/{line_id}
Remove line item from cart.

Response `204 No Content`

## Order Endpoints

### POST /api/v1/orders
Create order from current cart.

Request:
```json
{
  "shipping_address": {
    "name": "Jane Doe",
    "line1": "123 Main St",
    "line2": "Apt 4B",
    "city": "San Francisco",
    "state": "CA",
    "postal_code": "94105",
    "country": "US",
    "phone": "+1-415-555-0123"
  },
  "payment_method": {
    "type": "card",
    "provider": "stripe",
    "payment_token": "pm_1Qabc..."
  },
  "notes": "Leave package at front desk"
}
```

Response `201 Created`:
```json
{
  "id": "ord_4001",
  "user_id": "usr_1001",
  "status": "pending_payment",
  "items": [
    {
      "product_id": "prd_2001",
      "sku": "prd_2001_blk_m",
      "quantity": 2,
      "unit_price_cents": 18900,
      "line_total_cents": 37800
    }
  ],
  "subtotal_cents": 37800,
  "discount_cents": 0,
  "shipping_cents": 500,
  "tax_cents": 3402,
  "grand_total_cents": 41702,
  "currency": "USD",
  "created_at": "2026-02-25T06:10:00Z"
}
```

Possible errors:
- `409 OUT_OF_STOCK`
- `409 CONFLICT` (idempotency key reused with different payload)
- `422 INVALID_INPUT` (address/payment validation)

### GET /api/v1/orders
List authenticated user orders.

Response `200 OK`:
```json
{
  "items": [
    {
      "id": "ord_4001",
      "status": "paid",
      "grand_total_cents": 41702,
      "currency": "USD",
      "created_at": "2026-02-25T06:10:00Z"
    }
  ]
}
```

### GET /api/v1/orders/{order_id}
Get order detail.

Response `200 OK`:
```json
{
  "id": "ord_4001",
  "status": "paid",
  "tracking_number": "TRK123456789",
  "items": [
    {
      "product_id": "prd_2001",
      "sku": "prd_2001_blk_m",
      "quantity": 2,
      "line_total_cents": 37800
    }
  ],
  "shipping_address": {
    "name": "Jane Doe",
    "line1": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "postal_code": "94105",
    "country": "US"
  },
  "grand_total_cents": 41702,
  "currency": "USD",
  "created_at": "2026-02-25T06:10:00Z",
  "updated_at": "2026-02-25T06:20:00Z"
}
```

## HTTP Status Summary
- `200 OK`: successful read/update
- `201 Created`: resource created
- `204 No Content`: successful delete/logout
- `400 Bad Request`: malformed input
- `401 Unauthorized`: missing/invalid auth token
- `403 Forbidden`: authenticated but not allowed
- `404 Not Found`: missing resource
- `409 Conflict`: stock/idempotency/business conflict
- `422 Unprocessable Entity`: semantically invalid payload
- `429 Too Many Requests`: rate limited
- `500 Internal Server Error`: unexpected server failure
