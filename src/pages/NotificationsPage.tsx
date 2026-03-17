import { useState, useEffect } from "react";
import { Bell, Check, X, Calendar, Shield, Info, ArrowLeft, Trash2, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getCurrentUser, getNotifications, updateNotificationStatus, Notification, updateProfile, getTeams, updateTeamMembers, joinMatch } from "@/lib/storage";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const NotificationsPage = () => {
    const user = getCurrentUser();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            if (user) {
                const notes = await getNotifications(user.id);
                setNotifications(notes);
            }
        };
        fetchNotifications();
    }, [user?.id]);

    if (!user) return null;

    const handleAccept = async (n: Notification) => {
        if (n.type === 'team_invite' && n.data.teamId) {
            const teams = await getTeams();
            const team = teams.find(t => t.id === n.data.teamId);
            if (team) {
                const members = team.members || [];
                if (!members.includes(user.id)) {
                    await updateTeamMembers(team.id, [...members, user.id]);
                    toast({ title: "Invitación aceptada", description: `Bienvenido al equipo ${team.name}.` });
                }
            }
        } else if (n.type === 'match_invite' && n.data.matchId) {
            const success = await joinMatch(n.data.matchId, user.id);
            if (success) {
                toast({ title: "Invitación aceptada", description: "Te has unido al partido." });
            }
        } else if (n.type === 'match_join_request' && n.data.matchId) {
            const success = await joinMatch(n.data.matchId, n.fromId, n.data.team);
            if (success) {
                toast({ title: "Solicitud aceptada", description: `${n.fromName} ahora es parte del partido.` });
            }
        }
        await updateNotificationStatus(n.id, 'accepted');
        setNotifications(notifications.map(item => item.id === n.id ? { ...item, status: 'accepted' as const } : item));
    };

    const handleReject = async (n: Notification) => {
        await updateNotificationStatus(n.id, 'rejected');
        setNotifications(notifications.map(item => item.id === n.id ? { ...item, status: 'rejected' as const } : item));
        toast({ title: "Invitación rechazada", description: "Has declinado la invitación." });
    };

    const markAsRead = async (id: string) => {
        await updateNotificationStatus(id, 'read');
        setNotifications(notifications.map(item => item.id === id ? { ...item, status: 'read' as const } : item));
    };

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'team_invite': return <Shield className="h-5 w-5 text-primary" />;
            case 'match_invite': return <Calendar className="h-5 w-5 text-emerald-500" />;
            case 'match_cancel': return <X className="h-5 w-5 text-destructive" />;
            case 'match_join_request': return <Users className="h-5 w-5 text-amber-500" />;
            default: return <Bell className="h-5 w-5 text-blue-500" />;
        }
    };

    const getTitle = (n: Notification) => {
        switch (n.type) {
            case 'team_invite': return `Invitación a Equipo`;
            case 'match_invite': return `Invitación a Partido`;
            case 'match_cancel': return `Partido Cancelado`;
            case 'match_join_request': return `Solicitud para Unirse`;
            default: return `Notificación`;
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-9 w-9">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-black italic tracking-tight uppercase">Notificaciones</h1>
                    <p className="text-sm text-muted-foreground">Revisa tus invitaciones y alertas del barrio.</p>
                </div>
            </div>

            <div className="space-y-3">
                {notifications.length > 0 ? (
                    <AnimatePresence>
                        {notifications.map((n) => (
                            <motion.div
                                key={n.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`p-4 rounded-xl border border-border bg-card card-shadow relative overflow-hidden ${n.status === 'unread' ? 'border-l-4 border-l-primary' : ''}`}
                            >
                                <div className="flex gap-4">
                                    <div className="mt-1">{getIcon(n.type)}</div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-sm font-black uppercase tracking-tight">{getTitle(n)}</h3>
                                            <span className="text-[9px] text-muted-foreground font-medium">{new Date(n.timestamp).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            <span className="font-bold text-foreground">{n.fromName}</span> te ha enviado una notificación.
                                            {n.data.message && <span className="block mt-1 italic italic">"{n.data.message}"</span>}
                                        </p>

                                        {(n.status === 'unread' || n.status === 'pending') && (
                                            <div className="flex gap-2 mt-4">
                                                {(n.type === 'team_invite' || n.type === 'match_invite' || n.type === 'match_join_request') && (
                                                    <>
                                                        <Button size="sm" className="h-8 text-[10px] font-black uppercase" onClick={() => handleAccept(n)}>
                                                            <Check className="h-3.5 w-3.5 mr-1" /> Aceptar
                                                        </Button>
                                                        <Button size="sm" variant="outline" className="h-8 text-[10px] font-black uppercase" onClick={() => handleReject(n)}>
                                                            <X className="h-3.5 w-3.5 mr-1" /> Rechazar
                                                        </Button>
                                                    </>
                                                )}
                                                {n.type !== 'team_invite' && n.type !== 'match_invite' && n.type !== 'match_join_request' && n.status === 'unread' && (
                                                    <Button size="sm" variant="ghost" className="h-8 text-[10px] font-black uppercase" onClick={() => markAsRead(n.id)}>
                                                        Marcar como leída
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                        {(n.status === 'accepted' || n.status === 'rejected' || (n.status === 'read' && n.type !== 'team_invite' && n.type !== 'match_invite' && n.type !== 'match_join_request')) && (
                                            <div className="mt-3 flex items-center gap-1.5">
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${n.status === 'accepted' ? 'text-emerald-500' : n.status === 'rejected' ? 'text-destructive' : 'text-muted-foreground'}`}>
                                                    {n.status === 'accepted' ? 'Aceptada' : n.status === 'rejected' ? 'Rechazada' : 'Leída'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                ) : (
                    <div className="text-center py-20 bg-secondary/20 rounded-2xl border-2 border-dashed border-border">
                        <Bell className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-sm font-bold text-muted-foreground uppercase">No tienes notificaciones por ahora.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
