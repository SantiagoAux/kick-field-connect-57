import { Star, MapPin, Calendar, Shield, Users, Edit, Zap, Trophy, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

const stats = [
  { label: "Partidos", value: "47", icon: Trophy },
  { label: "Goles", value: "23", icon: Zap },
  { label: "Asistencias", value: "15", icon: TrendingUp },
  { label: "Rating", value: "4.3", icon: Star },
];

const ratings = [
  { label: "Nivel de juego", value: 4.2 },
  { label: "Trabajo en equipo", value: 4.5 },
  { label: "Puntualidad", value: 4.8 },
  { label: "Fair Play", value: 4.6 },
];

const ProfilePage = () => {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 p-6"
      >
        <div className="flex items-start gap-4 relative z-10">
          <Avatar className="h-24 w-24 rounded-xl border-4 border-primary/30 shadow-xl shadow-primary/20">
            <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 text-primary font-black text-3xl">JP</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-black italic tracking-tight uppercase">Juan Pérez</h1>
                <div className="flex items-center gap-1.5 mt-1 text-primary">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-bold">Santiago Centro</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 border-primary/40 hover:bg-primary/10">
                <Edit className="h-3.5 w-3.5" />
                Editar
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Mediocampista</span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md bg-secondary/80 text-foreground border border-border">Pie derecho</span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md bg-primary/20 text-primary border border-primary/30">Nivel 4</span>
        </div>
      </motion.div>

      <p className="text-sm text-muted-foreground px-1">
        Mediocampista creativo con buena visión de juego. Prefiero jugar por la banda derecha. Disponible fines de semana y miércoles.
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2">
        {stats.map((stat) => (
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

      {/* Ratings */}
      <section>
        <h2 className="text-base font-black uppercase tracking-wide mb-4 flex items-center gap-2 gradient-text">
          <Star className="h-5 w-5 text-primary" />
          Calificaciones
        </h2>
        <div className="space-y-3 bg-card rounded-xl p-4 card-shadow border border-border/50">
          {ratings.map((r) => (
            <div key={r.label} className="flex items-center justify-between">
              <span className="text-sm font-medium">{r.label}</span>
              <div className="flex items-center gap-3">
                <div className="w-28 h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(r.value / 5) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
                  />
                </div>
                <span className="text-sm font-black tabular-nums text-primary w-8 text-right">{r.value}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator className="bg-border/50" />

      {/* Teams */}
      <section>
        <h2 className="text-base font-black uppercase tracking-wide mb-4 flex items-center gap-2 gradient-text">
          <Shield className="h-5 w-5 text-primary" />
          Mis Equipos
        </h2>
        <div className="space-y-2">
          {["Los Cracks FC", "Real Vecinos"].map((team) => (
            <div key={team} className="flex items-center gap-3 p-4 rounded-xl bg-card card-shadow border-l-4 border-l-primary border border-border/50">
              <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-black uppercase tracking-wide">{team}</span>
              <Users className="h-4 w-4 text-muted-foreground ml-auto" />
            </div>
          ))}
        </div>
      </section>

      <Separator className="bg-border/50" />

      {/* Match History */}
      <section>
        <h2 className="text-base font-black uppercase tracking-wide mb-4 flex items-center gap-2 gradient-text">
          <Calendar className="h-5 w-5 text-primary" />
          Últimos Partidos
        </h2>
        <div className="space-y-2">
          {[
            { date: "Lun 10 Mar", teams: "Los Cracks vs Real Vecinos", result: "3-2", won: true },
            { date: "Sáb 8 Mar", teams: "Barrio FC vs Los Cracks", result: "1-1", won: false },
            { date: "Mié 5 Mar", teams: "Los Cracks vs Deportivo Sur", result: "4-0", won: true },
          ].map((match, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-card card-shadow border border-border/50">
              <div>
                <p className="text-sm font-bold">{match.teams}</p>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">{match.date}</p>
              </div>
              <span className={`text-lg font-black tabular-nums ${match.won ? 'text-primary' : 'text-muted-foreground'}`}>
                {match.result}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;