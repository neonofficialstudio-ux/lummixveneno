import React, { useEffect, useMemo, useState } from 'react';
import { fetchAdminDashboard } from '../../services/adminDashboard';

type DashboardRow = Record<string, any>;
type DashboardData = Record<string, any> | null;

const PERIOD_OPTIONS = [
  { label: '7 dias', value: 7 },
  { label: '30 dias', value: 30 },
];

const formatNumber = (value: number | null | undefined) =>
  new Intl.NumberFormat('pt-BR').format(value ?? 0);

const formatPercent = (value: number | null | undefined) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '0%';
  }
  const normalized = value > 1 ? value : value * 100;
  return `${normalized.toFixed(1)}%`;
};

const getRowLabel = (row: DashboardRow, fallback: string) =>
  row.source ?? row.origem ?? row.origin ?? row.status ?? row.label ?? fallback;

const getRowValue = (row: DashboardRow) =>
  row.count ?? row.total ?? row.value ?? row.qty ?? 0;

export const AdminDashboard: React.FC = () => {
  const [days, setDays] = useState(7);
  const [data, setData] = useState<DashboardData>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchAdminDashboard(days)
      .then((response) => {
        if (!isMounted) return;
        setData(response ?? null);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        const message = err?.message ?? 'Erro ao carregar dashboard.';
        if (message.includes('not_admin')) {
          setError('not_admin');
        } else {
          setError(message);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [days]);

  const normalized = useMemo(() => {
    const root = Array.isArray(data) ? data[0] ?? {} : data ?? {};
    const summary = root.summary ?? root.metrics ?? root;
    return {
      summary,
      whatsappBySource:
        root.whatsapp_by_source ??
        root.whatsapp_clicks_by_source ??
        root.whatsappClicksBySource ??
        [],
      eventsBySource: root.events_by_source ?? root.eventsBySource ?? [],
      leadsByStatus: root.leads_by_status ?? root.leadsByStatus ?? [],
    };
  }, [data]);

  const metrics = [
    {
      label: 'Page Views',
      value: formatNumber(normalized.summary?.page_views),
    },
    {
      label: 'Leads Submitted',
      value: formatNumber(normalized.summary?.leads_submitted),
    },
    {
      label: 'WhatsApp Clicks',
      value: formatNumber(normalized.summary?.whatsapp_clicks),
    },
    {
      label: 'Lead Rate',
      value: formatPercent(normalized.summary?.lead_rate),
    },
    {
      label: 'WhatsApp Rate',
      value: formatPercent(normalized.summary?.whatsapp_rate),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-display uppercase italic text-white">Dashboard</h2>
          <p className="text-xs text-nfs-muted uppercase tracking-widest">
            Métricas principais dos últimos {days} dias
          </p>
        </div>
        <div className="flex gap-2">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setDays(option.value)}
              className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${
                days === option.value
                  ? 'border-nfs-green bg-nfs-green text-black'
                  : 'border-white/10 text-nfs-muted hover:border-white/40 hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="text-sm text-nfs-muted uppercase tracking-widest">Carregando...</div>
      )}

      {!loading && error === 'not_admin' && (
        <div className="text-sm text-red-400 uppercase tracking-widest">Acesso negado</div>
      )}

      {!loading && error && error !== 'not_admin' && (
        <div className="text-sm text-red-400">{error}</div>
      )}

      {!loading && !error && (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="border border-white/10 bg-nfs-dark/40 px-4 py-4"
              >
                <div className="text-xs uppercase tracking-widest text-nfs-muted">
                  {metric.label}
                </div>
                <div className="text-2xl font-display italic text-white mt-3">
                  {metric.value}
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="border border-white/10 bg-black/40">
              <div className="px-4 py-3 border-b border-white/10 text-xs uppercase tracking-widest text-nfs-muted">
                WhatsApp clicks por origem
              </div>
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-white/5 text-xs uppercase tracking-widest text-nfs-muted">
                    <tr>
                      <th className="px-4 py-3 text-left">Origem</th>
                      <th className="px-4 py-3 text-right">Cliques</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(normalized.whatsappBySource as DashboardRow[]).map((row, index) => (
                      <tr key={`${getRowLabel(row, 'Origem')}-${index}`}>
                        <td className="px-4 py-3 border-t border-white/10 text-nfs-muted">
                          {getRowLabel(row, 'Origem desconhecida')}
                        </td>
                        <td className="px-4 py-3 border-t border-white/10 text-right text-white">
                          {formatNumber(getRowValue(row))}
                        </td>
                      </tr>
                    ))}
                    {(normalized.whatsappBySource as DashboardRow[]).length === 0 && (
                      <tr>
                        <td
                          colSpan={2}
                          className="px-4 py-6 text-center text-xs uppercase tracking-widest text-nfs-muted"
                        >
                          Sem dados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border border-white/10 bg-black/40">
              <div className="px-4 py-3 border-b border-white/10 text-xs uppercase tracking-widest text-nfs-muted">
                Eventos por origem (top 10)
              </div>
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-white/5 text-xs uppercase tracking-widest text-nfs-muted">
                    <tr>
                      <th className="px-4 py-3 text-left">Origem</th>
                      <th className="px-4 py-3 text-right">Eventos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(normalized.eventsBySource as DashboardRow[])
                      .slice(0, 10)
                      .map((row, index) => (
                        <tr key={`${getRowLabel(row, 'Origem')}-${index}`}>
                          <td className="px-4 py-3 border-t border-white/10 text-nfs-muted">
                            {getRowLabel(row, 'Origem desconhecida')}
                          </td>
                          <td className="px-4 py-3 border-t border-white/10 text-right text-white">
                            {formatNumber(getRowValue(row))}
                          </td>
                        </tr>
                      ))}
                    {(normalized.eventsBySource as DashboardRow[]).length === 0 && (
                      <tr>
                        <td
                          colSpan={2}
                          className="px-4 py-6 text-center text-xs uppercase tracking-widest text-nfs-muted"
                        >
                          Sem dados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="border border-white/10 bg-black/40">
            <div className="px-4 py-3 border-b border-white/10 text-xs uppercase tracking-widest text-nfs-muted">
              Leads por status
            </div>
            <div className="grid gap-3 px-4 py-4 sm:grid-cols-2 lg:grid-cols-4">
              {(normalized.leadsByStatus as DashboardRow[]).length === 0 && (
                <div className="text-xs uppercase tracking-widest text-nfs-muted">
                  Sem dados ainda
                </div>
              )}
              {(normalized.leadsByStatus as DashboardRow[]).map((row, index) => (
                <div
                  key={`${getRowLabel(row, 'Status')}-${index}`}
                  className="border border-white/10 bg-nfs-dark/40 px-4 py-3"
                >
                  <div className="text-xs uppercase tracking-widest text-nfs-muted">
                    {getRowLabel(row, 'Status')}
                  </div>
                  <div className="text-xl font-display italic text-white mt-2">
                    {formatNumber(getRowValue(row))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
