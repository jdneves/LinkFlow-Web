import { Lightbulb, Mail, RefreshCw, Loader2 } from "lucide-react";
import { useAnalyticsDashboard, useSendReport } from "@/hooks/useAnalytics";
import { useOnboarding } from "@/hooks/useOnboarding";
import { getApiErrorMessage } from "@/lib/errors";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatCards } from "@/components/dashboard/StatCards";
import { ClicksChart } from "@/components/dashboard/ClicksChart";
import { DeviceChart } from "@/components/dashboard/DeviceChart";
import { PlanUsage } from "@/components/dashboard/PlanUsage";
import { TopLinks } from "@/components/dashboard/TopLinks";
import { OnboardingChecklist } from "@/components/dashboard/OnboardingChecklist";

export default function Dashboard() {
  const analytics = useAnalyticsDashboard();
  const onboarding = useOnboarding();
  const report = useSendReport();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Visão geral das suas métricas e progresso.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => report.mutate()}
          disabled={report.isPending}
        >
          {report.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Mail className="size-4" />
          )}
          {report.isSuccess ? "Relatório enviado!" : "Enviar relatório"}
        </Button>
      </div>

      {/* Analytics */}
      {analytics.isLoading ? (
        <DashboardSkeleton />
      ) : analytics.isError ? (
        <ErrorState
          message={getApiErrorMessage(analytics.error)}
          onRetry={() => analytics.refetch()}
        />
      ) : analytics.data ? (
        <>
          <StatCards totais={analytics.data.totais} />

          {analytics.data.insightSemanal && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="flex items-start gap-3 p-4">
                <Lightbulb className="mt-0.5 size-5 shrink-0 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-amber-900">
                    Insight da semana
                  </p>
                  <p className="text-sm text-amber-800">
                    {analytics.data.insightSemanal}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 lg:grid-cols-3">
            <ClicksChart data={analytics.data.cliquesPorDia} />
            <DeviceChart data={analytics.data.cliquesPorDevice} />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {onboarding.data && !onboarding.data.completed && (
              <OnboardingChecklist data={onboarding.data} />
            )}
            <PlanUsage uso={analytics.data.usoPlano} />
            <TopLinks links={analytics.data.topLinks} />
          </div>
        </>
      ) : null}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[92px] animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-[312px] animate-pulse rounded-lg bg-muted lg:col-span-2" />
        <div className="h-[312px] animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <p className="text-sm text-muted-foreground">{message}</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="size-4" />
          Tentar novamente
        </Button>
      </CardContent>
    </Card>
  );
}
