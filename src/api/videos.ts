import { api } from "@/lib/api";
import type {
  Page,
  VideoCreateRequest,
  VideoFilters,
  VideoJobResponse,
} from "@/types/api";

export const videosApi = {
  create: (req: VideoCreateRequest) =>
    api.post<VideoJobResponse>("/api/videos", req).then((r) => r.data),

  list: (filters: VideoFilters = {}) =>
    api
      .get<Page<VideoJobResponse>>("/api/videos", {
        params: { page: filters.page ?? 0 },
      })
      .then((r) => r.data),

  status: (id: string) =>
    api.get<VideoJobResponse>(`/api/videos/${id}`).then((r) => r.data),
};
