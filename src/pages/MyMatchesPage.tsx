import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MatchCard from "@/components/MatchCard";
import { motion } from "framer-motion";
import { getMatches, getCurrentUser, Match } from "@/lib/storage";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const MyMatchesPage = () => {
  const [myMatches, setMyMatches] = useState<Match[]>([]);
  const user = getCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const allMatches = await getMatches();
        const filtered = allMatches.filter(m => m.confirmedPlayerIds.includes(user.id));
        setMyMatches(filtered);
      }
    };
    fetchData();
  }, [user?.id]);

  const today = new Date().toISOString().split('T')[0];
  const upcoming = myMatches.filter(m => m.date >= today);
  const past = myMatches.filter(m => m.date < today);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black italic tracking-tight uppercase">Mis Partidos</h1>
        <p className="text-sm text-muted-foreground mt-1">Sigue el ritmo de tu agenda deportiva.</p>
      </div>

      <Tabs defaultValue="proximos" className="w-full">
        <TabsList className="w-full bg-secondary">
          <TabsTrigger value="proximos" className="flex-1">Próximos</TabsTrigger>
          <TabsTrigger value="pasados" className="flex-1">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="proximos" className="mt-4">
          {upcoming.length > 0 ? (
            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
              {upcoming.map((m) => (
                <MatchCard
                  key={m.id}
                  {...m}
                  date={m.date}
                  confirmedPlayerIds={m.confirmedPlayerIds}
                  playersNeeded={m.playersNeeded}
                  teamAName={m.teamAName}
                  teamBName={m.teamBName}
                />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 text-muted-foreground bg-secondary/20 rounded-xl border-2 border-dashed border-border">
              <p className="font-bold uppercase text-xs">No tienes partidos programados.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pasados" className="mt-4">
          {past.length > 0 ? (
            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
              {past.map((m) => (
                <MatchCard
                  key={m.id}
                  {...m}
                  date={m.date}
                  confirmedPlayerIds={m.confirmedPlayerIds}
                  playersNeeded={m.playersNeeded}
                  teamAName={m.teamAName}
                  teamBName={m.teamBName}
                />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 text-muted-foreground bg-secondary/20 rounded-xl border-2 border-dashed border-border">
              <p className="font-bold uppercase text-xs">No hay partidos en tu historial.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyMatchesPage;
