import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";
import type { Category, Platform, Trend } from "@/types/api";

export const PLATFORM_LABEL: Record<Platform, string> = {
  MERCADO_LIVRE: "Mercado Livre",
  SHOPEE: "Shopee",
  AMAZON: "Amazon",
};

export const CATEGORY_LABEL: Record<Category, string> = {
  eletrodomesticos: "Eletrodomésticos",
  eletronicos: "Eletrônicos",
  beleza: "Beleza",
  fitness: "Fitness",
  casa: "Casa",
  games: "Games",
  moda: "Moda",
};

export const PLATFORMS: Platform[] = ["MERCADO_LIVRE", "SHOPEE", "AMAZON"];
export const CATEGORIES: Category[] = [
  "eletrodomesticos",
  "eletronicos",
  "beleza",
  "fitness",
  "casa",
  "games",
  "moda",
];

interface TrendMeta {
  label: string;
  icon: LucideIcon;
  className: string;
}
const TREND_FALLBACK: TrendMeta = {
  label: "—",
  icon: Minus,
  className: "text-muted-foreground",
};
const TREND_MAP: Record<Trend, TrendMeta> = {
  RISING: { label: "Em alta", icon: TrendingUp, className: "text-emerald-600" },
  STABLE: { label: "Estável", icon: Minus, className: "text-muted-foreground" },
  FALLING: { label: "Em queda", icon: TrendingDown, className: "text-destructive" },
};
export const trendMeta = (trend: Trend): TrendMeta =>
  TREND_MAP[trend] ?? TREND_FALLBACK;

/** Cor do score por faixa (0–100). */
export const scoreClasses = (score: number): string => {
  if (score >= 80) return "bg-emerald-100 text-emerald-700";
  if (score >= 60) return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-600";
};
