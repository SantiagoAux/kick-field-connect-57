import { useState, useEffect } from "react";
import { Plus, Trophy, Zap, Flame, Clock, MapPin, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/SectionHeader";
import MatchCard from "@/components/MatchCard";
import TeamCard from "@/components/TeamCard";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { getMatches, saveMatch, getTeams, saveTeam, getCurrentUser, getProfiles, Match, Team, Profile, generateId } from "@/lib/storage";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const Dashboard = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isMatchDialogOpen, setIsMatchDialogOpen] = useState(false);
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
  const { toast } = useToast();
  const user = getCurrentUser();

  const [newMatch, setNewMatch] = useState({
    venue: "",
    time: "20:00",
    date: new Date().toISOString().split('T')[0],
    type: "Fútbol 5",
    playersNeeded: 10,
    price: "$25.000",
    teamAName: "Por confirmar",
    teamBName: "Por confirmar",
  });

  const [newTeam, setNewTeam] = useState({
    name: "",
    city: "Pasto",
    logoUrl: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      const [fetchedMatches, fetchedTeams, fetchedProfiles] = await Promise.all([
        getMatches(),
        getTeams(),
        getProfiles()
      ]);
      setMatches(fetchedMatches);
      setTeams(fetchedTeams);
      setProfiles(fetchedProfiles);
    };
    fetchData();
  }, []);

  // Filter and sort matches
  const upcomingMatches = matches
    .filter(m => m.status !== 'finished')
    .sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });

  const pastMatches = matches
    .filter(m => m.status === 'finished')
    .sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.time.localeCompare(a.time);
    });

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const teamA = teams.find(t => t.name === newMatch.teamAName);
    const teamB = teams.find(t => t.name === newMatch.teamBName);

    const match: Match = {
      id: generateId(),
      ...newMatch,
      teamALogoUrl: teamA?.logoUrl,
      teamBLogoUrl: teamB?.logoUrl,
      confirmedPlayerIds: [user.id],
      teamAPlayerIds: [],
      teamBPlayerIds: [],
      creatorId: user.id,
      status: 'scheduled'
    };
    const success = await saveMatch(match);
    if (success) {
      setMatches([match, ...matches]);
      setIsMatchDialogOpen(false);
      toast({
        title: " ¡Partido creado!",
        description: `Te esperamos el ${newMatch.date} a las ${newMatch.time}.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error al crear partido",
        description: "No se pudo conectar con el servidor de datos.",
      });
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const team: Team = {
      id: generateId(),
      ...newTeam,
      playerCount: 1,
      captain: user.name,
      creatorId: user.id
    };
    const success = await saveTeam(team);
    if (success) {
      setTeams([team, ...teams]);
      setIsTeamDialogOpen(false);
      toast({
        title: "Equipo fundado",
        description: `¡Éxito con ${newTeam.name}!`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error al crear equipo",
        description: "No se pudo conectar con el servidor de datos.",
      });
    }
  };

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 p-6"
      >
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Trophy className="h-24 w-24 text-primary" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-5 w-5 text-primary" />
            <span className="text-label text-primary">Bienvenido, {user?.name || 'Jugador'}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black italic tracking-tight">
            LA CANCHA<span className="text-primary"> ES NUESTRA</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-md">
            Conecta con jugadores de tu barrio, arma equipos y domina la cancha.
          </p>
          <div className="flex gap-3 mt-5">
            <Dialog open={isMatchDialogOpen} onOpenChange={setIsMatchDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wide">
                  <Plus className="h-4 w-4" />
                  Crear Partido
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-slate-900/95 backdrop-blur-md border-primary/20 max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleCreateMatch}>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black italic text-primary">ORGANIZAR PARTIDO</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="venue" className="text-right font-bold text-xs uppercase">Cancha</Label>
                      <Input
                        id="venue"
                        placeholder="Ej: Cancha El Pibe"
                        className="col-span-3"
                        value={newMatch.venue}
                        onChange={(e) => setNewMatch({ ...newMatch, venue: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date" className="text-right font-bold text-xs uppercase">Fecha</Label>
                      <Input
                        id="date"
                        type="date"
                        className="col-span-3"
                        value={newMatch.date}
                        onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="time" className="text-right font-bold text-xs uppercase">Hora</Label>
                      <Input
                        id="time"
                        type="time"
                        className="col-span-3"
                        value={newMatch.time}
                        onChange={(e) => setNewMatch({ ...newMatch, time: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="teamA" className="text-right font-bold text-xs uppercase">Local</Label>
                      <select
                        id="teamA"
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newMatch.teamAName}
                        onChange={(e) => setNewMatch({ ...newMatch, teamAName: e.target.value })}
                      >
                        <option>Por confirmar</option>
                        {teams.map(t => <option key={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="teamB" className="text-right font-bold text-xs uppercase">Visita</Label>
                      <select
                        id="teamB"
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newMatch.teamBName}
                        onChange={(e) => setNewMatch({ ...newMatch, teamBName: e.target.value })}
                      >
                        <option>Por confirmar</option>
                        {teams.map(t => <option key={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full font-black uppercase tracking-widest italic">Pitar Inicio</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-primary/30 hover:bg-primary/10">
                  <Shield className="h-4 w-4" />
                  Crear Equipo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-slate-900/95 backdrop-blur-md border-primary/20">
                <form onSubmit={handleCreateTeam}>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black italic text-primary">FUNDAR EQUIPO</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="teamName" className="text-right font-bold text-xs uppercase">Nombre</Label>
                      <Input
                        id="teamName"
                        placeholder="Ej: Los Relámpagos"
                        className="col-span-3"
                        value={newTeam.name}
                        onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="teamCity" className="text-right font-bold text-xs uppercase">Ciudad</Label>
                      <Input
                        id="teamCity"
                        placeholder="Ej: Pasto"
                        className="col-span-3"
                        value={newTeam.city}
                        onChange={(e) => setNewTeam({ ...newTeam, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="teamLogo" className="text-right font-bold text-xs uppercase">Escudo (URL)</Label>
                      <Input
                        id="teamLogo"
                        placeholder="https://..."
                        className="col-span-3"
                        value={newTeam.logoUrl}
                        onChange={(e) => setNewTeam({ ...newTeam, logoUrl: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full font-black uppercase tracking-widest italic">Inscribir Equipo</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Partidos", value: matches.length.toString(), sub: "organizados" },
          { label: "Jugadores", value: profiles.length.toString(), sub: "registrados" },
          { label: "Equipos", value: teams.length.toString(), sub: "fundados" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="text-center p-4 rounded-xl bg-card card-shadow border border-primary/10"
          >
            <p className="text-2xl font-black text-primary">{stat.value}</p>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{stat.label}</p>
            <p className="text-[10px] text-muted-foreground/60">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Matches Sections */}
      <div className="space-y-12">
        {/* Upcoming Matches */}
        <section>
          <SectionHeader title="Próximos Partidos" linkTo="/mis-partidos" />
          {upcomingMatches.length > 0 ? (
            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
              {upcomingMatches.map((match) => (
                <MatchCard key={match.id} {...match} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center p-8 border-2 border-dashed border-primary/20 rounded-xl bg-primary/5">
              <p className="text-sm font-bold text-primary/60 uppercase">No hay partidos próximos.</p>
              <Button variant="link" onClick={() => setIsMatchDialogOpen(true)} className="text-primary font-black mt-2">¡Organiza uno!</Button>
            </div>
          )}
        </section>

        {/* Finished Matches */}
        {pastMatches.length > 0 && (
          <section>
            <SectionHeader title="Resultados Recientes" linkTo="/mis-partidos" />
            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3 opacity-80">
              {pastMatches.map((match) => (
                <MatchCard key={match.id} {...match} />
              ))}
            </motion.div>
          </section>
        )}
      </div>

      {/* Teams */}
      <section>
        <SectionHeader title="Equipos del Barrio" linkTo="/buscar" />
        {teams.length > 0 ? (
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
            {teams.map((team) => (
              <TeamCard key={team.id} {...team} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center p-8 border-2 border-dashed border-primary/20 rounded-xl bg-primary/5">
            <p className="text-sm font-bold text-primary/60 uppercase">No hay equipos registrados todavía.</p>
            <Button variant="link" onClick={() => setIsTeamDialogOpen(true)} className="text-primary font-black mt-2">¡Funda tu equipo!</Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
