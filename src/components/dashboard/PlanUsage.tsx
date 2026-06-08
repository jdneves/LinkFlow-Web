import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UsoPlano } from "@/types/api";

// PRO tem limites ilimitados; o backend pode representar como 0/negativo.
const isUnlimited = (limit: number) => limit == null || limit <= 0;

function UsageRow({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) {
  if (isUnlimited(limit)) {
    return (
      <div className="space-y-1.5">
        <div className="flex justify-between text-sm">
          <span>{label}</span>
          <span className="text-muted-foreground">{used} · Ilimitado</span>
        </div>
        <Progress value={100} indicatorClassName="bg-emerald-500" />
      </div>
    );
  }

  const pct = Math.round((used / limit) * 100);
  const atLimit = used >= limit;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span
          className={cn(
            atLimit ? "font-medium text-destructive" : "text-muted-foreground",
          )}
        >
          {used} / {limit}
        </span>
      </div>
      <Progress
        value={pct}
        indicatorClassName={cn(
          atLimit ? "bg-destructive" : pct >= 80 ? "bg-amber-500" : "bg-primary",
        )}
      />
    </div>
  );
}

export function PlanUsage({ uso }: { uso: UsoPlano }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Uso do plano</CardTitle>
        <Badge variant="secondary">{uso.plano}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <UsageRow label="Roteiros / mês" used={uso.rotelirosMes} limit={uso.limiteRoteiros} />
        <UsageRow label="Vídeos / mês" used={uso.videosMes} limit={uso.limiteVideos} />
        <UsageRow label="Links ativos" used={uso.linksAtivos} limit={uso.limiteLinks} />
      </CardContent>
    </Card>
  );
}
