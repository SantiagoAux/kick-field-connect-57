import { Users, Shield, Crown, Edit, Save, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { getCurrentUser, updateTeam, getProfileById, Profile, Team } from "@/lib/storage";
import { useToast } from "@/components/ui/use-toast";
import PlayerCard from "./PlayerCard";

interface TeamCardProps extends Team { }

const TeamCard = (team: TeamCardProps) => {
  const { id, name, city, playerCount, captain, creatorId, logoUrl, members = [] } = team;
  const user = getCurrentUser();
  const { toast } = useToast();
  const isCreator = user?.id === creatorId;
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [memberProfiles, setMemberProfiles] = useState<Profile[]>([]);
  const [editData, setEditData] = useState({ name, city, logoUrl: logoUrl || "" });

  const initials = name.slice(0, 2).toUpperCase();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateTeam(id, editData);
    if (success) {
      setIsEditDialogOpen(false);
      toast({ title: "Equipo actualizado", description: "Los cambios se guardaron correctamente." });
      window.location.reload();
    }
  };

  const fetchMembers = async () => {
    const profiles = await Promise.all(members.map(mId => getProfileById(mId)));
    setMemberProfiles(profiles.filter((p): p is Profile => p !== null));
    setIsMembersOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-card card-shadow transition-card hover:card-shadow-hover p-4 border border-border/50"
    >
      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14 rounded-xl border-2 border-primary/20">
          {logoUrl ? (
            <img src={logoUrl} alt={name} className="h-full w-full object-cover rounded-xl" />
          ) : (
            <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-black text-lg">
              <Shield className="h-6 w-6" />
            </AvatarFallback>
          )}
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
      </div>

      <div className="flex gap-2 mt-4">
        <Button variant="outline" size="sm" className="flex-1 text-[10px] font-bold uppercase h-8 gap-1.5" onClick={fetchMembers}>
          <Eye className="h-3 w-3" />
          Ver Integrantes
        </Button>

        {isCreator && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm" className="text-[10px] font-bold uppercase h-8 gap-1.5">
                <Edit className="h-3 w-3" />
                Editar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-slate-900/95 backdrop-blur-md border-primary/20">
              <form onSubmit={handleUpdate}>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black italic text-primary uppercase">Editar Equipo</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="t-name" className="text-right font-bold text-xs uppercase">Nombre</Label>
                    <Input id="t-name" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="t-city" className="text-right font-bold text-xs uppercase">Ciudad</Label>
                    <Input id="t-city" value={editData.city} onChange={(e) => setEditData({ ...editData, city: e.target.value })} className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="t-logo" className="text-right font-bold text-xs uppercase">Escudo (URL)</Label>
                    <Input id="t-logo" placeholder="https://..." value={editData.logoUrl} onChange={(e) => setEditData({ ...editData, logoUrl: e.target.value })} className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full font-black uppercase tracking-widest italic gap-2">
                    <Save className="h-4 w-4" />
                    Guardar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Dialog open={isMembersOpen} onOpenChange={setIsMembersOpen}>
        <DialogContent className="sm:max-w-[425px] bg-slate-900/95 backdrop-blur-md border-primary/20 max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-black italic text-primary uppercase">Integrantes - {name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {memberProfiles.map(p => (
              <PlayerCard
                key={p.id}
                id={p.id}
                name={p.name}
                position={p.position}
                level={p.stats.matches > 10 ? 2 : 1}
                rating={p.stats.rating}
                city={p.location}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default TeamCard;