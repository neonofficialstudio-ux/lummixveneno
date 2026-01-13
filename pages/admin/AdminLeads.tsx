import React, { useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../services/supabase';
import type { Lead } from '../../types';

const statusLabels: Record<NonNullable<Lead['status']>, string> = {
  new: 'Novo',
  contacted: 'Contactado',
  won: 'Fechado',
  lost: 'Perdido',
};

export const AdminLeads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | NonNullable<Lead['status']>>(
    'all'
  );
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = async () => {
    if (!isSupabaseConfigured()) {
      setError('Supabase não configurado.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setLeads(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();
    return leads.filter((lead) => {
      if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
      if (!query) return true;
      return (
        lead.name?.toLowerCase().includes(query) ||
        lead.whatsapp?.toLowerCase().includes(query)
      );
    });
  }, [leads, search, statusFilter]);

  const handleMarkContacted = async (leadId?: string) => {
    if (!leadId) return;
    const { error: updateError } = await supabase
      .from('leads')
      .update({ status: 'contacted' })
      .eq('id', leadId);

    if (!updateError) {
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, status: 'contacted' } : lead
        )
      );
    }
  };

  const handleCopyWhatsapp = async (whatsapp?: string) => {
    if (!whatsapp) return;
    try {
      await navigator.clipboard.writeText(whatsapp);
    } catch {
      // fallback silently
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-display uppercase italic text-white">Leads</h2>
          <p className="text-xs text-nfs-muted uppercase tracking-widest">
            Últimos 200 registros
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as 'all' | NonNullable<Lead['status']>)
            }
            className="bg-black/40 border border-white/10 px-3 py-2 text-xs uppercase tracking-widest"
          >
            <option value="all">Todos</option>
            <option value="new">Novos</option>
            <option value="contacted">Contactados</option>
            <option value="won">Fechados</option>
            <option value="lost">Perdidos</option>
          </select>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nome ou WhatsApp"
            className="bg-black/40 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-nfs-green"
          />
        </div>
      </div>

      {loading && (
        <div className="text-sm text-nfs-muted uppercase tracking-widest">Carregando...</div>
      )}
      {error && <div className="text-sm text-red-400">{error}</div>}

      {!loading && !error && (
        <div className="overflow-auto border border-white/10">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-widest text-nfs-muted">
              <tr>
                <th className="px-4 py-3 text-left">Nome</th>
                <th className="px-4 py-3 text-left">WhatsApp</th>
                <th className="px-4 py-3 text-left">Pacote</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Criado</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-t border-white/5">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">{lead.name}</div>
                    <div className="text-xs text-nfs-muted">{lead.city}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{lead.whatsapp}</div>
                    <button
                      onClick={() => handleCopyWhatsapp(lead.whatsapp)}
                      className="text-xs text-nfs-green uppercase tracking-widest"
                    >
                      Copiar WhatsApp
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs text-nfs-muted">
                    {lead.package_interest ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 border border-white/10 text-xs uppercase tracking-widest">
                      {lead.status ? statusLabels[lead.status] : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-nfs-muted">
                    {lead.created_at ? new Date(lead.created_at).toLocaleString('pt-BR') : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleMarkContacted(lead.id)}
                      className="text-xs uppercase tracking-widest border border-white/20 px-3 py-2 hover:border-nfs-green hover:text-nfs-green"
                    >
                      Marcar contactado
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-nfs-muted">
                    Nenhum lead encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
