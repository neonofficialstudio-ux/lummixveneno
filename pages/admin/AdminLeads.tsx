import React, { useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../services/supabase';
import type { Lead } from '../../types';

const statusLabels: Record<NonNullable<Lead['status']>, string> = {
  new: 'Novo',
  contacted: 'Contactado',
  won: 'Fechado',
  lost: 'Perdido',
};

const PAGE_SIZE = 200;

type ToastState = {
  type: 'success' | 'error';
  message: string;
} | null;

export const AdminLeads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | NonNullable<Lead['status']>>(
    'all'
  );
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = (nextToast: ToastState) => {
    setToast(nextToast);
    if (!nextToast) return;
    window.setTimeout(() => setToast(null), 3000);
  };

  const fetchLeads = async (pageIndex: number, shouldReplace: boolean) => {
    if (!isSupabaseConfigured()) {
      setError('Supabase não configurado.');
      setLoading(false);
      return;
    }

    if (pageIndex === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    setError(null);
    const start = pageIndex * PAGE_SIZE;
    const end = start + PAGE_SIZE - 1;

    const { data, error: fetchError } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .range(start, end);

    if (fetchError) {
      setError(fetchError.message);
    } else {
      const rows = data ?? [];
      setHasMore(rows.length === PAGE_SIZE);
      setLeads((prev) => (shouldReplace ? rows : [...prev, ...rows]));
    }

    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchLeads(0, true);
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

  const handleStatusChange = async (leadId: string | undefined, status: Lead['status']) => {
    if (!leadId || !status) return;
    const { error: updateError } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', leadId);

    if (updateError) {
      showToast({ type: 'error', message: updateError.message });
      return;
    }

    setLeads((prev) =>
      prev.map((lead) => (lead.id === leadId ? { ...lead, status } : lead))
    );
    showToast({ type: 'success', message: 'Status atualizado.' });
  };

  const formatWhatsappNumber = (whatsapp?: string) => (whatsapp ?? '').replace(/\D/g, '');

  const handleCopyWhatsapp = async (whatsapp?: string) => {
    if (!whatsapp) return;
    try {
      await navigator.clipboard.writeText(whatsapp);
      showToast({ type: 'success', message: 'WhatsApp copiado.' });
    } catch {
      showToast({ type: 'error', message: 'Não foi possível copiar.' });
    }
  };

  const handleOpenWhatsapp = (lead: Lead) => {
    const whatsapp = formatWhatsappNumber(lead.whatsapp);
    if (!whatsapp) return;
    const message = `Olá ${lead.name ?? ''}! Sobre seu ${
      lead.car_model ?? 'carro'
    } no pacote ${lead.package_interest ?? 'Lummi'} - podemos conversar?`;
    const link = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleLoadMore = async () => {
    if (!hasMore || loadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchLeads(nextPage, false);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed right-6 top-6 z-50 rounded border px-4 py-3 text-sm uppercase tracking-widest shadow-lg ${
            toast.type === 'success'
              ? 'border-nfs-green text-nfs-green bg-black/90'
              : 'border-red-500 text-red-400 bg-black/90'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-display uppercase italic text-white">Leads</h2>
          <p className="text-xs text-nfs-muted uppercase tracking-widest">
            Últimos {leads.length} registros
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
        <div className="space-y-4">
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
                      <div className="text-xs text-nfs-muted">{lead.car_model}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{lead.whatsapp}</div>
                      <div className="flex flex-col gap-1 mt-2">
                        <button
                          onClick={() => handleCopyWhatsapp(lead.whatsapp)}
                          className="text-xs text-nfs-green uppercase tracking-widest"
                        >
                          Copiar WhatsApp
                        </button>
                        <button
                          onClick={() => handleOpenWhatsapp(lead)}
                          className="text-xs text-nfs-purple uppercase tracking-widest"
                        >
                          Abrir no WhatsApp
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-nfs-muted">
                      {lead.package_interest ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.status ?? 'new'}
                        onChange={(event) =>
                          handleStatusChange(
                            lead.id,
                            event.target.value as NonNullable<Lead['status']>
                          )
                        }
                        className="bg-black/40 border border-white/10 px-3 py-2 text-xs uppercase tracking-widest"
                      >
                        <option value="new">{statusLabels.new}</option>
                        <option value="contacted">{statusLabels.contacted}</option>
                        <option value="won">{statusLabels.won}</option>
                        <option value="lost">{statusLabels.lost}</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-nfs-muted">
                      {lead.created_at
                        ? new Date(lead.created_at).toLocaleString('pt-BR')
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleStatusChange(lead.id, 'contacted')}
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
          {hasMore && (
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="border border-white/20 px-4 py-2 text-xs uppercase tracking-widest hover:border-nfs-green hover:text-nfs-green disabled:opacity-60"
            >
              {loadingMore ? 'Carregando...' : 'Carregar mais'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
