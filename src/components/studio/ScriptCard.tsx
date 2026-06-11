import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  SCRIPT_FORMAT_LABEL,
  SCRIPT_PLATFORM_LABEL,
  SCRIPT_TONE_LABEL,
} from "@/lib/studio";
import type { ScriptResponse } from "@/types/api";

interface Props {
  script: ScriptResponse;
  onClick: () => void;
}

export function ScriptCard({ script, onClick }: Props) {
  const date = new Date(script.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });

  return (
    <Card className="cursor-pointer transition-shadow hover:shadow-md" onClick={onClick}>
      <CardContent className="space-y-3 p-4">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary">
            {SCRIPT_PLATFORM_LABEL[script.platform]}
          </Badge>
          <Badge variant="outline">
            {SCRIPT_FORMAT_LABEL[script.format]}
          </Badge>
        </div>

        <p className="line-clamp-1 text-sm font-medium">{script.productName}</p>

        <p className="line-clamp-3 text-sm text-muted-foreground">{script.hook}</p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {SCRIPT_TONE_LABEL[script.tone]}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="size-3" />
            {date}
          </span>
        </div>

        <Button variant="outline" size="sm" className="w-full" onClick={onClick}>
          Ver roteiro
        </Button>
      </CardContent>
    </Card>
  );
}
