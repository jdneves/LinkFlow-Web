import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Radar as RadarIcon,
  Clapperboard,
  Link2,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/radar", label: "Radar", icon: RadarIcon },
  { to: "/studio", label: "Estúdio", icon: Clapperboard },
  { to: "/links", label: "Links", icon: Link2 },
  { to: "/videos", label: "Vídeos", icon: Video },
];

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r bg-card md:flex md:flex-col">
      <div className="flex h-16 items-center px-6 text-lg font-bold tracking-tight">
        Link<span className="text-muted-foreground">Flow</span>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              )
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
