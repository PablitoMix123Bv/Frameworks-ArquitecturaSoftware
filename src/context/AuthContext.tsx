// src/context/AuthContext.tsx

import React, { createContext, useState, useContext} from 'react';
import type { ReactNode } from 'react';

// 1. Interfaz para el objeto Usuario (lo que guardaremos)
interface AuthUser {
  id: number;
  email: string;
  // Rol define el nivel de acceso (administrador o estudiante)
  rol: 'administrador' | 'estudiante'; 
}

// 2. Interfaz para el Contexto (lo que se comparte)
// El contexto contiene el usuario, el estado de login, y las funciones
interface AuthContextType {
  user: AuthUser | null; // El usuario puede ser un objeto o null
  isLoggedIn: boolean;
  login: (email: string, rol: 'administrador' | 'estudiante') => void;
  logout: () => void;
}

// 3. Valor inicial del Contexto
// El contexto arranca sin usuario y sin funciones (temporalmente)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Hook personalizado para usar el contexto de forma segura (para no tener que usar useContext en cada archivo)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Interfaz para las propiedades del proveedor (recibe elementos hijos)
interface AuthProviderProps {
  children: ReactNode; // El contenido que envuelve el Provider
}

// 5. Componente Proveedor (El que guarda y reparte el estado)
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  
  // Estado que mantiene la información del usuario en toda la app
  const [user, setUser] = useState<AuthUser | null>(null);
  
  // Función para simular el inicio de sesión
  const login = (email: string, rol: 'administrador' | 'estudiante') => {
    // En una app real, aquí se guardaría el token JWT y se validarían los permisos
    const newUser: AuthUser = { id: 1, email, rol };
    setUser(newUser);
  };

  // Función para cerrar la sesión
  const logout = () => {
    setUser(null);
  };
  
  // El objeto 'value' es lo que se reparte a los componentes
  const value: AuthContextType = {
    user,
    isLoggedIn: user !== null, // Cálculo simple de si está logueado
    login,
    logout,
  };

  // Retornamos el Contexto Provider con el valor global
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};