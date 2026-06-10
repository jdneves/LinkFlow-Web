# LinkFlow Web — Roadmap de Fases

Documento vivo. Marque os itens conforme avança (`[x]`).
A ordem segue as dependências reais: cada fase destrava a próxima.

Legenda de status: ✅ concluída · 🚧 em andamento · ⬜ pendente

---

## Fase 0 — Fundação ✅
**Objetivo:** projeto compilando com toda a infraestrutura base.
- [x] Vite + React 18 + TS estrito, alias `@`
- [x] Tailwind + tema shadcn (CSS vars) + `cn()`
- [x] React Router + QueryClient + providers (`main.tsx`)
- [x] Axios com interceptors + **refresh de token com fila**
- [x] `tokenStorage`, `lib/errors.ts`
**Pronto quando:** `npm run build` passa e a app sobe em `/`.

## Fase 1 — Autenticação ✅
**Objetivo:** sessão JWT ponta a ponta. *(Destrava todo o resto.)*
- [x] `AuthContext` (login / register / logout / hidratação via `/me`)
- [x] `useAuth`, `ProtectedRoute`
- [x] Páginas Login e Register (React Hook Form + Zod)
- [x] Tratamento dos erros do backend (ex.: "E-mail já cadastrado")
**Pronto quando:** login real persiste sessão e refresh funciona em 401.

## Fase 2 — Layout / Shell ✅
**Objetivo:** casca do app autenticado.
- [x] `Layout` (sidebar + topbar) e `Sidebar` com navegação
- [x] Exibir plano do usuário + botão de logout
**Pronto quando:** navegação entre as áreas funciona dentro do shell.

## Fase 3 — Dashboard ✅
**Objetivo:** primeira tela com dados reais (React Query).
- [x] `api/analytics.ts` + `api/onboarding.ts` + hooks
- [x] Cards de totais, gráfico de cliques/dia, pizza de dispositivos
- [x] Uso do plano (barras), checklist de onboarding, top links, insight
- [x] Estados de loading / erro / vazio
**Pronto quando:** dashboard renderiza com dados da API e trata falhas.

---

## Fase 4 — Radar ✅
**Objetivo:** descoberta de produtos — primeira tela com paginação + filtros.
- [x] `api/products.ts` (list com query params, trending, detalhe, categorias)
- [x] Tipos `ProductResponse` + `scoreDetail` em `types/api.ts`
- [x] Hooks `useProducts` (paginado), `useTrending`, `useProduct`
- [x] Tela `Radar`: filtros (categoria, plataforma, busca) + grid de cards
- [x] Paginação e estado vazio
- [x] Página/painel de detalhe do produto (score, comissão, tendência)
**Depende de:** Fase 1 (auth).
**Pronto quando:** filtros refletem na URL/query e a lista pagina corretamente.

## Fase 5 — Estúdio ✅
**Objetivo:** geração de roteiros com IA (resposta pode demorar).
- [x] `api/scripts.ts` (gerar, listar, detalhe, por produto)
- [x] Tipos `ScriptResponse`
- [x] Form de geração (plataforma, formato, tom, duração)
- [x] **Bloqueio preventivo** quando limite do plano atingido (`usoPlano`)
- [x] Lista de roteiros + visualização (hook, tópicos, CTA, hashtags, stories)
- [x] Estado de "gerando…" tolerante (cold start + IA)
**Depende de:** Fase 4 (vincular roteiro a produto via `productId`).
**Pronto quando:** roteiro é gerado e exibido; limite bloqueia o botão.

## Fase 6 — Links ✅
**Objetivo:** links de afiliado rastreáveis.
- [x] `api/links.ts` (criar, listar paginado, detalhe, desativar)
- [x] Tipos `LinkResponse`
- [x] Form de criação (destino, título, slug opcional, campanha)
- [x] Lista + copiar `shortUrl` + exibir QR code (`qrCodeUrl`)
- [x] Soft delete (DELETE) com confirmação
**Depende de:** Fase 1; opcionalmente Fases 4/5 (vincular product/script).
**Pronto quando:** cria link, copia URL curta e desativa.

## Fase 7 — Vídeos ⬜
**Objetivo:** geração assíncrona com polling.
- [ ] `api/videos.ts` (criar 202, status, listar)
- [ ] Tipos `VideoJobResponse` (status PENDING→COMPLETED/FAILED)
- [ ] Hook de status com `refetchInterval` (10–30s), parando em estado terminal
- [ ] Tela: criar a partir de roteiro + UI dos estágios + erro/`errorMessage`
**Depende de:** Fase 5 (precisa de `scriptId`).
**Pronto quando:** job criado faz polling e mostra vídeo pronto ou falha.

---

## Fase 8 — Polimento & Deploy ⬜
**Objetivo:** pronto pra produção.
- [ ] `lazy()` na rota do Dashboard (isolar chunk do Recharts)
- [ ] Combinar URL final do frontend e **restringir CORS** no backend
- [ ] Mensagem amigável de cold start (Render free tier) no 1º acesso
- [ ] Revisitar storage de token (localStorage → avaliar httpOnly)
- [ ] Deploy do build (`dist/`) em CDN

---

### Convenções por fase (checklist rápido)
Para cada nova área, repetir: **tipos** → **`api/`** → **`hooks/`** → **tela** → estados loading/erro/vazio → validar `npm run build`.
