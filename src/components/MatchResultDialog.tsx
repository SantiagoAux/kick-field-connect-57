import { useState, useEffect } from "react";
import { Star, Zap, Trophy, TrendingUp, Save, Users } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getProfileById, Profile, PlayerMatchStats, completeMatch } from "@/lib/storage";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MatchResultDialogProps {
    matchId: string;
    playerIds: string[];
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

const MatchResultDialog = ({ matchId, playerIds, isOpen, onOpenChange, onSuccess }: MatchResultDialogProps) => {
    const { toast } = useToast();
    const [players, setPlayers] = useState<Profile[]>([]);
    const [stats, setStats] = useState<Record<string, { goals: number; assists: number; rating: number }>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchPlayers = async () => {
                const fetched = await Promise.all(playerIds.map(id => getProfileById(id)));
                const validProfiles = fetched.filter((p): p is Profile => p !== null);
                setPlayers(validProfiles);

                const initialStats: Record<string, { goals: number; assists: number; rating: number }> = {};
                validProfiles.forEach(p => {
                    initialStats[p.id] = { goals: 0, assists: 0, rating: 5 };
                });
                setStats(initialStats);
            };
            fetchPlayers();
        }
    }, [isOpen, playerIds]);

    const updateStat = (profileId: string, field: 'goals' | 'assists' | 'rating', value: number) => {
        setStats(prev => ({
            ...prev,
            [profileId]: { ...prev[profileId], [field]: value }
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        const data: PlayerMatchStats[] = Object.entries(stats).map(([profileId, s]) => ({
            profileId,
            ...s
        }));

        const success = await completeMatch(matchId, data);
        if (success) {
            toast({
                title: "Partido Finalizado",
                description: "Las estadísticas han sido actualizadas en los perfiles de los jugadores.",
            });
            onSuccess();
            onOpenChange(false);
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo finalizar el partido.",
            });
        }
        setLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-slate-900/95 backdrop-blur-md border-primary/20 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black italic text-primary uppercase flex items-center gap-2">
                        <Trophy className="h-6 w-6" />
                        FINALIZAR PARTIDO
                    </DialogTitle>
                    <p className="text-xs text-muted-foreground font-bold uppercase">Asigna goles, asistencias y califica a los jugadores.</p>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    {players.map((player) => (
                        <div key={player.id} className="p-4 rounded-xl border border-border bg-card/50 space-y-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 rounded-lg">
                                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                        {player.name.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-black uppercase">{player.name}</p>
                                    <p className="text-[10px] text-muted-foreground font-bold">{player.position}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase flex items-center gap-1">
                                        <Zap className="h-3 w-3 text-primary" /> Goles
                                    </Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={stats[player.id]?.goals || 0}
                                        onChange={(e) => updateStat(player.id, 'goals', parseInt(e.target.value) || 0)}
                                        className="h-8 text-sm font-bold"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3 text-primary" /> Asist.
                                    </Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={stats[player.id]?.assists || 0}
                                        onChange={(e) => updateStat(player.id, 'assists', parseInt(e.target.value) || 0)}
                                        className="h-8 text-sm font-bold"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase flex items-center gap-1">
                                        <Star className="h-3 w-3 text-amber-400" /> Calificación
                                    </Label>
                                    <select
                                        value={stats[player.id]?.rating || 5}
                                        onChange={(e) => updateStat(player.id, 'rating', parseInt(e.target.value))}
                                        className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm font-bold"
                                    >
                                        {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v} Estrellas</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full font-black uppercase tracking-widest italic h-12 gap-2"
                    >
                        <Save className="h-5 w-5" />
                        {loading ? "GUARDANDO..." : "GUARDAR RESULTADOS"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default MatchResultDialog;
