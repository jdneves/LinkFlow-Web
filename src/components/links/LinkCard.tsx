import { useState } from "react";
import { Check, Copy, ExternalLink, ImageOff, Loader2, QrCode, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PLATFORM_LABEL } from "@/lib/radar";
import { useDeactivateLink } from "@/hooks/useLinks";
import { getApiErrorMessage } from "@/lib/errors";
import type { LinkResponse } from "@/types/api";

interface Props {
  link: LinkResponse;
}

export function LinkCard({ link }: Props) {
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [qrError, setQrError] = useState(false);

  const deactivate = useDeactivateLink();

  function handleCopy() {
    navigator.clipboard.writeText(link.shortUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDeactivate() {
    deactivate.mutate(link.id, {
      onSuccess: () => setConfirmOpen(false),
    });
  }

  return (
    <>
      <Card className={link.active ? undefined : "opacity-60"}>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
          {/* Informações principais */}
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate font-medium">{link.title}</span>
              <Badge variant="secondary">{PLATFORM_LABEL[link.platform]}</Badge>
              {!link.active && (
                <Badge variant="outline" className="text-muted-foreground">
                  Inativo
                </Badge>
              )}
              {link.campaign && (
                <Badge variant="outline">{link.campaign}</Badge>
              )}
            </div>

            <p className="truncate text-sm text-muted-foreground">
              {link.destination}
            </p>

            <div className="flex items-center gap-2">
              <a
                href={link.shortUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                {link.shortUrl}
                <ExternalLink className="size-3" />
              </a>
              <Button variant="ghost" size="sm" className="h-6 px-1.5" onClick={handleCopy}>
                {copied ? (
                  <Check className="size-3.5 text-green-600" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </Button>
            </div>
          </div>

          {/* Métricas e ações */}
          <div className="flex shrink-0 items-center gap-3">
            <div className="text-center">
              <p className="text-lg font-bold">{link.clicks.toLocaleString("pt-BR")}</p>
              <p className="text-xs text-muted-foreground">cliques</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setQrOpen(true)}
              title="Ver QR Code"
            >
              <QrCode className="size-4" />
            </Button>

            {link.active && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmOpen(true)}
                title="Desativar link"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog QR Code */}
      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
            <DialogDescription className="truncate">{link.title}</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-2">
            {qrError ? (
              <div className="flex h-48 w-48 flex-col items-center justify-center gap-2 rounded-md border text-muted-foreground">
                <ImageOff className="size-6" />
                <span className="text-xs">QR code indisponível</span>
              </div>
            ) : (
              <img
                src={link.qrCodeUrl}
                alt={`QR Code — ${link.title}`}
                className="h-48 w-48 rounded-md"
                onError={() => setQrError(true)}
              />
            )}
          </div>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
            {copied ? "Copiado!" : "Copiar link"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Dialog confirmação de desativação */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Desativar link</DialogTitle>
            <DialogDescription>
              O link <strong>{link.shortUrl}</strong> será desativado e deixará
              de redirecionar visitantes. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          {deactivate.isError && (
            <p className="text-sm text-destructive">
              {getApiErrorMessage(deactivate.error)}
            </p>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={deactivate.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeactivate}
              disabled={deactivate.isPending}
            >
              {deactivate.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              Desativar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
