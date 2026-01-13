import { createClient } from '@supabase/supabase-js';
import type { Lead, AnalyticsEvent } from '../types';

// Credentials provided for this environment (fallback)
const PREVIEW_URL = 'https://huonvbjnuuteqbazlaul.supabase.co';
const PREVIEW_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1b252YmpudXV0ZXFiYXpsYXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMTM0MTcsImV4cCI6MjA4Mzg4OTQxN30.e3ejMVPf_wUAkTz1MT97RV3qlHl_SWdP9wtcVJw6-VE';

// Prioritize environment variables, fallback to preview credentials if missing
// Use optional chaining (?.) to prevent crash if import.meta.env is undefined
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || PREVIEW_URL;
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || PREVIEW_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Falhar rápido evita “funciona visualmente mas não salva nada”
  console.warn('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function submitLead(lead: Lead) {
  const { data, error } = await supabase.from('leads').insert([lead]).select();
  if (error) throw error;
  return data;
}

export async function trackEvent(event: AnalyticsEvent) {
  // analytics deve falhar silenciosamente
  try {
    const { error } = await supabase.from('events').insert([event]);
    if (error) console.warn('Tracking failed:', error.message);
  } catch {}
}

export async function getSiteSettings(keys: string[]) {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key,value')
    .in('key', keys);

  if (error) throw error;
  const map: Record<string, any> = {};
  for (const row of data ?? []) map[row.key] = row.value;
  return map;
}