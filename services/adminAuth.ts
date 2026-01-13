import { supabase, isSupabaseConfigured } from './supabase';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

export async function getSession() {
  return supabase.auth.getSession();
}

export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}

export async function signInWithPassword(email: string, password: string) {
  if (!isSupabaseConfigured()) throw new Error('SUPABASE_NOT_CONFIGURED');
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  if (!isSupabaseConfigured()) return;
  return supabase.auth.signOut();
}

export async function checkIsAdmin(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const { data, error } = await supabase.rpc('is_admin');
  if (error) return false;
  return Boolean(data);
}
