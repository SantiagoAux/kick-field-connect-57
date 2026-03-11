import { Plus } from "lucide-react";
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
  show: { transition: { staggerChildren: 0.05 } },
};

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Hola, Jugador 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">Menos organización. Más fútbol.</p>
        </div>
        <Button className="gap-2 md:hidden" size="sm">
          <Plus className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only">Crear</span>
        </Button>
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
        <SectionHeader title="Equipos" linkTo="/buscar" />
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
