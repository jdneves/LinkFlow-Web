import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SCRIPT_FORMAT_LABEL,
  SCRIPT_PLATFORM_LABEL,
} from "@/lib/studio";
import type { ScriptFormat, ScriptPlatform } from "@/types/api";

const ALL = "__all__";

interface Props {
  platform?: ScriptPlatform;
  format?: ScriptFormat;
  onPlatformChange: (v?: ScriptPlatform) => void;
  onFormatChange: (v?: ScriptFormat) => void;
  onClear: () => void;
}

export function StudioFilters({
  platform,
  format,
  onPlatformChange,
  onFormatChange,
  onClear,
}: Props) {
  const hasFilters = !!platform || !!format;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={platform ?? ALL}
        onValueChange={(v) =>
          onPlatformChange(v === ALL ? undefined : (v as ScriptPlatform))
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Plataforma" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Todas</SelectItem>
          {(Object.entries(SCRIPT_PLATFORM_LABEL) as [ScriptPlatform, string][]).map(
            ([k, v]) => (
              <SelectItem key={k} value={k}>
                {v}
              </SelectItem>
            ),
          )}
        </SelectContent>
      </Select>

      <Select
        value={format ?? ALL}
        onValueChange={(v) =>
          onFormatChange(v === ALL ? undefined : (v as ScriptFormat))
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Formato" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Todos</SelectItem>
          {(Object.entries(SCRIPT_FORMAT_LABEL) as [ScriptFormat, string][]).map(
            ([k, v]) => (
              <SelectItem key={k} value={k}>
                {v}
              </SelectItem>
            ),
          )}
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
