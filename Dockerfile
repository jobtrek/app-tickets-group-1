FROM oven/bun:1 AS base

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS dev
WORKDIR /app
COPY . .
EXPOSE 5173
EXPOSE 3001