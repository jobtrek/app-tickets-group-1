# IT ticket Management app.


A full-stack template using Bun, React 19, Vite, and Tailwind CSS v4, with TanStack Router for client-side routing and Valibot for schema validation.

## Stack

- **Runtime**: [Bun](https://bun.com)
- **Frontend**: React 19, Vite 7, Tailwind CSS v4
- **Routing**: TanStack React Router
- **HTTP Client**: Axios
- **Validation**: Valibot
- **Biome**: Prettier, ESLint

## Getting Started

Install dependencies:

```bash
bun install
```

Run the frontend and backend development servers:

```bash
# Frontend (Vite)
bun dev:frontend

# Backend (Bun with hot reload)
bun dev:backend
```

## Project Structure

```
├── frontend/
│   └── vite.config.ts
└── backend/
    └── src/
        └── index.ts
```