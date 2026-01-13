import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const MOCK_SALES = [
  { name: 'Gabriel', city: 'São Paulo' },
  { name: 'Matheus', city: 'Curitiba' },
  { name: 'Lucas', city: 'Belo Horizonte' },
  { name: 'Rafael', city: 'Rio de Janeiro' },
  { name: 'Bruno', city: 'Brasília' },
];

export const LiveTicker: React.FC = () => {
  const [currentSale, setCurrentSale] = useState<{ name: string; city: string } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // 20% chance to show a notification every check
      if (Math.random() > 0.5) {
        const randomSale = MOCK_SALES[Math.floor(Math.random() * MOCK_SALES.length)];
        setCurrentSale(randomSale);
        
        // Hide after 5 seconds
        setTimeout(() => setCurrentSale(null), 5000);
      }
    }, 35000); // Check every 35s

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {currentSale && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className="fixed bottom-24 left-1/2 md:left-20 md:bottom-10 md:transform-none transform -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="bg-nfs-black/90 border border-nfs-green/30 backdrop-blur-md px-4 py-3 rounded-sm shadow-[0_0_15px_rgba(0,255,156,0.1)] flex items-center gap-3 min-w-[280px]">
            <div className="w-2 h-2 rounded-full bg-nfs-green animate-pulse" />
            <div className="flex flex-col">
              <span className="text-nfs-text text-xs uppercase tracking-widest font-bold">Novo Projeto Iniciado</span>
              <span className="text-white text-sm font-mono">{currentSale.name} de {currentSale.city}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};