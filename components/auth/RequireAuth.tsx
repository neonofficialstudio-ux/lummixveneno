import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../services/supabase';

type RequireAuthProps = {
  children: React.ReactNode;
};

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [loading, navigate, user]);

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-nfs-black text-white flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-display uppercase italic text-white">
            Supabase não configurado
          </h1>
          <p className="text-sm text-nfs-muted">
            Configure as variáveis abaixo para habilitar sua área de cliente.
          </p>
          <ul className="text-sm text-left text-nfs-muted space-y-2">
            <li>✅ VITE_SUPABASE_URL</li>
            <li>✅ VITE_SUPABASE_ANON_KEY</li>
          </ul>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-nfs-black text-white flex items-center justify-center">
        <div className="text-sm text-nfs-muted font-mono uppercase tracking-widest">
          Carregando sessão...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};
