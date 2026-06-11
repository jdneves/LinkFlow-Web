import { AlertCircle, CheckCircle2, ExternalLink, Loader2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  isTerminal,
  STAGES,
  STATUS_STEP,
  VIDEO_STATUS_LABEL,
} from "@/lib/videos";
import { cn } from "@/lib/utils";
import type { VideoJobResponse } from "@/types/api";

interface Props {
  video: VideoJobResponse;
}

export function VideoCard({ video }: Props) {
  const step = STATUS_STEP[video.status];
  const terminal = isTerminal(video.status);
  const failed = video.status === "FAILED";
  const completed = video.status === "COMPLETED";

  const date = new Date(video.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className={cn(failed && "border-destructive/40")}>
      <CardContent className="space-y-4 p-4">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-medium">{video.productName}</p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3" />
              {date}
            </p>
          </div>
          <StatusBadge status={video.status} />
        </div>

        {/* Barra de progresso dos estágios */}
        {!failed && (
          <div className="space-y-2">
            <div className="flex gap-1">
              {STAGES.map((stage, i) => (
                <div
                  key={stage}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-colors",
                    i <= step
                      ? completed
                        ? "bg-green-500"
                        : "bg-primary"
                      : "bg-muted",
                  )}
                />
              ))}
            </div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {!terminal && (
                <Loader2 className="size-3 animate-spin" />
              )}
              {completed && (
                <CheckCircle2 className="size-3 text-green-500" />
              )}
              {VIDEO_STATUS_LABEL[video.status]}
            </p>
          </div>
        )}

        {/* Erro */}
        {failed && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{video.errorMessage ?? "Falha na geração do vídeo."}</span>
          </div>
        )}

        {/* Link do vídeo quando concluído */}
        {completed && video.videoUrl && (
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a href={video.videoUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="size-4" />
              Assistir vídeo
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: VideoJobResponse["status"] }) {
  if (status === "COMPLETED")
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Concluído</Badge>;
  if (status === "FAILED")
    return <Badge variant="destructive">Falhou</Badge>;
  return <Badge variant="secondary">{VIDEO_STATUS_LABEL[status]}</Badge>;
}
