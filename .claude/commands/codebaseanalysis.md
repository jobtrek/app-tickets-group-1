---
name: codebase-analysis
description: >
  Production-level codebase analysis for a Bun + React + TanStack Router + Zustand + Drizzle ORM + PostgreSQL stack.
  Trigger this skill whenever the user asks to: review code, analyze the codebase, check for issues, audit architecture,
  find repetitions, check SOLID principles, review commits, refactor suggestions, or generally "look at" the project.
  Also trigger for any mention of code quality, DRY violations, store structure, DB schema, WebSocket handler patterns,
  or commit message conventions. Run a thorough, opinionated, production-grade review — don't just describe what you see.
---

# Codebase Analysis — Bun / React / TanStack Router / Zustand / Drizzle + PostgreSQL

**Goal:** Deliver production-grade analysis — flag real problems, not surface-level notes.  
**Stack:** Bun HTTP + WebSockets · PostgreSQL · Drizzle ORM · Zustand v5 · React 19 · TanStack Router v1  
**Tools available:** `bash_tool`, `view`, GitHub CLI (`gh`)

---

## Phase 0 — Before You Say Anything, Verify

> Never assume a package version is problematic or non-existent without checking first.

```bash
# Check actual installed versions
cat package.json | grep -E '"(bun|drizzle-orm|drizzle-kit|zustand|@tanstack/react-router|react)"'

# Verify Docker image tags online before flagging them
# e.g. postgres:18.3 — search hub.docker.com or docs.postgresql.org before calling it invalid
```

If the user mentions a package version you're unsure about, run a web search before flagging it as beta/invalid.

---

## Phase 1 — Gather Context

```bash
# Project structure overview
find . -type f -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .git | sort

# Git history (requires gh CLI or git)
git log --oneline -30
# or
gh api repos/:owner/:repo/commits --jq '.[].commit.message' | head -30

# Package versions
bun pm ls 2>/dev/null || cat bun.lockb | head -50
```

Read key files: `package.json`, `drizzle.config.ts`, server entry point, main router file, store files.

---

## Phase 2 — Analysis Dimensions

Run all dimensions. Report findings per dimension, then a prioritized summary at the end.

---

### 2.1 — Repetition & DRY

Check for:

- Duplicated fetch/query logic across routes or components
- Copy-pasted Drizzle query blocks that could be abstracted into repository functions
- Repeated Zustand selector patterns that should be custom hooks
- Identical error-handling blocks in Bun route handlers
- Duplicated WebSocket message parsing logic

**Flag:** Any block appearing 2+ times that isn't trivially short.

---

### 2.2 — Code Simplification

Check for:

- Zustand stores with async logic that belongs in TanStack Router loaders or TanStack Query
- Manual `fetch()` calls when a router loader or `useQuery` would be cleaner
- Over-complicated Drizzle queries (excessive joins solvable with RQBv2 `with:` syntax)
- WebSocket message handlers using `if/else` chains instead of a dispatch map
- Bun route handlers doing business logic inline instead of delegating to service functions

---

### 2.3 — Code Organization

Expected structure for this stack:

```
src/
├── server/
│   ├── index.ts            # Bun.serve() entry — routing only, no logic
│   ├── routes/             # One file per domain (users.ts, posts.ts)
│   ├── ws/                 # WebSocket handlers separated from HTTP
│   │   ├── handlers.ts     # Message dispatch map
│   │   └── rooms.ts        # Room/subscription management
│   └── middleware/         # Auth, CORS, logging
├── db/
│   ├── schema/             # One file per table domain
│   ├── migrations/         # Drizzle-kit generated
│   └── index.ts            # Single drizzle() instance export
├── stores/                 # Zustand — one store per domain, not one giant store
├── routes/                 # TanStack Router file-based routes
│   ├── __root.tsx
│   └── _auth/
├── components/
└── lib/                    # Shared utils, types, validators
```

Flag deviations: server logic in entry file, schema mixed with query logic, Zustand stores as god objects.

---

### 2.4 — SOLID Principles

Evaluate each principle concretely against the codebase:

**S — Single Responsibility**

- Each Bun route handler should do one thing (validate → call service → return response)
- Zustand stores should not mix UI state with domain state
- Drizzle schema files should not contain query logic

**O — Open/Closed**

- WebSocket message handlers: adding a new message type should not require modifying existing handlers
- Check: is there a dispatch map or a growing if/else?

**L — Liskov Substitution**

- Check for TypeScript: are interface contracts honored across implementations?
- Are Drizzle `InferSelectModel<typeof table>` types used consistently, or ad-hoc `any`?

**I — Interface Segregation**

- Check Zustand stores: are components subscribing to entire stores or narrow selectors?
- Flag: `const store = useMyStore()` (subscribes to everything) vs `const x = useMyStore(s => s.x)`

**D — Dependency Inversion**

- Server routes should depend on service functions, not directly on `db`
- DB queries should be in repository functions, not scattered in route handlers

---

### 2.5 — Stack-Specific Anti-Patterns

