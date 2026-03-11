import { Home, Search, CalendarDays, User, Plus } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/", icon: Home, label: "Inicio" },
  { path: "/buscar", icon: Search, label: "Buscar" },
  { path: "/mis-partidos", icon: CalendarDays, label: "Mis Partidos" },
  { path: "/perfil", icon: User, label: "Perfil" },
];

const DesktopSidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 border-r border-border bg-background z-40">
      <div className="flex flex-col h-full px-4 py-6">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">⚽</span>
          </div>
          <span className="font-black text-lg tracking-tight italic">BarrioFútbol</span>
        </div>

        <Button className="mb-6 gap-2" size="default">
          <Plus className="h-4 w-4" />
          Crear Partido
        </Button>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`}
              >
                <Icon className="h-4.5 w-4.5" strokeWidth={isActive ? 2.2 : 1.8} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
