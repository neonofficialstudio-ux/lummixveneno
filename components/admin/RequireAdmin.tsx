import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkIsAdmin, getSession, onAuthStateChange } from '../../services/adminAuth';

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

    const validate = async () => {
      setError(null);
      const { data } = await getSession();
      if (!isMounted) return;
      if (!data.session) {
        navigate('/admin/login', { replace: true });
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
        navigate('/admin/login', { replace: true });
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
