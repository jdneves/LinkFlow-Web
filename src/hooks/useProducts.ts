import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { productsApi } from "@/api/products";
import type { RadarFilters } from "@/types/api";

export function useProducts(filters: RadarFilters) {
  return useQuery({
    queryKey: ["products", "list", filters],
    queryFn: () => productsApi.list(filters),
    // Mantém a lista anterior visível enquanto pagina/filtra (sem "piscar").
    placeholderData: keepPreviousData,
  });
}

export function useTrending() {
  return useQuery({
    queryKey: ["products", "trending"],
    queryFn: productsApi.trending,
  });
}

export function useProduct(id: string | null) {
  return useQuery({
    queryKey: ["products", "detail", id],
    queryFn: () => productsApi.detail(id!),
    enabled: !!id,
  });
}

export function useCategorias() {
  return useQuery({
    queryKey: ["products", "categorias"],
    queryFn: productsApi.categorias,
    staleTime: 60 * 60 * 1000, // categorias mudam pouco — 1h
  });
}
