import { trackEvent } from './supabase';

const SESSION_KEY = 'lw_session_id';

export function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `sess_${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function getUTMs() {
  const url = new URL(window.location.href);
  const get = (k: string) => url.searchParams.get(k) ?? undefined;
  return {
    utm_source: get('utm_source'),
    utm_medium: get('utm_medium'),
    utm_campaign: get('utm_campaign'),
    utm_content: get('utm_content'),
    utm_term: get('utm_term'),
  };
}

function compactMeta(meta: unknown) {
  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) return {};
  const safe: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(meta)) {
    if (value === null) {
      safe[key] = null;
      continue;
    }
    if (typeof value === 'string') {
      safe[key] = value.length > 120 ? value.slice(0, 120) : value;
      continue;
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      safe[key] = value;
    }
  }
  return safe;
}

function normalizeMeta(event_name: string, meta: unknown) {
  if (event_name.startsWith('scroll_')) return {};
  if (event_name === 'cta_whatsapp_click') return { section: 'hero' };
  if (event_name === 'portfolio_opened') {
    if (!meta || typeof meta !== 'object' || Array.isArray(meta)) return {};
    const m = meta as Record<string, unknown>;
    const id = typeof m.id === 'string' || typeof m.id === 'number' ? m.id : undefined;
    const category =
      typeof m.category === 'string' || typeof m.category === 'number' ? m.category : undefined;
    return {
      ...(id !== undefined ? { id } : {}),
      ...(category !== undefined ? { category } : {}),
    };
  }
  return compactMeta(meta);
}

export function fireEvent(event_name: string, source?: string, meta: any = {}) {
  const session_id = getSessionId();
  const utm = getUTMs();
  trackEvent({
    event_name,
    session_id,
    source: source ?? 'direct',
    meta: normalizeMeta(event_name, meta),
    ...utm,
  } as any);
}
