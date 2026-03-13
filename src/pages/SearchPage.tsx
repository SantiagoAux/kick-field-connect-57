import { useState, useEffect } from "react";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlayerCard from "@/components/PlayerCard";
import TeamCard from "@/components/TeamCard";
import { motion } from "framer-motion";
import { getProfiles, getTeams, Profile, Team } from "@/lib/storage";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [players, setPlayers] = useState<Profile[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [p, t] = await Promise.all([
        getProfiles(),
        getTeams()
      ]);
      setPlayers(p);
      setTeams(t);
    };
    fetchData();
  }, []);

  const filteredPlayers = players.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.position.toLowerCase().includes(query.toLowerCase()) ||
    p.location.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTeams = teams.filter(t =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.city.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight uppercase italic font-black">Buscar</h1>
        <p className="text-sm text-muted-foreground mt-1">Encuentra jugadores y equipos reales en tu zona.</p>
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
          {filteredPlayers.length > 0 ? (
            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
              {filteredPlayers.map((p) => (
                <PlayerCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  position={p.position}
                  level={p.stats.matches > 10 ? 2 : 1}
                  rating={p.stats.rating}
                  city={p.location}
                  available={true}
                />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <p>No se encontraron jugadores.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="equipos" className="mt-4">
          {filteredTeams.length > 0 ? (
            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
              {filteredTeams.map((t) => (
                <TeamCard key={t.id} {...t} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <p>No hay equipos registrados aún.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="canchas" className="mt-4">
          <div className="text-center py-12 px-6 rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5">
            <h3 className="text-lg font-black text-primary uppercase mb-2">Próximamente</h3>
            <p className="text-sm text-muted-foreground">Estamos verificando las mejores canchas de Pasto para que puedas reservar directamente.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchPage;
