import { supabase, isSupabaseConfigured } from './supabase';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

type Profile = {
  id: string;
  email?: string | null;
  display_name?: string | null;
  city?: string | null;
};

type SignUpOptions = {
  displayName?: string;
};

export async function signInWithPassword(email: string, password: string) {
  if (!isSupabaseConfigured()) throw new Error('SUPABASE_NOT_CONFIGURED');
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithPassword(
  email: string,
  password: string,
  options?: SignUpOptions
) {
  if (!isSupabaseConfigured()) throw new Error('SUPABASE_NOT_CONFIGURED');
  return supabase.auth.signUp({
    email,
    password,
    options: options?.displayName
      ? {
          data: {
            display_name: options.displayName,
          },
        }
      : undefined,
  });
}

export async function signOut() {
  if (!isSupabaseConfigured()) return;
  return supabase.auth.signOut();
}

export async function getSession() {
  return supabase.auth.getSession();
}

export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}

export async function getProfile(user?: User | null) {
  if (!isSupabaseConfigured()) throw new Error('SUPABASE_NOT_CONFIGURED');
  if (!user) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, display_name, city')
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw error;
  return (data as Profile | null) ?? null;
}

export async function updateProfile(
  user: User,
  updates: { display_name?: string | null; city?: string | null }
) {
  if (!isSupabaseConfigured()) throw new Error('SUPABASE_NOT_CONFIGURED');
  const { data, error } = await supabase
    .from('profiles')
    .update({
      display_name: updates.display_name,
      city: updates.city,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select('id, email, display_name, city')
    .maybeSingle();

  if (error) throw error;
  return (data as Profile | null) ?? null;
}

export type { Profile };
