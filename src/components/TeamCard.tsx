import { Users, Shield, Crown } from "lucide-react";
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
      className="rounded-xl bg-card card-shadow transition-card hover:card-shadow-hover p-4 flex items-center gap-4 border-l-4 border-l-primary/60"
    >
      <Avatar className="h-14 w-14 rounded-xl border-2 border-primary/20">
        <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-black text-lg">
          <Shield className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-black text-sm truncate uppercase tracking-wide">{name}</p>
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <span className="text-primary">⚡</span> {city}
        </p>
        <div className="flex items-center gap-1 mt-1.5 text-[10px] text-muted-foreground/70">
          <Crown className="h-3 w-3 text-amber-400" />
          <span>Cap: {captain}</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 bg-secondary/50 px-3 py-2 rounded-lg">
        <Users className="h-4 w-4 text-primary" />
        <span className="text-sm font-black tabular-nums text-primary">{playerCount}</span>
      </div>
    </motion.div>
  );
};

export default TeamCard;