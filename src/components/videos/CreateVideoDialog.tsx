import { useState } from "react";
import { AlertCircle, Loader2, ScrollText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useScripts } from "@/hooks/useScripts";
import { useCreateVideo } from "@/hooks/useVideos";
import { getApiErrorMessage } from "@/lib/errors";
import { SCRIPT_FORMAT_LABEL, SCRIPT_PLATFORM_LABEL } from "@/lib/studio";
import { cn } from "@/lib/utils";
import type { ScriptResponse } from "@/types/api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateVideoDialog({ open, onOpenChange }: Props) {
  const [selected, setSelected] = useState<ScriptResponse | null>(null);

  const scripts = useScripts({ page: 0 });
  const create = useCreateVideo();

  function handleOpenChange(o: boolean) {
    if (!o) {
      setSelected(null);
      create.reset();
    }
    onOpenChange(o);
  }

  function handleSubmit() {
    if (!selected) return;
    create.mutate(
      { scriptId: selected.id },
      { onSuccess: () => handleOpenChange(false) },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Criar vídeo</DialogTitle>
          <DialogDescription>
            Selecione um roteiro para gerar o vídeo com avatar IA.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm font-medium">Roteiro</p>

          {scripts.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : scripts.isError ? (
            <p className="text-sm text-destructive">
              {getApiErrorMessage(scripts.error)}
            </p>
          ) : scripts.data?.content.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-md border py-8 text-center">
              <ScrollText className="size-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Nenhum roteiro encontrado. Crie um no Estúdio primeiro.
              </p>
            </div>
          ) : (
            <div className="max-h-60 space-y-1 overflow-y-auto rounded-md border p-1">
              {scripts.data?.content.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelected(s)}
                  className={cn(
                    "w-full rounded px-3 py-2.5 text-left transition-colors hover:bg-muted",
                    selected?.id === s.id && "bg-secondary",
                  )}
                >
                  <p className="truncate text-sm font-medium">{s.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    {SCRIPT_PLATFORM_LABEL[s.platform]} ·{" "}
                    {SCRIPT_FORMAT_LABEL[s.format]}
                  </p>
                </button>
              ))}
            </div>
          )}

          {create.isPending && (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
              Criando job de vídeo... o processamento acontece em segundo plano.
            </div>
          )}

          {create.isError && (
            <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {getApiErrorMessage(create.error)}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={create.isPending}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!selected || create.isPending}>
            {create.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Criando...
              </>
            ) : (
              "Criar vídeo"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
