# IT Ticket Management App

A full-stack ticketing application built with Bun, React 19, Drizzle ORM and PostgreSQL. Supports authentication, ticket creation, real-time comments over WebSockets, and an admin dashboard.

## Stack

- **Runtime**: [Bun](https://bun.com)
- **Frontend**: React 19, Vite 7, Tailwind CSS v4
- **Routing**: TanStack React Router (file-based)
- **State**: Zustand
- **HTTP Client**: Axios
- **Backend**: Bun native HTTP + WebSocket server
- **Database**: PostgreSQL 18 via Drizzle ORM
- **Validation**: Valibot
- **Tooling**: Biome (lint + format), Docker Compose

## Getting Started

Copy `.env` and adjust values if needed, then start the stack with Docker:

```bash
docker compose up --build
```

This launches:
- `db` — PostgreSQL on port `5432`
- `backend` — Bun server on port `3001`
- `frontend` — Vite dev server on port `5173`

### Running locally without Docker

Install dependencies:

```bash
bun install
```

Run migrations and seed the database:

```bash
bunx drizzle-kit migrate
bun db:seed
```

Run both dev servers:

```bash
bun dev
```

Or run them individually:

```bash
bun dev:frontend   # Vite on :5173
bun dev:backend    # Bun with hot reload on :3001
```

## Scripts

- `bun dev` — run frontend + backend concurrently
- `bun dev:frontend` — run Vite dev server
- `bun dev:backend` — run Bun server with hot reload
- `bun build` — generate route tree, typecheck, and build the frontend
- `bun lint` / `bun lint:fix` — Biome lint
- `bun format` / `bun format:check` — Biome format
- `bun db:seed` — seed the database

## Project Structure

```
├── backend/
│   └── src/
│       ├── controllers/     # Route handlers (auth, tickets, comments)
│       ├── routes/          # HTTP + WebSocket route definitions
│       ├── repositories/    # DB queries via Drizzle
│       ├── middleware/      # Auth middleware
│       ├── validators/      # Valibot schemas
│       ├── db/              # Drizzle client
│       ├── data/schema.ts   # DB schema
│       ├── utils/           # WebSocket publisher
│       └── index.ts         # Bun.serve entrypoint
├── frontend/
│   ├── routes/              # TanStack file-based routes
│   │   ├── _authenticated/  # Logged-in-only routes
│   │   └── _adminOnly/      # Admin-only routes
│   ├── src/
│   │   ├── components/      # Reusable UI
│   │   ├── pages/           # Page components
│   │   ├── store/           # Zustand stores
│   │   └── utils/           # API clients, helpers, types
│   └── vite.config.ts
├── drizzle/                 # Generated SQL migrations
├── docs/                    # Sprint notes + workflow docs
├── docker-compose.yaml
├── Dockerfile
└── drizzle.config.ts
```

## Environment Variables

Defined in `.env`:

- `VITE_API_URL`, `VITE_USER_URL`, `VITE_LOGIN_URL`, `VITE_TICKET_URL`, `VITE_LOGOUT_URL`, `VITE_COMMENT_URL` — frontend API endpoints
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_HOST`, `POSTGRES_PORT` — database config
- `DATABASE_URL` — Drizzle connection string
