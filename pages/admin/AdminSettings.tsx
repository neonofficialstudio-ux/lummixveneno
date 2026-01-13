import React, { useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../../services/supabase';

const SETTINGS_KEYS = [
  'capacity_monthly',
  'capacity_remaining',
  'next_window',
  'whatsapp_number',
] as const;

type SettingsState = Record<(typeof SETTINGS_KEYS)[number], string>;

type MessageState = {
  type: 'success' | 'error';
  text: string;
} | null;

const defaultState: SettingsState = {
  capacity_monthly: '',
  capacity_remaining: '',
  next_window: '',
  whatsapp_number: '',
};

const isValidDate = (value: string) => {
  if (!value) return false;
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime());
};

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>(defaultState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<MessageState>(null);

  useEffect(() => {
    const loadSettings = async () => {
      if (!isSupabaseConfigured()) {
        setMessage({ type: 'error', text: 'Supabase não configurado.' });
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('key,value')
        .in('key', SETTINGS_KEYS);

      if (error) {
        setMessage({ type: 'error', text: error.message });
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

  const errors = useMemo(() => {
    const nextErrors: Partial<Record<keyof SettingsState, string>> = {};

    if (!settings.capacity_monthly.trim()) {
      nextErrors.capacity_monthly = 'Obrigatório.';
    } else if (!Number.isFinite(Number(settings.capacity_monthly))) {
      nextErrors.capacity_monthly = 'Informe um número válido.';
    }

    if (!settings.capacity_remaining.trim()) {
      nextErrors.capacity_remaining = 'Obrigatório.';
    } else if (!Number.isFinite(Number(settings.capacity_remaining))) {
      nextErrors.capacity_remaining = 'Informe um número válido.';
    }

    if (!settings.whatsapp_number.trim()) {
      nextErrors.whatsapp_number = 'Obrigatório.';
    } else if (/\D/.test(settings.whatsapp_number)) {
      nextErrors.whatsapp_number = 'Use apenas números.';
    }

    if (!settings.next_window.trim()) {
      nextErrors.next_window = 'Obrigatório.';
    } else if (!isValidDate(settings.next_window)) {
      nextErrors.next_window = 'Data inválida.';
    }

    return nextErrors;
  }, [settings]);

  const hasErrors = Object.keys(errors).length > 0;

  const handleChange = (key: keyof SettingsState, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (hasErrors) {
      setMessage({ type: 'error', text: 'Revise os campos obrigatórios.' });
      return;
    }

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
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Configurações salvas com sucesso.' });
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
              disabled={saving}
              className={`w-full bg-black/40 border px-3 py-2 text-sm ${
                errors.capacity_monthly ? 'border-red-500' : 'border-white/10'
              }`}
            />
            {errors.capacity_monthly && (
              <div className="text-xs text-red-400 mt-1">{errors.capacity_monthly}</div>
            )}
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-nfs-muted mb-2">
              Capacidade restante
            </label>
            <input
              value={settings.capacity_remaining}
              onChange={(event) => handleChange('capacity_remaining', event.target.value)}
              type="number"
              disabled={saving}
              className={`w-full bg-black/40 border px-3 py-2 text-sm ${
                errors.capacity_remaining ? 'border-red-500' : 'border-white/10'
              }`}
            />
            {errors.capacity_remaining && (
              <div className="text-xs text-red-400 mt-1">{errors.capacity_remaining}</div>
            )}
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-nfs-muted mb-2">
              Próxima janela
            </label>
            <input
              value={settings.next_window}
              onChange={(event) => handleChange('next_window', event.target.value)}
              className={`w-full bg-black/40 border px-3 py-2 text-sm ${
                errors.next_window ? 'border-red-500' : 'border-white/10'
              }`}
              type="date"
              disabled={saving}
            />
            {errors.next_window && (
              <div className="text-xs text-red-400 mt-1">{errors.next_window}</div>
            )}
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-nfs-muted mb-2">
              WhatsApp
            </label>
            <input
              value={settings.whatsapp_number}
              onChange={(event) =>
                handleChange('whatsapp_number', event.target.value.replace(/\D/g, ''))
              }
              className={`w-full bg-black/40 border px-3 py-2 text-sm ${
                errors.whatsapp_number ? 'border-red-500' : 'border-white/10'
              }`}
              placeholder="5511999999999"
              disabled={saving}
            />
            {errors.whatsapp_number && (
              <div className="text-xs text-red-400 mt-1">{errors.whatsapp_number}</div>
            )}
          </div>
          {message && (
            <div
              className={`text-sm ${
                message.type === 'success' ? 'text-nfs-green' : 'text-red-400'
              }`}
            >
              {message.text}
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={saving || hasErrors}
            className="bg-nfs-green text-black px-6 py-2 font-display uppercase italic tracking-widest disabled:opacity-60"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      )}
    </div>
  );
};
