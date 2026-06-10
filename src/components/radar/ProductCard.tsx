import { ImageOff } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatBRL, formatPct } from "@/lib/format";
import { PLATFORM_LABEL, scoreClasses, trendMeta } from "@/lib/radar";
import type { ProductResponse } from "@/types/api";

export function ProductCard({
  product,
  onClick,
}: {
  product: ProductResponse;
  onClick: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const trend = trendMeta(product.trend);
  const TrendIcon = trend.icon;
  const hasDiscount = product.discountPct > 0 && product.originalPrice > product.price;

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      className="cursor-pointer overflow-hidden transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-square bg-muted">
        {imgError || !product.imageUrl ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ImageOff className="size-8" />
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-contain"
          />
        )}
        <span
          className={cn(
            "absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-bold",
            scoreClasses(product.score),
          )}
          title="Score de potencial"
        >
          {product.score}
        </span>
        {hasDiscount && (
          <Badge variant="success" className="absolute left-2 top-2">
            -{formatPct(product.discountPct)}
          </Badge>
        )}
      </div>

      <CardContent className="space-y-2 p-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline">{PLATFORM_LABEL[product.platform]}</Badge>
          <span className={cn("flex items-center gap-1 text-xs", trend.className)}>
            <TrendIcon className="size-3.5" />
            {trend.label}
          </span>
        </div>

        <p className="line-clamp-2 min-h-[2.5rem] text-sm font-medium">
          {product.name}
        </p>

        <div className="flex items-end gap-2">
          <span className="text-lg font-bold">{formatBRL(product.price)}</span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              {formatBRL(product.originalPrice)}
            </span>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Comissão ~{formatBRL(product.estimatedCommission)} (
          {formatPct(product.commissionPct)})
        </p>
      </CardContent>
    </Card>
  );
}
