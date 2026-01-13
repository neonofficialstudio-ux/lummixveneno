import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';
import { getPublishedPortfolio } from '../services/supabase';
import { fireEvent } from '../services/analytics';
import type { PortfolioItem } from '../types';

type PortfolioGridProps = {
  whatsappNumber: string;
};

type DisplayPortfolioItem = {
  id: string;
  title: string;
  category: PortfolioItem['category'];
  cover_url: string;
  description?: string;
};

const CATEGORIES: Array<'ALL' | PortfolioItem['category']> = [
  'ALL',
  'STREET',
  'RAIN NIGHT',
  'TRACK DAY',
  'DRIFT',
  'STANCE',
  'GARAGE',
];

const PLACEHOLDER_ITEMS: DisplayPortfolioItem[] = [
  {
    id: '1',
    title: 'Midnight Club Civic',
    category: 'STREET',
    cover_url:
      'https://images.unsplash.com/photo-1621213344654-e7c65691129b?q=80&w=800',
  },
  {
    id: '2',
    title: 'Purple Rain R34',
    category: 'RAIN NIGHT',
    cover_url:
      'https://images.unsplash.com/photo-1549480625-2e63c784777d?q=80&w=800',
  },
  {
    id: '3',
    title: 'Track Day Porsche',
    category: 'TRACK DAY',
    cover_url:
      'https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=800',
  },
  {
    id: '4',
    title: 'Bagged Golf',
    category: 'STANCE',
    cover_url:
      'https://images.unsplash.com/photo-1620023067645-0370f6998495?q=80&w=800',
  },
  {
    id: '5',
    title: 'Underground Z',
    category: 'DRIFT',
    cover_url:
      'https://images.unsplash.com/photo-1606567595334-d39972c85dbe?q=80&w=800',
  },
  {
    id: '6',
    title: 'Garage Detail',
    category: 'GARAGE',
    cover_url:
      'https://images.unsplash.com/photo-1605559424843-9e4c2287f38d?q=80&w=800',
  },
];

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({ whatsappNumber }) => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [items, setItems] = useState<DisplayPortfolioItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<DisplayPortfolioItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    getPublishedPortfolio()
      .then((data) => {
        if (!isMounted) return;
        if (data?.length) {
          const mapped = data.map((item: any, index: number) => ({
            id: String(item.id ?? `portfolio-${index}`),
            title: item.title ?? item.name ?? 'Projeto Lummi',
            category: item.category ?? 'STREET',
            cover_url:
              item.cover_url ??
              item.image_url ??
              item.thumbnail_url ??
              'https://images.unsplash.com/photo-1621213344654-e7c65691129b?q=80&w=800',
            description: item.description,
          }));
          setItems(mapped);
        } else {
          setItems(PLACEHOLDER_ITEMS);
        }
      })
      .catch(() => {
        if (isMounted) setItems(PLACEHOLDER_ITEMS);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems =
    activeFilter === 'ALL'
      ? items
      : items.filter((item) => item.category === activeFilter);

  const handleOpen = (item: DisplayPortfolioItem) => {
    setSelectedItem(item);
    fireEvent('portfolio_opened', 'portfolio', { id: item.id });
  };

  return (
    <section id="portfolio" className="py-24 bg-nfs-black">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <h2 className="text-3xl md:text-5xl font-display uppercase italic text-white">
            Portfólio <span className="text-nfs-purple">Select</span>
          </h2>

          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-all ${
                  activeFilter === cat
                    ? 'bg-nfs-purple border-nfs-purple text-white'
                    : 'bg-transparent border-white/20 text-nfs-muted hover:border-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                onClick={() => handleOpen(item)}
                className="group relative aspect-[16/9] cursor-pointer overflow-hidden border border-white/10 bg-nfs-dark"
              >
                <img
                  src={item.cover_url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:grayscale-0 grayscale"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                  <h3 className="font-display uppercase italic text-xl mb-1 text-white">
                    {item.title}
                  </h3>
                  <span className="text-nfs-green text-xs tracking-widest uppercase mb-4">
                    {item.category} Build
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                    <Play size={16} className="ml-1 fill-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-nfs-dark border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative rounded-sm shadow-[0_0_50px_rgba(122,60,255,0.2)]"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-nfs-green hover:text-black rounded-full transition-colors text-white"
              >
                <X size={24} />
              </button>

              <div className="aspect-video w-full bg-black relative">
                <img src={selectedItem.cover_url} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* Placeholder for Video Player */}
                  <div className="bg-nfs-green/20 p-4 rounded-full border border-nfs-green animate-pulse">
                    <Play size={32} className="fill-nfs-green text-nfs-green" />
                  </div>
                </div>
              </div>

              <div className="p-8 grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h3 className="text-3xl font-display uppercase italic text-white mb-4">
                    {selectedItem.title}
                  </h3>
                  <p className="text-nfs-muted text-sm leading-relaxed mb-6">
                    {selectedItem.description ??
                      'Projeto desenvolvido para destacar as modificações e a assinatura visual do cliente.'}
                  </p>
                  <div className="flex gap-4">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] uppercase text-white">
                      Color Grade
                    </span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] uppercase text-white">
                      VFX
                    </span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] uppercase text-white">
                      Sound Design
                    </span>
                  </div>
                </div>
                <div className="border-l border-white/10 pl-8 flex flex-col justify-center">
                  <span className="text-xs uppercase text-nfs-muted tracking-widest mb-2">
                    Gostou desse estilo?
                  </span>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=Vi o projeto ${selectedItem.title} e quero algo parecido.`}
                    onClick={() =>
                      fireEvent('cta_whatsapp_click', 'portfolio', { id: selectedItem.id })
                    }
                    target="_blank"
                    className="w-full bg-nfs-purple text-white py-3 font-display uppercase italic text-center hover:bg-white hover:text-black transition-colors"
                  >
                    Orçar Similar
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
