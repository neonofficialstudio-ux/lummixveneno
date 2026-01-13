import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../services/supabase';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user, signIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate('/account', { replace: true });
    }
  }, [loading, navigate, user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await signIn(email.trim(), password);
      navigate('/account', { replace: true });
    } catch (err: any) {
      const message = err?.message ?? 'Não foi possível autenticar.';
      if (message.toLowerCase().includes('invalid')) {
        setError('Credenciais inválidas. Confira email e senha.');
      } else {
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-nfs-black text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-nfs-dark border border-white/10 p-8 shadow-[0_0_30px_rgba(0,255,156,0.15)]">
          <h1 className="text-2xl font-display uppercase italic mb-2 text-white">Login</h1>
          <p className="text-xs text-nfs-muted font-mono uppercase tracking-widest mb-6">
            Supabase não configurado
          </p>
          <p className="text-sm text-nfs-muted">
            Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para habilitar o login.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nfs-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-nfs-dark border border-white/10 p-8 shadow-[0_0_30px_rgba(0,255,156,0.15)]">
        <h1 className="text-2xl font-display uppercase italic mb-2 text-white">Login</h1>
        <p className="text-xs text-nfs-muted font-mono uppercase tracking-widest mb-6">
          Acesse sua área
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-nfs-muted mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full bg-black/40 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-nfs-green"
              placeholder="voce@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-nfs-muted mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full bg-black/40 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-nfs-green"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <div className="text-sm text-red-400">{error}</div>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-nfs-green text-black py-2 font-display uppercase italic tracking-widest hover:bg-white transition-colors disabled:opacity-60"
          >
            {submitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <div className="mt-6 text-xs text-nfs-muted">
          Ainda não tem conta?{' '}
          <Link to="/signup" className="text-nfs-green hover:text-white transition-colors">
            Criar cadastro
          </Link>
        </div>
      </div>
    </div>
  );
};
