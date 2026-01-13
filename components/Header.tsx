import React, { useState } from 'react';
import { Menu, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Portfólio', href: '#portfolio' },
    { name: 'Pacotes', href: '#packages' },
    { name: 'Como Funciona', href: '#how-it-works' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-nfs-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
             <div className="w-8 h-8 bg-nfs-green/20 border border-nfs-green rotate-45 flex items-center justify-center">
                <span className="text-nfs-green font-display -rotate-45 text-lg">L</span>
             </div>
             <div className="flex flex-col">
                <span className="text-white font-display uppercase tracking-wider text-sm md:text-base leading-none">LUMMI</span>
                <span className="text-nfs-muted text-[10px] uppercase tracking-[0.2em] leading-none">x MENINA VENENO</span>
             </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a 
                key={item.name} 
                href={item.href} 
                className="text-nfs-muted hover:text-nfs-green text-xs uppercase tracking-widest transition-colors font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Right Side: Status + CTA */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex flex-col items-end">
                <span className="text-[10px] text-nfs-muted uppercase tracking-wider">Capacidade Mês</span>
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-nfs-purple w-[70%]"></div>
                    </div>
                    <span className="text-nfs-purple text-xs font-mono font-bold">Restam 12</span>
                </div>
            </div>
            <button 
              onClick={() => document.getElementById('diagnostic')?.scrollIntoView({ behavior: 'smooth'})}
              className="bg-white text-black hover:bg-nfs-green hover:text-black transition-all px-6 py-2 uppercase font-black italic transform -skew-x-12 text-sm border border-transparent hover:shadow-[0_0_15px_rgba(0,255,156,0.5)]"
            >
               <span className="block transform skew-x-12">Orçar Agora</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-nfs-black border-b border-nfs-green/20 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <a 
                  key={item.name} 
                  href={item.href} 
                  onClick={() => setIsOpen(false)}
                  className="block text-white text-lg font-display uppercase tracking-wider hover:text-nfs-green hover:pl-2 transition-all"
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 border-t border-white/10">
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-xs text-nfs-muted uppercase">Vagas Restantes</span>
                    <span className="text-nfs-purple font-mono font-bold">12 / 40</span>
                 </div>
                 <button 
                   onClick={() => { setIsOpen(false); document.getElementById('diagnostic')?.scrollIntoView({ behavior: 'smooth'}) }}
                   className="w-full bg-nfs-green text-black py-3 uppercase font-black italic tracking-wider"
                 >
                    Orçar no Whatsapp
                 </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};