import { Star, MapPin, Zap, Trophy, TrendingUp, Shield } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Profile } from "@/lib/storage";
import { motion } from "framer-motion";

interface PublicProfileDialogProps {
    profile: Profile | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const PublicProfileDialog = ({ profile, isOpen, onOpenChange }: PublicProfileDialogProps) => {
    if (!profile) return null;

    const initials = profile.name.split(" ").map(n => n[0]).join("").toUpperCase();

    const userStats = [
        { label: "Partidos", value: profile.stats.matches.toString(), icon: Trophy },
        { label: "Goles", value: profile.stats.goals.toString(), icon: Zap },
        { label: "Asistencias", value: profile.stats.assists.toString(), icon: TrendingUp },
        { label: "Rating", value: profile.stats.rating.toFixed(1), icon: Star },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-slate-900/95 backdrop-blur-md border-primary/20 p-0 overflow-hidden">
                <div className="bg-gradient-to-br from-primary/30 via-primary/5 to-transparent p-6 pb-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20 rounded-xl border-4 border-primary/30 shadow-xl shadow-primary/20">
                            <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 text-primary font-black text-2xl">{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-black italic tracking-tight uppercase text-primary">{profile.name}</h2>
                            <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5" />
                                <span className="text-xs font-bold">{profile.location}</span>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 border border-emerald-500/30">{profile.position}</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-secondary/80 text-foreground border border-border">Pie {profile.foot}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 pt-2 space-y-6">
                    <div className="grid grid-cols-4 gap-2">
                        {userStats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="text-center rounded-xl bg-secondary/30 p-2.5 border border-border/50"
                            >
                                <stat.icon className="h-3.5 w-3.5 mx-auto text-primary mb-1" />
                                <p className="text-lg font-black tabular-nums text-primary">{stat.value}</p>
                                <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-wider">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-primary" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Trayectoria</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="p-3 rounded-lg border border-border bg-card/50">
                                <p className="text-[10px] font-bold text-primary uppercase mb-1">Última Actividad</p>
                                <p className="text-xs text-muted-foreground">Visto recientemente en el Dashboard organizando un partido.</p>
                            </div>
                            {/* Could add team logos or badges here */}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PublicProfileDialog;
