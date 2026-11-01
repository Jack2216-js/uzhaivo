
import { createClient } from '@supabase/supabase-js';

// Get env vars from .env file
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Missing env vars - using mock data');
}

// Create Supabase client - Only if env vars exist
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

console.log('[Supabase] Client initialized:', supabase ? '✅ Connected to ' + supabaseUrl : '❌ Using mock data');
