import React, { useEffect, useState } from 'react';
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
};

const emptyItem: Omit<PortfolioRecord, 'id'> = {
  title: '',
  category: 'STREET',
  cover_url: '',
  description: '',
  order_index: 0,
  is_published: false,
};

export const AdminPortfolio: React.FC = () => {
  const [items, setItems] = useState<PortfolioRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [newItem, setNewItem] = useState(emptyItem);

  const loadItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('portfolio_items')
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
    field: keyof PortfolioRecord,
    value: string | number | boolean
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = async (item: PortfolioRecord) => {
    const payload = {
      id: item.id,
      title: item.title,
      category: item.category,
      cover_url: item.cover_url,
      description: item.description,
      order_index: item.order_index ?? 0,
      is_published: item.is_published ?? false,
    };

    const { error } = await supabase.from('portfolio_items').upsert(payload);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Portfólio atualizado.');
      loadItems();
    }
  };

  const handleCreate = async () => {
    const payload = {
      ...newItem,
      order_index: Number(newItem.order_index) || 0,
    };

    const { error } = await supabase.from('portfolio_items').insert(payload);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Item criado.');
      setNewItem(emptyItem);
      loadItems();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display uppercase italic text-white">Portfólio</h2>
        <p className="text-xs text-nfs-muted uppercase tracking-widest">
          Gerencie itens publicados e ordem de exibição
        </p>
      </div>

      {message && <div className="text-sm text-nfs-green">{message}</div>}

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
          {items.map((item) => (
            <div key={item.id} className="border border-white/10 p-4 bg-black/20">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  value={item.title}
                  onChange={(event) => handleFieldChange(item.id, 'title', event.target.value)}
                  className="bg-black/40 border border-white/10 px-3 py-2 text-sm"
                />
                <select
                  value={item.category}
                  onChange={(event) =>
                    handleFieldChange(
                      item.id,
                      'category',
                      event.target.value as PortfolioItem['category']
                    )
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
                  value={item.cover_url ?? ''}
                  onChange={(event) =>
                    handleFieldChange(item.id, 'cover_url', event.target.value)
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
                value={item.description ?? ''}
                onChange={(event) =>
                  handleFieldChange(item.id, 'description', event.target.value)
                }
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
