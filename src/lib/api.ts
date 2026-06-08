import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "./tokenStorage";
import type { AuthResponse } from "@/types/api";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Cliente "cru" SÓ pro refresh — sem interceptors, pra não cair em loop de 401.
const refreshClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// --- Request: injeta o access token ---
api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Controle de refresh concorrente ---
let isRefreshing = false;
let queue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

function flushQueue(error: unknown, token: string | null) {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  queue = [];
}

/** Limpa a sessão e avisa o AuthContext (que redireciona pra /login). */
function forceLogout() {
  tokenStorage.clear();
  window.dispatchEvent(new Event("auth:logout"));
}

// --- Response: trata 401 com refresh único + fila ---
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const status = error.response?.status;

    // Não tenta refresh se: não é 401, já tentou, ou é a própria rota de auth.
    const isAuthRoute = original?.url?.includes("/api/auth/");
    if (status !== 401 || original?._retry || isAuthRoute) {
      return Promise.reject(error);
    }

    const refreshToken = tokenStorage.getRefresh();
    if (!refreshToken) {
      forceLogout();
      return Promise.reject(error);
    }

    original._retry = true;

    // Já existe um refresh rolando: enfileira e espera o novo token.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          },
          reject,
        });
      });
    }

    isRefreshing = true;
    try {
      const { data } = await refreshClient.post<AuthResponse>(
        "/api/auth/refresh",
        { refreshToken },
      );
      // Refresh é de uso único: SEMPRE substituir o par inteiro.
      tokenStorage.set(data.accessToken, data.refreshToken);
      flushQueue(null, data.accessToken);
      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(original);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
