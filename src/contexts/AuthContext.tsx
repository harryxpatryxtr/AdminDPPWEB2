'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService, LoginCredentials } from '@/services/authService';
import { getToken, setToken, removeToken, setUser, getUser, isTokenExpired } from '@/lib/tokenUtils';
import type { StoredUser } from '@/lib/tokenUtils';

interface AuthContextType {
  user: StoredUser | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
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
  const [user, setUserState] = useState<StoredUser | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Cargar estado inicial del localStorage
  useEffect(() => {
    const initAuth = () => {
      const storedToken = getToken();
      const storedUser = getUser();

      if (storedToken) {
        // Verificar si el token ha expirado
        if (isTokenExpired(storedToken)) {
          removeToken();
          setTokenState(null);
          setUserState(null);
        } else {
          setTokenState(storedToken);
          setUserState(storedUser);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      // Guardar token
      setToken(response.token);
      setTokenState(response.token);

      // Guardar información del usuario si viene en la respuesta
      if (response.user) {
        setUser(response.user);
        setUserState(response.user);
      } else {
        // Si no viene el usuario, intentar obtenerlo del token o hacer una petición
        try {
          const userData = await authService.getCurrentUser(response.token);
          if (userData) {
            setUser(userData);
            setUserState(userData);
          }
        } catch (error) {
          console.warn('No se pudo obtener información del usuario:', error);
        }
      }
    } catch (error) {
      removeToken();
      setTokenState(null);
      setUserState(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    setUserState(null);
    router.push('/login');
  };

  const isAuthenticated = token !== null && !isTokenExpired(token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

