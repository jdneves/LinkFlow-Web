import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/api/products";

export function useProductSearch(search: string) {
  return useQuery({
    queryKey: ["products", "search", search],
    queryFn: () => productsApi.list({ search, page: 0 }),
    enabled: search.length >= 2,
  });
}
