# Codebase Analysis Report — Round 3

**Date:** 2026-05-11  
**Branch:** `feat/changeUrgencyLevel`  
**Stack:** Bun HTTP · PostgreSQL · Drizzle ORM · Zustand v5 · React 19 · TanStack Router v1

> This report covers newly discovered issues and tracks what remains open from report2.

---

## What Was Fixed Since Report 2

| # | Issue | Status |
|---|---|---|
| 1 | Comment `idUser` spoofing — now uses `req.user.idUser` | ✅ Fixed |
| 2 | Uploads publicly accessible — `withAuth` added | ✅ Fixed |
| 5 | Frontend guards purely client-side — replaced with `checkSession()` + `/api/me` | ✅ Fixed |
| 6 | `commentQuery` hardcodes `userRole: "user"` — now uses `req.user.role` | ✅ Fixed |
| 7 | No error boundary — `errorComponent` and `pendingComponent` added to root | ✅ Fixed |
| 10 | Expired sessions never cleaned up — cleanup runs on startup and hourly | ✅ Fixed |
| 13 | No `.env.example` — created with placeholder credentials | ✅ Fixed |

---

## Critical Issues

### 1. `postComment` takes `idTicket` from the request body, not the URL

**File:** `backend/src/controllers/commentController.ts:14`, `backend/src/validators/commentValidator.ts:9`

The route is `POST /api/tickets/:id/comment`. The `idTicket` stored in the database still comes from the JSON body (`CommentPostSchema` still defines it). The URL's `:id` param is ignored entirely in `postComment`.

This means any authenticated user can send:
```
POST /api/tickets/1/comment
{ "commentText": "...", "idTicket": 999 }
```
and the comment is posted to ticket 999, regardless of what the URL says. More critically: there is **no ticket ownership check**. Any authenticated user can comment on any ticket, including tickets they have no access to.

**Fix:** Remove `idTicket` from `CommentPostSchema`. Use `req.params.id` as the ticket ID and add an access check:

```ts
export const postComment = async (
  req: AuthedRequest<"/api/tickets/:id/comment">,
) => {
  const idTicket = verifyAndParseId(req.params.id, "Invalid ticket ID");
  if (idTicket instanceof Response) return idTicket;

  const [ticket] = await ticketQueries.getById(idTicket);
  if (!ticket) return errorResponse("Ticket not found", 404);
  if (req.user.role !== "admin" && ticket.idUser !== req.user.idUser) {
    return errorResponse("Forbidden", 403);
  }

  const validated = v.parse(CommentPostSchema, await req.json());
  const inserted = await commentQuery.insert({
    ...validated,
    idTicket,
    idUser: req.user.idUser,
    userRole: req.user.role,
  });
  ...
};
```

---

### 3. `seed` service runs on every `docker compose up`

**File:** `docker-compose.yaml:43`

The newly added `seed` service has no `profiles:` key. `docker compose up` starts all services without a profile filter, so `bun run db:seed` runs every time the stack is brought up. If the seed script is not fully idempotent, this will corrupt or reset data on every deployment restart.

**Fix:** Add a Docker Compose profile so the seed service only runs when explicitly requested:

```yaml
seed:
  profiles: ["seed"]
  ...
```

Then seed with: `docker compose --profile seed up seed`

---

### 4. `checkSession()` fires a network call on every navigation

**File:** `frontend/routes/_authenticated.tsx:5`

TanStack Router's `beforeLoad` runs on every route transition, not just the initial load. Placing `checkSession()` there means every in-app navigation blocks on a `GET /api/me` round-trip before the next page renders. On a slow connection, every link click feels sluggish.

**Fix:** Hoist the session check to the root route and pass the user through router context. Child layouts read from context instead of fetching again:

```ts
// __root.tsx
export const Route = createRootRoute({
  beforeLoad: async () => {
    const user = await checkSession().catch(() => null);
    return { user };
  },
});

// _authenticated.tsx
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
});
```

---

### 5. Error alerts cannot be dismissed

**File:** `frontend/routes/__root.tsx:45`

`_clearError` is subscribed from the store but never called anywhere. The `Alert` component shows when `error` is set but there is no dismiss button and no automatic timeout. An error set in the store persists until the user refreshes the page.

**Fix:** Either call `_clearError` inside the `Alert`'s close handler:
```tsx
{error && <Alert variant="error" message={error} onClose={_clearError} />}
```
or auto-clear after a few seconds with `setTimeout(_clearError, 5000)`.

---

## Still Open From Report 2

These were not addressed in this round:

| # | Issue |
|---|---|
| 4 | No production Docker target — `bun --watch` and Vite dev server would run in prod |
| 8 | Title max length mismatch — frontend rejects > 20 chars, backend allows 100 |
| 9 | `sessionToken` column has no unique index — every auth check does a seq scan |
| 11 | `fetchTicketConfirmation` and `getTicketById` are dead code in `ticketsApi.ts` |
| 12 | `VITE_COMMENT_URL` is defined in `.env` and `.env.example` but unused in the frontend |
