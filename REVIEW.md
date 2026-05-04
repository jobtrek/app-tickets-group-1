# Production Audit — `app-tickets-group-1`

---

## Verdict

> **Not ready to ship.** The account takeover via `PATCH /api/user/:id` (unauthenticated, no ownership check) is the single most dangerous issue and must be fixed first. After that: session expiry, WebSocket auth bypass, and comment impersonation. The missing `VITE_STATS_URL` is a deploy-day crash. Most other issues are fixable in a focused day of work.


## 🟠 High-Priority Issues

### 1. Unbounded table scans on every dashboard load
**File:** `backend/src/repositories/ticketQuery.ts:22`

`getAllTickets` and `getAllByUser` have no `LIMIT` — full table scan on every dashboard load.

**Fix:** Add `limit`/`offset` params; accept `?page=&size=` in the controller.

---

### 2. Unbounded memory leak in rate limiter
**File:** `backend/src/utils/rateLimit.ts`

The `store` Map grows forever — old IP entries are never removed.

**Fix:** After filtering, call `store.delete(ip)` when the resulting array is empty.

---

### 3. Admin comments stored with wrong role
**File:** `backend/src/repositories/commentQuery.ts:36`

`userRole` is hardcoded to `"user"` for every insert — admin comments are stored and displayed with the wrong role.

**Fix:** Pass `userRole` from the session user through the call chain.

---

### 4. No upper bound on status ID validation
**File:** `backend/src/controllers/ticketController.ts:147`

`updateStatus` validates `statusId >= 1` but has no upper bound — an invalid FK causes a swallowed 500.

**Fix:** Add `|| statusId > 4` to the guard.

---

### 5. Duplicate ticket assignment rows accumulate
**File:** `backend/src/repositories/ticketQuery.ts:58`

`assign` inserts a new `ticket_assignment` row without deactivating existing ones.

**Fix:** In the transaction, `UPDATE ticket_assignment SET is_active = false WHERE id_ticket = $1 AND is_active = true` before the insert.

---

### 6. No production Docker configuration
**File:** `docker-compose.yaml`

Entire compose file is dev-only (`target: dev`, source volume mounts, `bun --watch`, DB port 5432 exposed to host).

**Fix:** Add a `prod` Dockerfile stage; write `docker-compose.prod.yaml` with no volume mounts, no exposed DB port.

---

### 7. No migration script
**File:** `package.json`

No `db:migrate` script — the 4 existing migrations have no documented or scripted path to run them.

**Fix:** Add `"db:migrate": "drizzle-kit migrate"`.

---

### 8. Missing rate limit on confirm endpoint
**File:** `backend/src/routes/ticketsRoute.ts:40`

`PATCH /api/tickets/:id/confirm` is missing `withRateLimit` unlike every other mutation on this router.

**Fix:** Wrap with `withRateLimit`.

---

### 9. Uncaught WebSocket parse error kills handler
**File:** `frontend/src/utils/useTicketsComments.ts:36`

`JSON.parse(event.data)` is bare — a malformed WS message throws uncaught and kills the handler for the connection lifetime.

**Fix:** Wrap in `try/catch` identical to `useTicketListUpdates.ts`.

---

## 🟡 Code Quality & Maintainability

### 1. `errorResponse` returns wrong content type
**File:** `backend/src/utils/responseFactory.ts:17`

`errorResponse` returns a plain-text body with `Content-Type: application/json` — `JSON.parse` on the client will crash.

**Fix:** Change body to `Response.json({ error: message }, ...)`.

---

### 2. Wrong CORS headers on comment route
**File:** `backend/src/routes/commentRoute.ts:1`

Imports `loginCorsHeaders` (allows only `POST, OPTIONS`) on a route that also serves `GET` — cross-origin GET will fail preflight.

**Fix:** Import `corsHeaders` instead.

---

### 3. Dead code files
**Files:** `backend/src/repositories/assigntTickerQuery.ts`, `registerQuery.ts`

