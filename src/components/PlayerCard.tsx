import { Star, Zap, MapPin, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getCurrentUser, addNotification, getTeams, Team } from "@/lib/storage";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import PublicProfileDialog from "./PublicProfileDialog";
import { getProfileById, Profile } from "@/lib/storage";

interface PlayerCardProps {
  id: string; // Added id to props
  name: string;
  position: string;
  level: number;
  rating: number;
  city: string;
  available?: boolean;
}

const positionStyles: Record<string, string> = {
  Portero: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Defensa: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Mediocampista: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Delantero: "bg-red-500/20 text-red-400 border-red-500/30",
};

const PlayerCard = ({ id, name, position, level, rating, city, available }: PlayerCardProps) => {
  const currentUser = getCurrentUser();
  const { toast } = useToast();
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      if (currentUser) {
        const teams = await getTeams();
        setMyTeams(teams.filter(t => t.creatorId === currentUser.id));
      }
    };
    fetchTeams();
  }, [currentUser?.id]);

  const handleViewProfile = async () => {
    const data = await getProfileById(id);
    setProfileData(data);
    setIsProfileOpen(true);
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const handleInviteToTeam = async (teamId: string, teamName: string) => {
    if (!currentUser) return;
    await addNotification({
      type: 'team_invite',
      fromId: currentUser.id,
      fromName: currentUser.name,
      toId: id,
      data: {
        teamId: teamId,
        message: `Te invito a unirte a mi equipo: ${teamName}`
      }
    });
    toast({
      title: "Invitación enviada",
      description: `Has invitado a ${name} al equipo ${teamName}.`
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-card card-shadow transition-card hover:card-shadow-hover p-4 flex items-center gap-4 border border-border/50"
    >
      {/* Rest of the component remains the same */}
      <div className="relative">
        <Avatar className="h-14 w-14 rounded-xl border-2 border-primary/30">
          <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 text-primary font-black text-lg">
            {initials}
          </AvatarFallback>
        </Avatar>
        {available && (
          <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-primary border-2 border-card shadow-lg shadow-primary/30" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-black text-sm truncate uppercase tracking-wide">{name}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${positionStyles[position] || "bg-secondary text-secondary-foreground border-border"}`}>
            {position}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {city}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 bg-amber-400/10 px-2 py-0.5 rounded">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <span className="text-sm font-black tabular-nums text-primary">{rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-2.5 w-2.5 text-primary" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase">NIVEL {level}</span>
            </div>
          </div>

          {currentUser && currentUser.id !== id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-primary hover:bg-primary/10">
                  <UserPlus className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-slate-900/95 backdrop-blur-md border-primary/20">
                <DropdownMenuLabel className="text-xs font-black uppercase">Invitar a Equipo</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {myTeams.length > 0 ? (
                  myTeams.map(t => (
                    <DropdownMenuItem key={t.id} onClick={() => handleInviteToTeam(t.id, t.name)} className="font-bold text-xs uppercase cursor-pointer">
                      {t.name}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled className="text-xs italic">No tienes equipos fundados</DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-black uppercase">Otras Acciones</DropdownMenuLabel>
                <DropdownMenuItem onClick={handleViewProfile} className="text-xs uppercase font-bold text-muted-foreground cursor-pointer">Ver Perfil Completo</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {currentUser && currentUser.id === id && (
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" onClick={() => (window as any).location.href = '/perfil'}>
              <Star className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      <PublicProfileDialog profile={profileData} isOpen={isProfileOpen} onOpenChange={setIsProfileOpen} />
    </motion.div>
  );
};

export default PlayerCard;