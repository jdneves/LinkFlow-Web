import { useMutation, useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/api/analytics";

export function useAnalyticsDashboard() {
  return useQuery({
    queryKey: ["analytics", "dashboard"],
    queryFn: analyticsApi.getDashboard,
  });
}

export function useSendReport() {
  return useMutation({ mutationFn: analyticsApi.sendReport });
}
