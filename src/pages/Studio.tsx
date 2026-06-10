import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  RefreshCw,
  ScrollText,
} from "lucide-react";
import { useScripts } from "@/hooks/useScripts";
import { useAnalyticsDashboard } from "@/hooks/useAnalytics";
import { getApiErrorMessage } from "@/lib/errors";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScriptCard } from "@/components/studio/ScriptCard";
import { ScriptDetailDialog } from "@/components/studio/ScriptDetailDialog";
import { StudioFilters } from "@/components/studio/StudioFilters";
import { GenerateScriptDialog } from "@/components/studio/GenerateScriptDialog";
import type { ScriptFormat, ScriptPlatform, ScriptResponse } from "@/types/api";

export default function Studio() {
  const [searchParams, setSearchParams] = useSearchParams();

  const platform = (searchParams.get("platform") as ScriptPlatform) || undefined;
  const format = (searchParams.get("format") as ScriptFormat) || undefined;
  const page = Number(searchParams.get("page") ?? 0);

  const patchParams = (mutate: (p: URLSearchParams) => void) => {
    const next = new URLSearchParams(searchParams);
    mutate(next);
    setSearchParams(next, { replace: true });
  };

  const setPlatform = (v?: ScriptPlatform) =>
    patchParams((p) => {
      v ? p.set("platform", v) : p.delete("platform");
      p.delete("page");
    });
  const setFormat = (v?: ScriptFormat) =>
    patchParams((p) => {
      v ? p.set("format", v) : p.delete("format");
      p.delete("page");
    });
  const goToPage = (n: number) => patchParams((p) => p.set("page", String(n)));
  const clearAll = () => setSearchParams({}, { replace: true });

  const filters = { platform, format, page };
  const scripts = useScripts(filters);
  const analytics = useAnalyticsDashboard();

  const [selected, setSelected] = useState<ScriptResponse | null>(null);
  const [generateOpen, setGenerateOpen] = useState(false);

  const usoPlano = analytics.data?.usoPlano;
  // Trata limite <= 0 como ilimitado (ex.: plano PRO) — não bloquear nesse caso.
  const limitAtingido =
    !!usoPlano &&
    usoPlano.limiteRoteiros > 0 &&
    usoPlano.rotelirosMes >= usoPlano.limiteRoteiros;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Estúdio</h1>
          <p className="text-sm text-muted-foreground">
            Gere roteiros com IA para os seus produtos.
          </p>
        </div>
        <Button onClick={() => setGenerateOpen(true)} disabled={limitAtingido}>
          <PlusCircle className="size-4" />
          Gerar roteiro
        </Button>
      </div>

      {limitAtingido && usoPlano && (
        <div className="flex items-center gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertCircle className="size-4 shrink-0" />
          <span>
            Você atingiu o limite de{" "}
            <strong>{usoPlano.limiteRoteiros} roteiros</strong> do plano{" "}
            <strong>{usoPlano.plano}</strong> este mês. Faça upgrade para continuar
            gerando.
          </span>
        </div>
      )}

      <StudioFilters
        platform={platform}
        format={format}
        onPlatformChange={setPlatform}
        onFormatChange={setFormat}
        onClear={clearAll}
      />

      <section className="space-y-4">
        {scripts.isLoading ? (
          <ScriptGridSkeleton />
        ) : scripts.isError ? (
          <ErrorState
            message={getApiErrorMessage(scripts.error)}
            onRetry={() => scripts.refetch()}
          />
        ) : scripts.data && scripts.data.content.length === 0 ? (
          <EmptyState
            hasFilters={!!platform || !!format}
            onClear={clearAll}
            onGenerate={() => setGenerateOpen(true)}
            limitAtingido={limitAtingido}
          />
        ) : scripts.data ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {scripts.data.content.map((s) => (
                <ScriptCard key={s.id} script={s} onClick={() => setSelected(s)} />
              ))}
            </div>
            <Pagination
              page={scripts.data.number}
              totalPages={scripts.data.totalPages}
              isFetching={scripts.isFetching}
              onPrev={() => goToPage(page - 1)}
              onNext={() => goToPage(page + 1)}
            />
          </>
        ) : null}
      </section>

      <ScriptDetailDialog
        script={selected}
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
      />

      <GenerateScriptDialog
        open={generateOpen}
        onOpenChange={setGenerateOpen}
      />
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  isFetching,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  isFetching: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrev}
        disabled={page <= 0 || isFetching}
      >
        <ChevronLeft className="size-4" />
        Anterior
      </Button>
      <span className="text-sm text-muted-foreground">
        Página {page + 1} de {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={page >= totalPages - 1 || isFetching}
      >
        Próxima
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}

function ScriptGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-52 animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  );
}

function EmptyState({
  hasFilters,
  onClear,
  onGenerate,
  limitAtingido,
}: {
  hasFilters: boolean;
  onClear: () => void;
  onGenerate: () => void;
  limitAtingido: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <ScrollText className="size-8 text-muted-foreground" />
        {hasFilters ? (
          <>
            <p className="text-sm text-muted-foreground">
              Nenhum roteiro encontrado com esses filtros.
            </p>
            <Button variant="outline" size="sm" onClick={onClear}>
              Limpar filtros
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Você ainda não gerou nenhum roteiro.
            </p>
            <Button size="sm" onClick={onGenerate} disabled={limitAtingido}>
              <PlusCircle className="size-4" />
              Gerar primeiro roteiro
            </Button>
          </>
        )}
      </CardContent>
    </Card>
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
