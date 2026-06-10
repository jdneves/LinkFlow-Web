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
export type ScriptTone = "ENTUSIASMADO" | "EDUCATIVO" | "DESCONTRAIDO" | "URGENTE";
export type ScriptDuration = "CURTO" | "MEDIO" | "LONGO";
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

// ============================================================
// Radar — /api/radar
// ============================================================
export type Trend = "RISING" | "STABLE" | "FALLING";

export interface ScoreDetail {
  commission: string;  // ex.: "Alta"
  competition: string; // ex.: "Baixa"
  demand: string;      // ex.: "Crescente"
}

export interface ProductResponse {
  id: string;
  externalId: string;
  platform: Platform;
  name: string;
  price: number;
  originalPrice: number;
  discountPct: number;
  commissionPct: number;
  estimatedCommission: number;
  imageUrl: string;
  productUrl: string;
  category: Category;
  score: number; // 0–100
  trend: Trend;
  scoreDetail: ScoreDetail;
}

export interface CategoriasResponse {
  categorias: Category[];
}

/** Filtros da listagem do Radar (viram query params). */
export interface RadarFilters {
  category?: Category;
  platform?: Platform;
  search?: string;
  page?: number;
}

// ============================================================
// Estúdio — /api/studio
// ============================================================
export interface ScriptGenerateRequest {
  productId: string;
  platform: ScriptPlatform;
  format: ScriptFormat;
  tone: ScriptTone;
  duration: ScriptDuration;
}

export interface ScriptResponse {
  id: string;
  productId: string;
  productName: string;
  platform: ScriptPlatform;
  format: ScriptFormat;
  tone: ScriptTone;
  duration: ScriptDuration;
  hook: string;
  topicos: string[];
  cta: string;
  hashtags: string[];
  stories?: string[];
  criadoEm: string;
}

/** Filtros da listagem do Estúdio (viram query params). */
export interface ScriptFilters {
  platform?: ScriptPlatform;
  format?: ScriptFormat;
  page?: number;
}

// ============================================================
// Links — /api/links
// ============================================================
export interface LinkResponse {
  id: string;
  slug: string;
  title: string;
  destination: string;
  shortUrl: string;
  qrCodeUrl: string;
  clicks: number;
  platform: Platform;
  campaign?: string;
  active: boolean;
  criadoEm: string;
}

export interface LinkCreateRequest {
  destination: string;
  title: string;
  slug?: string;
  campaign?: string;
}

export interface LinkFilters {
  page?: number;
}
