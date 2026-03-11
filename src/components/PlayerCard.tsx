import { Star } from "lucide-react";
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

const positionColors: Record<string, string> = {
  Portero: "bg-amber-100 text-amber-700",
  Defensa: "bg-blue-100 text-blue-700",
  Mediocampista: "bg-emerald-100 text-emerald-700",
  Delantero: "bg-red-100 text-red-700",
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
      className="rounded-2xl bg-card card-shadow transition-card hover:card-shadow-hover p-4 flex items-center gap-3"
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-secondary text-secondary-foreground font-medium text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        {available && (
          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-primary border-2 border-card" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-label px-2 py-0.5 rounded-full ${positionColors[position] || "bg-secondary text-secondary-foreground"}`}>
            {position}
          </span>
          <span className="text-xs text-muted-foreground">{city}</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium tabular-nums">{rating.toFixed(1)}</span>
        </div>
        <span className="text-xs text-muted-foreground">Nivel {level}</span>
      </div>
    </motion.div>
  );
};

export default PlayerCard;
