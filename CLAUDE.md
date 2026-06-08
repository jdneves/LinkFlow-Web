# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # dev server at http://localhost:5173
npm run build     # tsc -b + vite build → dist/
npm run lint      # eslint
npm run preview   # preview the production build
```

No test suite yet. Type-checking runs as part of `npm run build`.

## Environment

Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to the backend URL (default points to the `linkflow-api` Spring Boot service).

## Architecture

**Stack:** React 18 + Vite + TypeScript, React Router v6, TanStack Query, Axios, Tailwind CSS + shadcn/ui, React Hook Form + Zod.

**Provider tree** (`main.tsx`): `QueryClientProvider` → `BrowserRouter` → `AuthProvider` → `App`

**Routing** (`App.tsx`): Public routes (`/login`, `/register`) sit outside `ProtectedRoute`. All authenticated pages nest under `ProtectedRoute` → `Layout` (sidebar + topbar shell with `<Outlet />`). Unknown paths redirect to `/dashboard`.

**Auth flow** (`src/auth/`):
- `AuthContext` owns the session: hydrates on boot via `GET /api/auth/me`, exposes `login`/`register`/`logout`.
- `tokenStorage` (`lib/tokenStorage.ts`) persists the JWT pair in `localStorage`.
- `lib/api.ts` is the singleton Axios instance: injects `Authorization` on every request and handles 401s with a **queue-based token refresh** — concurrent 401s are held in a queue until a single `POST /api/auth/refresh` completes, then replayed. A separate `refreshClient` (no interceptors) is used for the refresh call itself to avoid loops. When refresh fails, it fires `auth:logout` on `window` which `AuthContext` listens to.

**API layer** (`src/api/`): One file per domain (`auth`, `analytics`, `links`, `onboarding`, `products`, `scripts`, `videos`). Each wraps `lib/api.ts` and returns unwrapped data (`.then(r => r.data)`). Most domain files are stubs (empty `export {}`) pending feature implementation.

**Types** (`src/types/api.ts`): Mirrors backend DTOs. `Page<T>` wraps Spring Data pagination. `ApiError` matches the backend's `GlobalExceptionHandler` shape (`message` + optional `errors` map for field validation).

**Error handling**: `lib/errors.ts` exports `getApiErrorMessage(err)` — use this in every catch block to extract the backend's pt-BR message or fall back to a generic string.

**UI components** (`src/components/ui/`): shadcn/ui primitives (Button, Card, Input, Label). New shadcn components are added via `npx shadcn@latest add <component>` — do not hand-write them.

**TanStack Query config** (`main.tsx`): `staleTime: 30s`, `retry: 1`, `refetchOnWindowFocus: false`.

## Planned feature order

Dashboard (analytics + onboarding) → Radar → Studio → Links → Videos (async polling).

When implementing a new page: add the API functions to `src/api/<domain>.ts`, add domain types to `src/types/api.ts`, build the page under `src/pages/`, and register the route in `App.tsx` if needed.
