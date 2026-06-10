import { ExternalLink, ImageOff } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatBRL, formatPct } from "@/lib/format";
import { PLATFORM_LABEL, scoreClasses, trendMeta } from "@/lib/radar";
import type { ProductResponse } from "@/types/api";

export function ProductDetailDialog({
  product,
  open,
  onOpenChange,
}: {
  product: ProductResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        {product && (
          <>
            <DialogHeader>
              <DialogTitle className="pr-6">{product.name}</DialogTitle>
              <DialogDescription>
                {PLATFORM_LABEL[product.platform]} · {product.externalId}
              </DialogDescription>
            </DialogHeader>

            <div className="flex gap-4">
              <div className="size-28 shrink-0 overflow-hidden rounded-md bg-muted">
                {imgError || !product.imageUrl ? (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <ImageOff className="size-6" />
                  </div>
                ) : (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    onError={() => setImgError(true)}
                    className="h-full w-full object-contain"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold">
                    {formatBRL(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatBRL(product.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Comissão estimada {formatBRL(product.estimatedCommission)} (
                  {formatPct(product.commissionPct)})
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-sm font-bold",
                      scoreClasses(product.score),
                    )}
                  >
                    Score {product.score}
                  </span>
                  {(() => {
                    const t = trendMeta(product.trend);
                    const Icon = t.icon;
                    return (
                      <span className={cn("flex items-center gap-1 text-sm", t.className)}>
                        <Icon className="size-4" />
                        {t.label}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-lg border p-3 text-center text-sm">
              <ScoreFactor label="Comissão" value={product.scoreDetail.commission} />
              <ScoreFactor label="Concorrência" value={product.scoreDetail.competition} />
              <ScoreFactor label="Demanda" value={product.scoreDetail.demand} />
            </div>

            <DialogFooter>
              <Button variant="outline" asChild>
                <a href={product.productUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="size-4" />
                  Ver na loja
                </a>
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ScoreFactor({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <Badge variant="secondary" className="mt-1">
        {value}
      </Badge>
    </div>
  );
}
