import { MapPin, Clock, Goal } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface CourtCardProps {
  name: string;
  address: string;
  type: string;
  price: string;
  nextAvailable?: string;
  imageUrl?: string;
}

const CourtCard = ({ name, address, type, price, nextAvailable }: CourtCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-card card-shadow transition-card hover:card-shadow-hover overflow-hidden border border-border/50"
    >
      <div className="h-28 bg-gradient-to-br from-primary/20 via-primary/5 to-background flex items-center justify-center relative">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 20px, hsl(142 76% 45% / 0.1) 20px, hsl(142 76% 45% / 0.1) 21px)`,
        }} />
        <Goal className="h-12 w-12 text-primary/40" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-black text-sm uppercase tracking-wide">{name}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs text-muted-foreground">{address}</span>
            </div>
          </div>
          <span className="text-label bg-primary/15 text-primary px-2 py-0.5 rounded border border-primary/20">
            {type}
          </span>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
          <div className="flex flex-col">
            <span className="font-black text-primary text-sm">{price}</span>
            {nextAvailable && (
              <div className="flex items-center gap-1 mt-0.5">
                <Clock className="h-3 w-3 text-primary" />
                <span className="text-xs text-muted-foreground font-medium">{nextAvailable}</span>
              </div>
            )}
          </div>
          <Button size="sm" variant="outline" className="h-8 text-xs font-bold uppercase tracking-wide border-primary/40 hover:bg-primary/10 hover:text-primary">
            Reservar
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CourtCard;