/**
 * Storage Management for BarrioFútbol
 * Using json-server as a local database
 */

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
    type: 'team_invite' | 'match_invite' | 'match_cancel' | 'match_update' | 'system';
    fromId: string;
    fromName: string;
    toId: string;
    data: {
        teamId?: string;
        matchId?: string;
        message?: string;
    };
    status: 'pending' | 'accepted' | 'rejected' | 'read' | 'unread';
    timestamp: string;
}

const BASE_URL = 'http://localhost:3001';

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
        const response = await fetch(`${BASE_URL}/profiles`);
        const profiles = await response.json();
        return profiles.map((p: any) => ({
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
        const response = await fetch(`${BASE_URL}/profiles/${id}`);
        if (!response.ok) return null;
        const profile = await response.json();
        profile.stats = profile.stats || { matches: 0, goals: 0, assists: 0, rating: 5.0 };
        return profile;
    } catch (error) {
        return null;
    }
};

export const saveProfile = async (profile: Profile) => {
    try {
        const profiles = await getProfiles();
        const existing = profiles.find(p => p.id === profile.id || p.email === profile.email);

        const profileToSave = {
            ...profile,
            stats: profile.stats || { matches: 0, goals: 0, assists: 0, rating: 5.0 }
        };

        let response;
        if (existing) {
            response = await fetch(`${BASE_URL}/profiles/${existing.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileToSave)
            });
        } else {
            response = await fetch(`${BASE_URL}/profiles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileToSave)
            });
        }
        return response.ok;
    } catch (error) {
        console.error("Error saving profile:", error);
        return false;
    }
};

export const updateProfile = async (id: string, data: Partial<Profile>) => {
    try {
        const profile = await getProfileById(id);
        if (profile) {
            const updatedProfile = { ...profile, ...data };
            await fetch(`${BASE_URL}/profiles/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            // Update local session if it's the current user
            const currentUser = getCurrentUser();
            if (currentUser && currentUser.id === id) {
                setCurrentUser(updatedProfile);
            }
            return true;
        }
        return false;
    } catch (error) {
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
        const response = await fetch(`${BASE_URL}/matches`);
        const matches = await response.json();
        return matches.map((m: any) => ({
            ...m,
            confirmedPlayerIds: m.confirmedPlayerIds || []
        }));
    } catch (error) {
        return [];
    }
};

export const saveMatch = async (match: Match) => {
    try {
        const matchToSave = {
            ...match,
            status: match.status || 'scheduled'
        };
        const response = await fetch(`${BASE_URL}/matches`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(matchToSave)
        });
        return response.ok;
    } catch (error) {
        console.error("Error saving match:", error);
        return false;
    }
};

export const deleteMatch = async (matchId: string) => {
    try {
        await fetch(`${BASE_URL}/matches/${matchId}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error("Error deleting match:", error);
    }
};

export const joinMatch = async (matchId: string, userId: string) => {
    try {
        const response = await fetch(`${BASE_URL}/matches/${matchId}`);
        const match = await response.json();

        if (!match.confirmedPlayerIds.includes(userId)) {
            match.confirmedPlayerIds.push(userId);
            await fetch(`${BASE_URL}/matches/${matchId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ confirmedPlayerIds: match.confirmedPlayerIds })
            });

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
        const response = await fetch(`${BASE_URL}/matches/${matchId}`);
        const match = await response.json();

        const index = match.confirmedPlayerIds.indexOf(userId);
        if (index >= 0) {
            match.confirmedPlayerIds.splice(index, 1);
            await fetch(`${BASE_URL}/matches/${matchId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ confirmedPlayerIds: match.confirmedPlayerIds })
            });

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
        const response = await fetch(`${BASE_URL}/teams`);
        const teams = await response.json();
        return teams.map((t: any) => ({
            ...t,
            members: t.members || [t.creatorId]
        }));
    } catch (error) {
        return [];
    }
};

export const saveTeam = async (team: Team) => {
    try {
        const response = await fetch(`${BASE_URL}/teams`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...team, members: [team.creatorId] })
        });
        return response.ok;
    } catch (error) {
        console.error("Error saving team:", error);
        return false;
    }
};

export const updateTeam = async (teamId: string, data: Partial<Team>) => {
    try {
        const response = await fetch(`${BASE_URL}/teams/${teamId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.ok;
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
        const response = await fetch(`${BASE_URL}/notifications?toId=${userId}`);
        const notifications = await response.json();
        return notifications.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
        return [];
    }
};

export const addNotification = async (n: Omit<Notification, 'id' | 'timestamp' | 'status'>) => {
    try {
        const newNote: Notification = {
            ...n,
            id: generateId(),
            timestamp: new Date().toISOString(),
            status: 'unread'
        };
        await fetch(`${BASE_URL}/notifications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newNote)
        });
        return newNote;
    } catch (error) {
        console.error("Error adding notification:", error);
        return null;
    }
};

export const updateNotificationStatus = async (id: string, status: Notification['status']) => {
    try {
        await fetch(`${BASE_URL}/notifications/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        return true;
    } catch (error) {
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
        await fetch(`${BASE_URL}/matches/${matchId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'finished' })
        });

        // 2. Update each player's profile
        for (const pStat of stats) {
            const profile = await getProfileById(pStat.profileId);
            if (profile) {
                const totalMatches = profile.stats.matches + 1;
                // Calculate new average rating
                const currentTotalRating = profile.stats.rating * profile.stats.matches;
                const newAverageRating = (currentTotalRating + pStat.rating) / totalMatches;

                const updatedStats = {
                    matches: totalMatches,
                    goals: profile.stats.goals + pStat.goals,
                    assists: profile.stats.assists + pStat.assists,
                    rating: Number(newAverageRating.toFixed(1))
                };

                await updateProfile(pStat.profileId, { stats: updatedStats });
            }
        }
        return true;
    } catch (error) {
        console.error("Error completing match:", error);
        return false;
    }
};

// --- Initial Data Setup ---
export const initializeData = () => {
    // With json-server, we don't need manual initialization here
    // as it's handled by the db.json file
};
