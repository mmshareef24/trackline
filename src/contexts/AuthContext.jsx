import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'auth_user';

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// Demo users for quick sign-in
export const demoUsers = [
  {
    id: 'demo-admin',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'admin',
    department: 'engineering',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=96',
  },
  {
    id: 'demo-manager',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    role: 'manager',
    department: 'marketing',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96',
  },
  {
    id: 'demo-analyst',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    role: 'analyst',
    department: 'sales',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96',
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load from storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  // Persist to storage
  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, [user]);

  const login = (u) => setUser(u);
  const logout = () => setUser(null);

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};