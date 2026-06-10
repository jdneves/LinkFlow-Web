import { api } from "@/lib/api";
import type {
  Page,
  ScriptFilters,
  ScriptGenerateRequest,
  ScriptResponse,
} from "@/types/api";

// Rotas alinhadas ao contrato do backend (PROJETO.md): prefixo /api/studio/roteiro(s).
export const scriptsApi = {
  // POST /api/studio/roteiro — geração com IA (pode demorar).
  generate: (req: ScriptGenerateRequest) =>
    api.post<ScriptResponse>("/api/studio/roteiro", req).then((r) => r.data),

  // GET /api/studio/roteiros — Page<ScriptResponse>.
  // Obs.: o PROJETO.md documenta apenas o query param `page`; `platform`/`format`
  // são enviados pelos filtros da tela e dependem de suporte no backend
  // (se não suportados, são ignorados e a filtragem não tem efeito).
  list: (filters: ScriptFilters = {}) => {
    const params: Record<string, string | number> = { page: filters.page ?? 0 };
    if (filters.platform) params.platform = filters.platform;
    if (filters.format) params.format = filters.format;
    return api
      .get<Page<ScriptResponse>>("/api/studio/roteiros", { params })
      .then((r) => r.data);
  },

  // GET /api/studio/roteiros/{id}
  detail: (id: string) =>
    api.get<ScriptResponse>(`/api/studio/roteiros/${id}`).then((r) => r.data),

  // GET /api/studio/roteiros/produto/{productId} — Page<ScriptResponse>.
  byProduct: (productId: string, page = 0) =>
    api
      .get<Page<ScriptResponse>>(`/api/studio/roteiros/produto/${productId}`, {
        params: { page },
      })
      .then((r) => r.data),

  // ⚠️ DELETE não está documentado no PROJETO.md para o Estúdio.
  // Mantido para não quebrar `useDeleteScript`; confirmar/implementar no backend
  // antes de expor um botão de excluir.
  delete: (id: string) =>
    api.delete(`/api/studio/roteiros/${id}`).then((r) => r.data),
};
