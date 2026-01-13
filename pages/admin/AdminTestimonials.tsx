import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';

type TestimonialRecord = {
  id: string;
  name: string;
  quote?: string | null;
  vehicle?: string | null;
  order_index?: number | null;
  is_published?: boolean | null;
};

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
  const [message, setMessage] = useState<string | null>(null);
  const [newItem, setNewItem] = useState(emptyItem);

  const loadItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      setMessage(error.message);
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

  const handleSave = async (item: TestimonialRecord) => {
    const payload = {
      id: item.id,
      name: item.name,
      quote: item.quote,
      vehicle: item.vehicle,
      order_index: item.order_index ?? 0,
      is_published: item.is_published ?? false,
    };

    const { error } = await supabase.from('testimonials').upsert(payload);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Depoimento atualizado.');
      loadItems();
    }
  };

  const handleCreate = async () => {
    const payload = {
      ...newItem,
      order_index: Number(newItem.order_index) || 0,
    };

    const { error } = await supabase.from('testimonials').insert(payload);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Depoimento criado.');
      setNewItem(emptyItem);
      loadItems();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display uppercase italic text-white">Depoimentos</h2>
        <p className="text-xs text-nfs-muted uppercase tracking-widest">
          Controle de publicação e ordem
        </p>
      </div>

      {message && <div className="text-sm text-nfs-green">{message}</div>}

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
          {items.map((item) => (
            <div key={item.id} className="border border-white/10 p-4 bg-black/20">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  value={item.name}
                  onChange={(event) => handleFieldChange(item.id, 'name', event.target.value)}
                  className="bg-black/40 border border-white/10 px-3 py-2 text-sm"
                />
                <input
                  value={item.vehicle ?? ''}
                  onChange={(event) =>
                    handleFieldChange(item.id, 'vehicle', event.target.value)
                  }
                  className="bg-black/40 border border-white/10 px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  value={item.order_index ?? 0}
                  onChange={(event) =>
                    handleFieldChange(item.id, 'order_index', Number(event.target.value))
                  }
                  className="bg-black/40 border border-white/10 px-3 py-2 text-sm"
                />
              </div>
              <textarea
                value={item.quote ?? ''}
                onChange={(event) => handleFieldChange(item.id, 'quote', event.target.value)}
                className="w-full bg-black/40 border border-white/10 px-3 py-2 text-sm mt-4"
                rows={3}
              />
              <div className="mt-4 flex items-center gap-4">
                <label className="text-xs uppercase tracking-widest text-nfs-muted">
                  <input
                    type="checkbox"
                    checked={Boolean(item.is_published)}
                    onChange={(event) =>
                      handleFieldChange(item.id, 'is_published', event.target.checked)
                    }
                    className="mr-2"
                  />
                  Publicado
                </label>
                <button
                  onClick={() => handleSave(item)}
                  className="border border-white/20 px-4 py-2 text-xs uppercase tracking-widest hover:border-nfs-green hover:text-nfs-green"
                >
                  Salvar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
