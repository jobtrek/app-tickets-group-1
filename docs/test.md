# User Story: Authentication Backend with Bun

---

## Overview

**As a** developer,
**I want to** build a secure authentication backend using Bun,
**So that** users can register and log in with validated, safely stored credentials.

---

## Acceptance Criteria

### 1. User Registration — `POST /api/register`
- Accepts `name`, `email`, `businessName`, and `password` in the request body
- Validates all fields using **Valibot** before processing:
  - `name` — required, non-empty string
  - `email` — required, valid email format
  - `password` — required, minimum 8 characters
- Returns a `400` error with a descriptive message if validation fails
- Hashes the password using **`Bun.password.hash()`** (Argon2id) before saving
- Saves the user (`name`, `email`, `businessName`, `hashedPassword`) to the database
- Returns a `201` success response on successful registration

---

### 2. User Login — `POST /api/login`
- Accepts `email` and `password` in the request body
- Validates both fields using **Valibot**:
  - `email` — required, valid email format
  - `password` — required, non-empty string
- Returns a `400` error if validation fails
- Looks up the user by email — returns `401` if not found
- Verifies the password using **`Bun.password.verify()`**
- Returns `401` if the password does not match
- Issues a secure **HTTP-only cookie** (session token) on successful login
- Returns a `200` success response

---

### 3. Protected Route — `GET /api/me`
- Reads the session cookie from the incoming request
- Returns `401` if no valid session is found
- Returns the authenticated user's details if the session is valid

---

### 4. Routing
- All routes are handled via **`Bun.serve()`**
- Unknown routes return a `404` response
- All responses return `Content-Type: application/json`

---

## Technical Notes

| Concern           | Tool / Approach                  |
|-------------------|----------------------------------|
| Runtime           | Bun                              |
| Validation        | Valibot                          |
| Password Hashing  | `Bun.password.hash()` (Argon2id) |
| Password Verify   | `Bun.password.verify()`          |
| Session           | HTTP-only secure cookie          |
| Routing           | `Bun.serve()` with URL matching  |