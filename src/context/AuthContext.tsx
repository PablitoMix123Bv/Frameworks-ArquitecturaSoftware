// src/context/AuthContext.tsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../api/axios'; 
// Importamos el tipo Rol desde types para mantener consistencia
import type { Rol } from '../types';

interface AuthUser {
  id: string; 
  email: string;
  nombre: string;
  rol: Rol;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>; 
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true); 

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        setUser(null);
        setChecking(false);
        return;
    }

    try {
        const userStored = localStorage.getItem('user');
        if(userStored) {
            setUser(JSON.parse(userStored));
        }
    } catch (error) {
        logout();
    }
    setChecking(false);
  };

  const login = async (email: string, password: string) => {
    try {
        const { data } = await api.post('/auth/login', { email, password });
        
        const { user, token } = data;
        
        // El backend ya debe devolver el rol 'capitan' si corresponde
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        
    } catch (error: any) {
        console.error(error);
        throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    checkAuthStatus
  };

  if (checking) return <div>Cargando...</div>; 

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};