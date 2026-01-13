import { createClient } from '@supabase/supabase-js';
import type { Lead, AnalyticsEvent } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase = createClient(SUPABASE_URL ?? '', SUPABASE_ANON_KEY ?? '');

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export async function submitLead(lead: Lead) {
  if (!isSupabaseConfigured()) throw new Error('SUPABASE_NOT_CONFIGURED');
  const { data, error } = await supabase.from('leads').insert([lead]).select();
  if (error) throw error;
  return data;
}

export async function trackEvent(event: AnalyticsEvent) {
  // tracking deve falhar silenciosamente
  if (!isSupabaseConfigured()) return;
  try {
    const { error } = await supabase.from('events').insert([event]);
    if (error) console.warn('Tracking failed:', error.message);
  } catch {}
}

export async function getSiteSettings(keys: string[]) {
  if (!isSupabaseConfigured()) return {};
  const { data, error } = await supabase
    .from('site_settings')
    .select('key,value')
    .in('key', keys);

  if (error) throw error;
  const map: Record<string, any> = {};
  for (const row of data ?? []) map[row.key] = row.value;
  return map;
}

export async function getPublishedPortfolio() {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('is_published', true)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getPublishedTestimonials() {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_published', true)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data ?? [];
}
