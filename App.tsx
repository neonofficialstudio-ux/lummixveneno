import React, { useEffect, useRef, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LiveTicker } from './components/LiveTicker';
import { StyleDiagnostic } from './components/StyleDiagnostic';
import { PortfolioGrid } from './components/PortfolioGrid';
import { Packages } from './components/Packages';
import { Footer } from './components/Footer';
import { FloatingCTA } from './components/FloatingCTA';
import { fireEvent } from './services/analytics';
import { loadSiteConfig, type SiteConfig } from './services/siteConfig';
import { getPublishedTestimonials } from './services/supabase';

type DisplayTestimonial = {
  id: string;
  quote: string;
  name: string;
  vehicle: string;
  isExample?: boolean;
};

const DEFAULT_CONFIG: SiteConfig = {
  whatsappNumber: '55XXXXXXXXXXX',
  capacityMonthly: 40,
  capacityRemaining: 12,
  nextWindowDate: undefined,
};

const PLACEHOLDER_TESTIMONIALS: DisplayTestimonial[] = [
  {
    id: 'placeholder-1',
    quote: 'Exemplo (substituir): atenção aos detalhes e consistência no feed.',
    name: 'Cliente Verificado',
    vehicle: 'Lancer GT',
    isExample: true,
  },
  {
    id: 'placeholder-2',
    quote: 'Exemplo (substituir): a edição deixou o projeto com cara de showroom.',
    name: 'Cliente Verificado',
    vehicle: 'Golf GTI',
    isExample: true,
  },
  {
    id: 'placeholder-3',
    quote: 'Exemplo (substituir): entregas rápidas e padrão premium.',
    name: 'Cliente Verificado',
    vehicle: 'BRZ',
    isExample: true,
  },
];

export default function App() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [testimonials, setTestimonials] = useState<DisplayTestimonial[]>([]);
  const [showExampleLabel, setShowExampleLabel] = useState(false);
  const firedScrollEvents = useRef({
    25: false,
    50: false,
    75: false,
    100: false,
  });

  useEffect(() => {
    fireEvent('page_view', 'direct');

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        const maxScroll = docHeight - winHeight;
        if (maxScroll > 0) {
          const percent = Math.min(100, Math.round((window.scrollY / maxScroll) * 100));
          ([25, 50, 75, 100] as const).forEach((threshold) => {
            if (percent >= threshold && !firedScrollEvents.current[threshold]) {
              firedScrollEvents.current[threshold] = true;
              fireEvent(`scroll_${threshold}`, 'scroll');
            }
          });
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;
    loadSiteConfig()
      .then((loaded) => {
        if (isMounted) setConfig(loaded);
      })
      .catch((error) => {
        console.warn('Falha ao carregar configurações do site:', error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    getPublishedTestimonials()
      .then((data) => {
        if (!isMounted) return;
        if (data?.length) {
          const mapped = data.map((row: any, index: number) => ({
            id: String(row.id ?? `testimonial-${index}`),
            quote:
              row.quote ??
              row.text ??
              row.message ??
              row.content ??
              'Depoimento enviado pelo cliente.',
            name: row.name ?? row.author ?? row.client_name ?? 'Cliente Verificado',
            vehicle: row.vehicle ?? row.car_model ?? row.project ?? 'Projeto Premium',
          }));
          setTestimonials(mapped);
          setShowExampleLabel(false);
        } else {
          setTestimonials(PLACEHOLDER_TESTIMONIALS);
          setShowExampleLabel(true);
        }
      })
      .catch((error) => {
        console.warn('Falha ao carregar depoimentos:', error);
        if (isMounted) {
          setTestimonials(PLACEHOLDER_TESTIMONIALS);
          setShowExampleLabel(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-nfs-black min-h-screen text-white font-sans selection:bg-nfs-green selection:text-black">
      <Header />

      <main>
        <Hero />

        {/* Comparison/Slider Section Placeholder - Kept simple for this iteration */}
        <section className="py-12 bg-nfs-dark border-y border-white/5">
          <div className="container mx-auto px-4 text-center">
            <span className="text-nfs-green text-xs font-mono uppercase tracking-widest mb-2 block">
              Antes / Depois
            </span>
            <h3 className="text-2xl font-display uppercase italic text-white">
              A Diferença é Brutal
            </h3>
            <p className="text-nfs-muted text-sm mt-2">
              Arraste para ver a mágica (Funcionalidade em desenvolvimento)
            </p>
          </div>
        </section>

        <StyleDiagnostic whatsappNumber={config.whatsappNumber} />

        {/* Stats Section */}
        <section className="py-16 border-b border-white/5">
          <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Entrega Rápida', val: '1-2 Dias' },
              { label: 'Vagas/Mês', val: '40' },
              { label: 'Garantia', val: 'Rev. Inclusa' },
              { label: 'Qualidade', val: 'Premium' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-display italic text-white mb-1">
                  {stat.val}
                </div>
                <div className="text-xs text-nfs-muted uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <PortfolioGrid whatsappNumber={config.whatsappNumber} />
        <Packages whatsappNumber={config.whatsappNumber} />

        {/* Social Proof/Testimonials */}
        {testimonials.length > 0 && (
          <section className="py-24 bg-nfs-black">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-display uppercase italic text-white mb-12">
                Quem já acelerou
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="bg-white/5 p-6 border border-white/10 text-left"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex text-nfs-green">★★★★★</div>
                      {(testimonial.isExample || showExampleLabel) && (
                        <span className="text-[10px] uppercase tracking-widest text-nfs-muted">
                          Exemplo (substituir)
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 mb-4">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                      <div className="text-xs">
                        <div className="text-white font-bold">{testimonial.name}</div>
                        <div className="text-nfs-muted">{testimonial.vehicle}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="py-24 bg-gradient-to-b from-nfs-dark to-black text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=2000')] bg-cover bg-center opacity-10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-7xl font-display uppercase italic text-white mb-8">
              Não Deixe seu <br />Projeto na Garagem
            </h2>
            <a
              href={`https://wa.me/${config.whatsappNumber}`}
              onClick={() => fireEvent('cta_whatsapp_click', 'cta_final')}
              className="inline-block bg-nfs-green text-black px-12 py-5 font-display uppercase italic text-xl tracking-wider hover:bg-white transition-all shadow-[0_0_30px_rgba(0,255,156,0.4)]"
            >
              Orçar Projeto Agora
            </a>
            <p className="mt-6 text-nfs-muted text-sm font-mono">
              Resposta em até 2h (dias úteis) • Capacidade do mês: {config.capacityMonthly}{' '}
              • Restam: {config.capacityRemaining}
            </p>
          </div>
        </section>
      </main>

      <Footer />
      <LiveTicker />
      <FloatingCTA whatsappNumber={config.whatsappNumber} />
    </div>
  );
}
