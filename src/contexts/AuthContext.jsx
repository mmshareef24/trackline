import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { upsertAuthUserOnLogin } from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const mapUser = (supaUser) => {
  if (!supaUser) return null;
  const meta = supaUser.user_metadata || {};
  const appMeta = supaUser.app_metadata || {};
  const nameFallback = supaUser.email?.split('@')[0] || 'User';
  return {
    id: supaUser.id,
    email: supaUser.email,
    name: meta.full_name || meta.name || nameFallback,
    role: appMeta.role || meta.role || '',
    avatar: meta.avatar_url || '',
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from current session
  useEffect(() => {
    let unsub = null;
    (async () => {
      try {
        if (!supabase) {
          // Supabase not configured; keep user null and stop loading
          return;
        }
        const { data: sessionData } = await supabase.auth.getSession();
        setSession(sessionData?.session || null);
        setUser(mapUser(sessionData?.session?.user || null));
      } finally {
        setLoading(false);
      }
    })();

    if (supabase) {
      unsub = supabase.auth.onAuthStateChange(async (_event, session) => {
        setSession(session || null);
        const mapped = mapUser(session?.user || null);
        setUser(mapped);
        if (session?.user) {
          // Best-effort upsert of app user record tied to auth user
          try {
            await upsertAuthUserOnLogin(session.user);
          } catch (e) {
            console.warn('[Auth] Upsert user failed:', e?.message || e);
          }
        }
      });
    }

    return () => {
      // onAuthStateChange returns { data: { subscription } }
      try {
        unsub?.data?.subscription?.unsubscribe?.();
      } catch {}
    };
  }, []);

  const login = async ({ email, password }) => {
    if (!supabase) {
      throw new Error('Authentication not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setUser(mapUser(data?.user || null));
    return data?.user || null;
  };

  const logout = async () => {
    if (!supabase) {
      setUser(null);
      return;
    }
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Error signing out:', e);
    } finally {
      setUser(null);
      setSession(null);
    }
  };

  const value = useMemo(() => ({ user, session, loading, login, logout }), [user, session, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};