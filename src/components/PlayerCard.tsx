import { Star, Zap, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface PlayerCardProps {
  name: string;
  position: string;
  level: number;
  rating: number;
  city: string;
  available?: boolean;
}

const positionStyles: Record<string, string> = {
  Portero: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Defensa: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Mediocampista: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Delantero: "bg-red-500/20 text-red-400 border-red-500/30",
};

const PlayerCard = ({ name, position, level, rating, city, available }: PlayerCardProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-card card-shadow transition-card hover:card-shadow-hover p-4 flex items-center gap-4"
    >
      <div className="relative">
        <Avatar className="h-14 w-14 rounded-xl border-2 border-primary/30">
          <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 text-primary font-black text-lg">
            {initials}
          </AvatarFallback>
        </Avatar>
        {available && (
          <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-primary border-2 border-card shadow-lg shadow-primary/30" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-black text-sm truncate uppercase tracking-wide">{name}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${positionStyles[position] || "bg-secondary text-secondary-foreground border-border"}`}>
            {position}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {city}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1 bg-amber-400/10 px-2 py-0.5 rounded">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          <span className="text-sm font-black tabular-nums text-primary">{rating.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="h-3 w-3 text-primary" />
          <span className="text-xs font-bold text-muted-foreground">NIVEL {level}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerCard;