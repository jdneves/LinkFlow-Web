import type {
  ScriptDuration,
  ScriptFormat,
  ScriptPlatform,
  ScriptTone,
} from "@/types/api";

export const SCRIPT_PLATFORM_LABEL: Record<ScriptPlatform, string> = {
  YOUTUBE: "YouTube",
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
};

export const SCRIPT_FORMAT_LABEL: Record<ScriptFormat, string> = {
  REVIEW: "Review",
  UNBOXING: "Unboxing",
  VALE_A_PENA: "Vale a Pena?",
  COMPARATIVO: "Comparativo",
  DICAS_DE_USO: "Dicas de Uso",
};

export const SCRIPT_TONE_LABEL: Record<ScriptTone, string> = {
  ENTUSIASMADO: "Entusiasmado",
  EDUCATIVO: "Educativo",
  DESCONTRAIDO: "Descontraído",
  URGENTE: "Urgente",
};

export const SCRIPT_DURATION_LABEL: Record<ScriptDuration, string> = {
  CURTO: "Curto (30-60s)",
  MEDIO: "Médio (1-3 min)",
  LONGO: "Longo (3-10 min)",
};
