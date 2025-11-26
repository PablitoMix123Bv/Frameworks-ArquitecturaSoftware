// src/context/AuthContext.tsx

import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import api from '../api/axios';
import type { Usuario } from '../types';

interface AuthContextType {
  user: Usuario | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, expediente: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
        const token = localStorage.getItem('token');
        const userStored = localStorage.getItem('user');

        if (token && userStored) {
            try {
                setUser(JSON.parse(userStored));
            } catch (e) {
                logout(); // Si el JSON está corrupto, limpiar
            }
        }
        // Importante: Terminamos de cargar sea cual sea el resultado
        setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
        // PASO 1: Obtener Token y ID básico (Tu backend actual solo devuelve esto)
        const { data: loginData } = await api.post('/auth/login', { email, password });
        const token = loginData.token;
        
        if (!token) throw new Error('No se recibió token del servidor');

        // Guardamos token temporalmente para poder hacer la siguiente petición autenticada
        localStorage.setItem('token', token);

        // PASO 2: Obtener el perfil completo (Roles, Nombre, etc.) usando el ID
        // Usamos el endpoint GET /auth/:id que SÍ devuelve todos los campos
        const userId = loginData.id; 
        const { data: fullUserData } = await api.get(`/auth/${userId}`);

        // Combinamos la info y guardamos
        const userFinal = { ...fullUserData, token }; // Aseguramos que tenga todo
        
        localStorage.setItem('user', JSON.stringify(userFinal));
        setUser(userFinal);

    } catch (error: any) {
        // Si falla algo, limpiamos cualquier rastro
        logout();
        const mensaje = error.response?.data?.message || 'Error al iniciar sesión';
        throw new Error(mensaje);
    }
  };

  const register = async (nombre: string, email: string, expediente: string, password: string) => {
      try {
          // El endpoint register suele devolver el usuario creado completo, así que aquí no suele hacer falta doble paso
          // Pero por seguridad, si el backend cambia, confiamos en la respuesta directa primero.
          const { data } = await api.post('/auth/register', { nombre, email, expediente, password });
          
          // Ajuste: Si el backend de registro no devuelve token directo, habría que hacer login automático.
          // Asumimos que tu backend devuelve { ...user, token } en register también.
          const { token, ...userData } = data;
          
          if (token) {
              localStorage.setItem('token', token);
              localStorage.setItem('user', JSON.stringify(userData));
              setUser(userData);
          }
      } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Error en el registro');
      }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, register, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};