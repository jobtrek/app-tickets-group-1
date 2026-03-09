# Architecture Analysis & Recommendations

> **Generated:** March 2026  
> **Project:** bun-react-template (Ticket Management System)  
> **Stack:** Bun + Vite + React 19 + TanStack Router + Tailwind CSS + SQLite

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current Architecture Analysis](#current-architecture-analysis)
3. [Issues Identified](#issues-identified)
4. [Proposed Architecture](#proposed-architecture)
5. [CLI Commands Setup](#cli-commands-setup)
6. [Routing Migration Guide](#routing-migration-guide)
7. [CI/CD Recommendations](#cicd-recommendations)
8. [Linting & Formatting Setup](#linting--formatting-setup)
9. [Implementation Roadmap](#implementation-roadmap)
10. [Files to Clean Up](#files-to-clean-up)

---

## Executive Summary

This project was initialized with `bun init` and later integrated Vite for frontend tooling. This hybrid setup has caused several architectural issues including:

- Conflicting server entry points
- Misconfigured routing (manual vs file-based)
- Scattered frontend files across root and `/frontend` directories
- Empty scaffolded directories and orphaned files

This document provides a comprehensive plan to reorganize the codebase into a clean, maintainable structure with proper separation of concerns.

---

## Current Architecture Analysis

### Current Directory Structure

```
app-tickets-group-1/
├── .git/
├── .gitignore
├── .tanstack/                    # TanStack Router temp files
├── backend/
│   └── src/
│       ├── controllers/          # EMPTY
│       │   ├── auth.controller.ts
│       │   └── index.ts
│       ├── db/
│       │   ├── database.ts       # SQLite setup + seed data
│       │   └── schema.sql        # EMPTY
│       ├── middleware/
│       │   ├── auth.middleware.ts # EMPTY
│       │   └── index.ts          # ⚠️ ACTUAL SERVER ENTRY POINT
│       ├── routes/               # EMPTY
│       │   ├── auth.route.ts
│       │   └── index.route.ts
│       └── validators/           # EMPTY
│           └── auth.validator.ts
├── build.ts                      # ⚠️ ORPHANED - Custom Bun build script
├── bun-env.d.ts
├── bun.lock
├── bunfig.toml                   # ⚠️ ORPHANED - Bun static serve config
├── docs/
├── frontend/
│   ├── assets/
│   │   └── Icon.svg
│   ├── routes/                   # TanStack Router routes
│   │   ├── __root.tsx
│   │   ├── createTicket.tsx
│   │   ├── dashboard.tsx
│   │   ├── index.tsx
│   │   ├── ticket.tsx
│   │   └── ticketHistory.tsx
│   └── src/
│       ├── App.tsx
│       ├── components/
│       ├── pages/
│       ├── router.ts             # ⚠️ Manual router (conflicts with plugin)
│       ├── routeTree.gen.ts      # Auto-generated (incomplete)
│       ├── store/
│       └── utils/
├── index.css                     # ⚠️ Should be in /frontend
├── index.html                    # ⚠️ Should be in /frontend
├── index.ts                      # ⚠️ ORPHANED - Old Bun server from init
├── main.tsx                      # ⚠️ Should be in /frontend
├── mydb.sqlite                   # ⚠️ Should be in /backend
├── node_modules/
├── package.json
├── README.md
├── src/                          # ⚠️ EMPTY - Relic from bun init
├── tsconfig.json
└── vite.config.ts                # Should be in /frontend
```

### Current Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Runtime | Bun | latest |
| Frontend Framework | React | 19 |
| Frontend Router | TanStack Router | 1.161.1 |
| Build Tool | Vite | 7.3.1 |
| Styling | Tailwind CSS | 4.1.11 |
| HTTP Client | Axios | 1.13.6 |
| Validation | Valibot | 1.2.0 |
| Database | SQLite (via Bun) | - |

### Current Scripts

```json
{
  "dev:frontend": "vite",
  "dev:backend": "bun --hot backend/src/middleware/index.ts",
  "build": "vite build",
  "preview": "vite preview"
}
```

---

## Issues Identified

### Critical Issues

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| 1 | **Orphaned Bun server** | `/index.ts` | Leftover from `bun init`, causes confusion about entry point |
| 2 | **TanStack Router misconfiguration** | `/frontend/src/router.ts` vs `routeTree.gen.ts` | Plugin generates routes but app uses manual router |
| 3 | **Frontend files at root** | `/index.html`, `/main.tsx`, `/index.css` | Poor separation, confusing project structure |
| 4 | **Empty `/src` directory** | `/src/` | Relic from initial setup, causes path alias issues |
| 5 | **Misnamed server location** | `/backend/src/middleware/index.ts` | Server entry in "middleware" folder is misleading |
| 6 | **Empty scaffolded files** | Multiple in `/backend/src/` | Incomplete refactoring, dead code |

### Moderate Issues

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| 7 | **Hardcoded API URLs** | `/frontend/src/utils/` | `http://localhost:3001` not configurable |
| 8 | **tsconfig path mismatch** | `/tsconfig.json` | `@/*` maps to empty `./src/*` |
| 9 | **Database at root** | `/mydb.sqlite` | Should be with backend code |
| 10 | **No environment variables** | - | No `.env` support configured |
| 11 | **CORS wildcard** | `/backend/src/middleware/index.ts` | `*` is insecure for production |
| 12 | **No linting/formatting** | - | No ESLint or Prettier configured |
| 13 | **No CI/CD** | - | No automated testing or deployment |

### Routing Conflict Details

The TanStack Router Vite plugin is configured to:
```typescript
TanStackRouterVite({
  routesDirectory: './frontend/routes',
  generatedRouteTree: './frontend/src/routeTree.gen.ts',
})
```

However, the app imports from a manually created `router.ts`:
```typescript
// frontend/src/router.ts - MANUAL (5 routes)
const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  ticketHistoryRoute,
  ticketViewRoute,
  ticketCreationRoute
])
```

While `routeTree.gen.ts` is auto-generated but incomplete (only recognizes 1 route).

---

## Proposed Architecture

### Target Directory Structure

```
app-tickets-group-1/
├── .github/
│   └── workflows/
│       └── ci.yml                  # GitHub Actions CI pipeline
├── backend/
│   ├── src/
│   │   ├── index.ts               # Server entry point (renamed)
│   │   ├── routes/
│   │   │   ├── index.ts           # Route aggregator
│   │   │   └── tickets.route.ts   # Ticket endpoints
│   │   ├── controllers/
│   │   │   └── tickets.controller.ts
│   │   ├── db/
│   │   │   ├── database.ts
│   │   │   ├── schema.sql
│   │   │   └── data/              # SQLite files
│   │   │       └── mydb.sqlite
│   │   ├── middleware/
│   │   │   ├── cors.ts
│   │   │   └── auth.ts
│   │   └── validators/
│   │       └── tickets.validator.ts
│   └── tsconfig.json              # Backend-specific TypeScript config
├── frontend/
│   ├── index.html                 # Entry HTML (moved from root)
│   ├── main.tsx                   # React entry (moved from root)
│   ├── index.css                  # Global styles (moved from root)
│   ├── vite.config.ts             # Vite config (moved from root)
│   ├── tsconfig.json              # Frontend-specific TypeScript config
│   ├── routes/                    # TanStack file-based routes
│   │   ├── __root.tsx
│   │   ├── index.tsx              # / route
│   │   ├── dashboard.tsx          # /dashboard route
│   │   ├── ticket.tsx             # /ticket route
│   │   ├── ticket-history.tsx     # /ticket-history route
│   │   └── create-ticket.tsx      # /create-ticket route
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Page-level components
│   │   ├── store/                 # State management
│   │   ├── utils/                 # Utilities and API client
│   │   ├── types/                 # TypeScript types
│   │   └── routeTree.gen.ts       # Auto-generated by TanStack
│   └── assets/
│       └── Icon.svg
├── docs/
│   └── ARCHITECTURE.md
├── .env.example                   # Environment variable template
├── .eslintrc.cjs                  # ESLint configuration
├── .prettierrc                    # Prettier configuration
├── .prettierignore
├── package.json                   # Updated with all scripts
├── tsconfig.json                  # Base/shared TypeScript config
└── README.md
```

### Key Changes Summary

| Change | From | To |
|--------|------|-----|
| Frontend entry files | Root level | `/frontend/` |
| Vite config | `/vite.config.ts` | `/frontend/vite.config.ts` |
| Backend entry | `/backend/src/middleware/index.ts` | `/backend/src/index.ts` |
| Database file | `/mydb.sqlite` | `/backend/src/db/data/mydb.sqlite` |
| Router | Manual `router.ts` | Auto-generated file-based routing |
| Path aliases | `@/*` → `./src/*` | `@/*` → `./frontend/src/*` |

---

## CLI Commands Setup

### Updated package.json Scripts

```json
{
  "name": "app-tickets",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev:frontend": "vite --config frontend/vite.config.ts",
    "dev:backend": "bun --hot backend/src/index.ts",
    "build:frontend": "vite build --config frontend/vite.config.ts",
    "build:backend": "bun build backend/src/index.ts --outdir=dist/backend --target=bun",
    "build": "bun run build:frontend && bun run build:backend",
    "preview": "vite preview --config frontend/vite.config.ts",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write \"**/*.{ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,json,css,md}\"",
    "typecheck": "tsc --noEmit",
    "typecheck:frontend": "tsc --noEmit -p frontend/tsconfig.json",
    "typecheck:backend": "tsc --noEmit -p backend/tsconfig.json",
    "clean": "rm -rf dist .tanstack node_modules/.vite"
  }
}
```

### Command Reference

| Command | Description |
|---------|-------------|
| `bun run dev:frontend` | Start Vite dev server for frontend (hot reload) |
| `bun run dev:backend` | Start Bun backend server (hot reload) |
| `bun run build:frontend` | Build frontend for production |
| `bun run build:backend` | Build backend for production |
| `bun run build` | Build both frontend and backend |
| `bun run lint` | Run ESLint on all TypeScript files |
| `bun run lint:fix` | Run ESLint and auto-fix issues |
| `bun run format` | Format all files with Prettier |
| `bun run format:check` | Check formatting without changes |
| `bun run typecheck` | Run TypeScript type checking |

### Running in Development

**Terminal 1 - Frontend:**
```bash
bun run dev:frontend
# Vite server at http://localhost:5173
```

**Terminal 2 - Backend:**
```bash
bun run dev:backend
# Bun server at http://localhost:3001
```

---

## Routing Migration Guide

### Current State: Manual Routing

Your current setup uses manually defined routes in `/frontend/src/router.ts`:

```typescript
// Current: frontend/src/router.ts
import { createRouter } from '@tanstack/react-router'
import { rootRoute } from '../routes/__root'
import { indexRoute } from '../routes/index'
import { dashboardRoute } from '../routes/dashboard'
// ... more imports

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  ticketHistoryRoute,
  ticketViewRoute,
  ticketCreationRoute
])

export const router = createRouter({ routeTree })
```

### Target State: File-Based Routing

With file-based routing, TanStack Router automatically generates the route tree from your file structure.

#### Step 1: Update Route Files

Each route file needs to export a `Route` using `createFileRoute`:

**Before (manual):**
```typescript
// frontend/routes/dashboard.tsx
import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import Dashboard from '../src/pages/Dashboard'

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard
})
```

**After (file-based):**
```typescript
// frontend/routes/dashboard.tsx
import { createFileRoute } from '@tanstack/react-router'
import Dashboard from '../src/pages/Dashboard'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard
})
```

#### Step 2: Update Root Route

**Before:**
```typescript
// frontend/routes/__root.tsx
import { createRootRoute, Outlet } from "@tanstack/react-router"

export const rootRoute = createRootRoute({
  component: () => (
    <div className="flex h-screen">
      <nav><Navbar /></nav>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
})
```

**After:**
```typescript
// frontend/routes/__root.tsx
import { createRootRoute, Outlet } from "@tanstack/react-router"
import { Navbar } from "../src/pages/Navbar"

export const Route = createRootRoute({
  component: () => (
    <div className="flex h-screen">
      <nav><Navbar /></nav>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
})
```

#### Step 3: Update App.tsx to Use Generated Routes

**Before:**
```typescript
// frontend/src/App.tsx
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'

function App() {
  return <RouterProvider router={router} />
}
```

**After:**
```typescript
// frontend/src/App.tsx
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  return <RouterProvider router={router} />
}

export default App
```

#### Step 4: Delete Manual Router File

Remove `/frontend/src/router.ts` as it's no longer needed.

#### Step 5: Update Vite Config (After Moving to /frontend)

```typescript
// frontend/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path'

export default defineConfig({
  root: __dirname,
  plugins: [
    TanStackRouterVite({
      routesDirectory: './routes',
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    react(),
    tailwind(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

#### Route File Naming Convention

| File Name | Generated Route Path |
|-----------|---------------------|
| `routes/index.tsx` | `/` |
| `routes/dashboard.tsx` | `/dashboard` |
| `routes/ticket.tsx` | `/ticket` |
| `routes/ticket-history.tsx` | `/ticket-history` |
| `routes/create-ticket.tsx` | `/create-ticket` |
| `routes/ticket.$id.tsx` | `/ticket/:id` (dynamic) |

---

## CI/CD Recommendations

### GitHub Actions Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  BUN_VERSION: 1.1.0

jobs:
  lint-and-typecheck:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: ${{ env.BUN_VERSION }}

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Check formatting
        run: bun run format:check

      - name: Run ESLint
        run: bun run lint

      - name: Type check
        run: bun run typecheck

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: lint-and-typecheck
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: ${{ env.BUN_VERSION }}

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Build frontend
        run: bun run build:frontend

      - name: Build backend
        run: bun run build:backend

      - name: Upload frontend artifacts
        uses: actions/upload-artifact@v4
        with:
          name: frontend-dist
          path: dist/
          retention-days: 7

  # Optional: Add test job when you have tests
  # test:
  #   name: Test
  #   runs-on: ubuntu-latest
  #   needs: lint-and-typecheck
  #   steps:
  #     - uses: actions/checkout@v4
  #     - uses: oven-sh/setup-bun@v2
  #     - run: bun install --frozen-lockfile
  #     - run: bun test
```

### Branch Protection Rules (Recommended)

Configure these in GitHub repository settings:

1. **Require pull request reviews** before merging
2. **Require status checks to pass** before merging:
   - `lint-and-typecheck`
   - `build`
3. **Require branches to be up to date** before merging
4. **Do not allow bypassing** the above settings

---

## Linting & Formatting Setup

### Install Dependencies

```bash
bun add -d eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin \
  eslint-plugin-react eslint-plugin-react-hooks eslint-config-prettier \
  prettier
```

### ESLint Configuration

Create `.eslintrc.cjs`:

```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'prettier', // Must be last to override other configs
  ],
  ignorePatterns: [
    'dist',
    'node_modules',
    '*.gen.ts', // Ignore generated files
    '.tanstack',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // TypeScript
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',

    // React
    'react/prop-types': 'off', // Not needed with TypeScript
    'react/react-in-jsx-scope': 'off', // Not needed with React 17+

    // React Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // General
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
  },
};
```

### Prettier Configuration

Create `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

Create `.prettierignore`:

```
dist
node_modules
bun.lock
*.gen.ts
.tanstack
```

### Optional: Pre-commit Hooks with Husky

```bash
bun add -d husky lint-staged
bunx husky init
```

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,css,md}": ["prettier --write"]
  }
}
```

Create `.husky/pre-commit`:

```bash
bunx lint-staged
```

---

## Implementation Roadmap

### Phase 1: Clean Up (Day 1)

**Goal:** Remove conflicts and orphaned files

- [x] Delete `/index.ts` (orphaned Bun server)
- [x] Delete `/build.ts` (unused custom build script)
- [x] Delete `/bunfig.toml` (unused Bun config)
- [x] Delete empty `/src/` directory
- [x] Move `/mydb.sqlite` to `/backend/src/db/data/mydb.sqlite`
- [x] Update database.ts to use new path

### Phase 2: Reorganize Frontend (Day 1-2)

**Goal:** Proper frontend file structure

- [x] Move `/index.html` to `/frontend/index.html`
- [x] Move `/main.tsx` to `/frontend/main.tsx`
- [x] Move `/index.css` to `/frontend/index.css`
- [x] Move `/vite.config.ts` to `/frontend/vite.config.ts`
- [x] Update vite.config.ts with new paths
- [x] Update import paths in moved files
- [x] Test that `bun run dev:frontend` works

### Phase 3: Fix Routing (Day 2-3)

**Goal:** Clean file-based routing

- [x] Convert all route files to use `createFileRoute`
- [x] Update `__root.tsx` to export `Route`
- [x] Delete `/frontend/src/router.ts`
- [x] Update `App.tsx` to use generated routes
- [x] Rename route files to use kebab-case (`ticketHistory.tsx` → `ticket-history.tsx`)
- [x] Verify TanStack plugin generates correct `routeTree.gen.ts`
- [x] Test all routes work correctly

### Phase 4: Fix Backend Structure (Day 3)

**Goal:** Proper backend organization

- [ ] Move server code from `middleware/index.ts` to `src/index.ts`
- [ ] Extract ticket routes to `routes/tickets.route.ts`
- [ ] Create proper route handler structure
- [ ] Add environment variable support
- [ ] Update CORS for production readiness
- [ ] Remove empty scaffolded files or implement them

### Phase 5: Add Tooling (Day 4)

**Goal:** Developer experience improvements

- [ ] Add ESLint configuration (`.eslintrc.cjs`)
- [ ] Add Prettier configuration (`.prettierrc`, `.prettierignore`)
- [ ] Create `.env.example` with required variables
- [ ] Update `package.json` with new scripts
- [ ] Set up GitHub Actions CI (`.github/workflows/ci.yml`)
- [ ] Optional: Set up Husky pre-commit hooks
- [ ] Update `README.md` with new commands and setup instructions

### Phase 6: Testing & Documentation (Day 5)

**Goal:** Verify everything works

- [ ] Test all CLI commands
- [ ] Test frontend routing
- [ ] Test backend API endpoints
- [ ] Test CI pipeline runs successfully
- [ ] Update any outdated documentation

---

## Files to Clean Up

### Files to Delete

| File | Reason |
|------|--------|
| `/index.ts` | Orphaned Bun server from `bun init` |
| `/build.ts` | Unused custom build script |
| `/bunfig.toml` | Unused Bun static serve config |
| `/src/` (directory) | Empty, causes path alias confusion |
| `/frontend/src/router.ts` | Replaced by auto-generated routes |
| `/backend/src/controllers/auth.controller.ts` | Empty file |
| `/backend/src/controllers/index.ts` | Empty file |
| `/backend/src/routes/auth.route.ts` | Empty file |
| `/backend/src/routes/index.route.ts` | Empty file |
| `/backend/src/middleware/auth.middleware.ts` | Empty file |
| `/backend/src/validators/auth.validator.ts` | Empty file |
| `/backend/src/db/schema.sql` | Empty file |

### Files to Move

| From | To |
|------|-----|
| `/index.html` | `/frontend/index.html` |
| `/main.tsx` | `/frontend/main.tsx` |
| `/index.css` | `/frontend/index.css` |
| `/vite.config.ts` | `/frontend/vite.config.ts` |
| `/mydb.sqlite` | `/backend/src/db/data/mydb.sqlite` |
| `/backend/src/middleware/index.ts` | `/backend/src/index.ts` |

### Files to Rename

| From | To | Reason |
|------|-----|--------|
| `ticketHistory.tsx` | `ticket-history.tsx` | Consistent kebab-case for URLs |
| `createTicket.tsx` | `create-ticket.tsx` | Consistent kebab-case for URLs |

---

## Environment Variables

Create `.env.example`:

```bash
# Backend
PORT=3001
DATABASE_PATH=./backend/src/db/data/mydb.sqlite
CORS_ORIGIN=http://localhost:5173

# Frontend (prefix with VITE_ to expose to client)
VITE_API_URL=http://localhost:3001
```

Usage in backend:
```typescript
const port = process.env.PORT || 3001;
const corsOrigin = process.env.CORS_ORIGIN || '*';
```

Usage in frontend:
```typescript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

---

## Summary

This architecture document outlines a comprehensive plan to transform the current hybrid Bun/Vite setup into a clean, maintainable codebase. The key improvements are:

1. **Clear separation** of frontend and backend code
2. **Consistent file-based routing** with TanStack Router
3. **Proper CLI commands** for development and production
4. **Automated code quality** with ESLint and Prettier
5. **CI/CD pipeline** with GitHub Actions
6. **Environment-based configuration** for different deployments

Follow the implementation roadmap to systematically address each issue while maintaining a working application throughout the migration.