Both files are dead code — nothing imports them.

**Fix:** Delete both files.

---

### 4. Duplicate admin enforcement mechanisms
**Files:** `backend/src/middleware/auth.middleware.ts`, `backend/src/utils/publishTicketUpdate.ts`

Two parallel admin-enforcement mechanisms exist: `withAdmin` (middleware) and `requireAdmin` (in-controller guard). Routes using the guard also call `getSessionUser` via `withAuth`, resulting in two DB round-trips per request.

**Fix:** Apply `withAdmin` at the route level on all admin endpoints, delete `requireAdmin`.

---

### 5. Inconsistent error response format in ID parser
**File:** `backend/src/utils/idParser.ts:9`

`verifyAndParseId` returns a plain-text 400 `Response`, inconsistent with JSON errors everywhere else.

**Fix:** Return `Response.json({ error: errorMessage }, { status: 400 })`.

---

### 6. No max length on ticket description
**File:** `backend/src/validators/ticketValidator.ts:13`

`description` has no `maxLength` — multi-megabyte payloads are accepted.

**Fix:** Add `v.maxLength(5000)` or similar.

---

### 7. Inconsistent route casing
**File:** `backend/src/routes/registerRoute.ts:6`

Route is `/api/User` (capital U) — inconsistent with every other route and REST convention.

**Fix:** Rename to `/api/user` and update the frontend env var.

---

## 🔵 Production Essentials Checklist

| Item | Status |
|---|---|
| Structured logging (request IDs, not `console.log`) | ❌ Missing — all logging is bare `console.error()` |
| Health check endpoint (`GET /health`) | ❌ Missing |
| Graceful shutdown on SIGTERM | ❌ Missing — no `process.on("SIGTERM")` handler |
| Environment variable validation on startup | ❌ Missing — `DATABASE_URL!` assertion gives an opaque crash on first query, not at boot |
| Database migration strategy | ⚠️ Partial — 4 migrations exist but no script to run them |
| Error monitoring (Sentry or equivalent) | ❌ Missing |
| Global `unhandledRejection` catch | ❌ Missing |
| CORS to explicit allowlist | ⚠️ Partial — single origin from env var, but defaults to `localhost:5173` silently if unset |
| Security headers (CSP, X-Frame-Options, etc.) | ❌ Missing entirely |
| Rate limiting on auth and mutation endpoints | ⚠️ Partial — login/register/most mutations covered; `/api/user/:id`, `/api/statistics`, `/api/tickets/:id/confirm` are not |
| Pagination on all list endpoints | ❌ Missing — `GET /api/tickets` is an unbounded table scan |
| No hardcoded secrets in source | ❌ `.env` with credentials committed to git |

---

## 🟢 What's Solid

**Timing-attack-resistant login** (`loginController.ts:36`)
The `DUMMY_HASH` ensures `Bun.password.verify` always runs, preventing email enumeration via timing.

**Magic-byte file validation** (`imageHandling.ts:13`)
`file-type` inspects actual buffer contents instead of trusting the client's MIME type — the correct approach.

**Path traversal prevention** (`uploadsController.ts:6`)
`path.basename()` on the filename param means `../../etc/passwd` is safely reduced to `passwd`.

**Middleware composition** (`withRateLimit(withAuth(handler))`)
Clean, readable, and consistently applied on most routes.

**DB transaction on ticket assignment** (`ticketQuery.ts:58`)
The `ticket_assignment` insert and `tickets` update are atomic.

**Ownership check on `getTicketById`** (`ticketController.ts:39`)
Non-admin users cannot read another user's ticket by guessing an ID.

**Valibot schemas on all external inputs**
Every body-accepting endpoint validates against a typed schema before touching the database; schemas are colocated in `validators/`.

**UUID filenames for uploads**
Eliminates collisions and keeps user-controlled strings off the filesystem.