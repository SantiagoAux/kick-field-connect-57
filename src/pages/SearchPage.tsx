import { useState } from "react";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlayerCard from "@/components/PlayerCard";
import CourtCard from "@/components/CourtCard";
import TeamCard from "@/components/TeamCard";
import { motion } from "framer-motion";

const players = [
  { name: "Carlos Méndez", position: "Delantero", level: 4, rating: 4.3, city: "Santiago Centro", available: true },
  { name: "Andrés Rojas", position: "Mediocampista", level: 3, rating: 3.8, city: "Ñuñoa", available: true },
  { name: "Felipe Torres", position: "Defensa", level: 5, rating: 4.7, city: "Providencia", available: false },
  { name: "Miguel Soto", position: "Portero", level: 4, rating: 4.1, city: "Las Condes", available: true },
  { name: "Rodrigo Vega", position: "Mediocampista", level: 3, rating: 3.5, city: "Maipú", available: true },
  { name: "Sebastián Díaz", position: "Delantero", level: 5, rating: 4.9, city: "Santiago Centro", available: false },
];

const courts = [
  { name: "Cancha El Pibe", address: "Av. Grecia 1234", type: "Fútbol 5", price: "$25.000/hr", nextAvailable: "Hoy 21:00" },
  { name: "Complejo La 10", address: "Los Leones 567", type: "Fútbol 7", price: "$35.000/hr", nextAvailable: "Mañana 18:00" },
  { name: "Arena Gol", address: "Irarrázaval 890", type: "Fútbol 11", price: "$50.000/hr", nextAvailable: "Sáb 10:00" },
  { name: "Centro Deportivo Norte", address: "Av. Independencia 2345", type: "Fútbol 5", price: "$20.000/hr", nextAvailable: "Hoy 22:00" },
];

const teams = [
  { name: "Los Cracks FC", city: "Santiago", playerCount: 15, captain: "Juan Pérez" },
  { name: "Barrio FC", city: "Ñuñoa", playerCount: 12, captain: "Diego Muñoz" },
  { name: "Real Vecinos", city: "Providencia", playerCount: 18, captain: "Pablo Silva" },
  { name: "Deportivo Sur", city: "San Miguel", playerCount: 14, captain: "Mario López" },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const SearchPage = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Buscar</h1>
        <p className="text-sm text-muted-foreground mt-1">Jugadores, equipos y canchas</p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, ciudad, posición..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 bg-secondary border-0"
          />
        </div>
        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="jugadores" className="w-full">
        <TabsList className="w-full bg-secondary">
          <TabsTrigger value="jugadores" className="flex-1">Jugadores</TabsTrigger>
          <TabsTrigger value="equipos" className="flex-1">Equipos</TabsTrigger>
          <TabsTrigger value="canchas" className="flex-1">Canchas</TabsTrigger>
        </TabsList>

        <TabsContent value="jugadores" className="mt-4">
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
            {players.map((p, i) => (
              <PlayerCard key={i} {...p} />
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="equipos" className="mt-4">
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
            {teams.map((t, i) => (
              <TeamCard key={i} {...t} />
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="canchas" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courts.map((c, i) => (
              <CourtCard key={i} {...c} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchPage;
