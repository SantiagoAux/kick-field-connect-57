import { Users } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TeamCardProps {
  name: string;
  city: string;
  playerCount: number;
  captain: string;
}

const TeamCard = ({ name, city, playerCount, captain }: TeamCardProps) => {
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card card-shadow transition-card hover:card-shadow-hover p-4 flex items-center gap-3"
    >
      <Avatar className="h-12 w-12 rounded-xl">
        <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold text-sm">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{city} · Cap: {captain}</p>
      </div>
      <div className="flex items-center gap-1 text-muted-foreground">
        <Users className="h-4 w-4" />
        <span className="text-sm tabular-nums">{playerCount}</span>
      </div>
    </motion.div>
  );
};

export default TeamCard;
