import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LiveTicker } from './components/LiveTicker';
import { StyleDiagnostic } from './components/StyleDiagnostic';
import { PortfolioGrid } from './components/PortfolioGrid';
import { Packages } from './components/Packages';
import { Footer } from './components/Footer';
import { FloatingCTA } from './components/FloatingCTA';
import { trackEvent } from './services/supabase';
import { v4 as uuidv4 } from 'uuid';

export default function App() {
  const WHATSAPP_NUMBER = (import.meta as any).env?.VITE_WHATSAPP_NUMBER || '5511999999999';
  
  useEffect(() => {
    // Session management for analytics
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
        sessionId = `sess_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('session_id', sessionId);
    }

    // Track Page View
    trackEvent({
        event_name: 'page_view',
        session_id: sessionId,
        source: 'direct'
    });
  }, []);

  return (
    <div className="bg-nfs-black min-h-screen text-white font-sans selection:bg-nfs-green selection:text-black">
      <Header />
      
      <main>
        <Hero />
        
        {/* Comparison/Slider Section Placeholder - Kept simple for this iteration */}
        <section className="py-12 bg-nfs-dark border-y border-white/5">
           <div className="container mx-auto px-4 text-center">
              <span className="text-nfs-green text-xs font-mono uppercase tracking-widest mb-2 block">Antes / Depois</span>
              <h3 className="text-2xl font-display uppercase italic text-white">A Diferença é Brutal</h3>
              <p className="text-nfs-muted text-sm mt-2">Arraste para ver a mágica (Funcionalidade em desenvolvimento)</p>
           </div>
        </section>

        <StyleDiagnostic />
        
        {/* Stats Section */}
        <section className="py-16 border-b border-white/5">
           <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                  { label: "Entrega Rápida", val: "1-2 Dias" },
                  { label: "Vagas/Mês", val: "40" },
                  { label: "Garantia", val: "Rev. Inclusa" },
                  { label: "Qualidade", val: "Premium" }
              ].map((stat, i) => (
                  <div key={i}>
                      <div className="text-3xl md:text-4xl font-display italic text-white mb-1">{stat.val}</div>
                      <div className="text-xs text-nfs-muted uppercase tracking-widest">{stat.label}</div>
                  </div>
              ))}
           </div>
        </section>

        <PortfolioGrid />
        <Packages />
        
        {/* Social Proof/Testimonials */}
        <section className="py-24 bg-nfs-black">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-display uppercase italic text-white mb-12">Quem já acelerou</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {[1,2,3].map(i => (
                        <div key={i} className="bg-white/5 p-6 border border-white/10 text-left">
                            <div className="flex text-nfs-green mb-4">★★★★★</div>
                            <p className="text-sm text-gray-300 mb-4">"O nível de detalhe é absurdo. Meu engajamento no Reels triplicou depois que comecei a postar as edições da Lummi."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                                <div className="text-xs">
                                    <div className="text-white font-bold">Cliente Verificado</div>
                                    <div className="text-nfs-muted">Lancer GT</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-gradient-to-b from-nfs-dark to-black text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=2000')] bg-cover bg-center opacity-10"></div>
            <div className="container mx-auto px-4 relative z-10">
                <h2 className="text-4xl md:text-7xl font-display uppercase italic text-white mb-8">
                    Não Deixe seu <br />Projeto na Garagem
                </h2>
                <a 
                   href={`https://wa.me/${WHATSAPP_NUMBER}`}
                   className="inline-block bg-nfs-green text-black px-12 py-5 font-display uppercase italic text-xl tracking-wider hover:bg-white transition-all shadow-[0_0_30px_rgba(0,255,156,0.4)]"
                >
                    Orçar Projeto Agora
                </a>
                <p className="mt-6 text-nfs-muted text-sm font-mono">
                    Resposta em até 2h (dias úteis) • Vagas restantes: 12
                </p>
            </div>
        </section>
      </main>

      <Footer />
      <LiveTicker />
      <FloatingCTA />
    </div>
  );
}