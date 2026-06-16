/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api } from '@/services/api';
import type { AuthUser } from '@/types/business';

const TOKEN_KEY = 'enterprise-learning-token';
const USER_KEY = 'enterprise-learning-user';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readUser(): AuthUser | null {
  try {
    const value = localStorage.getItem(USER_KEY);
    return value ? JSON.parse(value) as AuthUser : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? readUser() : null;
  });
  const loading = false;

  useEffect(() => {
    const expire = () => setUser(null);
    window.addEventListener('enterprise-auth-expired', expire);
    return () => window.removeEventListener('enterprise-auth-expired', expire);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: Boolean(user && localStorage.getItem(TOKEN_KEY)),
    loading,
    login: async (username: string, password: string) => {
      const result = await api.auth.login(username, password);
      localStorage.setItem(TOKEN_KEY, result.token);
      localStorage.setItem(USER_KEY, JSON.stringify(result.user));
      setUser(result.user);
    },
    logout: () => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
    },
  }), [loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
