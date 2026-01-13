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
}

export interface AnalyticsEvent {
  event_name: string;
  source?: string;
  meta?: Record<string, any>;
  session_id: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'STREET' | 'RAIN NIGHT' | 'TRACK DAY' | 'DRIFT' | 'STANCE' | 'GARAGE';
  cover_url: string;
  media_type: 'image' | 'video';
  description?: string;
}

export interface PackageTier {
  name: string;
  price: string;
  features: string[];
  color: 'green' | 'purple' | 'cyan';
  popular?: boolean;
}