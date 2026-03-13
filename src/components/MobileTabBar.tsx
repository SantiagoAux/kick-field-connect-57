import { Home, Search, CalendarDays, User, Bell } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { getCurrentUser, getNotifications } from "@/lib/storage";
import { useEffect, useState } from "react";

const tabs = [
  { path: "/", icon: Home, label: "Inicio" },
  { path: "/buscar", icon: Search, label: "Buscar" },
  { path: "/mis-partidos", icon: CalendarDays, label: "Partidos" },
  { path: "/notificaciones", icon: Bell, label: "Alertas", isNotification: true },
  { path: "/perfil", icon: User, label: "Perfil" },
];

const MobileTabBar = () => {
  const location = useLocation();
  const user = getCurrentUser();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      if (user) {
        const notes = await getNotifications(user.id);
        setUnreadCount(notes.filter(n => n.status === 'unread').length);
      }
    };
    fetchUnread();
  }, [user?.id, location.pathname]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ path, icon: Icon, label, isNotification }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all relative ${isActive ? "text-primary bg-primary/10" : "text-muted-foreground"
                }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                {isNotification && unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] text-primary-foreground font-black border border-background">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileTabBar;