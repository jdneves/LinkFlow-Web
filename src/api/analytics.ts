import { api } from "@/lib/api";
import type { AnalyticsDashboard } from "@/types/api";

export const analyticsApi = {
  getDashboard: () =>
    api.get<AnalyticsDashboard>("/api/analytics/dashboard").then((r) => r.data),
  // Dispara o envio do relatório semanal por e-mail (202).
  sendReport: () => api.post("/api/analytics/relatorio").then((r) => r.data),
};
