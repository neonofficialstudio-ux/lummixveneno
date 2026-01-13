import React from 'react';
import { Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
           <div className="col-span-1 md:col-span-2">
              <h2 className="font-display uppercase italic text-2xl text-white mb-4">Lummi x Menina Veneno</h2>
              <p className="text-nfs-muted max-w-sm">
                Estúdio de identidade visual automotiva focado em performance social. 
                Transformamos projetos reais em lendas digitais.
              </p>
           </div>
           
           <div>
              <h4 className="text-white font-bold uppercase tracking-widest mb-4 text-xs">Menu</h4>
              <ul className="space-y-2 text-nfs-muted text-sm">
                 <li><a href="#portfolio" className="hover:text-nfs-green transition-colors">Portfólio</a></li>
                 <li><a href="#packages" className="hover:text-nfs-green transition-colors">Pacotes</a></li>
                 <li><a href="#diagnostic" className="hover:text-nfs-green transition-colors">Diagnóstico</a></li>
              </ul>
           </div>

           <div>
              <h4 className="text-white font-bold uppercase tracking-widest mb-4 text-xs">Conta</h4>
              <ul className="space-y-2 text-nfs-muted text-sm">
                 <li>
                    <Link to="/login" className="hover:text-nfs-green transition-colors">
                      Entrar
                    </Link>
                 </li>
                 <li>
                    <Link to="/account" className="hover:text-nfs-green transition-colors">
                      Área do Cliente
                    </Link>
                 </li>
                 <li>
                    <Link
                      to="/admin"
                      className="text-[10px] font-mono uppercase tracking-widest hover:text-nfs-green transition-colors"
                    >
                      Admin
                    </Link>
                 </li>
              </ul>
           </div>

           <div>
              <h4 className="text-white font-bold uppercase tracking-widest mb-4 text-xs">Social</h4>
              <div className="flex gap-4">
                 <a href="#" className="text-nfs-muted hover:text-nfs-purple transition-colors"><Instagram /></a>
                 <a href="#" className="text-nfs-muted hover:text-nfs-purple transition-colors"><Mail /></a>
              </div>
           </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-nfs-muted font-mono">
           <p>© {new Date().getFullYear()} Lummi World. Todos os direitos reservados.</p>
           <p>Developed with pure Vibe Coding.</p>
        </div>
      </div>
    </footer>
  );
};
