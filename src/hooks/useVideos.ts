import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { videosApi } from "@/api/videos";
import { isTerminal } from "@/lib/videos";
import type { VideoCreateRequest, VideoFilters } from "@/types/api";

export function useVideos(filters: VideoFilters) {
  return useQuery({
    queryKey: ["videos", "list", filters],
    queryFn: () => videosApi.list(filters),
    placeholderData: keepPreviousData,
    // Faz polling enquanto houver jobs não terminais na página atual.
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;
      const hasActive = data.content.some((v) => !isTerminal(v.status));
      return hasActive ? 15_000 : false;
    },
  });
}

export function useVideoStatus(id: string | null) {
  return useQuery({
    queryKey: ["videos", "status", id],
    queryFn: () => videosApi.status(id!),
    enabled: !!id,
    // Para polling quando o job atinge estado terminal.
    refetchInterval: (query) =>
      isTerminal(query.state.data?.status) ? false : 10_000,
  });
}

export function useCreateVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: VideoCreateRequest) => videosApi.create(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos", "list"] });
      queryClient.invalidateQueries({ queryKey: ["analytics", "dashboard"] });
    },
  });
}
