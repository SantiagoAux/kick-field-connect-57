/**
 * Storage Management for BarrioFútbol
 * Using Supabase as a cloud database
 */

import { supabase } from './supabase';

export interface Profile {
    id: string;
    name: string;
    email: string;
    password?: string;
    position: string;
    location: string;
    foot: string;
    role: 'admin' | 'user';
    stats: {
        matches: number;
        goals: number;
        assists: number;
        rating: number;
    };
}

export interface Match {
    id: string;
    venue: string;
    time: string;
    date: string;
    type: string;
    playersNeeded: number;
    confirmedPlayerIds: string[];
    teamAPlayerIds: string[];
    teamBPlayerIds: string[];
    teamAName: string;
    teamBName: string;
    price: string;
    creatorId: string;
    status: 'scheduled' | 'finished' | 'cancelled';
    teamALogoUrl?: string;
    teamBLogoUrl?: string;
}

export interface Team {
    id: string;
    name: string;
    city: string;
    playerCount: number;
    captain: string;
    creatorId: string;
    members?: string[];
    logoUrl?: string;
}

export interface Notification {
    id: string;
    type: 'team_invite' | 'match_invite' | 'match_cancel' | 'match_update' | 'match_join_request' | 'system';
    fromId: string;
    fromName: string;
    toId: string;
    data: {
        teamId?: string;
        matchId?: string;
        message?: string;
        team?: 'A' | 'B';
    };
    status: 'pending' | 'accepted' | 'rejected' | 'read' | 'unread';
    timestamp: string;
}

const STORAGE_KEYS = {
    AUTH: 'bf_current_user',
};

// --- Utils ---
export const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// --- Profiles ---
export const getProfiles = async (): Promise<Profile[]> => {
    try {
        const { data, error } = await supabase.from('profiles').select('*');
        if (error) throw error;

        return (data || []).map((p: any) => ({
            ...p,
            stats: p.stats || { matches: 0, goals: 0, assists: 0, rating: 5.0 }
        }));
    } catch (error) {
        console.error("Error fetching profiles:", error);
        return [];
    }
};

export const getProfileById = async (id: string): Promise<Profile | null> => {
    try {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
        if (error) {
            if (error.code === 'PGRST116') return null; // PostgREST error code for not found
            throw error;
        }

        const profile = data;
        if (profile) {
            profile.stats = profile.stats || { matches: 0, goals: 0, assists: 0, rating: 5.0 };
        }
        return profile;
    } catch (error) {
        return null;
    }
};

export const saveProfile = async (profile: Profile) => {
    try {
        const profileToSave = {
            ...profile,
            stats: profile.stats || { matches: 0, goals: 0, assists: 0, rating: 5.0 }
        };

        const { error } = await supabase.from('profiles').upsert(profileToSave, { onConflict: 'id' });

        if (error) throw error;
        return true;
    } catch (error) {
        console.error("Error saving profile:", error);
        return false;
    }
};

export const updateProfile = async (id: string, data: Partial<Profile>) => {
    try {
        const { error } = await supabase.from('profiles').update(data).eq('id', id);
        if (error) throw error;

        // Update local session if it's the current user
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.id === id) {
            const updatedProfile = await getProfileById(id);
            if (updatedProfile) {
                setCurrentUser(updatedProfile);
            }
        }
        return true;
    } catch (error) {
        console.error("Error updating profile:", error);
        return false;
    }
};

// --- Auth ---
export const setCurrentUser = (profile: Profile | null) => {
    if (profile) {
        localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(profile));
        localStorage.setItem("isAuthenticated", "true");
    } else {
        localStorage.removeItem(STORAGE_KEYS.AUTH);
        localStorage.setItem("isAuthenticated", "false");
    }
};

