# Infra Notes — Docker DNS Error Postmortem

## Symptom

Backend kept crashing with:

```
DNSException: getaddrinfo ENOTFOUND
 syscall: "getaddrinfo"
 errno: 4
 code: "ENOTFOUND"
```

Errors appeared during Drizzle queries (sessions, user insertion, ticket fetches) and on WebSocket upgrades. They got worse after backend edits and after running migrations.

## Root cause

The backend was **restarting constantly** because of a shared bind mount.

1. `docker-compose.yaml` mounted the entire project into both containers: `.:/app` on `frontend` and `backend`.
2. The backend ran with `bun --watch backend/src/index.ts`, which restarts on any file change inside its working tree.
3. When the frontend container did anything that touched a file — Vite cache writes, tanstack-router regenerating `routeTree.gen.ts`, `.env` saves — those changes appeared inside the backend container too (same bind mount).
4. Bun's watcher reacted and restarted the backend mid-flight.
5. The Postgres connection pool was torn down while requests were still in progress. The next query hit a half-dead state and `dns.lookup()` failed → `getaddrinfo ENOTFOUND`.

The hostname was missing from the error (`ENOTFOUND` with no name shown) because the DNS subsystem itself was being released — it wasn't "can't find `db`", it was "DNS isn't available right now."

Migrations made it worse for the same reason: `drizzle-kit` writes to `./drizzle/`, which triggered another restart.

## Fixes applied

### 1. Split the bind mounts (the real fix)

`docker-compose.yaml` — each container now only mounts what it needs:

```yaml
backend:
  volumes:
    - ./backend:/app/backend
    - ./drizzle:/app/drizzle
    - ./drizzle.config.ts:/app/drizzle.config.ts
    - ./package.json:/app/package.json
    - ./bun.lock:/app/bun.lock
    - ./tsconfig.json:/app/tsconfig.json
    - /app/node_modules`docker-compose.yaml` — each container now only mounts what it needs:


frontend:
  volumes:
    - ./frontend:/app/frontend
    - ./package.json:/app/package.json
    - ./bun.lock:/app/bun.lock
    - ./tsconfig.json:/app/tsconfig.json
    - ./biome.json:/app/biome.json
    - /app/node_modules
```

Frontend file changes can no longer reach the backend container, so Bun's watcher only fires on real backend edits.

### 2. Resilient Postgres client config

`backend/src/db/database.ts` — added pool options so a transient blip retries instead of crashing:

```ts
const client = postgres(process.env.DATABASE_URL!, {
  max: 10,
  idle_timeout: 30,
  connect_timeout: 10,
  max_lifetime: 60 * 30,
});
```

### 3. Smaller cleanup in the same pass

- Pinned `postgres:18` → `postgres:18.3` for reproducible builds.
- Removed obsolete `links: - db` (legacy Docker; `networks:` already handles service discovery).

## How to apply

```bash
docker compose down -v   # -v drops the db volume; skip if you want to keep data
docker compose build
docker compose up
```

## Known leftover

The `db_data` volume is mounted at `/var/lib/postgresql` instead of `/var/lib/postgresql/data`. Postgres writes its data inside the `data/` subdirectory, so persistence across volume recreations isn't reliable. Left intentionally for now — fix when convenient by changing the volume path and starting from a clean volume.
