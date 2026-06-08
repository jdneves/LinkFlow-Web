// ============================================================
// Tipos espelhando os DTOs do backend (linkflow-api).
// Domínios completos (Radar, Estúdio, etc.) entram com cada área.
// ============================================================

// ---- Compartilhados ----
export type Plan = "FREE" | "CREATOR" | "PRO";

/** Wrapper de paginação do Spring Data (Page<T>). */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}

/** Corpo de erro do GlobalExceptionHandler. */
export interface ApiError {
  message: string;
  errors?: Record<string, string>; // erros por campo em validações (400)
}

// ---- Auth ----
export interface User {
  id: string;
  name: string;
  email: string;
  plan: Plan;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// ---- Enums de domínio (referência p/ as próximas áreas) ----
export type Platform = "MERCADO_LIVRE" | "SHOPEE" | "AMAZON";
export type Category =
  | "eletrodomesticos"
  | "eletronicos"
  | "beleza"
  | "fitness"
  | "casa"
  | "games"
  | "moda";
export type ScriptPlatform = "YOUTUBE" | "INSTAGRAM" | "TIKTOK";
export type ScriptFormat =
  | "REVIEW"
  | "UNBOXING"
  | "VALE_A_PENA"
  | "COMPARATIVO"
  | "DICAS_DE_USO";
export type VideoStatus =
  | "PENDING"
  | "GENERATING_AUDIO"
  | "GENERATING_VIDEO"
  | "COMPLETED"
  | "FAILED";
export type Device = "MOBILE" | "DESKTOP" | "TABLET";

// ============================================================
// Analytics — /api/analytics/dashboard
// ============================================================
export interface DashboardTotais {
  totalCliques: number;
  totalLinks: number;
  totalRoteiros: number;
  totalVideos: number;
  cliquesUltimos30Dias: number;
  cliquesUltimos7Dias: number;
}

export interface CliquesPorDia {
  data: string; // ISO "2025-06-01"
  total: number;
}

export type CliquesPorDevice = Partial<Record<Device, number>>;

export interface TopLink {
  id: string;
  slug: string;
  title: string;
  shortUrl: string;
  clicks: number;
  platform: Platform;
}

export interface UsoPlano {
  plano: Plan;
  rotelirosMes: number; // (sic) nome do campo exatamente como o backend envia
  limiteRoteiros: number;
  videosMes: number;
  limiteVideos: number;
  linksAtivos: number;
  limiteLinks: number;
}

export interface AnalyticsDashboard {
  totais: DashboardTotais;
  cliquesPorDia: CliquesPorDia[];
  cliquesPorDevice: CliquesPorDevice;
  topLinks: TopLink[];
  insightSemanal: string;
  usoPlano: UsoPlano;
}

// ============================================================
// Onboarding — /api/onboarding
// ============================================================
export interface OnboardingStep {
  id: string;
  titulo: string;
  descricao: string;
  acao: string; // rota web sugerida (ex.: "/radar")
  concluido: boolean;
  ordem: number;
}

export interface OnboardingResponse {
  progresso: number; // 0–100
  completed: boolean;
  passos: OnboardingStep[];
  proximoPasso: string;
  mensagemMotivacional: string;
}
