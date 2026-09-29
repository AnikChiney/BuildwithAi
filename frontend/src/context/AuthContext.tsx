import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { authApi, AuthUser } from '../services/authApi';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const authVersion = useRef(0);

  useEffect(() => {
    let active = true;

    console.log("AUTH: checking session...");
    const versionAtStart = authVersion.current;
    authApi
      .me()
      .then(u => {
        if (
          active &&
          authVersion.current === versionAtStart
        ) {
          setUser(u);
        }
      })
      .catch(() => {
        // leave user as-is
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  const login = useCallback(async (email: string, password: string) => {
    const u = await authApi.login(email, password);
    authVersion.current++;
    setUser(u);
  }, []);
  const register = useCallback(async (
    name: string,
    email: string,
    password: string
  ) => {
    await authApi.register(name, email, password);

    const u = await authApi.login(email, password);

    authVersion.current++;
    setUser(u);
  }, []);
  const logout = useCallback(async () => {
    await authApi.logout();
    authVersion.current++;
    setUser(null);
  }, []);
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
