import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { checkIsAdmin } from '../../services/adminAuth';
import { updateProfile } from '../../services/auth';

export const Account: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [city, setCity] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setDisplayName(profile?.display_name ?? '');
    setCity(profile?.city ?? '');
  }, [profile]);

  useEffect(() => {
    let mounted = true;

    async function run() {
      if (!user) return;
      const ok = await checkIsAdmin();
      if (mounted) setIsAdmin(ok);
    }

    run();
    return () => {
      mounted = false;
    };
  }, [user]);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      await updateProfile(user, {
        display_name: displayName.trim() || null,
        city: city.trim() || null,
      });
      await refreshProfile();
      setMessage('Perfil atualizado com sucesso.');
    } catch (err: any) {
      setError(err?.message ?? 'Não foi possível atualizar o perfil.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-nfs-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-nfs-dark border border-white/10 p-8 shadow-[0_0_30px_rgba(0,255,156,0.15)]">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="text-xs font-mono text-nfs-muted hover:text-white">
            ← Voltar ao site
          </Link>
          {isAdmin ? (
            <Link to="/admin" className="text-xs font-mono text-nfs-purple hover:text-white">
              Admin →
            </Link>
          ) : null}
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-display uppercase italic text-white">Minha conta</h1>
            <p className="text-xs text-nfs-muted font-mono uppercase tracking-widest">
              Gerencie seus dados
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-xs uppercase tracking-widest border border-white/20 px-4 py-2 hover:border-nfs-green hover:text-nfs-green transition-colors"
          >
            Sair
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-nfs-muted mb-2">Email</div>
            <div className="text-sm text-white bg-black/40 border border-white/10 px-3 py-2">
              {user?.email ?? '—'}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-nfs-muted mb-2">
              ID do usuário
            </div>
            <div className="text-sm text-nfs-muted bg-black/40 border border-white/10 px-3 py-2">
              {user?.id ?? '—'}
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="mt-8 space-y-4">
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
              Cidade
            </label>
            <input
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="w-full bg-black/40 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-nfs-green"
              placeholder="Cidade"
            />
          </div>
          {error && <div className="text-sm text-red-400">{error}</div>}
          {message && <div className="text-sm text-nfs-green">{message}</div>}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-nfs-green text-black py-2 font-display uppercase italic tracking-widest hover:bg-white transition-colors disabled:opacity-60"
            >
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
            <button
              type="button"
              onClick={() => {
                setDisplayName(profile?.display_name ?? '');
                setCity(profile?.city ?? '');
                setMessage(null);
                setError(null);
              }}
              className="flex-1 border border-white/20 py-2 text-xs uppercase tracking-widest hover:border-nfs-green hover:text-nfs-green transition-colors"
            >
              Restaurar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
