import { Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/useAuth";

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b px-6">
          <span className="text-sm text-muted-foreground">
            {user ? `Olá, ${user.name}` : ""}
          </span>
          <div className="flex items-center gap-3">
            {user && (
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                {user.plan}
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={() => logout()}>
              <LogOut className="size-4" />
              Sair
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
