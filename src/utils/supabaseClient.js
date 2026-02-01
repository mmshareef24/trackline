import { createClient } from '@supabase/supabase-js';

// Fallback to hardcoded values if env vars are missing (Debug Fix)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ygzgenatdfmnmhidqcos.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnemdlbmF0ZGZtbm1oaWRxY29zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MjExMjAsImV4cCI6MjA4NTE5NzEyMH0.GenViHd0Jmc1StwShR7cNqNW5Sw4CJb6K4nbHJ0YVXU';

let supabaseInstance = null;
try {
  if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    try {
      const host = new URL(supabaseUrl).hostname;
      const ref = host.split('.')[0] || host;
      console.info('[Auth] Supabase client initialized', { ref, url: supabaseUrl });
    } catch {}
  } else {
    // Helpful warning during development; avoids crashing imports when envs are missing
    console.warn('[Auth] Supabase env not set. Define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  }
} catch (e) {
  console.error('[Auth] Failed to initialize Supabase client:', e);
}

export const supabase = supabaseInstance;