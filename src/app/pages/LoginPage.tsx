import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/app';

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 2000);
    return () => clearTimeout(timer);
  }, [error]);

  if (!isLoading && isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) navigate(from, { replace: true });
    else setError('Введённый email или пароль некорректны.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-violet px-4">
      <div className="w-full max-w-[420px] rounded-[28px] bg-surface p-8 shadow-[0_24px_60px_-12px_rgba(5,46,22,0.35)]">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime/20">
            <BookOpen size={24} className="text-lime" />
          </div>
          <div>
            <h1 className="font-heading text-2xl text-violet">StudySync</h1>
            <p className="font-body text-sm text-violet/70">Вход в личный кабинет</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block font-label text-xs uppercase tracking-wider text-violet/80">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="h-12 rounded-xl border-violet/15 bg-violet/5 text-violet"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block font-label text-xs uppercase tracking-wider text-violet/80">Пароль</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-12 rounded-xl border-violet/15 bg-violet/5 text-violet"
              required
            />
            {error && (
              <p className="mt-2 font-body text-sm text-red-400" role="alert">
                {error}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-lime font-label text-violet hover:bg-lime-dark"
          >
            {loading ? 'Вход...' : 'Войти'}
          </Button>
        </form>
      </div>
    </div>
  );
}