export const getCurrentUser = (): Profile | null => {
    const data = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (!data) return null;
    try {
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
};

// --- Matches ---
export const getMatches = async (): Promise<Match[]> => {
    try {
        const { data, error } = await supabase.from('matches').select('*');
        if (error) throw error;

        return (data || []).map((m: any) => ({
            ...m,
            // Map snake_case from DB to camelCase if needed
            creatorId: m.creatorId || m.creator_id,
            confirmedPlayerIds: m.confirmedPlayerIds || m.confirmed_player_ids || [],
            teamAPlayerIds: m.teamAPlayerIds || m.team_a_player_ids || [],
            teamBPlayerIds: m.teamBPlayerIds || m.team_b_player_ids || [],
            teamALogoUrl: m.teamALogoUrl || m.team_a_logo_url,
            teamBLogoUrl: m.teamBLogoUrl || m.team_b_logo_url,
        }));
    } catch (error) {
        console.error("Error fetching matches:", error);
        return [];
    }
};

export const saveMatch = async (match: Match) => {
    try {
        // Prepare data mapping to both camelCase and snake_case for compatibility
        const matchToSave: any = {
            ...match,
            status: match.status || 'scheduled',
            confirmedPlayerIds: match.confirmedPlayerIds || [],
            confirmed_player_ids: match.confirmedPlayerIds || [],
            teamAPlayerIds: match.teamAPlayerIds || [],
            team_a_player_ids: match.teamAPlayerIds || [],
            teamBPlayerIds: match.teamBPlayerIds || [],
            team_b_player_ids: match.teamBPlayerIds || [],
            creator_id: match.creatorId,
            team_a_logo_url: match.teamALogoUrl,
            team_b_logo_url: match.teamBLogoUrl
        };

        const { error } = await supabase.from('matches').upsert(matchToSave, { onConflict: 'id' });
        if (error) throw error;

        return true;
    } catch (error) {
        console.error("Error saving match:", error);
        return false;
    }
};

export const deleteMatch = async (matchId: string) => {
    try {
        const { error } = await supabase.from('matches').delete().eq('id', matchId);
        if (error) throw error;
    } catch (error) {
        console.error("Error deleting match:", error);
    }
};

export const requestJoinMatch = async (matchId: string, userId: string, userName: string, creatorId: string, team: 'A' | 'B') => {
    if (!creatorId) {
        console.error("No se puede solicitar unión: el partido no tiene un organizador válido.");
        return false;
    }
    try {
        const result = await addNotification({
            type: 'match_join_request',
            fromId: userId,
            fromName: userName,
            toId: creatorId,
            data: { matchId, team, message: `quiere unirse al equipo ${team}` }
        });
        
        if (!result) {
            console.error("Fallo al crear la notificación en el servidor.");
            return false;
        }
        
        return true;
    } catch (error) {
        console.error("Error requesting to join match:", error);
        return false;
    }
};

export const joinMatch = async (matchId: string, userId: string, team?: 'A' | 'B') => {
    try {
        const { data: match, error: fetchError } = await supabase.from('matches')
            .select('confirmedPlayerIds, confirmed_player_ids, teamAPlayerIds, team_a_player_ids, teamBPlayerIds, team_b_player_ids')
            .eq('id', matchId)
            .single();
        if (fetchError) throw fetchError;

        const currentPlayers = match?.confirmedPlayerIds || match?.confirmed_player_ids || [];
        const teamA = match?.teamAPlayerIds || match?.team_a_player_ids || [];
        const teamB = match?.teamBPlayerIds || match?.team_b_player_ids || [];

        if (!currentPlayers.includes(userId)) {
            const newPlayers = [...currentPlayers, userId];
            const updates: any = { 
                confirmedPlayerIds: newPlayers,
                confirmed_player_ids: newPlayers
            };
            
            if (team === 'A' && !teamA.includes(userId)) {
                updates.teamAPlayerIds = [...teamA, userId];
                updates.team_a_player_ids = [...teamA, userId];
            }
            if (team === 'B' && !teamB.includes(userId)) {
                updates.teamBPlayerIds = [...teamB, userId];
                updates.team_b_player_ids = [...teamB, userId];
            }

            const { error: updateError } = await supabase.from('matches').update(updates).eq('id', matchId);
            if (updateError) throw updateError;

            // Update user stats
            const profile = await getProfileById(userId);
            if (profile) {
                profile.stats.matches += 1;
                await updateProfile(userId, { stats: profile.stats });
            }
            return true;
        }
    } catch (error) {
        console.error("Error joining match:", error);
    }
    return false;
};

export const leaveMatch = async (matchId: string, userId: string) => {
    try {
        const { data: match, error: fetchError } = await supabase.from('matches')
            .select('confirmedPlayerIds, confirmed_player_ids, teamAPlayerIds, team_a_player_ids, teamBPlayerIds, team_b_player_ids')
            .eq('id', matchId)
            .single();
        if (fetchError) throw fetchError;

        const currentPlayers = match?.confirmedPlayerIds || match?.confirmed_player_ids || [];
        const teamA = match?.teamAPlayerIds || match?.team_a_player_ids || [];
        const teamB = match?.teamBPlayerIds || match?.team_b_player_ids || [];

        const playerIndex = currentPlayers.indexOf(userId);

        if (playerIndex >= 0) {
            const newPlayers = currentPlayers.filter(id => id !== userId);
            const newTeamA = teamA.filter(id => id !== userId);
            const newTeamB = teamB.filter(id => id !== userId);

            const updates: any = { 
                confirmedPlayerIds: newPlayers,
                confirmed_player_ids: newPlayers,
                teamAPlayerIds: newTeamA,
                team_a_player_ids: newTeamA,
                teamBPlayerIds: newTeamB,
                team_b_player_ids: newTeamB
            };

            const { error: updateError } = await supabase.from('matches').update(updates).eq('id', matchId);
            if (updateError) throw updateError;

            // Update user stats
            const profile = await getProfileById(userId);
            if (profile && profile.stats.matches > 0) {
                profile.stats.matches -= 1;
                await updateProfile(userId, { stats: profile.stats });
            }
            return true;
        }
    } catch (error) {
        console.error("Error leaving match:", error);
    }
    return false;
};

export const removePlayerFromMatch = async (matchId: string, userId: string) => {
    return await leaveMatch(matchId, userId);
};

// --- Teams ---
export const getTeams = async (): Promise<Team[]> => {
    try {
        const { data, error } = await supabase.from('teams').select('*');
        if (error) throw error;

        return (data || []).map((t: any) => ({
            ...t,
            members: t.members || [t.creatorId]
        }));
    } catch (error) {
        console.error("Error fetching teams:", error);
        return [];
    }
};

export const saveTeam = async (team: Team) => {
    try {
        const teamToSave = {
            ...team,
            members: team.members || [team.creatorId]
        };

        const { error } = await supabase.from('teams').upsert(teamToSave, { onConflict: 'id' });
        if (error) throw error;

        return true;
    } catch (error) {
        console.error("Error saving team:", error);
        return false;
    }
};

export const updateTeam = async (teamId: string, data: Partial<Team>) => {
    try {
        const { error } = await supabase.from('teams').update(data).eq('id', teamId);
        if (error) throw error;

        return true;
    } catch (error) {
        console.error("Error updating team:", error);
        return false;
    }
};

export const updateTeamMembers = async (teamId: string, memberIds: string[]) => {
    return await updateTeam(teamId, { members: memberIds, playerCount: memberIds.length });
};

// --- Notifications ---
export const getNotifications = async (userId: string): Promise<Notification[]> => {
    try {
        // Try querying using toId or to_id
        const { data, error } = await supabase.from('notifications')
            .select('*')
            .or(`toId.eq.${userId},to_id.eq.${userId}`)
            .order('timestamp', { ascending: false });

        if (error) throw error;
        
        return (data || []).map((n: any) => ({
            ...n,
            fromId: n.fromId || n.from_id,
            fromName: n.fromName || n.from_name,
            toId: n.toId || n.to_id,
        }));
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
};

export const addNotification = async (n: Omit<Notification, 'id' | 'timestamp' | 'status'>) => {
    try {
        const newNote: Notification = {
            ...n,
            id: generateId(),
            timestamp: new Date().toISOString(),
            status: 'unread',
        };

        console.log("Intentando insertar notificación con payload:", newNote);
        const { error } = await supabase.from('notifications').insert(newNote);
        
        if (error) {
            console.error("Error de Supabase al insertar notificación:", JSON.stringify(error, null, 2));
            throw error;
        }

        return newNote;
    } catch (error) {
        console.error("Error adding notification:", error);
        return null;
    }
};

export const updateNotificationStatus = async (id: string, status: Notification['status']) => {
    try {
        const { error } = await supabase.from('notifications').update({ status }).eq('id', id);
        if (error) throw error;

        return true;
    } catch (error) {
        console.error("Error updating notification status:", error);
        return false;
    }
};

// --- Statistics & Flow ---
export interface PlayerMatchStats {
    profileId: string;
    goals: number;
    assists: number;
    rating: number;
}

export const completeMatch = async (matchId: string, stats: PlayerMatchStats[]) => {
    try {
        // 1. Update Match Status
        const { error: matchError } = await supabase.from('matches').update({ status: 'finished' }).eq('id', matchId);
        if (matchError) throw matchError;

        // 2. Fetch all profiles concurrently
        const profiles = await Promise.all(
            stats.map(s => getProfileById(s.profileId))
        );

        // 3. Calculate updates and execute them concurrently
        const updatePromises = stats.map((pStat, index) => {
            const profile = profiles[index];
            if (!profile) return Promise.resolve(false);

            const totalMatches = profile.stats.matches + 1;
            const currentTotalRating = profile.stats.rating * profile.stats.matches;
            const newAverageRating = (currentTotalRating + pStat.rating) / totalMatches;

            const updatedStats = {
                matches: totalMatches,
                goals: profile.stats.goals + pStat.goals,
                assists: profile.stats.assists + pStat.assists,
                rating: Number(newAverageRating.toFixed(1))
            };

            return updateProfile(pStat.profileId, { stats: updatedStats });
        });

        await Promise.all(updatePromises);
        return true;
    } catch (error) {
        console.error("Error completing match:", error);
        return false;
    }
};

// --- Initial Data Setup ---
export const initializeData = () => {
    // Database initialization is handled directly via Supabase SQL
};
