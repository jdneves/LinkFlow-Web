import { api } from "@/lib/api";
import type {
  Page,
  ScriptFilters,
  ScriptGenerateRequest,
  ScriptResponse,
} from "@/types/api";

export const scriptsApi = {
  generate: (req: ScriptGenerateRequest) =>
    api.post<ScriptResponse>("/api/studio/generate", req).then((r) => r.data),

  list: (filters: ScriptFilters = {}) => {
    const params: Record<string, string | number> = { page: filters.page ?? 0 };
    if (filters.platform) params.platform = filters.platform;
    if (filters.format) params.format = filters.format;
    return api
      .get<Page<ScriptResponse>>("/api/studio", { params })
      .then((r) => r.data);
  },

  detail: (id: string) =>
    api.get<ScriptResponse>(`/api/studio/${id}`).then((r) => r.data),

  byProduct: (productId: string) =>
    api
      .get<ScriptResponse[]>(`/api/studio/produto/${productId}`)
      .then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/api/studio/${id}`).then((r) => r.data),
};
