import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/auth/ProtectedRoute";
import { Layout } from "@/components/Layout";

const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Radar = lazy(() => import("@/pages/Radar"));
const Studio = lazy(() => import("@/pages/Studio"));
const Links = lazy(() => import("@/pages/Links"));
const Videos = lazy(() => import("@/pages/Videos"));

function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center text-muted-foreground">
      Carregando…
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protegidas (dentro do shell do app) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/radar" element={<Radar />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/links" element={<Links />} />
            <Route path="/videos" element={<Videos />} />
          </Route>
        </Route>

        {/* Fallbacks */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
