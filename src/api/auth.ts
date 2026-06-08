import { api } from "@/lib/api";
import type { AuthResponse, User } from "@/types/api";

export const authApi = {
  me: () => api.get<User>("/api/auth/me").then((r) => r.data),
  login: (email: string, password: string) =>
    api
      .post<AuthResponse>("/api/auth/login", { email, password })
      .then((r) => r.data),
  register: (name: string, email: string, password: string) =>
    api
      .post<AuthResponse>("/api/auth/register", { name, email, password })
      .then((r) => r.data),
  logout: () => api.post("/api/auth/logout").then((r) => r.data),
};
