import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '@/types/auth';
import { ACCESS_TOKEN_KEY } from '@/types/auth';
import { apiLogin, apiMe, apiRegister } from '@/api/auth';

export type RegisterError =
  | 'EMAIL_EXISTS'
  | { error: 'PASSWORD_TOO_SHORT'; minLength: number };

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (payload: { email: string; password: string; displayName: string }) => Promise<boolean | RegisterError>;
  logout: () => void;
  updateUser: (user: User) => void;
  isAuthenticated: boolean;
}

const DEFAULT_MIN_PASSWORD_LENGTH = 8;

function parseMinPasswordLength(message: string): number {
  const match = message.match(/(\d+)/);
  return match ? Math.max(1, parseInt(match[1], 10)) : DEFAULT_MIN_PASSWORD_LENGTH;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(ACCESS_TOKEN_KEY));
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const stored = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (!stored) {
        if (!cancelled) {
          setToken(null);
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const me = await apiMe();
        if (cancelled) return;
        setToken(stored);
        setUser(me);
      } catch {
        // 401 обрабатывается интерсептором (удалит токен и отправит на /login)
        if (cancelled) return;
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        const res = await apiLogin({ email, password });
        localStorage.setItem(ACCESS_TOKEN_KEY, res.token);
        setToken(res.token);
        setUser(res.user);
        navigate('/app');
        return true;
      } catch {
        return false;
      }
    },
    [navigate]
  );

  const updateUser = useCallback((user: User) => {
    setUser(user);
  }, []);

  const register = useCallback(
    async (payload: { email: string; password: string; displayName: string }): Promise<boolean | RegisterError> => {
      try {
        const res = await apiRegister(payload);
        localStorage.setItem(ACCESS_TOKEN_KEY, res.token);
        setToken(res.token);
        setUser(res.user);
        navigate('/app');
        return true;
      } catch (err: unknown) {
        const res = (err as { response?: { status?: number; data?: { message?: string } } })?.response;
        if (res?.status === 409) return 'EMAIL_EXISTS';
        const msg = (res?.data?.message ?? '').toLowerCase();
        const isEmailExists =
          res?.status === 400 &&
          (msg.includes('уже') || msg.includes('already') || msg.includes('exists') || msg.includes('зарегистрирован'));
        if (isEmailExists) return 'EMAIL_EXISTS';
        const isPasswordRelated =
          res?.status === 400 &&
          (msg.includes('password') || msg.includes('пароль') || msg.includes('парол'));
        const isLengthRelated =
          msg.includes('short') || msg.includes('length') || msg.includes('длин') || msg.includes('минимум') || msg.includes('at least') || msg.includes('символ');
        if (isPasswordRelated && isLengthRelated) {
          const minLength = parseMinPasswordLength(res?.data?.message ?? '');
          return { error: 'PASSWORD_TOO_SHORT', minLength };
        }
        return false;
      }
    },
    [navigate]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    setToken(null);
    setUser(null);
    navigate('/');
  }, [navigate]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      login,
      register,
      logout,
      updateUser,
      isAuthenticated: !!token && !!user,
    }),
    [user, token, isLoading, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
