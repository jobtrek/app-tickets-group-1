---
name: docker-postgres-skill
description: >
  Docker Compose + Dockerfile + PostgreSQL environment analysis and error diagnosis skill for Thomas's stack.
  Trigger this skill whenever Thomas mentions: docker-compose errors, container crashes, backend not connecting to DB,
  localhost resolution issues inside Docker, .env misconfiguration, DATABASE_URL, postgres connection string,
  ENOTFOUND errors, Drizzle connection errors, "backend restarts on change", "containers keep failing", healthcheck issues,
  or any question about Dockerfile targets (dev/prod), service networking between containers, or volume mount conflicts.
  Also trigger when reviewing or modifying docker-compose.yml, Dockerfile, or .env files.
---

# Docker + PostgreSQL Skill

Thomas's stack: **Bun** backend (Elysia.js + Drizzle ORM), **Vite/React** frontend, **PostgreSQL 18.3**, single `Dockerfile` with multi-stage targets, one `docker-compose.yml`, one `.env` file.

---

## 1. The #1 Rule: Never Use `localhost` Inside Docker

Inside a Docker network, `localhost` = the container itself. Always use the **service name** as hostname.

| Context                     | Wrong               | Right                                         |
| --------------------------- | ------------------- | --------------------------------------------- |
| DB connection from backend  | `localhost:5432`    | `db:5432`                                     |
| WebSocket/API from frontend | `localhost:3001`    | `backend:3001`                                |
| Backend calling itself      | `localhost:3001/ws` | `backend:3001/ws` (or just use internal path) |

---

## 2. Canonical `.env` Structure

```env
# PostgreSQL
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=mydb

# Drizzle / backend
DATABASE_URL=postgres://myuser:mypassword@db:5432/mydb

# Backend
BACKEND_PORT=3001
BACKEND_HOST=0.0.0.0   # must bind to 0.0.0.0, not localhost

# Frontend
VITE_API_URL=http://localhost:3001   # from browser's perspective (host machine)
VITE_WS_URL=ws://localhost:3001/ws  # same: browser connects via mapped port
```

> **Note:** `VITE_*` vars are resolved by the browser, not inside Docker. So `localhost` is correct there. All server-to-server calls must use service names.

---

## 3. Canonical `Dockerfile` (single file, multi-stage)

```dockerfile
FROM oven/bun:1 AS base
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Dev target — hot reload, all deps
FROM base AS dev
COPY . .
EXPOSE 3001 5173

# Production target
FROM base AS prod
COPY . .
RUN bun run build
EXPOSE 3001
CMD ["bun", "run", "start"]
```

**Common mistakes:**

- `COPY . .` before `bun install` → cache busted on every code change → slow rebuilds
- Not setting `EXPOSE` for all ports used in compose
- Missing `--frozen-lockfile` → non-deterministic installs

---

## 4. Canonical `docker-compose.yml`

```yaml
services:
  db:
    image: postgres:18.3 # pin exact version, not just "18"
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - db_data:/var/lib/postgresql/data # ⚠️ must include /data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 10
    networks:
      - app_network

  backend:
    build:
      context: .
      dockerfile: Dockerfile
      target: dev
    command: bun run dev:backend
    restart: unless-stopped
    env_file:
      - .env
    ports:
      - "3001:3001"
    volumes:
      - .:/app
      - /app/node_modules # anonymous volume to protect node_modules from host override
    depends_on:
      db:
        condition: service_healthy
    networks:
      - app_network

  frontend:
    build:
      context: .
      dockerfile: Dockerfile
      target: dev
    command: bun run dev:frontend
    env_file:
      - .env
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - backend
    networks:
      - app_network

volumes:
  db_data:

networks:
  app_network:
    driver: bridge
```

---

## 5. Common Errors & Fixes

### `ENOTFOUND localhost` / DNS resolution error

**Cause:** App code uses `localhost` for inter-service calls.  
**Fix:** Replace with Docker service name in `.env` (e.g. `DATABASE_URL=postgres://...@db:5432/...`).

### Drizzle query fails immediately on startup

**Cause:** Backend starts before DB is ready (healthcheck not respected or `depends_on` missing).  
**Fix:** Ensure `depends_on.db.condition: service_healthy` on backend service.

### `db_data` volume doesn't persist data

**Cause:** Volume path is `/var/lib/postgresql` instead of `/var/lib/postgresql/data`.  
**Fix:** Always use `/var/lib/postgresql/data`.

### Backend crashes on code change (hot reload)

**Cause:** File watcher triggers restart, but env or DB connection isn't re-established.  
**Fix:** Use `restart: unless-stopped` + ensure DB connection is lazy/retried, not established once at boot.

### `node_modules` from host overrides container's

**Cause:** Bind mount `.:/app` overwrites everything including `node_modules`.  
**Fix:** Add an anonymous volume `- /app/node_modules` after the bind mount to shadow it.

### Frontend can't reach backend (in browser)

**Cause:** `VITE_API_URL` set to `http://backend:3001` — service names only work inside Docker, not in the browser.  
**Fix:** Use `http://localhost:3001` for `VITE_*` vars (browser uses the host-mapped port).

### `links:` is unnecessary

**Cause:** `links:` was the old way to connect containers.  
**Fix:** Remove it — shared `networks:` is sufficient and is the modern approach.

---

## 6. Analysis Checklist (run through this when debugging)

When Thomas shares a docker-compose error, work through in order:

1. **Networking** — Is any service-to-service call using `localhost`? → Replace with service name.
2. **DB volume path** — Is it `.../postgresql/data`? → Add `/data` if missing.
3. **Port binding** — Is backend binding to `0.0.0.0`? → Check `BACKEND_HOST` env.
4. **Healthcheck** — Does backend have `condition: service_healthy` on db? → Add if missing.
5. **node_modules shadow** — Is there an anonymous volume for `/app/node_modules`? → Add if missing.
6. **VITE vars** — Do `VITE_*` API/WS URLs use `localhost`? → They should (browser context).
7. **Dockerfile COPY order** — Is `bun install` before `COPY . .`? → Fix layer caching if not.
8. **Image version** — Is postgres pinned to `18.3` not just `18`? → Pin for reproducibility.
