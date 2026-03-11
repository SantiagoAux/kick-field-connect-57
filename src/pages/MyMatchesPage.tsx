import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MatchCard from "@/components/MatchCard";
import { motion } from "framer-motion";

const upcoming = [
  { date: "Hoy", time: "20:00", venue: "Cancha El Pibe", type: "Fútbol 5", playersConfirmed: 8, playersNeeded: 10, teamA: "Los Cracks", teamB: "Barrio FC", price: "$25.000" },
  { date: "Mañana", time: "19:00", venue: "Complejo La 10", type: "Fútbol 7", playersConfirmed: 12, playersNeeded: 14, teamA: "Real Vecinos", teamB: "Deportivo Sur", price: "$30.000" },
];

const past = [
  { date: "Lun 10", time: "21:00", venue: "Arena Gol", type: "Fútbol 5", playersConfirmed: 10, playersNeeded: 10, teamA: "Los Cracks", teamB: "Real Vecinos", price: "$25.000" },
  { date: "Sáb 8", time: "17:00", venue: "Cancha El Pibe", type: "Fútbol 7", playersConfirmed: 14, playersNeeded: 14, teamA: "Barrio FC", teamB: "Deportivo Sur", price: "$30.000" },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const MyMatchesPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Mis Partidos</h1>
        <p className="text-sm text-muted-foreground mt-1">Partidos confirmados y pasados</p>
      </div>

      <Tabs defaultValue="proximos" className="w-full">
        <TabsList className="w-full bg-secondary">
          <TabsTrigger value="proximos" className="flex-1">Próximos</TabsTrigger>
          <TabsTrigger value="pasados" className="flex-1">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="proximos" className="mt-4">
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
            {upcoming.map((m, i) => (
              <MatchCard key={i} {...m} />
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="pasados" className="mt-4">
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
            {past.map((m, i) => (
              <MatchCard key={i} {...m} />
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyMatchesPage;
