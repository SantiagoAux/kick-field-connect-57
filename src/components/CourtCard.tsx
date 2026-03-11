import { MapPin, Clock } from "lucide-react";
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
      className="rounded-2xl bg-card card-shadow transition-card hover:card-shadow-hover overflow-hidden"
    >
      <div className="h-32 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
        <span className="text-4xl">🏟️</span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-sm">{name}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{address}</span>
            </div>
          </div>
          <span className="text-label bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full">
            {type}
          </span>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{price}</span>
            {nextAvailable && (
              <div className="flex items-center gap-1 mt-0.5">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{nextAvailable}</span>
              </div>
            )}
          </div>
          <Button size="sm" variant="outline" className="h-8 text-xs">
            Reservar
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CourtCard;
