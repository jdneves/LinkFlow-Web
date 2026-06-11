import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [showColdStart, setShowColdStart] = useState(false);

  useEffect(() => {
    if (!isLoading) return;
    const t = setTimeout(() => setShowColdStart(true), 4000);
    return () => clearTimeout(t);
  }, [isLoading]);

  // Evita "piscar" o /login enquanto hidrata a sessão (/me).
  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2 text-muted-foreground">
        <span>Carregando…</span>
        {showColdStart && (
          <p className="max-w-xs text-center text-xs text-muted-foreground/60">
            O servidor está acordando — isso pode levar alguns segundos no primeiro acesso.
          </p>
        )}
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
