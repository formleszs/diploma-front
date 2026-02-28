import { useState, useEffect } from 'react';
import { User, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { apiUpdateProfile, apiUploadAvatar } from '@/api/auth';
import { API_ORIGIN } from '@/api/http';
import { MAX_DISPLAY_NAME_LENGTH } from '@/types/auth';

function getInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return displayName.slice(0, 2).toUpperCase() || '?';
}

function avatarSrc(avatarUrl: string | null): string | null {
  if (!avatarUrl) return null;
  if (avatarUrl.startsWith('http')) return avatarUrl;
  return `${API_ORIGIN}${avatarUrl}`;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, updateUser } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) setDisplayName(user.displayName);
  }, [isOpen, user?.displayName]);

  if (!user) return null;

  const handleSubmitName = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = displayName.trim();
    if (!trimmed) {
      setError('Укажите имя');
      return;
    }
    if (trimmed.length > MAX_DISPLAY_NAME_LENGTH) {
      setError(`Максимум ${MAX_DISPLAY_NAME_LENGTH} символов`);
      return;
    }
    if (trimmed === user.displayName) {
      onClose();
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const updated = await apiUpdateProfile(trimmed);
      updateUser(updated);
      setDisplayName(updated.displayName);
      onClose();
    } catch {
      setError('Не удалось обновить имя');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setError(null);
    setUploading(true);
    try {
      const updated = await apiUploadAvatar(file);
      updateUser(updated);
    } catch {
      setError('Не удалось загрузить аватар');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const src = avatarSrc(user.avatarUrl);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[420px] p-0 overflow-hidden rounded-2xl border border-white/15 bg-[linear-gradient(160deg,rgba(14,43,28,0.94)_0%,rgba(8,30,20,0.94)_100%)] shadow-[0_34px_80px_-18px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        <DialogHeader className="p-6 pb-4 border-b border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.01)_100%)]">
          <DialogTitle className="font-heading text-2xl text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-lime/25 rounded-xl flex items-center justify-center border border-lime/25 shadow-[0_0_20px_rgba(74,222,128,0.22)]">
              <User size={20} className="text-violet" />
            </div>
            Профиль
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center gap-3">
            <label className="relative cursor-pointer">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-white/[0.05] border-2 border-white/18 flex items-center justify-center text-2xl font-heading text-white shadow-[0_10px_28px_-10px_rgba(0,0,0,0.45)]">
                {src ? (
                  <img src={src} alt="" className="h-full w-full object-cover" />
                ) : (
                  getInitials(user.displayName)
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleAvatarChange}
                disabled={uploading}
              />
              <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#86efac_0%,#4ade80_100%)] text-violet border border-lime/50 shadow-[0_0_24px_-8px_rgba(74,222,128,0.8)]">
                <Camera size={16} />
              </span>
            </label>
            {uploading && <p className="font-body text-sm text-white/70">Загрузка...</p>}
          </div>

          <form onSubmit={handleSubmitName} className="space-y-3">
            <label className="block font-label uppercase tracking-[0.08em] text-xs text-white/75">
              Отображаемое имя
            </label>
            <div className="flex gap-2">
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value.slice(0, MAX_DISPLAY_NAME_LENGTH))}
                className="h-12 flex-1 rounded-xl bg-white/[0.07] border border-white/18 font-body text-white placeholder:text-white/45 focus-visible:ring-2 focus-visible:ring-lime/50 focus-visible:border-lime/35 shadow-inner shadow-black/10 transition-[box-shadow,border-color,background-color]"
                maxLength={MAX_DISPLAY_NAME_LENGTH}
              />
              <Button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[linear-gradient(135deg,#86efac_0%,#4ade80_100%)] text-violet hover:brightness-95 border border-lime/50 shadow-[0_0_36px_-10px_rgba(74,222,128,0.7)]"
              >
                {saving ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
            <p className="font-body text-xs text-white/55">{displayName.length}/{MAX_DISPLAY_NAME_LENGTH}</p>
            {error && <p className="font-body text-sm text-red-400">{error}</p>}
          </form>

          <p className="font-body text-sm text-white/72">{user.email}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
