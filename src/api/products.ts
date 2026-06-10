import { api } from "@/lib/api";
import type {
  CategoriasResponse,
  Page,
  ProductResponse,
  RadarFilters,
} from "@/types/api";

export const productsApi = {
  list: (filters: RadarFilters = {}) => {
    const params: Record<string, string | number> = { page: filters.page ?? 0 };
    if (filters.category) params.category = filters.category;
    if (filters.platform) params.platform = filters.platform;
    if (filters.search) params.search = filters.search;
    return api
      .get<Page<ProductResponse>>("/api/radar", { params })
      .then((r) => r.data);
  },
  trending: () =>
    api.get<ProductResponse[]>("/api/radar/trending").then((r) => r.data),
  detail: (id: string) =>
    api.get<ProductResponse>(`/api/radar/${id}`).then((r) => r.data),
  categorias: () =>
    api.get<CategoriasResponse>("/api/radar/categorias").then((r) => r.data),
};
