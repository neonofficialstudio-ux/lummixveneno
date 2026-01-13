import React, { useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../../services/supabase';

const SETTINGS_KEYS = [
  'capacity_monthly',
  'capacity_remaining',
  'next_window',
  'whatsapp_number',
] as const;

type SettingsState = Record<(typeof SETTINGS_KEYS)[number], string>;

const defaultState: SettingsState = {
  capacity_monthly: '',
  capacity_remaining: '',
  next_window: '',
  whatsapp_number: '',
};

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>(defaultState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      if (!isSupabaseConfigured()) {
        setMessage('Supabase não configurado.');
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('site_settings')
        .select('key,value')
        .in('key', SETTINGS_KEYS);

      if (error) {
        setMessage(error.message);
      } else {
        const nextState = { ...defaultState } as SettingsState;
        data?.forEach((row) => {
          if (row.key in nextState) {
            nextState[row.key as keyof SettingsState] = String(row.value ?? '');
          }
        });
        setSettings(nextState);
      }
      setLoading(false);
    };

    loadSettings();
  }, []);

  const handleChange = (key: keyof SettingsState, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    const payload = SETTINGS_KEYS.map((key) => {
      let value: string | number | null = settings[key];
      if (key === 'capacity_monthly' || key === 'capacity_remaining') {
        value = settings[key] ? Number(settings[key]) : null;
      }
      return { key, value };
    });

    const { error } = await supabase.from('site_settings').upsert(payload, {
      onConflict: 'key',
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Configurações salvas com sucesso.');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-display uppercase italic text-white">Settings</h2>
        <p className="text-xs text-nfs-muted uppercase tracking-widest">
          Ajustes do site em tempo real
        </p>
      </div>

      {loading ? (
        <div className="text-sm text-nfs-muted uppercase tracking-widest">Carregando...</div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-nfs-muted mb-2">
              Capacidade mensal
            </label>
            <input
              value={settings.capacity_monthly}
              onChange={(event) => handleChange('capacity_monthly', event.target.value)}
              type="number"
              className="w-full bg-black/40 border border-white/10 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-nfs-muted mb-2">
              Capacidade restante
            </label>
            <input
              value={settings.capacity_remaining}
              onChange={(event) => handleChange('capacity_remaining', event.target.value)}
              type="number"
              className="w-full bg-black/40 border border-white/10 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-nfs-muted mb-2">
              Próxima janela
            </label>
            <input
              value={settings.next_window}
              onChange={(event) => handleChange('next_window', event.target.value)}
              className="w-full bg-black/40 border border-white/10 px-3 py-2 text-sm"
              placeholder="2024-10-01"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-nfs-muted mb-2">
              WhatsApp
            </label>
            <input
              value={settings.whatsapp_number}
              onChange={(event) => handleChange('whatsapp_number', event.target.value)}
              className="w-full bg-black/40 border border-white/10 px-3 py-2 text-sm"
              placeholder="5511999999999"
            />
          </div>
          {message && <div className="text-sm text-nfs-green">{message}</div>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-nfs-green text-black px-6 py-2 font-display uppercase italic tracking-widest disabled:opacity-60"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      )}
    </div>
  );
};
