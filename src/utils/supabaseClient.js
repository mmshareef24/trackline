import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance = null;
try {
  if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  } else {
    // Helpful warning during development; avoids crashing imports when envs are missing
    console.warn('[Auth] Supabase env not set. Define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  }
} catch (e) {
  console.error('[Auth] Failed to initialize Supabase client:', e);
}

export const supabase = supabaseInstance;