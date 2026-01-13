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

export function fireEvent(event_name: string, source?: string, meta: any = {}) {
  const session_id = getSessionId();
  const utm = getUTMs();
  trackEvent({
    event_name,
    session_id,
    source: source ?? 'direct',
    meta,
    ...utm,
  } as any);
}
