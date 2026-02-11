import { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/context/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI-only: no backend
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[420px] p-0 border-0 overflow-hidden bg-surface rounded-[24px] shadow-[0_24px_60px_-12px_rgba(5,46,22,0.35)]">
        <DialogHeader className="p-6 pb-4 border-b border-violet/10">
          <DialogTitle className="font-heading text-2xl text-violet flex items-center gap-3">
            <div className="w-10 h-10 bg-lime/20 rounded-xl flex items-center justify-center">
              <LogIn size={20} className="text-lime" />
            </div>
            {t.auth.title}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex rounded-xl bg-violet/5 p-1 mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-label uppercase tracking-[0.08em] text-xs transition-all ${
                mode === 'login'
                  ? 'bg-lime text-violet'
                  : 'text-violet/70 hover:text-violet'
              }`}
            >
              <LogIn size={14} />
              {t.auth.login}
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-label uppercase tracking-[0.08em] text-xs transition-all ${
                mode === 'register'
                  ? 'bg-lime text-violet'
                  : 'text-violet/70 hover:text-violet'
              }`}
            >
              <UserPlus size={14} />
              {t.auth.register}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block font-label uppercase tracking-[0.08em] text-xs text-violet/80 mb-1.5">
                  {t.auth.name}
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 bg-violet/5 border border-violet/15 rounded-xl font-body text-violet placeholder:text-violet/50 focus:ring-2 focus:ring-violet/30"
                  placeholder={t.auth.name}
                />
              </div>
            )}
            <div>
              <label className="block font-label uppercase tracking-[0.08em] text-xs text-violet/80 mb-1.5">
                {t.auth.email}
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-violet/5 border border-violet/15 rounded-xl font-body text-violet placeholder:text-violet/50 focus:ring-2 focus:ring-violet/30"
                placeholder="you@university.edu"
                required
              />
            </div>
            <div>
              <label className="block font-label uppercase tracking-[0.08em] text-xs text-violet/80 mb-1.5">
                {t.auth.password}
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-violet/5 border border-violet/15 rounded-xl font-body text-violet placeholder:text-violet/50 focus:ring-2 focus:ring-violet/30"
                placeholder="••••••••"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 bg-lime text-violet hover:bg-lime-dark font-label uppercase tracking-[0.08em] text-sm rounded-xl transition-all duration-300 hover:scale-[1.02]"
            >
              {mode === 'login' ? t.auth.submitLogin : t.auth.submitRegister}
            </Button>
          </form>

          <p className="mt-4 text-center font-body text-sm text-violet/80">
            {mode === 'login' ? t.auth.noAccount : t.auth.haveAccount}{' '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-lime font-medium hover:underline"
            >
              {mode === 'login' ? t.auth.register : t.auth.login}
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
