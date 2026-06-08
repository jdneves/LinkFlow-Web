import { AxiosError } from "axios";
import type { ApiError } from "@/types/api";

/** Extrai a mensagem amigável do backend (já vem em pt-BR) ou um fallback. */
export function getApiErrorMessage(err: unknown): string {
  if (err instanceof AxiosError) {
    const data = err.response?.data as ApiError | undefined;
    if (data?.message) return data.message;
    if (err.response?.status === 500)
      return "Algo deu errado por aqui. Tente de novo em instantes.";
    if (err.code === "ERR_NETWORK")
      return "Sem conexão com o servidor. O serviço pode estar iniciando — aguarde alguns segundos.";
  }
  return "Erro inesperado. Tente novamente.";
}
