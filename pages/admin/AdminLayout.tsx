import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { signOut } from '../../services/adminAuth';

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard' },
  { label: 'Leads', to: '/admin/leads' },
  { label: 'Settings', to: '/admin/settings' },
  { label: 'Portfólio', to: '/admin/portfolio' },
  { label: 'Depoimentos', to: '/admin/testimonials' },
];

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-nfs-black text-white flex">
      <aside className="w-64 bg-nfs-dark border-r border-white/10 p-6 hidden lg:flex flex-col">
        <div className="text-lg font-display uppercase italic text-white mb-8">
          Lummi Admin
        </div>
        <Link to="/" className="text-xs font-mono text-nfs-muted hover:text-white mb-6">
          ← Voltar ao site
        </Link>
        <nav className="flex flex-col gap-2 text-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-2 border text-xs uppercase tracking-widest transition-colors ${
                  isActive
                    ? 'bg-nfs-green text-black border-nfs-green'
                    : 'border-white/10 text-nfs-muted hover:border-white/40 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-nfs-dark/60">
          <div className="text-xs text-nfs-muted uppercase tracking-[0.3em]">Painel Admin</div>
          <button
            onClick={handleSignOut}
            className="text-xs uppercase tracking-widest border border-white/20 px-4 py-2 hover:border-nfs-green hover:text-nfs-green transition-colors"
          >
            Sair
          </button>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
