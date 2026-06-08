import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Platform, TopLink } from "@/types/api";

const PLATFORM_LABEL: Record<Platform, string> = {
  MERCADO_LIVRE: "Mercado Livre",
  SHOPEE: "Shopee",
  AMAZON: "Amazon",
};

const fmt = new Intl.NumberFormat("pt-BR");

export function TopLinks({ links }: { links: TopLink[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top links</CardTitle>
      </CardHeader>
      <CardContent>
        {links.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Nenhum link com cliques ainda.
          </p>
        ) : (
          <ul className="divide-y">
            {links.map((link) => (
              <li
                key={link.id}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{link.title}</p>
                  <Badge variant="outline" className="mt-1">
                    {PLATFORM_LABEL[link.platform]}
                  </Badge>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold">{fmt.format(link.clicks)}</p>
                  <p className="text-xs text-muted-foreground">cliques</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
