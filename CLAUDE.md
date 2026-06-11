# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Frontend (SPA) for **LinkFlow**, an affiliate-creator SaaS. It is a pure client of the
`linkflow-api` Spring Boot backend — no local DB or business logic. The backend contract
lives in `PROJETO.md` (the backend repo); **that file is the source of truth for endpoints,
DTOs, and enums**. The phase-by-phase plan lives in `ROADMAP.md`.

## Commands

```bash
npm run dev       # dev server at http://localhost:5173
npm run build     # tsc -b + vite build → dist/
npm run lint      # eslint
npm run preview   # preview the production build
```

No test suite yet. Type-checking runs as part of `npm run build` — always run `npm run build`
before committing a phase. `tsconfig.app.json`/`tsconfig.node.json` use `noEmit: true` with
`tsBuildInfoFile` in `node_modules/.tmp`; **never** commit emitted `.d.ts` files into `src/`
(the only hand-written one is `src/vite-env.d.ts`).

## Environment

Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` (defaults to the deployed
`linkflow-api`). Vite only exposes vars prefixed with `VITE_`.

## Stack

React 18 + Vite + TypeScript (strict) · React Router v6 · TanStack Query · Axios ·
Tailwind CSS + shadcn/ui · React Hook Form + Zod · Recharts · date-fns (pt-BR) · lucide-react.

## Architecture

**Provider tree** (`main.tsx`): `QueryClientProvider` → `BrowserRouter` → `AuthProvider` → `App`.
Query defaults: `staleTime: 30s`, `retry: 1`, `refetchOnWindowFocus: false`.

**Routing** (`App.tsx`): `/login` and `/register` are public. Everything else nests under
`ProtectedRoute` → `Layout` (sidebar + topbar shell with `<Outlet />`). Unknown paths redirect
to `/dashboard`.

**Auth** (`src/auth/`):
- `AuthContext` owns the session: hydrates on boot via `GET /api/auth/me`; exposes
  `login` / `register` / `logout` and `user` / `isAuthenticated` / `isLoading`.
- `useAuth()` is the accessor hook; `ProtectedRoute` gates routes and shows a loading state
  while hydrating (avoids flashing `/login`).
- `tokenStorage` (`lib/tokenStorage.ts`) persists the JWT pair in `localStorage`.
- `lib/api.ts` is the singleton Axios instance. It injects `Authorization` on every request
  and handles 401 with a **queue-based refresh**: the first 401 owns a single
  `POST /api/auth/refresh`; concurrent 401s queue and replay with the new token (prevents
  burning the single-use refresh token). A separate `refreshClient` (no interceptors) makes the
  refresh call to avoid loops. On refresh failure it clears tokens and dispatches a
  `window` event `auth:logout`, which `AuthContext` listens to → forced logout.

**Layers:**
- `src/api/<domain>.ts` — pure fetch functions, one object per domain
  (`authApi`, `analyticsApi`, `productsApi`, `scriptsApi`, `onboardingApi`, plus `links`/`videos`
  pending). Every call returns unwrapped data via `.then(r => r.data)`. **Components never call
  axios directly** — always go through these + a hook.
- `src/hooks/` — TanStack Query hooks wrapping the api layer (see Conventions).
- `src/types/api.ts` — all DTOs mirroring the backend. `Page<T>` wraps Spring Data pagination
  (`content`, `totalElements`, `totalPages`, `number`). `ApiError` matches the backend
  `GlobalExceptionHandler` (`message` + optional `errors` field-map for 400s).
- `src/lib/` — `utils.ts` (`cn`), `errors.ts` (`getApiErrorMessage`), `format.ts`
  (`formatBRL`, `formatPct`), `radar.ts` and `studio.ts` (label maps + option lists + helpers),
  `tokenStorage.ts`, `api.ts`.

## UI components (already in `src/components/ui/`)

These exist and are committed — **do not recreate or re-add them**:
`button`, `card`, `input`, `label`, `badge`, `dialog`, `progress`, `select`.

For a **new** primitive, add it with `npx shadcn@latest add <component>` (the project is wired
for shadcn: `components.json`, `@/` alias, CSS-variable theme in `src/styles/globals.css`).
Do not hand-write primitives that shadcn provides. Shared, non-primitive components live in
feature folders: `components/dashboard/`, `components/radar/`, `components/studio/`, plus
top-level `Layout.tsx` / `Sidebar.tsx`.

## Conventions (follow these for every new feature)

- **Order of work per phase:** types → `api/` → `hooks/` → page → loading/error/empty states →
  `npm run build`. Then update `ROADMAP.md` (check the boxes).
- **Field names:** mirror EXACTLY the DTO field names documented in `PROJETO.md` (or the backend
  DTO source in `../linkflow/src/main/java/br/com/linkflow/dto/`). Do not invent or translate
  names. The backend is inconsistent — analytics uses Portuguese (`rotelirosMes`,
  `cliquesPorDia`) while Script/Link/Video use English (`createdAt`, `destinationUrl`,
  `customSlug`, `topics`). When in doubt about a RESPONSE field, confirm against a real API
  response (or the backend DTO record) before naming it — a wrong name fails silently
  (`undefined`) on responses or returns 400 on requests.
- **Query hooks:** name `use<Domain>`; key as `["domain", "list"|"detail"|..., args]`.
  Paginated lists use `placeholderData: keepPreviousData` (no flicker when paging/filtering).
  Detail/conditional queries use `enabled: !!id` (or `search.length >= 2`).
- **Mutations:** on success, `invalidateQueries` the affected list key. If the action consumes a
  plan quota (generate script, create video), **also** invalidate
  `["analytics", "dashboard"]` so plan usage updates.
- **Filters in the URL:** drive list filters from `useSearchParams` (source of truth), with a
  `patchParams` helper that clones the params, mutates, and `setSearchParams(next, {replace:true})`.
  Changing a filter resets `page`. Free-text search is debounced with `useDebounce` before hitting
  the URL. In a shadcn `Select`, "all/none" cannot be `value=""` — use the `__all__` sentinel and
  map it back to `undefined`.
- **Errors:** wrap every async UI action in try/catch (or use mutation `isError`) and surface
  `getApiErrorMessage(err)` — backend messages are already friendly pt-BR
  (e.g. "E-mail já cadastrado", "E-mail ou senha incorretos").
- **States:** every screen that hits the API renders explicit **loading** (skeleton),
  **error** (with retry), and **empty** states.
- **Create / detail via dialogs:** creation forms and detail views are shadcn `Dialog`s opened
  from a page (see `GenerateScriptDialog`, `ScriptDetailDialog`, `ProductDetailDialog`).
- **Plan limits:** `usoPlano` comes from `GET /api/analytics/dashboard`. Disable the action
  button preventively when the quota is reached; the backend also validates. **Treat
  `limite* <= 0` as unlimited in EVERY plan check** (Dashboard, Studio, Links, Vídeos) — the
  guard is always `!!usoPlano && usoPlano.<limite> > 0 && usoPlano.<usado> >= usoPlano.<limite>`.
  Never block when the limit is 0/negative.
- **Copy-to-clipboard:** use a small local-state `CopyButton` (navigator.clipboard) like in
  `ScriptDetailDialog`.
- **i18n:** all UI text is pt-BR.
- **Backend quirk to preserve:** the analytics field is `usoPlano.rotelirosMes` (sic — mirrors a
  backend typo). Do not "fix" the name on the frontend.

## Implemented modules

- **Auth** — login/register/context/guard/refresh.
- **Layout** — sidebar + topbar shell.
- **Dashboard** (`pages/Dashboard.tsx`, `components/dashboard/`, `api/analytics.ts`,
  `api/onboarding.ts`, `hooks/useAnalytics.ts`, `hooks/useOnboarding.ts`) — stat cards,
  clicks/day area chart, device pie, plan-usage bars, onboarding checklist, top links, weekly
  insight, "send report" mutation.
- **Radar** (`pages/Radar.tsx`, `components/radar/`, `api/products.ts`, `hooks/useProducts.ts`,
  `hooks/useDebounce.ts`, `lib/radar.ts`, `lib/format.ts`) — URL-synced filters
  (search/category/platform), trending row, paginated grid, product detail dialog with a
  "Gerar roteiro" link into the Studio (`/studio?productId=&productName=`).
- **Studio** (`pages/Studio.tsx`, `components/studio/`, `api/scripts.ts`, `hooks/useScripts.ts`,
  `hooks/useProductSearch.ts`, `lib/studio.ts`) — URL-synced platform/format filters, paginated
  list, `GenerateScriptDialog` (product search + platform/format/tone/duration selects),
  `ScriptDetailDialog`. Plan-limit aware via `usoPlano.rotelirosMes`.

> **Studio — confirmed against the backend `ScriptController`:** routes are
> `POST /api/studio/roteiro`, `GET /api/studio/roteiros`, `GET /api/studio/roteiros/{id}`,
> `GET /api/studio/roteiros/produto/{productId}`. There is **no DELETE** endpoint for scripts.
> The request (`ScriptRequest`) requires `productName` (@NotBlank); `tone`/`duration` are
> free-text Strings on the backend — the frontend enums serialize to valid values. The list
> endpoint only supports the `page` query param (platform/format filters are ignored
> server-side).

## Remaining phases (see `ROADMAP.md` for full detail)

- **Links** — `api/links.ts` (create, list paginated, detail, delete), `LinkResponse` type,
  `useLinks`. Create dialog (destinationUrl, title, optional slug/campaign/productId/scriptId).
  List with **copy `shortUrl`** and **show `qrCodeUrl`** (the QR image URL comes from the
  backend — do not generate it). `DELETE` is a **soft delete** (deactivate) → confirm first and
  reflect `active: false`. The public redirect `/r/{username}/{slug}` is hit by the visitor's
  browser, **not** the app — the frontend only displays/copies the short URL.
- **Videos** — async pipeline. `POST /api/videos` returns `202` with `status: PENDING`.
  **Poll** `GET /api/videos/{id}` with TanStack Query `refetchInterval`, and **stop polling at a
  terminal status** (`COMPLETED` / `FAILED`) — e.g.
  `refetchInterval: (q) => isTerminal(q.state.data?.status) ? false : 15000`. Show the stages;
  on `COMPLETED` use `videoUrl`, on `FAILED` show `errorMessage`. Apply the plan-limit guard with
  `usoPlano.videosMes` / `limiteVideos` (treating `<= 0` as unlimited).

## Backend notes

- CORS is fully open in dev — restrict to the deployed frontend origin before production.
- Render free tier cold-starts: the first request after idle can be slow; keep tolerant loading
  states / friendly messaging.
- `recharts` is heavy (~242 kB gzip). Consider `lazy()` on the Dashboard route in the polish phase.
