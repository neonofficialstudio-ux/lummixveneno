import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Zap } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      
      {/* Background Video/Image Placeholder */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-nfs-black/60 z-10 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2583&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
        
        {/* Neon Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,156,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,156,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)] origin-bottom pointer-events-none"></div>
      </div>

      <div className="container mx-auto px-4 z-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Text Content */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-nfs-green/30 bg-nfs-green/5 mb-4 rounded-sm">
               <div className="w-2 h-2 bg-nfs-green rounded-full animate-pulse"></div>
               <span className="text-nfs-green text-[10px] uppercase tracking-[0.2em] font-bold">Status: Online & Ready</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display uppercase italic leading-none mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              Seu Projeto <br />
              <span className="text-white">Merece Cena</span> <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-nfs-green to-emerald-600">De Jogo</span>
            </h1>
            
            <p className="text-nfs-muted text-lg md:text-xl max-w-xl mx-auto lg:mx-0 font-light border-l-2 border-nfs-purple pl-4">
              Transforme fotos de celular em estética underground AAA. Visual de projeto patrocinado que para o scroll.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <a 
              href="#diagnostic"
              className="group relative px-8 py-4 bg-white text-black font-display uppercase italic tracking-wider overflow-hidden hover:text-nfs-green transition-colors clip-diagonal"
            >
               <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
               <span className="relative z-10 flex items-center gap-2">
                 Modo Underground <Zap size={18} className="fill-current" />
               </span>
            </a>
            
            <a 
               href="#portfolio"
               className="px-8 py-4 border border-white/20 text-white font-display uppercase italic tracking-wider hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
               Ver Projetos <ArrowDown size={18} />
            </a>
          </motion.div>

          <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-nfs-muted font-mono uppercase tracking-widest">
            <span className="flex items-center gap-1"><span className="text-nfs-green">✔</span> Reels Ready</span>
            <span className="flex items-center gap-1"><span className="text-nfs-green">✔</span> 48h Delivery</span>
            <span className="flex items-center gap-1"><span className="text-nfs-green">✔</span> 100% Unique</span>
          </div>
        </div>

        {/* Game Card Visual */}
        <div className="lg:col-span-5 hidden lg:block">
           <motion.div
             initial={{ rotateY: -15, rotateX: 5, opacity: 0 }}
             animate={{ rotateY: 0, rotateX: 0, opacity: 1 }}
             transition={{ duration: 1, type: "spring" }}
             whileHover={{ rotateY: 5, rotateX: -5, scale: 1.02 }}
             className="relative bg-nfs-dark/80 border border-white/10 p-2 rounded-lg backdrop-blur-sm shadow-[0_0_30px_rgba(122,60,255,0.15)]"
           >
              {/* HUD Overlay */}
              <div className="absolute top-4 right-4 z-20 flex flex-col items-end">
                 <span className="text-4xl font-display italic text-nfs-purple">98</span>
                 <span className="text-[10px] uppercase text-nfs-muted tracking-widest">Style Rating</span>
              </div>

              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden rounded border border-white/5 bg-gray-900 group">
                 <img src="https://images.unsplash.com/photo-1614200179396-2bdb77ebf81d?q=80&w=1600&auto=format&fit=crop" className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700" alt="Featured Car" />
                 
                 {/* Scanline Effect */}
                 <div className="absolute inset-0 scanline pointer-events-none opacity-20"></div>
                 
                 {/* Stats Bar */}
                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 pt-12">
                    <h3 className="text-2xl font-display uppercase italic text-white mb-2">Nissan S15 <span className="text-nfs-cyan text-sm not-italic">Spec-R</span></h3>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] uppercase tracking-wider text-nfs-muted">
                          <span>Aura</span>
                          <span className="text-nfs-cyan">MAX</span>
                       </div>
                       <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-nfs-cyan w-[95%] shadow-[0_0_10px_#00cfff]"></div>
                       </div>
                       
                       <div className="flex justify-between text-[10px] uppercase tracking-wider text-nfs-muted">
                          <span>Street Cred</span>
                          <span className="text-nfs-purple">High</span>
                       </div>
                       <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-nfs-purple w-[80%] shadow-[0_0_10px_#7a3cff]"></div>
                       </div>
                    </div>
                 </div>
              </div>
           </motion.div>
        </div>
      </div>
    </section>
  );
};