#### Bun HTTP

- ❌ Building manual router with `if/else` on `url.pathname` at scale → use a Map or small router lib (Hono is production-stable on Bun)
- ❌ No request validation (Zod/Valibot on incoming bodies)
- ❌ WebSocket handlers inside the main `fetch()` instead of `websocket: {}` block
- ✅ Auth handled in `fetch()` before `server.upgrade()` — verify this

#### Bun WebSockets

- ❌ Iterating over all clients manually instead of using native `ws.publish()` / `ws.subscribe()`
- ❌ No `idleTimeout` configured (stale connections)
- ❌ Missing `drain` handler (backpressure unhandled)
- ❌ No typed `WebSocketData` interface on the connection

#### PostgreSQL + Drizzle ORM

- Check schema: `serial` vs `integer().generatedAlwaysAsIdentity()` — the latter is the 2025 standard
- Flag: `drizzle-zod` / `drizzle-valibot` imported as separate packages — in v1.x they moved into `drizzle-orm`
- Flag: N+1 query patterns — use Drizzle RQBv2 `with:` instead of nested loops
- Flag: `db.execute(sql\`...\`)` for queries that could be type-safe Drizzle builder calls
- Flag: Missing indexes on foreign keys and frequent filter columns

#### Zustand v5

- ❌ `import useStore from 'zustand'` — default export removed in v4+, must use `{ create }`
- ❌ Storing server/API response data in Zustand — this belongs in TanStack Query
- ❌ Components calling `const everything = useMyStore()` — subscribe only to needed slice
- ❌ One giant god store — should be split by domain (auth, ui, [feature])
- ❌ Actions defined outside the store creator
- ✅ Check: are actions co-located with state inside `create()`?
- ✅ Check: is `shallow` from `zustand/shallow` used for object comparisons?

#### TanStack Router v1

- ❌ Data fetching inside components (fetch-on-render) instead of route `loader`s
- ❌ URL search params managed with `useState` instead of `validateSearch`
- ❌ Missing `ErrorBoundary` / `pendingComponent` on routes
- ❌ Code splitting not enabled (every route should use `lazy()` for non-critical routes)
- ✅ Prefer file-based routing over code-based for discoverability

---

### 2.6 — Commit Convention (2026 Standard)

Check commits follow Conventional Commits spec:

```
<type>(<scope>): <description>

Types: feat | fix | chore | docs | style | refactor | perf | test | build | ci | revert
```

```bash
# Pull last 30 commits
git log --oneline -30

# Flag commits that:
# - Have no type prefix
# - Use past tense ("added feature" instead of "add feature")
# - Are too vague ("fix stuff", "wip", "update")
# - Have scope that doesn't match the changed files
# - Mix multiple unrelated changes in one commit
```

Report: commit compliance % and examples of good/bad commits found.

---

## Phase 3 — Library Suggestions (Context-Gated)

**Only suggest a library if the codebase demonstrates the problem it solves at meaningful scale.**

| Problem Observed                                | Suggestion                               | Threshold                                   |
| ----------------------------------------------- | ---------------------------------------- | ------------------------------------------- |
| Manual routing in Bun server growing large      | **Hono** (production-stable, Bun-native) | 10+ routes with repeated middleware         |
| Repeated body validation logic                  | **Zod** or **Valibot**                   | 3+ routes with manual validation            |
| Complex WebSocket room management               | **PartyKit** or custom room manager      | 5+ room types with complex membership logic |
| Server state in Zustand                         | **TanStack Query** (already in stack?)   | Any API data in Zustand                     |
| Multiple async stores with loading/error states | **TanStack Query**                       | 3+ async Zustand actions                    |
| Drizzle schema validation duplication           | **drizzle-zod** (now in drizzle-orm)     | Schema used as input validator separately   |

**Do not suggest:** libraries for problems not evident in the code. Do not suggest rewrites of working subsystems.
**Only suggest:** libraries if the user will significantly from it, mesure the average time learning \* the average time refactoring/implementing.
before suggesting it to the user.

---

## Phase 4 — Output Format

Structure your report as:

```
## 🔍 Codebase Analysis Report

### Critical Issues (fix before production)
- [ISSUE] description — file:line — suggested fix

### Warnings (should fix soon)
- ...

### Improvements (nice to have)
- ...

### SOLID Assessment
| Principle | Score (1-5) | Key Finding |
|---|---|---|

### Commit Convention
- Compliance: X/30 commits follow convention
- Examples of violations: ...

### Library Suggestions
(only if threshold met)

### What's Done Well
(always include — honest positive observations)
```

---

## Phase 5 — Verification Checklist

Before finalizing report:

- [ ] Checked actual package versions — no assumption of "beta" without confirming online
- [ ] Flagged issues with file references, not just abstract descriptions
- [ ] Library suggestions tied to observed evidence
- [ ] SOLID findings are concrete (not "consider SRP"), tied to actual code
- [ ] Commit analysis pulled from actual git history, not hypothetical
