import { api } from "@/lib/api";
import type {
  LinkCreateRequest,
  LinkFilters,
  LinkResponse,
  Page,
} from "@/types/api";

export const linksApi = {
  create: (req: LinkCreateRequest) =>
    api.post<LinkResponse>("/api/links", req).then((r) => r.data),

  list: (filters: LinkFilters = {}) =>
    api
      .get<Page<LinkResponse>>("/api/links", {
        params: { page: filters.page ?? 0 },
      })
      .then((r) => r.data),

  detail: (id: string) =>
    api.get<LinkResponse>(`/api/links/${id}`).then((r) => r.data),

  deactivate: (id: string) =>
    api.delete(`/api/links/${id}`).then((r) => r.data),
};
