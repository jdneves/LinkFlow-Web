import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Flame, RefreshCw, SearchX } from "lucide-react";
import { useProducts, useTrending } from "@/hooks/useProducts";
import { useDebounce } from "@/hooks/useDebounce";
import { getApiErrorMessage } from "@/lib/errors";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadarFilters } from "@/components/radar/RadarFilters";
import { ProductCard } from "@/components/radar/ProductCard";
import { ProductDetailDialog } from "@/components/radar/ProductDetailDialog";
import type { Category, Platform, ProductResponse } from "@/types/api";

export default function Radar() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Fonte da verdade dos filtros = query string da URL.
  const category = (searchParams.get("category") as Category) || undefined;
  const platform = (searchParams.get("platform") as Platform) || undefined;
  const urlSearch = searchParams.get("search") ?? "";
  const page = Number(searchParams.get("page") ?? 0);

  // Input de busca controlado localmente + debounce antes de ir pra URL.
  const [searchInput, setSearchInput] = useState(urlSearch);
  const debouncedSearch = useDebounce(searchInput, 400);

  const patchParams = (mutate: (p: URLSearchParams) => void) => {
    const next = new URLSearchParams(searchParams);
    mutate(next);
    setSearchParams(next, { replace: true });
  };

  // Reflete a busca debounced na URL (resetando a página).
  useEffect(() => {
    if (debouncedSearch === urlSearch) return;
    patchParams((p) => {
      debouncedSearch ? p.set("search", debouncedSearch) : p.delete("search");
      p.delete("page");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const setCategory = (v?: Category) =>
    patchParams((p) => {
      v ? p.set("category", v) : p.delete("category");
      p.delete("page");
    });
  const setPlatform = (v?: Platform) =>
    patchParams((p) => {
      v ? p.set("platform", v) : p.delete("platform");
      p.delete("page");
    });
  const goToPage = (n: number) => patchParams((p) => p.set("page", String(n)));
  const clearAll = () => {
    setSearchInput("");
    setSearchParams({}, { replace: true });
  };

  const filters = {
    category,
    platform,
    search: urlSearch || undefined,
    page,
  };
  const hasFilters = !!category || !!platform || !!urlSearch;

  const products = useProducts(filters);
  const trending = useTrending();

  const [selected, setSelected] = useState<ProductResponse | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Radar</h1>
        <p className="text-sm text-muted-foreground">
          Descubra produtos com potencial de venda.
        </p>
      </div>

      <RadarFilters
        search={searchInput}
        category={category}
        platform={platform}
        onSearchChange={setSearchInput}
        onCategoryChange={setCategory}
        onPlatformChange={setPlatform}
        onClear={clearAll}
      />

      {/* Em alta — só quando não há filtros ativos */}
      {!hasFilters && trending.data && trending.data.length > 0 && (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Flame className="size-4 text-amber-500" />
            Em alta
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {trending.data.slice(0, 6).map((p) => (
              <ProductCard key={p.id} product={p} onClick={() => setSelected(p)} />
            ))}
          </div>
        </section>
      )}

      {/* Lista principal */}
      <section className="space-y-4">
        {products.isLoading ? (
          <ProductGridSkeleton />
        ) : products.isError ? (
          <ErrorState
            message={getApiErrorMessage(products.error)}
            onRetry={() => products.refetch()}
          />
        ) : products.data && products.data.content.length === 0 ? (
          <EmptyState onClear={hasFilters ? clearAll : undefined} />
        ) : products.data ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.data.content.map((p) => (
                <ProductCard key={p.id} product={p} onClick={() => setSelected(p)} />
              ))}
            </div>
            <Pagination
              page={products.data.number}
              totalPages={products.data.totalPages}
              isFetching={products.isFetching}
              onPrev={() => goToPage(page - 1)}
              onNext={() => goToPage(page + 1)}
            />
          </>
        ) : null}
      </section>

      <ProductDetailDialog
        product={selected}
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
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

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-[320px] animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  );
}

function EmptyState({ onClear }: { onClear?: () => void }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <SearchX className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Nenhum produto encontrado com esses filtros.
        </p>
        {onClear && (
          <Button variant="outline" size="sm" onClick={onClear}>
            Limpar filtros
          </Button>
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
