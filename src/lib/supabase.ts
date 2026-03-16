import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseKey } from './supabase-config';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
