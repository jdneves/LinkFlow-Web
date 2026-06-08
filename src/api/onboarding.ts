import { api } from "@/lib/api";
import type { OnboardingResponse } from "@/types/api";

export const onboardingApi = {
  get: () => api.get<OnboardingResponse>("/api/onboarding").then((r) => r.data),
};
