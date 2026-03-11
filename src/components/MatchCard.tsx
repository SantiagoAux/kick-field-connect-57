import { CalendarDays, MapPin, Users } from "lucide-react";
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card card-shadow transition-card hover:card-shadow-hover p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium tabular-nums">{date} · {time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{venue}</span>
          </div>
        </div>
        <span className="text-label bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full">
          {type}
        </span>
      </div>

      {teamA && teamB && (
        <div className="flex items-center justify-center gap-3 py-3 mb-3 border-t border-b border-border/50">
          <span className="font-semibold text-sm">{teamA}</span>
          <span className="text-muted-foreground text-xs">vs</span>
          <span className="font-semibold text-sm">{teamB}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm tabular-nums">
            <span className="font-medium">{playersConfirmed}</span>
            <span className="text-muted-foreground">/{playersNeeded}</span>
          </span>
          {spotsLeft > 0 && spotsLeft <= 3 && (
            <span className="text-xs text-primary font-medium">¡Faltan {spotsLeft}!</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {price && <span className="text-sm text-muted-foreground">{price}</span>}
          <Button size="sm" className="h-8 text-xs">
            Unirse
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default MatchCard;
