import { api } from "@/lib/api";
import type {
  Page,
  ScriptFilters,
  ScriptGenerateRequest,
  ScriptResponse,
} from "@/types/api";

// Rotas alinhadas ao ScriptController do backend: prefixo /api/studio/roteiro(s).
export const scriptsApi = {
  // POST /api/studio/roteiro — geração com IA (pode demorar).
  generate: (req: ScriptGenerateRequest) =>
    api.post<ScriptResponse>("/api/studio/roteiro", req).then((r) => r.data),

  // GET /api/studio/roteiros — Page<ScriptResponse>.
  // Obs.: o backend só suporta o query param `page`; `platform`/`format`
  // são enviados pelos filtros da tela mas ignorados pelo servidor
  // (a filtragem não tem efeito até existir suporte no backend).
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
};
