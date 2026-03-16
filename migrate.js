import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// The URL and Key from your environment / config
const supabaseUrl = "https://dwhitgauckaduihhansf.supabase.co"
const supabaseKey = "sb_publishable_wev78I6xcqP4_EYgLC3J3w_7S2M4hpK"

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateData() {
    console.log('Starting migration...');

    try {
        // Read local db.json
        const rawData = fs.readFileSync('./db.json', 'utf-8');
        const db = JSON.parse(rawData);

        // 1. Migrate Profiles
        if (db.profiles && db.profiles.length > 0) {
            console.log(`Migrating ${db.profiles.length} profiles...`);
            const { error: errorProfiles } = await supabase.from('profiles').upsert(db.profiles);
            if (errorProfiles) {
                console.error('Error migrating profiles:', errorProfiles);
            } else {
                console.log('Profiles migrated successfully.');
            }
        }

        // 2. Migrate Matches
        if (db.matches && db.matches.length > 0) {
            console.log(`Migrating ${db.matches.length} matches...`);
            const { error: errorMatches } = await supabase.from('matches').upsert(db.matches);
            if (errorMatches) {
                console.error('Error migrating matches:', errorMatches);
            } else {
                console.log('Matches migrated successfully.');
            }
        }

        // 3. Migrate Teams
        if (db.teams && db.teams.length > 0) {
            console.log(`Migrating ${db.teams.length} teams...`);
            const { error: errorTeams } = await supabase.from('teams').upsert(db.teams);
            if (errorTeams) {
                console.error('Error migrating teams:', errorTeams);
            } else {
                console.log('Teams migrated successfully.');
            }
        }

        // 4. Migrate Notifications
        if (db.notifications && db.notifications.length > 0) {
            console.log(`Migrating ${db.notifications.length} notifications...`);
            const { error: errorNotifs } = await supabase.from('notifications').upsert(db.notifications);
            if (errorNotifs) {
                console.error('Error migrating notifications:', errorNotifs);
            } else {
                console.log('Notifications migrated successfully.');
            }
        }

        console.log('Migration finished!');

    } catch (err) {
        console.error('Failed to read db.json or connect to Supabase:', err);
    }
}

migrateData();
