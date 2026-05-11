# Codebase Analysis Report

**Date:** 2026-05-11  
**Branch:** `feat/changeUrgencyLevel`  
**Stack:** Bun HTTP · PostgreSQL · Drizzle ORM · Zustand v5 · React 19 · TanStack Router v1

---

## Critical Issues

# DONE 1

### 1. Double WebSocket connection on ticket-history page

**Files:** `frontend/routes/__root.tsx:14`, `frontend/routes/_authenticated/ticket-history.tsx:24`

`useTicketListUpdates()` is called in `__root.tsx` (runs on every page) and again in `ticket-history.tsx`. On the history page two WebSocket connections open to the `tickets` channel simultaneously. Every `ticket_created` event fires `addTicket` twice, duplicating rows in the store.

**Fix:** Remove the `useTicketListUpdates()` call from `ticket-history.tsx`. The root already covers it.


---
# DONE 2
### 2. `ticketStatusStore` is entirely dead

**Files:** `frontend/src/store/ticketStatusStore.ts`, `frontend/src/pages/Dashboard.tsx:53`, `frontend/src/pages/TicketHistory.tsx:43`

Both `Dashboard.tsx` and `TicketHistory.tsx` read `statusByTicketId` to display live statuses. However `setTicketStatus` is never called anywhere in the codebase. The store is always `{}`, so every ticket falls back to `row.statusName`. The live-status feature does not work.

**Fix:** Either call `setTicketStatus` inside `useTicketListUpdates` when a `ticket_status_update` event arrives, or delete the store and read `row.statusName` directly.

---

# DONE 3

### 3. `/api/tickets/:id/ws` bypasses all WebSocket security checks

**Files:** `backend/src/controllers/commentController.ts:36-43`, `backend/src/routes/commentRoute.ts:18`

The `websocketUpgrade` function calls `getServer()?.upgrade(req, ...)` directly, skipping every check present in the real `handleWsUpgrade`: no origin validation, no ownership check, no ticket existence check. Any authenticated user can subscribe to any ticket's real-time channel through this route.

The frontend does not use this route at all — it connects to `/ws?ticketId=` instead — making this a dead but dangerous endpoint.

**Fix:** Remove the `/api/tickets/:id/ws` route entirely, or run it through the same guard logic as `handleWsUpgrade`.

---
# DONE 4
### 4. Session tokens never expire

**Files:** `backend/src/middleware/auth.middleware.ts:45`, `backend/src/data/schema.ts:41-47`

The expiry check in `auth.middleware.ts` is commented out, and the `cookies` table has no `expiresAt` column. A stolen session token is valid indefinitely.

**Fix:** Add an `expiresAt` column to the `cookies` table, set it on login (e.g. `NOW() + INTERVAL '1 day'`), and enforce `gt(cookies.expiresAt, new Date())` in the session lookup query.

---

## Warnings
# DONE 5
### 5. `handleConfirmClose` and `handleOwnerClose` are identical

**File:** `frontend/src/pages/TicketView.tsx:112-121` and `:143-152`

Both functions call `ownerConfirmTicket(ticketIdNumber, true)`, invalidate the router, set `statusName` to `"Fermé"`, and clear `pendingConfirmation`. One is dead code.

**Fix:** Delete `handleOwnerClose` and pass `handleConfirmClose` wherever `handleOwnerClose` is used.

---
# TODO 6
### 6. `createTicketFromForm` fires a redundant GET after POST

**File:** `frontend/src/utils/ticketsApi.ts:15`

After POSTing a new ticket the function immediately calls `GET /api/tickets` to fetch the full ticket list. The POST already returns the created ticket, and the WebSocket `ticket_created` event adds it to the store in real time. The GET is a wasted round-trip.

**Fix:** Return only `postResponse.data.createdTicket` and remove the `GET` call.

---


# FIXED
### 7. Route naming inconsistency — plural vs. singular

**File:** `backend/src/routes/ticketsRoute.ts:17` vs `:23`

`GET /api/tickets` and `POST /api/tickets` use the plural form, but `GET /api/ticket/:id` uses the singular. This breaks REST convention consistency.

**Fix:** Rename the route to `/api/tickets/:id` to match the collection resource.

---

### 8. In-memory rate limiter resets on server restart

**File:** `backend/src/utils/rateLimit.ts`

Rate limit state lives in a `Map` in memory. In development with `bun --watch`, any file save resets all counters. In production, a crash or deploy resets them. For the login endpoint (5 attempts/email) this is a meaningful protection gap.

**Fix:** Document the limitation clearly, or persist rate limit state to Redis or the database for the login route specifically.

---

### 9. Missing indexes on foreign key columns

**File:** `backend/src/data/schema.ts`

