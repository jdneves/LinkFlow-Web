import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, Loader2 } from "lucide-react";
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
import { useCreateLink } from "@/hooks/useLinks";
import { getApiErrorMessage } from "@/lib/errors";

const schema = z.object({
  destination: z.string().url("URL de destino inválida"),
  title: z.string().min(1, "Título obrigatório"),
  slug: z.string().optional(),
  campaign: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateLinkDialog({ open, onOpenChange }: Props) {
  const create = useCreateLink();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  function handleOpenChange(o: boolean) {
    if (!o) {
      reset();
      create.reset();
    }
    onOpenChange(o);
  }

  function onSubmit(data: FormData) {
    create.mutate(
      {
        destinationUrl: data.destination,
        title: data.title,
        customSlug: data.slug || undefined,
        campaign: data.campaign || undefined,
      },
      { onSuccess: () => handleOpenChange(false) },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Criar link</DialogTitle>
          <DialogDescription>
            Gere um link rastreável com QR code para o seu produto de afiliado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="destination">URL de destino *</Label>
            <Input
              id="destination"
              placeholder="https://shopee.com.br/produto..."
              {...register("destination")}
            />
            {errors.destination && (
              <p className="text-xs text-destructive">{errors.destination.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              placeholder="Ex: Airfryer Philips — review"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="slug">
                Slug <span className="text-muted-foreground">(opcional)</span>
              </Label>
              <Input
                id="slug"
                placeholder="meu-produto"
                {...register("slug")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="campaign">
                Campanha <span className="text-muted-foreground">(opcional)</span>
              </Label>
              <Input
                id="campaign"
                placeholder="Ex: black-friday"
                {...register("campaign")}
              />
            </div>
          </div>

          {create.isError && (
            <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {getApiErrorMessage(create.error)}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={create.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar link"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
