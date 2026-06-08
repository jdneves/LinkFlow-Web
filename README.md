# LinkFlow Web

Frontend (SPA) do LinkFlow — cliente da API REST `linkflow-api` (Spring Boot).

## Stack
React 18 + Vite + TypeScript · React Router v6 · TanStack Query · Axios · Tailwind + shadcn/ui · React Hook Form + Zod.

## Rodar localmente
```bash
npm install
cp .env.example .env   # ajuste VITE_API_BASE_URL se precisar
npm run dev            # http://localhost:5173
```

## Scripts
- `npm run dev` — servidor de desenvolvimento (Vite)
- `npm run build` — type-check + build de produção (`dist/`)
- `npm run preview` — preview do build

## O que já está montado (fundação)
- **Config:** Vite (alias `@`), Tailwind + tema shadcn, TS estrito.
- **`lib/api.ts`:** Axios com interceptors e **refresh de token com fila** (lida com 401 concorrentes sem queimar o refresh de uso único).
- **`auth/`:** `AuthContext` (login/register/logout + hidratação via `/me`), `useAuth`, `ProtectedRoute`.
- **Auth UI:** páginas de Login e Cadastro com validação Zod e tratamento dos erros do backend.
- **Shell:** `Layout` (sidebar + topbar) com navegação entre as áreas.
- **Stubs:** Dashboard, Radar, Estúdio, Links, Vídeos + camada `api/` por domínio.

## Próximos passos (ordem sugerida)
Dashboard (analytics + onboarding) → Radar → Estúdio → Links → Vídeos (polling).
