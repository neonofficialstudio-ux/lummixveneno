import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../services/supabase';

type TestimonialRecord = {
  id: string;
  name: string;
  quote?: string | null;
  vehicle?: string | null;
  order_index?: number | null;
  is_published?: boolean | null;
};

type MessageState = {
  type: 'success' | 'error';
  text: string;
} | null;

type EditState = {
  draft: TestimonialRecord;
} | null;

const emptyItem: Omit<TestimonialRecord, 'id'> = {
  name: '',
  quote: '',
  vehicle: '',
  order_index: 0,
  is_published: false,
};

export const AdminTestimonials: React.FC = () => {
  const [items, setItems] = useState<TestimonialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<MessageState>(null);
  const [newItem, setNewItem] = useState(emptyItem);
  const [editState, setEditState] = useState<EditState>(null);

  const loadItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('testimonials')
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
    field: keyof TestimonialRecord,
    value: string | number | boolean
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const saveItem = async (item: TestimonialRecord) => {
    const payload = {
      id: item.id,
      name: item.name,
      quote: item.quote,
      vehicle: item.vehicle,
      order_index: Number(item.order_index ?? 0),
      is_published: item.is_published ?? false,
    };

    const { error } = await supabase.from('testimonials').upsert(payload);
    if (error) {
      setMessage({ type: 'error', text: error.message });
      return false;
    }
    setMessage({ type: 'success', text: 'Depoimento atualizado.' });
    return true;
  };

  const handleCreate = async () => {
    const payload = {
      ...newItem,
      order_index: Number(newItem.order_index) || 0,
    };

    const { error } = await supabase.from('testimonials').insert(payload);
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Depoimento criado.' });
      setNewItem(emptyItem);
      loadItems();
    }
  };

  const handleTogglePublish = async (item: TestimonialRecord, isPublished: boolean) => {
    handleFieldChange(item.id, 'is_published', isPublished);
    await saveItem({ ...item, is_published: isPublished });
  };

  const handleOrderBlur = async (id: string) => {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    await saveItem(item);
  };

  const openEditModal = (item: TestimonialRecord) => {
    setEditState({ draft: { ...item } });
  };

  const handleEditChange = (field: keyof TestimonialRecord, value: string) => {
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
    const ok = await saveItem(editState.draft);
    if (ok) {
      setItems((prev) =>
        prev.map((item) => (item.id === editState.draft.id ? editState.draft : item))
      );
      setEditState(null);
    }
  };

  const hasItems = useMemo(() => items.length > 0, [items]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display uppercase italic text-white">Depoimentos</h2>
        <p className="text-xs text-nfs-muted uppercase tracking-widest">
          Controle de publicação e ordem
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
        <h3 className="text-sm uppercase tracking-widest text-nfs-muted mb-4">Novo</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            value={newItem.name}
            onChange={(event) => setNewItem((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Nome"
            className="bg-black/40 border border-white/10 px-3 py-2 text-sm"
          />
          <input
            value={newItem.vehicle ?? ''}
            onChange={(event) =>
              setNewItem((prev) => ({ ...prev, vehicle: event.target.value }))
            }
            placeholder="Veículo"
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
          value={newItem.quote ?? ''}
          onChange={(event) =>
            setNewItem((prev) => ({ ...prev, quote: event.target.value }))
          }
          placeholder="Texto do depoimento"
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
              Nenhum depoimento encontrado.
            </div>
          )}
          {items.map((item) => (
            <div key={item.id} className="border border-white/10 p-4 bg-black/20">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-white font-semibold">{item.name}</div>
                  <div className="text-xs text-nfs-muted">{item.vehicle}</div>
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
          <div className="bg-nfs-black border border-white/10 max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-display uppercase italic text-white">Editar depoimento</h3>
              <button
                onClick={() => setEditState(null)}
                className="text-xs uppercase tracking-widest text-nfs-muted"
              >
                Fechar
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                value={editState.draft.name}
                onChange={(event) => handleEditChange('name', event.target.value)}
                className="bg-black/40 border border-white/10 px-3 py-2 text-sm"
                placeholder="Nome"
              />
              <input
                value={editState.draft.vehicle ?? ''}
                onChange={(event) => handleEditChange('vehicle', event.target.value)}
                className="bg-black/40 border border-white/10 px-3 py-2 text-sm"
                placeholder="Veículo"
              />
              <input
                value={editState.draft.order_index ?? 0}
                onChange={(event) => handleEditChange('order_index', event.target.value)}
                type="number"
                className="bg-black/40 border border-white/10 px-3 py-2 text-sm"
                placeholder="Order"
              />
            </div>
            <textarea
              value={editState.draft.quote ?? ''}
              onChange={(event) => handleEditChange('quote', event.target.value)}
              className="w-full bg-black/40 border border-white/10 px-3 py-2 text-sm"
              rows={3}
              placeholder="Texto do depoimento"
            />
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
