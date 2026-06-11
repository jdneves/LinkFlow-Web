import { useState } from "react";
import { AlertCircle, Loader2, Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProductSearch } from "@/hooks/useProductSearch";
import { useGenerateScript } from "@/hooks/useScripts";
import { useDebounce } from "@/hooks/useDebounce";
import { getApiErrorMessage } from "@/lib/errors";
import { PLATFORM_LABEL } from "@/lib/radar";
import {
  SCRIPT_DURATION_LABEL,
  SCRIPT_FORMAT_LABEL,
  SCRIPT_PLATFORM_LABEL,
  SCRIPT_TONE_LABEL,
} from "@/lib/studio";
import type {
  ProductResponse,
  ScriptDuration,
  ScriptFormat,
  ScriptPlatform,
  ScriptTone,
} from "@/types/api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EMPTY = "" as const;

export function GenerateScriptDialog({ open, onOpenChange }: Props) {
  const [productSearch, setProductSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
  const [platform, setPlatform] = useState<ScriptPlatform | typeof EMPTY>(EMPTY);
  const [format, setFormat] = useState<ScriptFormat | typeof EMPTY>(EMPTY);
  const [tone, setTone] = useState<ScriptTone | typeof EMPTY>(EMPTY);
  const [duration, setDuration] = useState<ScriptDuration | typeof EMPTY>(EMPTY);

  const debouncedSearch = useDebounce(productSearch, 400);
  const search = useProductSearch(debouncedSearch);
  const generate = useGenerateScript();

  const canSubmit =
    !!selectedProduct && !!platform && !!format && !!tone && !!duration && !generate.isPending;

  function resetForm() {
    setSelectedProduct(null);
    setProductSearch("");
    setPlatform(EMPTY);
    setFormat(EMPTY);
    setTone(EMPTY);
    setDuration(EMPTY);
    generate.reset();
  }

  function handleOpenChange(open: boolean) {
    if (!open) resetForm();
    onOpenChange(open);
  }

  function handleSubmit() {
    if (!canSubmit) return;
    generate.mutate(
      {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        platform: platform as ScriptPlatform,
        format: format as ScriptFormat,
        tone: tone as ScriptTone,
        duration: duration as ScriptDuration,
      },
      {
        onSuccess: () => {
          handleOpenChange(false);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Gerar roteiro</DialogTitle>
          <DialogDescription>
            Selecione um produto e configure o estilo do roteiro.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Seletor de produto */}
          <div className="space-y-2">
            <Label>Produto</Label>
            {selectedProduct ? (
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{selectedProduct.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {PLATFORM_LABEL[selectedProduct.platform]}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 shrink-0"
                  onClick={() => {
                    setSelectedProduct(null);
                    setProductSearch("");
                  }}
                >
                  <X className="size-4" />
                  Trocar
                </Button>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar produto pelo nome..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {debouncedSearch.length >= 2 && (
                  <div className="max-h-44 overflow-y-auto rounded-md border">
                    {search.isLoading ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                      </div>
                    ) : search.data?.content.length === 0 ? (
                      <p className="py-6 text-center text-sm text-muted-foreground">
                        Nenhum produto encontrado.
                      </p>
                    ) : (
                      search.data?.content.slice(0, 6).map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          className="w-full px-3 py-2.5 text-left hover:bg-muted"
                          onClick={() => {
                            setSelectedProduct(p);
                            setProductSearch("");
                          }}
                        >
                          <p className="truncate text-sm font-medium">{p.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {PLATFORM_LABEL[p.platform]}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Configurações do roteiro */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Plataforma</Label>
              <Select
                value={platform}
                onValueChange={(v) => setPlatform(v as ScriptPlatform)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {(
                    Object.entries(SCRIPT_PLATFORM_LABEL) as [ScriptPlatform, string][]
                  ).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Formato</Label>
              <Select
                value={format}
                onValueChange={(v) => setFormat(v as ScriptFormat)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(SCRIPT_FORMAT_LABEL) as [ScriptFormat, string][]).map(
                    ([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Tom</Label>
              <Select
                value={tone}
                onValueChange={(v) => setTone(v as ScriptTone)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(SCRIPT_TONE_LABEL) as [ScriptTone, string][]).map(
                    ([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Duração</Label>
              <Select
                value={duration}
                onValueChange={(v) => setDuration(v as ScriptDuration)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {(
                    Object.entries(SCRIPT_DURATION_LABEL) as [ScriptDuration, string][]
                  ).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {generate.isPending && (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
              Gerando roteiro com IA... isso pode levar alguns segundos.
            </div>
          )}

          {generate.isError && (
            <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {getApiErrorMessage(generate.error)}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={generate.isPending}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {generate.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Gerando...
              </>
            ) : (
              "Gerar roteiro"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
