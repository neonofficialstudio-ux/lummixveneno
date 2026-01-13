import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../services/supabase';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { user, signUp, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate('/account', { replace: true });
    }
  }, [loading, navigate, user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      await signUp(email.trim(), password, displayName.trim() || undefined);
      setSuccess('Cadastro criado! Verifique seu email para confirmar o acesso.');
    } catch (err: any) {
      setError(err?.message ?? 'Não foi possível criar sua conta.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-nfs-black text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-nfs-dark border border-white/10 p-8 shadow-[0_0_30px_rgba(0,255,156,0.15)]">
          <h1 className="text-2xl font-display uppercase italic mb-2 text-white">Cadastro</h1>
          <p className="text-xs text-nfs-muted font-mono uppercase tracking-widest mb-6">
            Supabase não configurado
          </p>
          <p className="text-sm text-nfs-muted">
            Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para habilitar o cadastro.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nfs-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link to="/" className="text-xs font-mono text-nfs-muted hover:text-white">
            ← Voltar ao site
          </Link>
        </div>
        <div className="bg-nfs-dark border border-white/10 p-8 shadow-[0_0_30px_rgba(0,255,156,0.15)]">
          <h1 className="text-2xl font-display uppercase italic mb-2 text-white">Cadastro</h1>
          <p className="text-xs text-nfs-muted font-mono uppercase tracking-widest mb-6">
            Entre para a garagem
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-nfs-muted mb-2">
                Nome de exibição
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                className="w-full bg-black/40 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-nfs-green"
                placeholder="Seu nome"
              />
            </div>
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
                placeholder="Crie uma senha"
                required
              />
            </div>
            {error && <div className="text-sm text-red-400">{error}</div>}
            {success && <div className="text-sm text-nfs-green">{success}</div>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-nfs-green text-black py-2 font-display uppercase italic tracking-widest hover:bg-white transition-colors disabled:opacity-60"
            >
              {submitting ? 'Criando...' : 'Criar conta'}
            </button>
          </form>
          <div className="mt-6 text-xs text-nfs-muted">
            Já tem conta?{' '}
            <Link to="/login" className="text-nfs-green hover:text-white transition-colors">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
