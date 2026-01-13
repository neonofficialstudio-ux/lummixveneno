import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkIsAdmin, getSession, onAuthStateChange } from '../../services/adminAuth';
import { isSupabaseConfigured } from '../../services/supabase';

type RequireAdminProps = {
  children: React.ReactNode;
};

type AuthState = 'loading' | 'authorized' | 'denied';

export const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!isSupabaseConfigured()) {
      setState('denied');
      setError('SUPABASE_NOT_CONFIGURED');
      return;
    }

    const validate = async () => {
      setError(null);
      const { data } = await getSession();
      if (!isMounted) return;
      if (!data.session) {
        navigate('/login', { replace: true });
        return;
      }
      try {
        const isAdmin = await checkIsAdmin();
        if (!isMounted) return;
        if (!isAdmin) {
          setState('denied');
        } else {
          setState('authorized');
        }
      } catch (err) {
        if (!isMounted) return;
        setError('Falha ao validar permissões.');
        setState('denied');
      }
    };

    validate();

    const { data: subscription } = onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/login', { replace: true });
      }
    });

    return () => {
      isMounted = false;
      subscription?.subscription?.unsubscribe();
    };
  }, [navigate]);

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-nfs-black text-white flex items-center justify-center">
        <div className="text-sm text-nfs-muted font-mono uppercase tracking-widest">
          Validando acesso...
        </div>
      </div>
    );
  }

  if (state === 'denied') {
    if (error === 'SUPABASE_NOT_CONFIGURED') {
      return (
        <div className="min-h-screen bg-nfs-black text-white flex items-center justify-center p-6">
          <div className="max-w-md text-center space-y-4">
            <h1 className="text-2xl font-display uppercase italic text-white">
              Supabase não configurado
            </h1>
            <p className="text-sm text-nfs-muted">
              Configure as variáveis abaixo para habilitar o painel.
            </p>
            <ul className="text-sm text-left text-nfs-muted space-y-2">
              <li>✅ VITE_SUPABASE_URL</li>
              <li>✅ VITE_SUPABASE_ANON_KEY</li>
            </ul>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-nfs-black text-white flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-display uppercase italic text-white mb-4">
            Acesso negado
          </h1>
          <p className="text-sm text-nfs-muted">
            {error ?? 'Seu usuário não tem permissão para acessar o painel administrativo.'}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
