import { Home, Search, CalendarDays, User, Plus, Shield } from "lucide-react";
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
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-border bg-background z-40">
      <div className="flex flex-col h-full px-4 py-6">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-black text-2xl tracking-tight italic">BarrioFútbol</span>
        </div>

        <Button className="mb-6 gap-2 font-bold uppercase tracking-wide text-sm h-12" size="default">
          <Plus className="h-5 w-5" />
          Crear Partido
        </Button>

        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-all ${
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
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