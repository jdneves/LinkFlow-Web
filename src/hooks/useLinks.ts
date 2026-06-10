import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { linksApi } from "@/api/links";
import type { LinkCreateRequest, LinkFilters } from "@/types/api";

export function useLinks(filters: LinkFilters) {
  return useQuery({
    queryKey: ["links", "list", filters],
    queryFn: () => linksApi.list(filters),
    placeholderData: keepPreviousData,
  });
}

export function useCreateLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: LinkCreateRequest) => linksApi.create(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", "list"] });
      queryClient.invalidateQueries({ queryKey: ["analytics", "dashboard"] });
    },
  });
}

export function useDeactivateLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => linksApi.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", "list"] });
      queryClient.invalidateQueries({ queryKey: ["analytics", "dashboard"] });
    },
  });
}
