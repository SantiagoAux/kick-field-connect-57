import { CalendarDays, MapPin, Users, Swords } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface MatchCardProps {
  date: string;
  time: string;
  venue: string;
  type: string;
  playersConfirmed: number;
  playersNeeded: number;
  teamA?: string;
  teamB?: string;
  price?: string;
}

const MatchCard = ({
  date,
  time,
  venue,
  type,
  playersConfirmed,
  playersNeeded,
  teamA,
  teamB,
  price,
}: MatchCardProps) => {
  const spotsLeft = playersNeeded - playersConfirmed;
  const isAlmostFull = spotsLeft <= 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-card card-shadow transition-card hover:card-shadow-hover p-4 border-l-4 border-l-primary"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold tabular-nums uppercase tracking-wide">{date} · {time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{venue}</span>
          </div>
        </div>
        <span className="text-label bg-primary/20 text-primary px-2.5 py-1 rounded-md border border-primary/30">
          {type}
        </span>
      </div>

      {teamA && teamB && (
        <div className="flex items-center justify-center gap-4 py-3 mb-3 border-t border-b border-border/50 bg-secondary/30 rounded-lg">
          <span className="font-black text-sm uppercase tracking-wide">{teamA}</span>
          <div className="flex items-center gap-1 text-primary">
            <Swords className="h-4 w-4" />
            <span className="font-bold text-xs">VS</span>
          </div>
          <span className="font-black text-sm uppercase tracking-wide">{teamB}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-md">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold tabular-nums">
              {playersConfirmed}<span className="text-muted-foreground font-normal">/{playersNeeded}</span>
            </span>
          </div>
          {isAlmostFull && spotsLeft > 0 && (
            <span className="text-xs font-black uppercase tracking-wide text-primary animate-pulse">
              ¡Faltan {spotsLeft}!
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {price && <span className="text-sm font-bold text-primary">{price}</span>}
          <Button size="sm" className="h-8 text-xs font-bold uppercase tracking-wide bg-primary hover:bg-primary/90">
            Unirse
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default MatchCard;