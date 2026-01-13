import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../services/supabase';
import type { PortfolioItem } from '../../types';

const categories: PortfolioItem['category'][] = [
  'STREET',
  'RAIN NIGHT',
  'TRACK DAY',
  'DRIFT',
  'STANCE',
  'GARAGE',
];

type PortfolioRecord = PortfolioItem & {
  description?: string | null;
  cover_url?: string | null;
  order_index?: number | null;
  is_published?: boolean | null;
  media_urls?: any;
};

type MessageState = {
  type: 'success' | 'error';
  text: string;
} | null;

type EditState = {
  draft: PortfolioRecord;
  mediaUrlsText: string;
  error?: string | null;
} | null;

const emptyItem: Omit<PortfolioRecord, 'id'> = {
  title: '',
  category: 'STREET',
  cover_url: '',
  description: '',
  order_index: 0,
  is_published: false,
  media_urls: null,
};

const parseJsonInput = (value: string) => {
  if (!value.trim()) return { value: null, error: null };
  try {
    return { value: JSON.parse(value), error: null };
  } catch {
    return { value: null, error: 'JSON inválido.' };
  }
};

export const AdminPortfolio: React.FC = () => {
  const [items, setItems] = useState<PortfolioRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<MessageState>(null);
  const [newItem, setNewItem] = useState(emptyItem);
  const [editState, setEditState] = useState<EditState>(null);

  const loadItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setItems(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleFieldChange = (
    id: string,
    field: keyof PortfolioRecord,
    value: string | number | boolean
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const saveItem = async (item: PortfolioRecord) => {
    const payload = {
      id: item.id,
      title: item.title,
      category: item.category,
      cover_url: item.cover_url,
      description: item.description,
      order_index: Number(item.order_index ?? 0),
      is_published: item.is_published ?? false,
      media_urls: item.media_urls ?? null,
    };

    const { error } = await supabase.from('portfolio_items').upsert(payload);
    if (error) {
      setMessage({ type: 'error', text: error.message });
      return false;
    }
    setMessage({ type: 'success', text: 'Portfólio atualizado.' });
    return true;
  };

  const handleCreate = async () => {
    const payload = {
      ...newItem,
      order_index: Number(newItem.order_index) || 0,
    };

    const { error } = await supabase.from('portfolio_items').insert(payload);
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Item criado.' });
      setNewItem(emptyItem);
      loadItems();
    }
  };

  const handleTogglePublish = async (item: PortfolioRecord, isPublished: boolean) => {
    handleFieldChange(item.id, 'is_published', isPublished);
    await saveItem({ ...item, is_published: isPublished });
  };

  const handleOrderBlur = async (id: string) => {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    await saveItem(item);
  };

  const openEditModal = (item: PortfolioRecord) => {
    setEditState({
      draft: { ...item },
      mediaUrlsText: item.media_urls ? JSON.stringify(item.media_urls, null, 2) : '',
      error: null,
    });
  };

  const handleEditChange = (field: keyof PortfolioRecord, value: string) => {
    setEditState((prev) =>
      prev
        ? {
            ...prev,
            draft: { ...prev.draft, [field]: value },
          }
        : prev
    );
  };

  const handleEditSave = async () => {
    if (!editState) return;
    const { value, error } = parseJsonInput(editState.mediaUrlsText);
    if (error) {
      setEditState({ ...editState, error });
      return;
    }

    const updated = {
      ...editState.draft,
      media_urls: value,
    } as PortfolioRecord;

    const ok = await saveItem(updated);
    if (ok) {
      setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setEditState(null);
    }
  };

  const hasItems = useMemo(() => items.length > 0, [items]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display uppercase italic text-white">Portfólio</h2>
        <p className="text-xs text-nfs-muted uppercase tracking-widest">
          Gerencie itens publicados e ordem de exibição
        </p>
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

      <div className="border border-white/10 p-4 bg-nfs-dark/40">
        <h3 className="text-sm uppercase tracking-widest text-nfs-muted mb-4">Novo item</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            value={newItem.title}
            onChange={(event) => setNewItem((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Título"
            className="bg-black/40 border border-white/10 px-3 py-2 text-sm"
          />
          <select
            value={newItem.category}
            onChange={(event) =>
              setNewItem((prev) => ({
                ...prev,
                category: event.target.value as PortfolioItem['category'],
              }))
            }
            className="bg-black/40 border border-white/10 px-3 py-2 text-sm"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            value={newItem.cover_url ?? ''}
            onChange={(event) =>
              setNewItem((prev) => ({ ...prev, cover_url: event.target.value }))
            }
            placeholder="URL da capa"
            className="bg-black/40 border border-white/10 px-3 py-2 text-sm"
          />
          <input
            value={newItem.order_index ?? 0}
            onChange={(event) =>
              setNewItem((prev) => ({ ...prev, order_index: Number(event.target.value) }))
            }
            type="number"
            placeholder="Order index"
            className="bg-black/40 border border-white/10 px-3 py-2 text-sm"
          />
        </div>
        <textarea
          value={newItem.description ?? ''}
          onChange={(event) =>
            setNewItem((prev) => ({ ...prev, description: event.target.value }))
          }
          placeholder="Descrição"
          className="w-full bg-black/40 border border-white/10 px-3 py-2 text-sm mt-4"
          rows={3}
        />
        <div className="mt-4 flex items-center gap-4">
          <label className="text-xs uppercase tracking-widest text-nfs-muted">
            <input
              type="checkbox"
              checked={Boolean(newItem.is_published)}
              onChange={(event) =>
                setNewItem((prev) => ({ ...prev, is_published: event.target.checked }))
              }
              className="mr-2"
            />
            Publicar
          </label>
          <button
            onClick={handleCreate}
            className="bg-nfs-green text-black px-4 py-2 text-xs uppercase tracking-widest"
          >
            Criar
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-nfs-muted uppercase tracking-widest">Carregando...</div>
      ) : (
        <div className="space-y-4">
          {!hasItems && (
            <div className="text-sm text-nfs-muted uppercase tracking-widest">
              Nenhum item encontrado.
            </div>
          )}
          {items.map((item) => (
            <div key={item.id} className="border border-white/10 p-4 bg-black/20">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-white font-semibold">{item.title}</div>
                  <div className="text-xs text-nfs-muted">{item.category}</div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <label className="text-xs uppercase tracking-widest text-nfs-muted">
                    <input
                      type="checkbox"
                      checked={Boolean(item.is_published)}
                      onChange={(event) => handleTogglePublish(item, event.target.checked)}
                      className="mr-2"
                    />
                    Publicado
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-nfs-muted uppercase tracking-widest">
                      Order
                    </span>
                    <input
                      type="number"
                      value={item.order_index ?? 0}
                      onChange={(event) =>
                        handleFieldChange(item.id, 'order_index', Number(event.target.value))
                      }
                      onBlur={() => handleOrderBlur(item.id)}
                      className="w-20 bg-black/40 border border-white/10 px-2 py-1 text-xs"
                    />
                  </div>
                  <button
                    onClick={() => openEditModal(item)}
                    className="border border-white/20 px-4 py-2 text-xs uppercase tracking-widest hover:border-nfs-green hover:text-nfs-green"
                  >
                    Editar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <div className="bg-nfs-black border border-white/10 max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-display uppercase italic text-white">Editar item</h3>
              <button
                onClick={() => setEditState(null)}
                className="text-xs uppercase tracking-widest text-nfs-muted"
              >
                Fechar
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                value={editState.draft.title}
                onChange={(event) => handleEditChange('title', event.target.value)}
                className="bg-black/40 border border-white/10 px-3 py-2 text-sm"
                placeholder="Título"
              />
              <select
                value={editState.draft.category}
                onChange={(event) => handleEditChange('category', event.target.value)}
                className="bg-black/40 border border-white/10 px-3 py-2 text-sm"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input
                value={editState.draft.cover_url ?? ''}
                onChange={(event) => handleEditChange('cover_url', event.target.value)}
                className="bg-black/40 border border-white/10 px-3 py-2 text-sm"
                placeholder="URL da capa"
              />
              <input
                value={editState.draft.order_index ?? 0}
                onChange={(event) =>
                  handleEditChange('order_index', String(event.target.value))
                }
                type="number"
                className="bg-black/40 border border-white/10 px-3 py-2 text-sm"
                placeholder="Order"
              />
            </div>
            <textarea
              value={editState.draft.description ?? ''}
              onChange={(event) => handleEditChange('description', event.target.value)}
              className="w-full bg-black/40 border border-white/10 px-3 py-2 text-sm"
              rows={3}
              placeholder="Descrição"
            />
            <div>
              <label className="block text-xs uppercase tracking-widest text-nfs-muted mb-2">
                Media URLs (JSON)
              </label>
              <textarea
                value={editState.mediaUrlsText}
                onChange={(event) =>
                  setEditState((prev) =>
                    prev ? { ...prev, mediaUrlsText: event.target.value, error: null } : prev
                  )
                }
                className="w-full bg-black/40 border border-white/10 px-3 py-2 text-sm font-mono"
                rows={4}
                placeholder='["https://..."]'
              />
              {editState.error && (
                <div className="text-xs text-red-400 mt-1">{editState.error}</div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setEditState(null)}
                className="border border-white/20 px-4 py-2 text-xs uppercase tracking-widest"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditSave}
                className="bg-nfs-green text-black px-4 py-2 text-xs uppercase tracking-widest"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
