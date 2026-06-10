import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Link2,
  PlusCircle,
  RefreshCw,
} from "lucide-react";
import { useLinks } from "@/hooks/useLinks";
import { useAnalyticsDashboard } from "@/hooks/useAnalytics";
import { getApiErrorMessage } from "@/lib/errors";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LinkCard } from "@/components/links/LinkCard";
import { CreateLinkDialog } from "@/components/links/CreateLinkDialog";

export default function Links() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? 0);

  const goToPage = (n: number) =>
    setSearchParams({ page: String(n) }, { replace: true });

  const links = useLinks({ page });
  const analytics = useAnalyticsDashboard();

  const [createOpen, setCreateOpen] = useState(false);

  const usoPlano = analytics.data?.usoPlano;
  const limitAtingido =
    !!usoPlano && usoPlano.linksAtivos >= usoPlano.limiteLinks;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Links</h1>
          <p className="text-sm text-muted-foreground">
            Links de afiliado rastreáveis com QR code.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} disabled={limitAtingido}>
          <PlusCircle className="size-4" />
          Criar link
        </Button>
      </div>

      {limitAtingido && usoPlano && (
        <div className="flex items-center gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertCircle className="size-4 shrink-0" />
          <span>
            Você atingiu o limite de{" "}
            <strong>{usoPlano.limiteLinks} links ativos</strong> do plano{" "}
            <strong>{usoPlano.plano}</strong>. Desative links antigos ou faça
            upgrade para criar mais.
          </span>
        </div>
      )}

      <section className="space-y-3">
        {links.isLoading ? (
          <LinkListSkeleton />
        ) : links.isError ? (
          <ErrorState
            message={getApiErrorMessage(links.error)}
            onRetry={() => links.refetch()}
          />
        ) : links.data && links.data.content.length === 0 ? (
          <EmptyState
            onCreate={() => setCreateOpen(true)}
            limitAtingido={limitAtingido}
          />
        ) : links.data ? (
          <>
            <div className="space-y-3">
              {links.data.content.map((l) => (
                <LinkCard key={l.id} link={l} />
              ))}
            </div>
            <Pagination
              page={links.data.number}
              totalPages={links.data.totalPages}
              isFetching={links.isFetching}
              onPrev={() => goToPage(page - 1)}
              onNext={() => goToPage(page + 1)}
            />
          </>
        ) : null}
      </section>

      <CreateLinkDialog open={createOpen} onOpenChange={setCreateOpen} />
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

function LinkListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  );
}

function EmptyState({
  onCreate,
  limitAtingido,
}: {
  onCreate: () => void;
  limitAtingido: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <Link2 className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Você ainda não criou nenhum link de afiliado.
        </p>
        <Button size="sm" onClick={onCreate} disabled={limitAtingido}>
          <PlusCircle className="size-4" />
          Criar primeiro link
        </Button>
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
