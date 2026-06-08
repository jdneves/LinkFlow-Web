import { useQuery } from "@tanstack/react-query";
import { onboardingApi } from "@/api/onboarding";

export function useOnboarding() {
  return useQuery({
    queryKey: ["onboarding"],
    queryFn: onboardingApi.get,
  });
}
