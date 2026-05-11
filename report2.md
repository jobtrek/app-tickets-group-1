# Codebase Analysis Report — Round 2

**Date:** 2026-05-11  
**Branch:** `feat/changeUrgencyLevel`  
**Stack:** Bun HTTP · PostgreSQL · Drizzle ORM · Zustand v5 · React 19 · TanStack Router v1

> This report covers only new findings. Issues from `report.md` that are already resolved are noted at the bottom.

---

## Critical Issues

### 1. Comment `idUser` is user-controlled — any user can post as any other user

**Files:** `backend/src/controllers/commentController.ts:8`, `backend/src/repositories/commentQuery.ts:35`, `backend/src/validators/commentValidator.ts`

`postComment` is typed as plain `Request`, not `AuthedRequest`. Even though the route goes through `withAuth`, the handler never reads `req.user`. The `idUser` written to the database comes entirely from the client-sent JSON body, which passes through `CommentPostSchema` unchanged.

Any authenticated user can send:
```json
{ "idUser": 1, "idTicket": 5, "commentText": "..." }
```
and the comment is stored as if user 1 wrote it.

**Fix:** Change the signature to `AuthedRequest`, remove `idUser` from `CommentPostSchema`, and use `req.user.idUser` in the insert:

```ts
// commentController.ts
export const postComment = async (req: AuthedRequest<"/api/tickets/:id/comment">) => {
  const validated = v.parse(CommentPostSchema, await req.json());
  const inserted = await commentQuery.insert({
    ...validated,
    idUser: req.user.idUser,
    userRole: req.user.role,
  });
  ...
};
```

---

### 2. Uploaded files are publicly accessible without authentication

**File:** `backend/src/routes/uploadsRoute.ts`

`GET /uploads/:file` has no `withAuth`. Any unauthenticated request that knows or guesses a filename can download any ticket attachment. UUID filenames are not access control — they are just obscurity.

**Fix:** Add `withAuth` to the route:

```ts
"/uploads/:file": {
  GET: withAuth(serveUpload),
}
```

For stricter control, also verify the requesting user owns or is assigned to the ticket that image belongs to.

---

### 3. PostgreSQL data is not persisted between container restarts

**File:** `docker-compose.yaml:9`

The volume is mounted as:
```yaml
- db_data:/var/lib/postgresql
```

The official PostgreSQL Docker image stores data in `/var/lib/postgresql/data` (`$PGDATA`). The volume is mounted one directory too high, so the actual data directory lives inside the container's ephemeral layer. Every `docker compose down && docker compose up` starts with a completely empty database.

**Fix:**
```yaml
- db_data:/var/lib/postgresql/data
```

---

## Warnings

### 4. No production Docker target — `bun --watch` would run in production

**Files:** `Dockerfile`, `docker-compose.yaml`

The Dockerfile has only a `dev` stage. Both services use `target: dev` and run `bun run dev:backend` (`bun --watch`) and `bun run dev:frontend` (Vite dev server). Neither is suitable for production:

- `bun --watch` restarts the process on every file change and has higher memory overhead
- Vite dev server is unbundled with no compression or caching

**Fix:** Add a `prod` stage to the Dockerfile:

```dockerfile
FROM base AS prod
WORKDIR /app
COPY . .
RUN bun run build
CMD ["bun", "run", "backend/src/index.ts"]
```

Then add a `docker-compose.prod.yaml` that uses `target: prod`, sets `NODE_ENV=production`, and replaces the `command:` overrides.

---

### 5. Frontend route guards are purely client-side

**File:** `frontend/src/utils/IsAuthenticated.ts`

`isAuthenticated()` reads only from Zustand/`localStorage`. A user who manually writes the expected shape into the `user-storage` localStorage key bypasses every `beforeLoad` guard and sees the full admin UI. The backend correctly validates the session cookie on every API call, so they cannot read real data — but they will see all admin pages with failing requests rather than being redirected to login.

**Fix:** The `beforeLoad` guards should call a `/api/me` endpoint (a lightweight session check) instead of reading local state. Until then, document clearly that these guards are UI-only, not a security boundary.

---

### 6. `commentQuery.insert` hardcodes `userRole: "user"` for every comment

**File:** `backend/src/repositories/commentQuery.ts:35`

Every comment is inserted with `userRole: "user"` regardless of who posts it. Admin replies appear in the UI as user messages because `authorRole` is read directly from the database.

