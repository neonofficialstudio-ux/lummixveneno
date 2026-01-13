import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkIsAdmin, signInWithPassword, signOut } from '../../services/adminAuth';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await signInWithPassword(email.trim(), password);
      if (signInError) throw signInError;

      const isAdmin = await checkIsAdmin();
      if (!isAdmin) {
        await signOut();
        setError('Sem permissão para acessar o painel.');
        return;
      }

      navigate('/admin', { replace: true });
    } catch (err: any) {
      setError(err?.message ?? 'Não foi possível autenticar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nfs-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-nfs-dark border border-white/10 p-8 shadow-[0_0_30px_rgba(0,255,156,0.15)]">
        <h1 className="text-2xl font-display uppercase italic mb-2 text-white">Admin Login</h1>
        <p className="text-xs text-nfs-muted font-mono uppercase tracking-widest mb-6">
          Acesso restrito
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
              placeholder="admin@lummi.com"
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
            disabled={loading}
            className="w-full bg-nfs-green text-black py-2 font-display uppercase italic tracking-widest hover:bg-white transition-colors disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};
