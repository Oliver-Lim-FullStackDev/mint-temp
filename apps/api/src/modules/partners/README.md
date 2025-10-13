# MINT Partner API Documentation

This document describes how partners can track referred users and query player data via the MINT Partner API. It includes the partner-facing URLs, authentication, available filters (camelCase), and ready-to-copy cURL examples.

---

## Example Partner Details

- **Partner:** Company Name
- **Key:** `company-name`
- **User WEB URL (referral):** `https://mint.io?referrer=<KEY>` → e.g. `https://mint.io?referrer=company-name` `v2 only`
- **User TG URL (referral):** `https://t.me/MintDotIO_bot/?startapp=referrer=<KEY>` → e.g. `https://t.me/MintDotIO_bot/?startapp=referrer=company-name`
- **API Endpoint:** `https://mint-api.mint.io/api/partners/<KEY>`
- **Token:** `<TOKEN>` (use in `Authorization: Bearer <TOKEN>`)

## Authentication

All requests require a bearer token sent via the `Authorization` header.

**Header:** `Authorization: Bearer <TOKEN>`

## Endpoints
- **Players :** `GET /partners/<KEY>/players` → e.g. `https://mint-api.mint.io/api/partners/company-name/players`

---

## Query Parameters (Filters)

> **Note:** Filter keys use **camelCase**.

- `username` — string. Filter by exact username (e.g., `tg_12345678`).
- `createdAtFrom` — ISO datetime (inclusive). Return players created **on/after** this timestamp.
- `createdAtTo` — ISO datetime (inclusive). Return players created **on/before** this timestamp.
- `page` — integer. Pagination page (1-based).

---

## cURL Examples

### Get player by username
```bash
curl -s \
  -H "Content-type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  "https://mint-api.mint.io/api/partners/<KEY>/players?username=tg_12345678"
```

### Get players created after a specific date
```bash
curl -s \
-H "Content-type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
"https://mint-api.mint.io/api/partners/<KEY>/players?createdAtFrom=2025-09-13%2018%3A00"
```

### Get players created before a specific date
```bash
curl -s \
-H "Content-type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
"https://mint-api.mint.io/api/partners/<KEY>/players?createdAtTo=2024-09-01%2016%3A00"
```

### Get players created between two dates
```bash
curl -s \
-H "Content-type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
"https://mint-api.mint.io/api/partners/<KEY>/players?createdAtFrom=2024-09-01%2000%3A00&createdAtTo=2025-09-13%2023%3A59"
```

### Paginate through results
```bash
curl -s \
-H "Content-type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
"https://mint-api.mint.io/api/partners/<KEY>/players?page=2"
```
