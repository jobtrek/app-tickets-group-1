# Authentication: How It Works

## Overview

Authentication is the process of verifying **who a user is** before granting them access to protected resources. The most common approach in modern web apps is **session-based token authentication**.

---

## The Login Flow

### 1. User submits credentials

The user sends their email and password to the server via a login form or API call.

### 2. Server validates credentials

The server looks up the user in the database by their email, then compares the submitted password against the **stored hash** (passwords are never stored in plain text — they're hashed using algorithms like bcrypt or Argon2).

- **If invalid:** the server returns a `401 Unauthorized` error.
- **If valid:** the server moves on to create a session.

### 3. Server creates a session token

Once the credentials check out, the server generates a **session token** — a unique, signed string (often a JWT) that represents the user's authenticated session. This token typically contains:

- The user's ID
- An expiry timestamp
- A cryptographic signature (so it can't be tampered with)

The server sends this token back to the client.

### 4. Client stores the token

The client stores the token so it can be reused on every subsequent request. Common storage options:

- **HTTP-only cookie** (recommended — not accessible via JavaScript, more secure)
- **localStorage / sessionStorage** (easier but vulnerable to XSS attacks)

### 5. Subsequent requests use the token

Every time the client calls a protected endpoint, it attaches the token — usually in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The server verifies the token's **signature** and **expiry**. If everything checks out, access is granted. If not, another `401` is returned.

### 6. The session stays alive until logout or expiry

The token keeps the user "logged in" without the server needing to remember anything. The session ends when:

- The user **logs out** (the client deletes the token)
- The token **expires** (the server rejects it on the next request)
- The token is **revoked** server-side (for JWT, this requires a blocklist)
1
---

## Key Takeaway

> The server is **stateless** after login. It doesn't keep a list of "who's logged in" — it simply checks the math on the token every single time. The token *is* the proof of identity.

---

## Analogy: TypeScript vs Raw PHP

Think of it like **airport security**.

### TypeScript = Strict airport security

Before you ever board the plane (deploy to production), everything gets checked:

- **Passport check** — Your type declarations tell the system exactly what kind of data you're carrying. A `User` is a `User`, not a random string.
- **Luggage scan** — Interfaces enforce the *shape* of your data. If an object is missing a required field, you're stopped at the gate.
- **Boarding pass** — Enums restrict values to a known set. No random strings slipping through — only `"admin"`, `"editor"`, or `"viewer"`.

**Result:** Errors are caught *before takeoff* (at compile time, on your machine), not in production.

### Raw PHP = Open-door policy

There's no security checkpoint. Everyone walks straight onto the plane:

- **No passport check** — `$x` can be a string one moment, an integer the next. Nobody verifies.
- **No luggage scan** — Arrays are unstructured bags. You *hope* the key exists, but nothing enforces it.
- **No boarding pass** — Magic strings everywhere. A typo like `"amdin"` instead of `"admin"` slips right through.

**Result:** Errors are found *mid-flight* (at runtime, in production), when real users are affected.

### The punchline

TypeScript doesn't make your code *run* differently — it still compiles down to JavaScript. It just forces you to think clearly about your data shapes **before** runtime. Just like airport security doesn't change your destination — it just makes sure nothing dangerous gets on the plane.

---

*Document prepared for internal knowledge sharing.*
