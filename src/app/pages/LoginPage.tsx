import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    <div className="relative flex min-h-screen items-center justify-center bg-violet-dark px-4">
      <div className="absolute inset-0 pointer-events-none bg-depth-drift opacity-[0.08]" aria-hidden />
      <motion.div
        className="relative flex min-h-screen w-full items-center justify-center px-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      >
      <div className="w-full max-w-[420px] rounded-3xl bg-surface p-8 shadow-[0_28px_64px_-16px_rgba(0,0,0,0.35)] border border-white/10">
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
      </motion.div>
    </div>
  );
}
