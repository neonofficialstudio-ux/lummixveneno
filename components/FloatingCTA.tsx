import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const FloatingCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const WHATSAPP_NUMBER = (import.meta as any).env?.VITE_WHATSAPP_NUMBER || '5511999999999';

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 300px, hide if at the very bottom (footer area)
      const scrolled = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      
      if (scrolled > 300 && scrolled < (docHeight - winHeight - 600)) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-gradient-to-t from-black via-black to-transparent"
        >
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            className="block w-full bg-nfs-green text-black font-display uppercase italic text-center py-4 shadow-[0_0_20px_rgba(0,255,156,0.3)]"
          >
            Orçar Agora
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};