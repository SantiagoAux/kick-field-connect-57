import { Star, MapPin, Calendar, Shield, Users, Edit, Zap, Trophy, TrendingUp, LogOut, Save } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { getCurrentUser, setCurrentUser, getTeams, getMatches, updateProfile, Profile, Team, Match } from "@/lib/storage";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [myMatches, setMyMatches] = useState<Match[]>([]);

  const [editData, setEditData] = useState({
    name: user?.name || "",
    location: user?.location || "",
    position: user?.position || "",
    foot: user?.foot || "",
    password: user?.password || "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const [teams, matches] = await Promise.all([
        getTeams(),
        getMatches()
      ]);
      setMyTeams(teams.filter(t => t.creatorId === user.id));
      setMyMatches(matches.filter(m => m.confirmedPlayerIds.includes(user.id)));
    };
    fetchData();
  }, [user?.id]);

  if (!user) return null;

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/login");
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateProfile(user.id, editData);
    if (success) {
      setIsEditDialogOpen(false);
      toast({
        title: "Perfil actualizado",
        description: "Tus datos se han guardado correctamente.",
      });
      // Optionally refresh the page or update local state
      window.location.reload();
    } else {
      toast({
        variant: "destructive",
        title: "Error al actualizar",
        description: "No se pudo guardar en el servidor. Revisa tu conexión o asegúrate de que el servidor de datos esté corriendo.",
      });
    }
  };

  const initials = user.name.split(" ").map(n => n[0]).join("").toUpperCase();

  const userStats = [
    { label: "Partidos", value: user.stats.matches.toString(), icon: Trophy },
    { label: "Goles", value: user.stats.goals.toString(), icon: Zap },
    { label: "Asistencias", value: user.stats.assists.toString(), icon: TrendingUp },
    { label: "Rating", value: user.stats.rating.toFixed(1), icon: Star },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 p-6"
      >
        <div className="flex items-start gap-4 relative z-10">
          <Avatar className="h-24 w-24 rounded-xl border-4 border-primary/30 shadow-xl shadow-primary/20">
            <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 text-primary font-black text-3xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-black italic tracking-tight uppercase truncate max-w-[150px] md:max-w-none">{user.name}</h1>
                <div className="flex items-center gap-1.5 mt-1 text-primary">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-bold">{user.location}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1.5 border-primary/40 hover:bg-primary/10">
                      <Edit className="h-3.5 w-3.5" />
                      Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-slate-900/95 backdrop-blur-md border-primary/20">
                    <form onSubmit={handleUpdateProfile}>
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-black italic text-primary uppercase">Editar Perfil</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-name" className="text-right font-bold text-xs uppercase">Nombre</Label>
                          <Input id="edit-name" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-location" className="text-right font-bold text-xs uppercase">Ciudad</Label>
                          <Input id="edit-location" value={editData.location} onChange={(e) => setEditData({ ...editData, location: e.target.value })} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-pos" className="text-right font-bold text-xs uppercase">Posición</Label>
                          <select
                            id="edit-pos"
                            className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={editData.position}
                            onChange={(e) => setEditData({ ...editData, position: e.target.value })}
                          >
                            <option>Portero</option>
                            <option>Defensa</option>
                            <option>Mediocampista</option>
                            <option>Delantero</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-foot" className="text-right font-bold text-xs uppercase">Pie</Label>
                          <select
                            id="edit-foot"
                            className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={editData.foot}
                            onChange={(e) => setEditData({ ...editData, foot: e.target.value })}
                          >
                            <option>Derecho</option>
                            <option>Izquierdo</option>
                            <option>Ambidiestro</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-pass" className="text-right font-bold text-xs uppercase">Clave</Label>
                          <Input id="edit-pass" type="password" value={editData.password} onChange={(e) => setEditData({ ...editData, password: e.target.value })} className="col-span-3" required />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" className="w-full font-black uppercase tracking-widest italic gap-2">
                          <Save className="h-4 w-4" />
                          Guardar Cambios
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">{user.position}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md bg-secondary/80 text-foreground border border-border">Pie {user.foot}</span>
          {user.role === 'admin' && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md bg-primary/20 text-primary border border-primary/30">Administrador</span>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2">
        {userStats.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center rounded-xl bg-card card-shadow p-3 border border-border/50"
          >
            <stat.icon className="h-4 w-4 mx-auto text-primary mb-1" />
            <p className="text-xl font-black tabular-nums text-primary">{stat.value}</p>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <Separator className="bg-border/50" />

      {/* Teams */}
      <section>
        <h2 className="text-base font-black uppercase tracking-wide mb-4 flex items-center gap-2 gradient-text">
          <Shield className="h-5 w-5 text-primary" />
          Mis Equipos
        </h2>
        <div className="space-y-2">
          {myTeams.length > 0 ? (
            myTeams.map((team) => (
              <div key={team.id} className="flex items-center gap-3 p-4 rounded-xl bg-card card-shadow border-l-4 border-l-primary border border-border/50">
                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-black uppercase tracking-wide">{team.name}</span>
                <Users className="h-4 w-4 text-muted-foreground ml-auto" />
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground italic px-2">No has fundado equipos todavía.</p>
          )}
        </div>
      </section>

      <Separator className="bg-border/50" />

      {/* Match History */}
      <section>
        <h2 className="text-base font-black uppercase tracking-wide mb-4 flex items-center gap-2 gradient-text">
          <Calendar className="h-5 w-5 text-primary" />
          Mi Historial de Partidos
        </h2>
        <div className="space-y-2">
          {myMatches.length > 0 ? (
            myMatches.map((match) => (
              <div key={match.id} className="flex items-center justify-between p-4 rounded-xl bg-card card-shadow border border-border/50">
                <div>
                  <p className="text-sm font-bold">{match.teamAName} vs {match.teamBName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">{match.date} - {match.venue}</p>
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-primary">Confirmado</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground italic px-2">No has participado en partidos aún.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;