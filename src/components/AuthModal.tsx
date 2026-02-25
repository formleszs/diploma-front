import { useState, useEffect } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { MAX_DISPLAY_NAME_LENGTH } from '@/types/auth';

const MIN_PASSWORD_LENGTH = 8;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { t } = useLanguage();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 2000);
    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (isOpen) setError(null);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (mode === 'login') {
      const ok = await login(email, password);
      if (ok) onClose();
      else setError('Введённый email или пароль некорректны.');
    } else {
      const trimmedName = displayName.trim();
      if (!trimmedName) {
        setError('Укажите отображаемое имя');
        return;
      }
      if (trimmedName.length > MAX_DISPLAY_NAME_LENGTH) {
        setError(`Имя не должно быть длиннее ${MAX_DISPLAY_NAME_LENGTH} символов`);
        return;
      }
      if (password.length < MIN_PASSWORD_LENGTH) {
        setError(`Пароль должен быть длиннее ${MIN_PASSWORD_LENGTH} символов`);
        return;
      }
      const result = await register({ email, password, displayName: trimmedName });
      if (result === true) onClose();
      else if (result === 'EMAIL_EXISTS') setError('Пользователь с таким email уже зарегистрирован!');
      else if (typeof result === 'object' && result.error === 'PASSWORD_TOO_SHORT') setError(`Пароль должен быть длиннее ${result.minLength} символов`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[420px] p-0 overflow-hidden rounded-2xl shadow-[0_34px_80px_-18px_rgba(0,0,0,0.55)] border border-white/15 bg-[linear-gradient(160deg,rgba(14,43,28,0.94)_0%,rgba(8,30,20,0.94)_100%)] backdrop-blur-xl">
        <DialogHeader className="p-6 pb-4 border-b border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.01)_100%)]">
          <DialogTitle className="font-heading text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-lime/25 rounded-xl flex items-center justify-center border border-lime/25 shadow-[0_0_20px_rgba(74,222,128,0.22)]">
              <LogIn size={20} className="text-violet" />
            </div>
            {t.auth.title}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <div className="flex rounded-full bg-white/6 p-1 mb-6 border border-white/12">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full font-label font-medium text-xs uppercase tracking-wider transition-all duration-200 ${
                mode === 'login'
                  ? 'bg-[linear-gradient(135deg,#86efac_0%,#4ade80_100%)] text-violet shadow-[0_8px_24px_-10px_rgba(74,222,128,0.7)] ring-1 ring-lime/45'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <LogIn size={14} />
              {t.auth.login}
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full font-label font-medium text-xs uppercase tracking-wider transition-all duration-200 ${
                mode === 'register'
                  ? 'bg-[linear-gradient(135deg,#86efac_0%,#4ade80_100%)] text-violet shadow-[0_8px_24px_-10px_rgba(74,222,128,0.7)] ring-1 ring-lime/45'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <UserPlus size={14} />
              {t.auth.register}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div>
                <label className="block font-label text-xs font-medium uppercase tracking-wider text-white/75 mb-2">
                  {t.auth.name}
                </label>
                <Input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value.slice(0, MAX_DISPLAY_NAME_LENGTH))}
                  className="h-12 bg-white/[0.07] border border-white/18 rounded-xl font-body text-white placeholder:text-white/45 focus-visible:ring-2 focus-visible:ring-lime/50 focus-visible:border-lime/35 shadow-inner shadow-black/10 transition-[box-shadow,border-color,background-color]"
                  placeholder="Имя пользователя"
                  maxLength={MAX_DISPLAY_NAME_LENGTH}
                />
                <p className="mt-1.5 font-body text-xs text-white/55">
                  {displayName.length}/{MAX_DISPLAY_NAME_LENGTH}
                </p>
              </div>
            )}
            <div>
              <label className="block font-label text-xs font-medium uppercase tracking-wider text-white/75 mb-2">
                {t.auth.email}
              </label>
                <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-white/[0.07] border border-white/18 rounded-xl font-body text-white placeholder:text-white/45 focus-visible:ring-2 focus-visible:ring-lime/50 focus-visible:border-lime/35 shadow-inner shadow-black/10 transition-[box-shadow,border-color,background-color]"
                placeholder="you@university.edu"
                required
              />
            </div>
            <div>
              <label className="block font-label text-xs font-medium uppercase tracking-wider text-white/75 mb-2">
                {t.auth.password}
              </label>
                <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-white/[0.07] border border-white/18 rounded-xl font-body text-white placeholder:text-white/45 focus-visible:ring-2 focus-visible:ring-lime/50 focus-visible:border-lime/35 shadow-inner shadow-black/10 transition-[box-shadow,border-color,background-color]"
                placeholder="••••••••"
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
              className="w-full h-12 btn-pill bg-[linear-gradient(135deg,#86efac_0%,#4ade80_100%)] text-violet hover:brightness-95 font-label font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_36px_-10px_rgba(74,222,128,0.7)] hover:-translate-y-0.5 border border-lime/50"
            >
              {mode === 'login' ? t.auth.submitLogin : t.auth.submitRegister}
            </Button>
          </form>

          <p className="mt-5 text-center font-body text-sm text-white/75">
            {mode === 'login' ? t.auth.noAccount : t.auth.haveAccount}{' '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-lime font-medium hover:underline underline-offset-2 focus:outline-none"
            >
              {mode === 'login' ? t.auth.register : t.auth.login}
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
