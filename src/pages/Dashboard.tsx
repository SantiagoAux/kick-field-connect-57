import { Plus, Trophy, Zap, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/SectionHeader";
import MatchCard from "@/components/MatchCard";
import PlayerCard from "@/components/PlayerCard";
import CourtCard from "@/components/CourtCard";
import TeamCard from "@/components/TeamCard";
import { motion } from "framer-motion";

const upcomingMatches = [
  { date: "Hoy", time: "20:00", venue: "Cancha El Pibe", type: "Fútbol 5", playersConfirmed: 8, playersNeeded: 10, teamA: "Los Cracks", teamB: "Barrio FC", price: "$25.000" },
  { date: "Mañana", time: "19:00", venue: "Complejo La 10", type: "Fútbol 7", playersConfirmed: 12, playersNeeded: 14, teamA: "Real Vecinos", teamB: "Deportivo Sur", price: "$30.000" },
  { date: "Sáb 15", time: "16:00", venue: "Arena Gol", type: "Fútbol 11", playersConfirmed: 18, playersNeeded: 22, price: "$40.000" },
];

const availablePlayers = [
  { name: "Carlos Méndez", position: "Delantero", level: 4, rating: 4.3, city: "Santiago Centro", available: true },
  { name: "Andrés Rojas", position: "Mediocampista", level: 3, rating: 3.8, city: "Ñuñoa", available: true },
  { name: "Felipe Torres", position: "Defensa", level: 5, rating: 4.7, city: "Providencia", available: false },
  { name: "Miguel Soto", position: "Portero", level: 4, rating: 4.1, city: "Las Condes", available: true },
];

const courts = [
  { name: "Cancha El Pibe", address: "Av. Grecia 1234", type: "Fútbol 5", price: "$25.000/hr", nextAvailable: "Hoy 21:00" },
  { name: "Complejo La 10", address: "Los Leones 567", type: "Fútbol 7", price: "$35.000/hr", nextAvailable: "Mañana 18:00" },
];

const teams = [
  { name: "Los Cracks FC", city: "Santiago", playerCount: 15, captain: "Juan Pérez" },
  { name: "Barrio FC", city: "Ñuñoa", playerCount: 12, captain: "Diego Muñoz" },
  { name: "Real Vecinos", city: "Providencia", playerCount: 18, captain: "Pablo Silva" },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const Dashboard = () => {
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
            <span className="text-label text-primary">Vamos a jugar</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black italic tracking-tight">
            LA CANCHA<span className="text-primary"> ES NUESTRA</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-md">
            Conecta con jugadores de tu barrio, arma equipos y domina la cancha. 
            Menos charla, más fútbol.
          </p>
          <div className="flex gap-3 mt-5">
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wide">
              <Plus className="h-4 w-4" />
              Crear Partido
            </Button>
            <Button variant="outline" className="gap-2 border-primary/30 hover:bg-primary/10">
              <Zap className="h-4 w-4" />
              Buscar Cancha
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Partidos", value: "12", sub: "este mes" },
          { label: "Jugadores", value: "156", sub: "activos" },
          { label: "Canchas", value: "8", sub: "disponibles" },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="text-center p-4 rounded-xl bg-card card-shadow"
          >
            <p className="text-2xl font-black text-primary">{stat.value}</p>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{stat.label}</p>
            <p className="text-[10px] text-muted-foreground/60">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Matches */}
      <section>
        <SectionHeader title="Próximos Partidos" linkTo="/mis-partidos" />
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
          {upcomingMatches.map((match, i) => (
            <MatchCard key={i} {...match} />
          ))}
        </motion.div>
      </section>

      {/* Available Players */}
      <section>
        <SectionHeader title="Jugadores Disponibles" linkTo="/buscar" />
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
          {availablePlayers.map((player, i) => (
            <PlayerCard key={i} {...player} />
          ))}
        </motion.div>
      </section>

      {/* Courts */}
      <section>
        <SectionHeader title="Canchas Cercanas" linkTo="/buscar" linkText="Ver mapa" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {courts.map((court, i) => (
            <CourtCard key={i} {...court} />
          ))}
        </div>
      </section>

      {/* Teams */}
      <section>
        <SectionHeader title="Equipos del Barrio" linkTo="/buscar" />
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
          {teams.map((team, i) => (
            <TeamCard key={i} {...team} />
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default Dashboard;