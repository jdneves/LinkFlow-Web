import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORIES,
  CATEGORY_LABEL,
  PLATFORMS,
  PLATFORM_LABEL,
} from "@/lib/radar";
import type { Category, Platform } from "@/types/api";

// Valor sentinela para "todos" (o Select do Radix não aceita value="").
const ALL = "__all__";

interface RadarFiltersProps {
  search: string;
  category?: Category;
  platform?: Platform;
  onSearchChange: (v: string) => void;
  onCategoryChange: (v?: Category) => void;
  onPlatformChange: (v?: Platform) => void;
  onClear: () => void;
}

export function RadarFilters({
  search,
  category,
  platform,
  onSearchChange,
  onCategoryChange,
  onPlatformChange,
  onClear,
}: RadarFiltersProps) {
  const hasFilters = !!search || !!category || !!platform;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar produtos…"
          className="pl-9"
        />
      </div>

      <Select
        value={category ?? ALL}
        onValueChange={(v) =>
          onCategoryChange(v === ALL ? undefined : (v as Category))
        }
      >
        <SelectTrigger className="sm:w-48">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Todas as categorias</SelectItem>
          {CATEGORIES.map((c) => (
            <SelectItem key={c} value={c}>
              {CATEGORY_LABEL[c]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={platform ?? ALL}
        onValueChange={(v) =>
          onPlatformChange(v === ALL ? undefined : (v as Platform))
        }
      >
        <SelectTrigger className="sm:w-44">
          <SelectValue placeholder="Plataforma" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Todas as plataformas</SelectItem>
          {PLATFORMS.map((p) => (
            <SelectItem key={p} value={p}>
              {PLATFORM_LABEL[p]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="size-4" />
          Limpar
        </Button>
      )}
    </div>
  );
}
