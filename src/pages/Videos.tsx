import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  RefreshCw,
  Video,
} from "lucide-react";
import { useVideos } from "@/hooks/useVideos";
import { useAnalyticsDashboard } from "@/hooks/useAnalytics";
import { getApiErrorMessage } from "@/lib/errors";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VideoCard } from "@/components/videos/VideoCard";
import { CreateVideoDialog } from "@/components/videos/CreateVideoDialog";

export default function Videos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? 0);

  const goToPage = (n: number) =>
    setSearchParams({ page: String(n) }, { replace: true });

  const videos = useVideos({ page });
  const analytics = useAnalyticsDashboard();

  const [createOpen, setCreateOpen] = useState(false);

  const usoPlano = analytics.data?.usoPlano;
  const limitAtingido =
    !!usoPlano &&
    usoPlano.limiteVideos > 0 &&
    usoPlano.videosMes >= usoPlano.limiteVideos;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vídeos</h1>
          <p className="text-sm text-muted-foreground">
            Geração de vídeo com avatar IA — processamento assíncrono.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} disabled={limitAtingido}>
          <PlusCircle className="size-4" />
          Criar vídeo
        </Button>
      </div>

      {limitAtingido && usoPlano && (
        <div className="flex items-center gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertCircle className="size-4 shrink-0" />
          <span>
            Você atingiu o limite de{" "}
            <strong>{usoPlano.limiteVideos} vídeos</strong> do plano{" "}
            <strong>{usoPlano.plano}</strong> este mês. Faça upgrade para
            continuar gerando.
          </span>
        </div>
      )}

      <section className="space-y-4">
        {videos.isLoading ? (
          <VideoGridSkeleton />
        ) : videos.isError ? (
          <ErrorState
            message={getApiErrorMessage(videos.error)}
            onRetry={() => videos.refetch()}
          />
        ) : videos.data && videos.data.content.length === 0 ? (
          <EmptyState
            onCreate={() => setCreateOpen(true)}
            limitAtingido={limitAtingido}
          />
        ) : videos.data ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videos.data.content.map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
            <Pagination
              page={videos.data.number}
              totalPages={videos.data.totalPages}
              isFetching={videos.isFetching}
              onPrev={() => goToPage(page - 1)}
              onNext={() => goToPage(page + 1)}
            />
          </>
        ) : null}
      </section>

      <CreateVideoDialog open={createOpen} onOpenChange={setCreateOpen} />
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

function VideoGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-44 animate-pulse rounded-lg bg-muted" />
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
        <Video className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Você ainda não gerou nenhum vídeo.
        </p>
        <Button size="sm" onClick={onCreate} disabled={limitAtingido}>
          <PlusCircle className="size-4" />
          Criar primeiro vídeo
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
