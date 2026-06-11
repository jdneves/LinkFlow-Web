import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { scriptsApi } from "@/api/scripts";
import type { ScriptFilters, ScriptGenerateRequest } from "@/types/api";

export function useScripts(filters: ScriptFilters) {
  return useQuery({
    queryKey: ["scripts", "list", filters],
    queryFn: () => scriptsApi.list(filters),
    placeholderData: keepPreviousData,
  });
}

export function useScript(id: string | null) {
  return useQuery({
    queryKey: ["scripts", "detail", id],
    queryFn: () => scriptsApi.detail(id!),
    enabled: !!id,
  });
}

export function useGenerateScript() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: ScriptGenerateRequest) => scriptsApi.generate(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scripts", "list"] });
      // Gerar roteiro consome cota do plano → atualiza usoPlano.
      queryClient.invalidateQueries({ queryKey: ["analytics", "dashboard"] });
    },
  });
}
