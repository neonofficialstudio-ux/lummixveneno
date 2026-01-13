import { getSiteSettings } from './supabase';

export type SiteConfig = {
  whatsappNumber: string;
  capacityMonthly: number;
  capacityRemaining: number;
  nextWindowDate?: string;
};

const envWhatsapp = import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined;

export async function loadSiteConfig(): Promise<SiteConfig> {
  // defaults seguros (sem prometer nada)
  const defaults: SiteConfig = {
    whatsappNumber: envWhatsapp ?? '55XXXXXXXXXXX',
    capacityMonthly: 40,
    capacityRemaining: 12,
    nextWindowDate: undefined,
  };

  const settings = await getSiteSettings([
    'whatsapp_number',
    'capacity_monthly',
    'capacity_remaining',
    'next_window',
  ]);

  // site_settings guarda jsonb; pode vir string/number/obj
  const whatsappNumber = (settings.whatsapp_number ?? defaults.whatsappNumber) as any;
  const capacityMonthly = Number(settings.capacity_monthly ?? defaults.capacityMonthly);
  const capacityRemaining = Number(settings.capacity_remaining ?? defaults.capacityRemaining);
  const nextWindowDate =
    typeof settings.next_window === 'object' ? settings.next_window?.date : undefined;

  return {
    whatsappNumber: String(whatsappNumber).replace(/\D/g, ''),
    capacityMonthly: Number.isFinite(capacityMonthly)
      ? capacityMonthly
      : defaults.capacityMonthly,
    capacityRemaining: Number.isFinite(capacityRemaining)
      ? capacityRemaining
      : defaults.capacityRemaining,
    nextWindowDate,
  };
}
