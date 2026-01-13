import React from 'react';
import { Check } from 'lucide-react';
import { fireEvent } from '../services/analytics';

type PackagesProps = {
  whatsappNumber: string;
};

const PACKAGES = [
  {
    name: 'Starter',
    price: '497',
    desc: 'Pra quem quer começar a se destacar.',
    features: [
      '1 Edição de Reels (até 30s)',
      'Correção de Cor Básica',
      '2 Fotos Editadas',
      'Entrega em 48h',
    ],
    color: 'border-nfs-green text-nfs-green',
  },
  {
    name: 'Pro Build',
    price: '897',
    popular: true,
    desc: 'O favorito para projetos finalizados.',
    features: [
      '3 Edições de Reels (Pack Mensal)',
      'Color Grading Cinema',
      'Sound Design Imersivo',
      '5 Fotos Editadas',
      'Identidade Visual de Legenda',
    ],
    color: 'border-nfs-purple text-nfs-purple',
  },
  {
    name: 'Legend',
    price: '1.497',
    desc: 'Tratamento de patrocínio oficial.',
    features: [
      'Cobertura Completa (Remoto*)',
      'Pack de Stories Animados',
      '1 Vídeo Longo (Youtube)',
      'Consultoria de Tráfego',
      'Revisões Ilimitadas',
    ],
    color: 'border-nfs-cyan text-nfs-cyan',
  },
];

export const Packages: React.FC<PackagesProps> = ({ whatsappNumber }) => {
  return (
    <section id="packages" className="py-24 bg-nfs-gray relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-display uppercase italic text-white mb-4">
            Escolha sua <span className="text-nfs-green">Spec</span>
          </h2>
          <p className="text-nfs-muted">
            Vagas limitadas por mês para manter o padrão de qualidade.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start max-w-6xl mx-auto">
          {PACKAGES.map((pkg, idx) => (
            <div
              key={idx}
              className={`relative bg-nfs-black border ${
                pkg.popular
                  ? 'border-nfs-purple shadow-[0_0_30px_rgba(122,60,255,0.15)] transform md:-translate-y-4'
                  : 'border-white/10'
              } p-8 group transition-transform hover:transform hover:-translate-y-2`}
            >
              {pkg.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-nfs-purple text-white px-4 py-1 text-xs font-bold uppercase tracking-widest shadow-lg">
                  Most Wanted
                </div>
              )}

              <h3
                className={`text-2xl font-display uppercase italic mb-2 ${
                  pkg.popular ? 'text-white' : 'text-gray-300'
                }`}
              >
                {pkg.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-sm text-nfs-muted">R$</span>
                <span className="text-4xl font-bold text-white font-mono">{pkg.price}</span>
              </div>
              <p className="text-sm text-nfs-muted mb-8 border-b border-white/10 pb-4 min-h-[50px]">
                {pkg.desc}
              </p>

              <ul className="space-y-4 mb-8">
                {pkg.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <Check
                      size={16}
                      className={`${
                        pkg.popular ? 'text-nfs-purple' : 'text-nfs-green'
                      } mt-0.5 shrink-0`}
                    />
                    {feat}
                  </li>
                ))}
              </ul>

              <a
                href={`https://wa.me/${whatsappNumber}?text=Tenho interesse no pacote ${pkg.name}`}
                onClick={() => {
                  fireEvent('package_selected', 'packages', { tier: pkg.name.toUpperCase() });
                  fireEvent('cta_whatsapp_click', 'packages', { package: pkg.name });
                }}
                className={`w-full block text-center py-3 font-display uppercase italic tracking-wider transition-all ${
                  pkg.popular
                    ? 'bg-nfs-purple text-white hover:bg-white hover:text-black'
                    : 'border border-white/20 text-white hover:bg-white hover:text-black'
                }`}
              >
                Selecionar
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
