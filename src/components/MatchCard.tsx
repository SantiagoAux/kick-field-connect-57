import { CalendarDays, MapPin, Users, Swords, CheckCircle2, Settings2, Trash2, UserMinus, XCircle, Trophy, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getProfiles, joinMatch, requestJoinMatch, getCurrentUser, deleteMatch, leaveMatch, removePlayerFromMatch, Profile } from "@/lib/storage";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import MatchResultDialog from "./MatchResultDialog";

interface MatchCardProps {
  id: string;
  date: string;
  time: string;
  venue: string;
  type: string;
  confirmedPlayerIds: string[];
  playersNeeded: number;
  teamAName: string;
  teamBName: string;
  creatorId: string;
  price?: string;
  status?: 'scheduled' | 'finished' | 'cancelled';
  teamALogoUrl?: string;
  teamBLogoUrl?: string;
  teamAPlayerIds?: string[];
  teamBPlayerIds?: string[];
}

const MatchCard = ({
  id,
  date,
  time,
  venue,
  type,
  confirmedPlayerIds: initialIds,
  playersNeeded,
  teamAName,
  teamBName,
  creatorId,
  price,
  status = 'scheduled',
  teamALogoUrl,
  teamBLogoUrl,
}: MatchCardProps) => {
  const [playerIds, setPlayerIds] = useState(initialIds);
  const [confirmedPlayers, setConfirmedPlayers] = useState<Profile[]>([]);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isJoinRequestOpen, setIsJoinRequestOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<'A' | 'B' | null>(null);
  const { toast } = useToast();
  const user = getCurrentUser();

  useEffect(() => {
    const fetchPlayers = async () => {
      const allProfiles = await getProfiles();
      setConfirmedPlayers(allProfiles.filter(p => playerIds.includes(p.id)));
    };
    fetchPlayers();
  }, [playerIds]);

  const playersConfirmed = playerIds.length;
  const spotsLeft = playersNeeded - playersConfirmed;
  const isJoined = user && playerIds.includes(user.id);
  const isCreator = user && user.id === creatorId;
  const isFinished = status === 'finished';

  const handleJoinRequestClick = () => {
    if (!user) {
      toast({ title: "Acceso requerido", description: "Debes iniciar sesión para unirte." });
      return;
    }
    setIsJoinRequestOpen(true);
  };

  const submitJoinRequest = async () => {
    if (!user || !selectedTeam) return;
    const success = await requestJoinMatch(id, user.id, user.name, creatorId, selectedTeam);
    if (success) {
      setIsJoinRequestOpen(false);
      toast({ title: "Solicitud enviada", description: "Espera a que el organizador acepte tu solicitud." });
    } else {
      toast({ variant: "destructive", title: "Error", description: "No se pudo enviar la solicitud." });
    }
  };

  const handleLeaveMatch = async () => {
    if (!user) return;
    const success = await leaveMatch(id, user.id);
    if (success) {
      setPlayerIds(playerIds.filter(pid => pid !== user.id));
      toast({ title: "Asistencia cancelada", description: "Te has retirado del partido." });
    }
  };

  const handleDeleteMatch = async () => {
    await deleteMatch(id);
    toast({ title: "Partido cancelado", description: "El partido ha sido eliminado correctamente." });
    window.location.reload();
  };

  const handleRemovePlayer = async (userId: string, userName: string) => {
    const success = await removePlayerFromMatch(id, userId);
    if (success) {
      setPlayerIds(playerIds.filter(pid => pid !== userId));
      toast({ title: "Jugador removido", description: `${userName} ha sido sacado del partido.` });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-card card-shadow transition-card hover:card-shadow-hover p-4 border-l-4 border-l-primary"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold tabular-nums uppercase tracking-wide">{date} · {time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{venue}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-[10px] font-bold bg-primary/20 text-primary px-2.5 py-1 rounded-md border border-primary/30 uppercase tracking-tighter">
            {isFinished ? 'Finalizado' : type}
          </span>
          {isCreator && (
            <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-primary/10">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white/95 backdrop-blur-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black italic text-primary uppercase">Gestionar Partido</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <h4 className="text-xs font-black uppercase text-muted-foreground mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Participantes ({playerIds.length})
                    </h4>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {confirmedPlayers.map(p => (
                        <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                          <span className="text-sm font-bold">{p.name} {p.id === creatorId && '(Organizador)'}</span>
                          {p.id !== creatorId && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:bg-destructive/10"
                              onClick={() => handleRemovePlayer(p.id, p.name)}
                            >
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div className="flex flex-col gap-2">
                    {!isFinished && (
                      <Button
                        className="w-full font-black uppercase italic gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
                        onClick={() => {
                          setIsManageDialogOpen(false);
                          setIsResultOpen(true);
                        }}
                      >
                        <Trophy className="h-4 w-4" />
                        Finalizar Partido y Calificar
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      className="w-full font-black uppercase italic gap-2"
                      onClick={handleDeleteMatch}
                    >
                      <Trash2 className="h-4 w-4" />
                      Cancelar Partido (Eliminar)
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 py-3 mb-3 border-t border-b border-border/50 bg-secondary/10 rounded-lg">
        <div className="flex flex-col items-center flex-1 gap-2">
          {teamALogoUrl ? (
            <img src={teamALogoUrl} alt={teamAName} className="h-8 w-8 object-cover rounded shadow-sm border border-border" />
          ) : (
            <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center border border-primary/20">
              <Shield className="h-4 w-4 text-primary" />
            </div>
          )}
          <span className="font-black text-[10px] uppercase tracking-wide text-center">{teamAName}</span>
        </div>

        <div className="flex flex-col items-center gap-1 text-primary">
          <Swords className="h-4 w-4" />
          <span className="font-black text-[8px]">VS</span>
        </div>

        <div className="flex flex-col items-center flex-1 gap-2">
          {teamBLogoUrl ? (
            <img src={teamBLogoUrl} alt={teamBName} className="h-8 w-8 object-cover rounded shadow-sm border border-border" />
          ) : (
            <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center border border-primary/20">
              <Shield className="h-4 w-4 text-primary" />
            </div>
          )}
          <span className="font-black text-[10px] uppercase tracking-wide text-center">{teamBName}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-md">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold tabular-nums">
                {playersConfirmed}<span className="text-muted-foreground font-normal">/{playersNeeded}</span>
              </span>
            </div>
            {spotsLeft > 0 && spotsLeft <= 3 && (
              <span className="text-[10px] font-black uppercase tracking-wide text-primary animate-pulse">
                ¡Faltan {spotsLeft}!
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {price && <span className="text-sm font-bold text-primary">{price}</span>}
            {isJoined ? (
              <div className="flex gap-1">
                <Button size="sm" disabled className="h-8 text-xs font-bold uppercase tracking-wide bg-emerald-500 text-white gap-1 opacity-100">
                  <CheckCircle2 className="h-3 w-3" />
                  Confirmado
                </Button>
                {!isCreator && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive border-destructive/30 hover:bg-destructive/10"
                    onClick={handleLeaveMatch}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ) : (
              <Button
                size="sm"
                onClick={handleJoinRequestClick}
                className="h-8 text-xs font-bold uppercase tracking-wide bg-primary hover:bg-primary/90"
              >
                Unirse
              </Button>
            )}
          </div>
        </div>

        {confirmedPlayers.length > 0 && (
          <div className="pt-2 border-t border-border/50">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Jugadores confirmados:</p>
            <div className="flex flex-wrap gap-1">
              {confirmedPlayers.map((p) => (
                <span key={p.id} className="text-[10px] bg-secondary/80 px-2 py-0.5 rounded-full border border-border">
                  {p.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <MatchResultDialog
        matchId={id}
        playerIds={playerIds}
        isOpen={isResultOpen}
        onOpenChange={setIsResultOpen}
        onSuccess={() => window.location.reload()}
      />

      <Dialog open={isJoinRequestOpen} onOpenChange={setIsJoinRequestOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-md sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-black italic text-primary uppercase">Elegir Equipo</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm font-medium text-muted-foreground">¿En qué equipo deseas jugar?</p>
            <div className="flex gap-4">
              <Button
                variant={selectedTeam === 'A' ? 'default' : 'outline'}
                className="flex-1 font-bold uppercase h-12"
                onClick={() => setSelectedTeam('A')}
              >
                {teamAName}
              </Button>
              <Button
                variant={selectedTeam === 'B' ? 'default' : 'outline'}
                className="flex-1 font-bold uppercase h-12"
                onClick={() => setSelectedTeam('B')}
              >
                {teamBName}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="w-full font-black uppercase tracking-widest gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
              disabled={!selectedTeam}
              onClick={submitJoinRequest}
            >
              Enviar Solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default MatchCard;