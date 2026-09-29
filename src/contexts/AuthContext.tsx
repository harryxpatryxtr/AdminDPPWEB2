'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService, LoginCredentials, SessionRole, SessionUser } from '@/services/authService';
import { clearSession, hasSession, setSession } from '@/lib/tokenUtils';

interface AuthContextType {
  user: SessionUser | null;
  roles: SessionRole[];
  permissions: string[];
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  /** true si la sesión tiene la clave de permiso (ej. "user:create") */
  can: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [roles, setRoles] = useState<SessionRole[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const resetState = () => {
    setUser(null);
    setRoles([]);
    setPermissions([]);
  };

  const loadSession = useCallback(async () => {
    const session = await authService.getSession();
    setUser(session.user);
    setRoles(session.roles);
    setPermissions(session.permissions);
  }, []);

  // Recuperar la sesión guardada al cargar la app
  useEffect(() => {
    const init = async () => {
      if (hasSession()) {
        try {
          await loadSession();
        } catch {
          clearSession();
          resetState();
        }
      } else {
        clearSession();
      }
      setLoading(false);
    };
    init();
  }, [loadSession]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const { accessToken, refreshToken } = await authService.login(credentials);
      setSession({ accessToken, refreshToken });
      await loadSession();
    } catch (error) {
      clearSession();
      resetState();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // La sesión local se cierra aunque el servidor no responda
    }
    clearSession();
    resetState();
    router.push('/login');
  };

  const can = useCallback(
    (permission: string) => permissions.includes(permission.toLowerCase()),
    [permissions],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        roles,
        permissions,
        loading,
        isAuthenticated: user !== null,
        login,
        logout,
        can,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
