// src/components/ProtectedRoute.tsx

import React from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importamos el hook que nos da el estado global

/**
 * Interfaz para las propiedades de la Ruta Protegida.
 * Recibe los elementos hijos que debe renderizar si el acceso es permitido.
 */
interface ProtectedRouteProps {
  children: ReactNode;
  // El rol requerido para acceder a esta ruta (por defecto, solo el administrador)
  requiredRole?: 'administrador' | 'jugador'; 
}

/**
 * Componente que verifica la autenticación y el rol antes de renderizar la página.
 * * Concepto de Renderizado Condicional:
 * El componente decide qué renderizar (la página solicitada o una redirección)
 * basándose en el  ado de las variables (isLoggedIn y user.rol).
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole = 'administrador' }) => {
  
  // Obtenemos el estado de autenticación global
  const { isLoggedIn, user } = useAuth();

  // 1. Verificar si el usuario NO ha iniciado sesión.
  if (!isLoggedIn) {
    // Si no está logueado, lo redireccionamos a la página de login.
    // Navigate es el componente de React Router DOM que fuerza el cambio de URL.
    return <Navigate to="/login" replace />; 
  }

  // 2. Verificar el Rol (Autorización)
  // Solo se realiza la verificación de rol si el usuario existe y si la ruta lo requiere.
  if (user && user.rol !== requiredRole) {
    // Si el usuario está logueado pero no tiene el rol necesario, 
    // lo enviamos a una ruta pública (ej. la página de inicio) o a una página de error 403.
    console.warn(`Intento de acceso denegado. Rol actual: ${user.rol}, Rol requerido: ${requiredRole}`);
    return <Navigate to="/" replace />; 
  }

  // 3. Acceso Permitido
  // Si pasa todas las verificaciones (logueado y con rol correcto), renderizamos el contenido hijo (la página).
  return <>{children}</>;
};

export default ProtectedRoute;