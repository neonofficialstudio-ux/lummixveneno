import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { submitLead } from '../services/supabase';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Lead } from '../types';

export const StyleDiagnostic: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Lead>>({
    name: '',
    whatsapp: '',
    city: '',
    car_model: '',
    source: 'diagnostic'
  });

  const WHATSAPP_NUMBER = (import.meta as any).env?.VITE_WHATSAPP_NUMBER || '5511999999999';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const sessionId = localStorage.getItem('session_id') || 'unknown';
    
    // 1. Submit to Supabase
    try {
        await submitLead({
            ...formData as Lead,
            consent: true,
            source: 'diagnostic',
        });
    } catch (err) {
        console.error("Failed to save lead, proceeding to WhatsApp anyway", err);
    }

    // 2. Prepare WhatsApp Message
    const text = `Fala Team Lummi! Me chamo ${formData.name} de ${formData.city}. Tenho um ${formData.car_model} e acabei de preencher a Rota de Estilo no site. Quero saber qual visual combina mais com meu projeto.`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

    // 3. Redirect
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        setLoading(false);
        setStep(2); // Show success state
    }, 1500);
  };

  return (
    <section id="diagnostic" className="py-24 bg-nfs-dark relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-nfs-purple/10 via-nfs-black/50 to-nfs-black pointer-events-none"></div>
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-display uppercase italic mb-4">
            <span className="text-nfs-green">Diagnóstico</span> Relâmpago
          </h2>
          <p className="text-nfs-muted text-lg max-w-2xl mx-auto">
            Descubra qual estética (Street, Neon ou Clean) vai explodir o engajamento do seu projeto. 
            Receba sua <span className="text-white font-bold">Rota de Estilo + Checklist</span> grátis.
          </p>
        </div>

        <div className="bg-nfs-black border border-white/10 p-8 md:p-12 relative overflow-hidden group">
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-nfs-green"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-nfs-green"></div>
            
            {step === 1 ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-nfs-muted">Seu Nome</label>
                    <input 
                      required
                      name="name"
                      type="text" 
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ex: João da Silva"
                      className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-nfs-green focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-nfs-muted">WhatsApp</label>
                    <input 
                      required
                      name="whatsapp"
                      type="tel" 
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                      className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-nfs-green focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-nfs-muted">Modelo do Carro</label>
                    <input 
                      required
                      name="car_model"
                      type="text" 
                      value={formData.car_model}
                      onChange={handleChange}
                      placeholder="Ex: Civic Si, Golf GTI..."
                      className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-nfs-green focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-nfs-muted">Cidade</label>
                    <input 
                      required
                      name="city"
                      type="text" 
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Ex: São Paulo"
                      className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-nfs-green focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-nfs-green text-black font-display uppercase italic tracking-wider text-xl py-4 mt-4 hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>Enviando... <Loader2 className="animate-spin" /></>
                  ) : (
                    <>Gerar Rota de Estilo <ArrowRight /></>
                  )}
                </button>
                <p className="text-center text-xs text-nfs-muted mt-4">
                  *Ao enviar, você será redirecionado para o WhatsApp para receber o material.
                </p>
              </form>
            ) : (
               <div className="text-center py-12">
                  <div className="inline-block p-4 rounded-full bg-nfs-green/20 mb-6">
                    <ArrowRight className="w-12 h-12 text-nfs-green" />
                  </div>
                  <h3 className="text-2xl font-display uppercase italic text-white mb-2">Solicitação Recebida!</h3>
                  <p className="text-nfs-muted mb-6">Se o WhatsApp não abriu, clique abaixo.</p>
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Retomando`} className="text-nfs-green underline uppercase tracking-widest text-sm font-bold">
                    Abrir WhatsApp Manualmente
                  </a>
               </div>
            )}
        </div>
      </div>
    </section>
  );
};