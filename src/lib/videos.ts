import type { VideoStatus } from "@/types/api";

export const VIDEO_STATUS_LABEL: Record<VideoStatus, string> = {
  PENDING: "Na fila",
  GENERATING_AUDIO: "Gerando áudio",
  GENERATING_VIDEO: "Gerando vídeo",
  COMPLETED: "Concluído",
  FAILED: "Falhou",
};

export const TERMINAL_STATUSES: VideoStatus[] = ["COMPLETED", "FAILED"];

export function isTerminal(status?: VideoStatus): boolean {
  return !!status && TERMINAL_STATUSES.includes(status);
}

/** Índice do estágio atual (0–3) para exibir a barra de progresso. */
export const STATUS_STEP: Record<VideoStatus, number> = {
  PENDING: 0,
  GENERATING_AUDIO: 1,
  GENERATING_VIDEO: 2,
  COMPLETED: 3,
  FAILED: 3,
};

export const STAGES: VideoStatus[] = [
  "PENDING",
  "GENERATING_AUDIO",
  "GENERATING_VIDEO",
  "COMPLETED",
];
