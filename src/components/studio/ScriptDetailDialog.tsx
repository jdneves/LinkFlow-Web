import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  SCRIPT_DURATION_LABEL,
  SCRIPT_FORMAT_LABEL,
  SCRIPT_PLATFORM_LABEL,
  SCRIPT_TONE_LABEL,
} from "@/lib/studio";
import type { ScriptResponse } from "@/types/api";

interface Props {
  script: ScriptResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScriptDetailDialog({ script, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        {script && (
          <>
            <DialogHeader>
              <DialogTitle className="pr-6">{script.productName}</DialogTitle>
              <DialogDescription asChild>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <Badge variant="secondary">
                    {SCRIPT_PLATFORM_LABEL[script.platform]}
                  </Badge>
                  <Badge variant="outline">
                    {SCRIPT_FORMAT_LABEL[script.format]}
                  </Badge>
                  <Badge variant="outline">
                    {SCRIPT_TONE_LABEL[script.tone]}
                  </Badge>
                  <Badge variant="outline">
                    {SCRIPT_DURATION_LABEL[script.duration]}
                  </Badge>
                </div>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              <ScriptSection title="Gancho">
                <p className="text-sm leading-relaxed">{script.hook}</p>
              </ScriptSection>

              <ScriptSection title="Tópicos">
                <ol className="space-y-1.5">
                  {script.topicos.map((t, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="shrink-0 font-medium text-muted-foreground">
                        {i + 1}.
                      </span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ol>
              </ScriptSection>

              <ScriptSection title="Call to Action">
                <p className="text-sm leading-relaxed">{script.cta}</p>
              </ScriptSection>

              {script.hashtags.length > 0 && (
                <ScriptSection title="Hashtags">
                  <div className="flex flex-wrap gap-1.5">
                    {script.hashtags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="font-normal">
                        #{tag.replace(/^#/, "")}
                      </Badge>
                    ))}
                  </div>
                </ScriptSection>
              )}

              {script.stories && script.stories.length > 0 && (
                <ScriptSection title="Stories">
                  <ol className="space-y-1.5">
                    {script.stories.map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="shrink-0 font-medium text-muted-foreground">
                          {i + 1}.
                        </span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                </ScriptSection>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ScriptSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}
