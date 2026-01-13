export interface Lead {
  id?: string;
  created_at?: string;

  name: string;
  whatsapp: string;
  city: string;
  car_model: string;
  package_interest?: 'STARTER' | 'PRO' | 'LEGEND';
  message?: string;

  source: string;
  status?: 'new' | 'contacted' | 'won' | 'lost';
  consent: boolean;

  // hardening / tracking
  session_id?: string;
  honeypot?: string;

  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export interface AnalyticsEvent {
  id?: string;
  created_at?: string;

  event_name: string;
  session_id: string;
  source?: string;
  meta?: Record<string, any>;

  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;

  ip_hash?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'STREET' | 'RAIN NIGHT' | 'TRACK DAY' | 'DRIFT' | 'STANCE' | 'GARAGE';
  cover_url?: string | null;
  media_urls?: any;
  description?: string | null;
  results?: any;
}

export interface Testimonial {
  id: string;
  name: string;
  city?: string | null;
  car?: string | null;
  text: string;
  avatar_url?: string | null;
}

export interface PackageTier {
  name: string;
  price: string;
  features: string[];
  color: 'green' | 'purple' | 'cyan';
  popular?: boolean;
}
