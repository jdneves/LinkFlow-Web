import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { OnboardingResponse } from "@/types/api";

export function OnboardingChecklist({ data }: { data: OnboardingResponse }) {
  const passos = [...data.passos].sort((a, b) => a.ordem - b.ordem);

  return (
    <Card>
      <CardHeader className="space-y-3">
        <CardTitle className="text-base">Primeiros passos</CardTitle>
        <div className="space-y-1.5">
          <span className="text-xs text-muted-foreground">
            {data.progresso}% concluído
          </span>
          <Progress value={data.progresso} indicatorClassName="bg-emerald-500" />
        </div>
      </CardHeader>
      <CardContent className="space-y-0.5">
        {passos.map((p) => (
          <Link
            key={p.id}
            to={p.acao}
            className={cn(
              "flex items-start gap-3 rounded-md p-2 transition-colors hover:bg-secondary/60",
              p.concluido && "opacity-60",
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                p.concluido
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-muted-foreground/40",
              )}
            >
              {p.concluido && <Check className="size-3" />}
            </span>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-sm font-medium",
                  p.concluido && "line-through",
                )}
              >
                {p.titulo}
              </p>
              <p className="text-xs text-muted-foreground">{p.descricao}</p>
            </div>
            {!p.concluido && (
              <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground" />
            )}
          </Link>
        ))}
        {!data.completed && (
          <p className="px-2 pt-3 text-sm text-muted-foreground">
            {data.mensagemMotivacional}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