**Fix:** Pass `userRole` as a parameter from the controller (which will have `req.user.role` once fix #1 is applied):

```ts
// commentQuery.ts
insert: async (values: CommentInsertValues & { userRole: string }) => {
  ...values,
  userRole: values.userRole,
  ...
}
```

---

### 7. No error boundary or loading state on any route

**File:** `frontend/routes/__root.tsx` and all route files

No TanStack Router route defines `errorComponent` or `pendingComponent`. If any loader throws (DB down, 500, timeout), the user sees a blank white screen with no message and no way to recover. This is the most user-visible reliability gap for production.

**Fix:** Add at minimum a root-level error boundary and pending state:

```ts
// __root.tsx
export const Route = createRootRoute({
  errorComponent: ({ error }) => (
    <div>Une erreur est survenue : {error.message}</div>
  ),
  pendingComponent: () => <Spinner />,
  component: RootComponent,
});
```

Per-route `pendingComponent` on the dashboard and ticket view loaders is also worth adding.

---

### 8. Title max length mismatch between frontend and backend

**Files:** `frontend/src/pages/TicketCreation.tsx:51`, `backend/src/validators/ticketValidator.ts:12`

The frontend rejects titles longer than 20 characters. The backend allows up to 100. A title of 21–100 characters passes the API directly but is blocked in the UI. Anyone calling the API without going through the form (or bypassing client-side validation) can create tickets the creation form would reject.

**Fix:** Align the two limits. The backend's 100-character limit is the authoritative one — update the frontend to match, or decide on a shorter limit and enforce it in both places.

---

### 9. `sessionToken` column has no unique index

**File:** `backend/src/data/schema.ts:43`

`auth.middleware.ts` runs `WHERE session_token = ? AND expires_at > NOW()` on every authenticated request. The `sessionToken` column is `notNull()` but has no `.unique()` constraint or index. Every API call does a sequential scan of the entire cookies table.

**Fix:**
```ts
sessionToken: varchar("session_token").notNull().unique(),
```
Then run `drizzle-kit generate` and `migrate`.

---

## Improvements

### 10. Expired sessions accumulate in the DB forever

**File:** `backend/src/repositories/cookieQuery.ts`

There is no cleanup mechanism. The `cookies` table grows indefinitely with expired rows, slowly degrading session lookup performance.

**Fix:** Add a periodic cleanup. The simplest approach is to run it on server startup and once per hour:

```ts
// db/database.ts or a startup hook
await db.delete(cookies).where(lt(cookies.expiresAt, new Date()));
```

---

### 11. `fetchTicketStatus` and `fetchTicketConfirmation` are dead code

**File:** `frontend/src/utils/ticketsApi.ts:64-83`

Both functions do a full `GET /api/ticket/:id` to extract a single field. Neither is called anywhere — the data is passed as props directly from route loaders. They should be deleted before someone imports them thinking they are the correct pattern.

---

### 12. `VITE_COMMENT_URL` env var is defined but unused

**File:** `.env:10`

`VITE_COMMENT_URL=http://localhost:3001/api/tickets/comment` is defined but no frontend file reads `import.meta.env.VITE_COMMENT_URL`. It is dead configuration that will confuse anyone who tries to update it expecting an effect.

---

### 13. No `.env.example` file

The `.env` file is correctly gitignored, but there is no committed `.env.example`. New developers must read the source code to discover every required environment variable. A `.env.example` with placeholder values (e.g. `POSTGRES_PASSWORD=changeme`) is the standard fix.

---

## What Was Fixed Since Report 1

| # | Issue | Status |
|---|---|---|
| 1 | Double WebSocket connection on ticket-history page | Fixed |
| 3 | `/api/tickets/:id/ws` security bypass | Fixed |
| 4 | Session tokens never expire | Fixed |
| 5 | `handleConfirmClose` === `handleOwnerClose` duplicate | Fixed |
| 6 | `createTicketFromForm` redundant GET after POST | Fixed |
| 8 | In-memory rate limiter — limitation documented | Documented |

| # | Issue | Still Open |
|---|---|---|
| 2 | `ticketStatusStore` never populated (`setTicketStatus` never called) | Open |
| 7 | Route naming inconsistency (`/api/ticket/:id` vs `/api/tickets`) | Verify |
| 9 | Missing indexes on FK columns | Open |
| 10 | `Dashboard.tsx` / `TicketHistory.tsx` duplicate table code | Open |
| 11 | `getFilteredTickets` / `getFilteredUserTickets` duplicate sort logic | Open |
| 12 | `withAuth` / `withAdmin` duplicate session lookup | Open |
| 13 | WebSocket dispatch uses if/else chain | Open |
