import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import {
  getProfile,
  getSession,
  onAuthStateChange,
  signInWithPassword,
  signOut as signOutService,
  signUpWithPassword,
  type Profile,
} from '../services/auth';
import { isSupabaseConfigured } from '../services/supabase';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (nextUser: User | null) => {
    if (!nextUser) {
      setProfile(null);
      return;
    }

    try {
      const data = await getProfile(nextUser);
      setProfile(data);
    } catch (error) {
      console.warn('Falha ao carregar perfil:', error);
      setProfile(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    await loadProfile(user);
  }, [loadProfile, user]);

  useEffect(() => {
    let isMounted = true;

    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const bootstrap = async () => {
      const { data } = await getSession();
      if (!isMounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      await loadProfile(data.session?.user ?? null);
      setLoading(false);
    };

    bootstrap();

    const { data: subscription } = onAuthStateChange(async (_event, nextSession) => {
      if (!isMounted) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      await loadProfile(nextSession?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription?.subscription?.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await signInWithPassword(email, password);
    if (error) throw error;
    const { data } = await getSession();
    setSession(data.session);
    setUser(data.session?.user ?? null);
    await loadProfile(data.session?.user ?? null);
  }, [loadProfile]);

  const signUp = useCallback(
    async (email: string, password: string, displayName?: string) => {
      const { error } = await signUpWithPassword(email, password, {
        displayName,
      });
      if (error) throw error;
    },
    []
  );

  const signOut = useCallback(async () => {
    await signOutService();
    setSession(null);
    setUser(null);
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [loading, profile, session, signIn, signOut, signUp, user, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
