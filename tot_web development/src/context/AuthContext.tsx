// src/context/AuthContext.tsx
import React, { ReactNode, createContext, useEffect, useState } from 'react';
import { User } from '../types/auth';

// Add admin type to existing User type
type AdminUser = {
  id: string;
  username: string;
  role: 'admin';
  email: string;
};

type AuthUser = User | AdminUser;

interface AuthContextType {
  authState: {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
  };
  setAuthState: React.Dispatch<React.SetStateAction<AuthContextType['authState']>>;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  isAdmin: () => boolean;
}

const defaultAuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

export const AuthContext = createContext<AuthContextType>({
  authState: defaultAuthState,
  setAuthState: () => {},
  adminLogin: async () => false,
  isAdmin: () => false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthContextType['authState']>(defaultAuthState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      setAuthState({
        token,
        user,
        isAuthenticated: true,
      });
    }
  }, []);

  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    if (username === 'TOTtoken12' && password === 'admintoken') {
      const adminUser: AdminUser = {
        id: 'admin-1',
        username: 'TOTtoken12',
        email: 'admin@example.com',
        role: 'admin',
      };

      const adminToken = 'admin-token-' + Date.now();

      setAuthState({
        user: adminUser,
        token: adminToken,
        isAuthenticated: true,
      });

      localStorage.setItem('token', adminToken);
      localStorage.setItem('user', JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const isAdmin = (): boolean => {
    return authState.user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState, adminLogin, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};