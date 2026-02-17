import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import ProfileModal from '@/components/ProfileModal';
import { API_ORIGIN } from '@/api/http';

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

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const src = user ? avatarSrc(user.avatarUrl) : null;

  return (
    <div className="min-h-screen bg-violet">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-violet/95 backdrop-blur-md">
        <div className="flex h-14 w-full items-center justify-between px-8 lg:px-14">
          <Link to="/app" className="flex items-center gap-2 text-white hover:opacity-90">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime">
              <BookOpen size={18} className="text-violet" />
            </div>
            <span className="font-heading text-lg">StudySync</span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-2 rounded-lg py-1.5 pl-1 pr-3 text-white hover:bg-white/10 transition-colors"
            >
              <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-violet/20 border border-white/20 flex items-center justify-center text-sm font-heading text-lime">
                {src ? (
                  <img src={src} alt="" className="h-full w-full object-cover" />
                ) : (
                  user ? getInitials(user.displayName) : '?'
                )}
              </div>
              <span className="font-body text-sm font-medium truncate max-w-[140px]">
                {user?.displayName ?? 'Пользователь'}
              </span>
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <LogOut size={16} />
              Выйти
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
        <Outlet />
      </main>
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}