PostgreSQL does not auto-index foreign keys. The following columns have FK constraints but no indexes:

| Table | Column |
|---|---|
| `tickets` | `id_user`, `id_status`, `id_support` |
| `comments` | `id_ticket`, `id_user` |
| `ticket_assignment` | `id_ticket`, `id_support` |

Every query that filters or joins on these columns (which is every query) will do a sequential scan as the table grows.

**Fix:** Add `.index()` to each FK column in the Drizzle schema, then generate and run a migration.

---

## Improvements

### 10. `getFilteredTickets` and `getFilteredUserTickets` duplicate sort logic

**Files:** `frontend/src/utils/sorting.ts`, `frontend/src/utils/getFilteredUserTickets.ts`

Both files contain byte-for-byte identical sort blocks for `asc` / `desc` / `az`.

**Fix:** Extract a `sortTickets(tickets: Ticket[], sort: string): Ticket[]` helper and call it from both.

---

### 12. `withAuth` and `withAdmin` duplicate session lookup and 401 response

**File:** `backend/src/middleware/auth.middleware.ts`

Both call `getSessionUser(req)` and return the same `{ error: "Unauthorized" }` 401 on failure. The only difference is the role check in `withAdmin`.

**Fix:** Consider a single `withRole(requiredRole, handler)` factory that handles the lookup once and reduces copy-paste.

---

### 13. WebSocket message dispatch uses an if/else chain

**File:** `frontend/src/utils/useTicketsComments.ts:33-45`

Adding a new WebSocket event type requires editing the existing function body. A dispatch map would make the handler open to extension without modification:

```ts
const dispatch: Record<string, (data: unknown) => void> = {
  status_update: (data) => onStatusUpdateRef.current?.(data.statusName),
  confirmation_update: (data) => onConfirmationUpdateRef.current?.(data.hasAdminConfirmed),
  // ...
};
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  dispatch[data.type]?.(data) ?? setComments((prev) => [...prev, data]);
};
```

---

## SOLID Assessment

| Principle | Score | Key Finding |
|---|---|---|
| S — Single Responsibility | 4/5 | Backend controller/repo split is clean. `TicketView.tsx` is large but all flows are cohesive around one ticket. |
| O — Open/Closed | 3/5 | WebSocket dispatch in `useTicketsComments` requires modification to add new event types. |
| L — Liskov Substitution | 4/5 | Drizzle inferred types used correctly throughout. No `any` abuse. |
| I — Interface Segregation | 4/5 | `useShallow` used correctly in `Dashboard.tsx:52` and `TicketHistory.tsx:41`. Selectors are narrow. |
| D — Dependency Inversion | 5/5 | Controllers call repository functions. Routes never import `db` directly. Dependency chain is clean. |

---

## Commit Convention

Approximately **16 / 30** recent commits follow [Conventional Commits](https://www.conventionalcommits.org/) correctly.

**Violations found:**

| Commit | Issue |
|---|---|
| `added a new admin_level...` | No type prefix, past tense |
| `feat: formatted code` | Wrong type — should be `style:` |
| `chore: ticketsAPI returned data format consistant` | Typo ("consistant"), vague description |
| `feat: formatted code` (second occurrence) | Same issue |
| Multiple `style: formatted code` | Formatting should be a CI hook, not a commit |

**Rule of thumb:** if the description is still vague after removing the type prefix, rewrite it. Prefer imperative mood: `fix: prevent session token reuse after logout` not `fixed session thing`.

---

## What's Done Well

- **`generatedAlwaysAsIdentity()`** on all PKs — correct modern Drizzle pattern, not legacy `serial`.
- **`baseTicketQuery()`** in `ticketQuery.ts:8` — single DRY join definition reused by all four ticket query variants.
- **Magic-bytes file validation** in `imageHandling.ts` — uses `fileTypeFromBuffer` to detect actual MIME type rather than trusting the file extension. Correct approach.
- **Timing attack prevention** in `loginController.ts:37-41` — always runs `Bun.password.verify` against a dummy hash when the user does not exist, preventing email enumeration.
- **Atomic transaction in `ticketQuery.assign`** — deactivating old assignments and inserting the new one in a single transaction is correct.
- **Valibot on every mutating endpoint** — all POST/PATCH bodies are validated before any DB call.
- **`withAuth`/`withAdmin` middleware** — clean, composable, correctly typed. No route handler touches `req.user` without passing through the middleware first.
- **Persistent filter/sort in `ticketStore`** using `partialize` — user preferences survive a page refresh without persisting the raw ticket data to localStorage.
- **WebSocket auth gate in `handleWsUpgrade`** — origin check, session check, and ownership check all happen before `server.upgrade()`. Solid.
