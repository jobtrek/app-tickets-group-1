# Backend Refactoring Guide

> The goal is to split the current single-file backend into a clean,
> organised structure that is easier to maintain and build on.

---

## Current State

Everything lives in `middleware/index.ts` — server setup, routes, and database queries all mixed together.

---

## Proposed Architecture

```
backend/src/
├── middleware/
│   └── index.ts        # Bun.serve() entry point only
├── routes/
│   └── index.route.ts  # Route definitions
├── controllers/
│   └── index.ts        # Business logic
    repository/
    ->  ticket.repo.ts # DB queries related to tickets
└── db/
    ├── database.ts     # DB connection
    └── schema.sql      # Table definitions
```

---

## What Needs to Change

### 1. `middleware/index.ts` — Entry point only

```ts
import { ticketRoutes } from '../routes/index.route'

const server = Bun.serve({
  port: 3001,
  routes: {
    ...ticketRoutes,
  },
})
```

### 2. `routes/index.route.ts` — Routes only, no logic

```ts
import { getTickets, createTicket } from '../controllers/index'

export const ticketRoutes = {
  '/api/tickets': {
    GET: getTickets,
    POST: createTicket,
  },
}
```

### 3. `controllers/index.ts` — All logic and DB queries

```ts
import { db } from '../db/database'

export const getTickets = async (req: Request) => {
  try {
    const tickets = db.query('SELECT * FROM ticket').all()
    return Response.json(tickets, { status: 200 })
  } catch (e) {
    return new Response('DB Error', { status: 500 })
  }
}

export const createTicket = async (req: Request) => {
  try {
    const { title, description, urgence, id_user } = await req.json()
    const insert = db.prepare(`
      INSERT INTO ticket (title, description, urgence, id_user)
      VALUES (?, ?, ?, ?)
      RETURNING *
    `)
    const result = insert.get(title, description, urgence, id_user)
    return Response.json(result, { status: 201 })
  } catch (e) {
    return new Response('DB Error', { status: 500 })
  }
}
```


## File naming conventions for the backend

- `index.ts` for entry points 
- `*.route.ts` for route definitions (e.g., `routes/index.route.ts`)
- `*.controller.ts` for business logic (e.g., `controllers/index.controller.ts`)
- `*.repo.ts` for database queries (e.g., `repository/ticket.repo.ts
- `database.ts` for DB connection setup
- `schema.sql` for SQL table definitions


all files should be named accordingly like for routes ex: index.route.ts for clarity and to easily identify the purpose of each file.

---

## Request Flow

```
Request → Bun.serve() → Route → Controller → DB → Response
```

---

## Summary

| Area | Before | After |
|---|---|---|
| Entry point | Everything in one file | Server setup only |
| Routes | Mixed with logic | Delegate to controllers |
| Business logic | Inline in routes | Moved to controllers |