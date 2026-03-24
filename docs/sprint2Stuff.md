# Sprint 2 Summary

## Overview

Sprint 2 focused on three major areas: restructuring the codebase with a clean frontend/backend separation, setting up a CI pipeline for code quality, and implementing core authentication and ticket management features.

---

## 1. Codebase Refactoring — Frontend/Backend Separation

We refactored the project to enforce a clear boundary between the frontend and backend. This means:

- **Frontend** and **backend** now live in separate directories with their own dependencies and responsibilities.
- The backend handles API routes, database access, and business logic.
- The frontend handles UI rendering, routing, and state management.
- Communication between the two happens exclusively through API calls.

> **For contributors:** Refer to `flow.md` for the full architectural overview and conventions. Follow the patterns described there when adding new endpoints or pages.

---

## 2. CI Pipeline (GitHub Actions + Biome)

We introduced a CI pipeline via **GitHub Actions** that automatically checks code formatting and linting on every push/PR.

### Formatter & Linter

We use [Biome](https://biomejs.dev/) for both formatting and linting.

| Command              | Purpose                                      |
|----------------------|----------------------------------------------|
| `bun run lint`       | Check for linting and formatting issues       |
| `bun run lint:fix`   | Auto-fix all fixable issues                   |

### What to know

- The CI pipeline **will fail** if your code has unresolved Biome issues.
- Always run `bun run lint:fix` before pushing.
- If CI fails on your PR, check the Actions tab for the specific errors.

---

## 3. Authentication (Registration & Login)

We implemented a custom JWT-based authentication flow covering registration and login.

### How it works

- **Registration:** Users can create an account. Credentials are validated and stored, and a JWT is issued on success.
- **Login:** Users authenticate with their credentials and receive a JWT for subsequent requests.
- **Redirection:** After login, users are automatically redirected to the dashboard. Unauthenticated users are redirected to the login page.

---

## 4. Dashboard & Ticket Routing

After login, users land on the **dashboard**, which displays a list of their tickets.

### Ticket display

- Tickets are fetched from the backend API and rendered dynamically on the dashboard.

### Dynamic routing (TanStack Router)

- We use [TanStack Router](https://tanstack.com/router) for client-side routing.
- Clicking a ticket navigates to a dynamic route (e.g., `/tickets/:id`) that loads the corresponding ticket detail page.
- Route definitions live in the frontend routing configuration — refer to the existing patterns when adding new routes.

---

## Quick Reference for New Contributors

| Topic                     | Where to look                          |
|---------------------------|----------------------------------------|
| Architecture overview     | `flow.md`                              |
| Linting & formatting      | `bun run lint:fix` (Biome)             |
| CI pipeline config        | `.github/workflows/`                   |
| Auth flow                 | Backend auth module (see `flow.md`)    |
| Routing                   | Frontend route definitions (TanStack)  |
| Environment setup         | `.env.example`                         |
