import { MousePointerClick, Link2, FileText, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardTotais } from "@/types/api";

const fmt = new Intl.NumberFormat("pt-BR");

export function StatCards({ totais }: { totais: DashboardTotais }) {
  const cards = [
    {
      label: "Cliques totais",
      value: totais.totalCliques,
      icon: MousePointerClick,
      hint: `${fmt.format(totais.cliquesUltimos7Dias)} nos últimos 7 dias`,
    },
    { label: "Links ativos", value: totais.totalLinks, icon: Link2 },
    { label: "Roteiros", value: totais.totalRoteiros, icon: FileText },
    { label: "Vídeos", value: totais.totalVideos, icon: Video },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, hint }) => (
        <Card key={label}>
          <CardContent className="flex items-start justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-1 text-2xl font-bold">{fmt.format(value)}</p>
              {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
            </div>
            <div className="rounded-lg bg-secondary p-2 text-muted-foreground">
              <Icon className="size-5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
