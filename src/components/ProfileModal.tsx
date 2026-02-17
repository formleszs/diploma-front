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
      <DialogContent className="max-w-[420px] p-0 border-0 overflow-hidden !bg-surface rounded-[24px] shadow-[0_24px_60px_-12px_rgba(5,46,22,0.35)]">
        <DialogHeader className="p-6 pb-4 border-b border-violet/10">
          <DialogTitle className="font-heading text-2xl text-violet flex items-center gap-3">
            <div className="w-10 h-10 bg-lime/20 rounded-xl flex items-center justify-center">
              <User size={20} className="text-lime" />
            </div>
            Профиль
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center gap-3">
            <label className="relative cursor-pointer">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-violet/10 border-2 border-violet/20 flex items-center justify-center text-2xl font-heading text-violet">
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
              <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-lime text-violet">
                <Camera size={16} />
              </span>
            </label>
            {uploading && <p className="font-body text-sm text-violet/70">Загрузка...</p>}
          </div>

          <form onSubmit={handleSubmitName} className="space-y-3">
            <label className="block font-label uppercase tracking-[0.08em] text-xs text-violet/80">
              Отображаемое имя
            </label>
            <div className="flex gap-2">
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value.slice(0, MAX_DISPLAY_NAME_LENGTH))}
                className="h-12 flex-1 rounded-xl border-violet/15 bg-violet/5 text-violet"
                maxLength={MAX_DISPLAY_NAME_LENGTH}
              />
              <Button type="submit" disabled={saving} className="rounded-xl bg-lime text-violet hover:bg-lime-dark">
                {saving ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
            <p className="font-body text-xs text-violet/60">{displayName.length}/{MAX_DISPLAY_NAME_LENGTH}</p>
            {error && <p className="font-body text-sm text-red-400">{error}</p>}
          </form>

          <p className="font-body text-sm text-violet/70">{user.email}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
