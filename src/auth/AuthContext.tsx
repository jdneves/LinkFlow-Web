import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api } from "@/lib/api";
import { tokenStorage } from "@/lib/tokenStorage";
import type { AuthResponse, User } from "@/types/api";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hidrata a sessão no boot: se há token, busca /me.
  useEffect(() => {
    if (!tokenStorage.getAccess()) {
      setIsLoading(false);
      return;
    }
    api
      .get<User>("/api/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        tokenStorage.clear();
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Logout forçado disparado pelo interceptor quando o refresh falha.
  useEffect(() => {
    const handler = () => setUser(null);
    window.addEventListener("auth:logout", handler);
    return () => window.removeEventListener("auth:logout", handler);
  }, []);

  const persistSession = (data: AuthResponse) => {
    tokenStorage.set(data.accessToken, data.refreshToken);
    setUser(data.user);
  };

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>("/api/auth/login", {
      email,
      password,
    });
    persistSession(data);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { data } = await api.post<AuthResponse>("/api/auth/register", {
        name,
        email,
        password,
      });
      persistSession(data);
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout"); // invalida o refresh no servidor
    } catch {
      // Mesmo se falhar, limpamos a sessão local.
    } finally {
      tokenStorage.clear();
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
