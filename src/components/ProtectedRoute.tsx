// src/components/ProtectedRoute.tsx

import React from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
// 1. IMPORTAMOS EL TIPO ROL (Esto es clave)
import type { Rol } from '../types'; 

interface ProtectedRouteProps {
  children: ReactNode;
  // 2. ACTUALIZAMOS EL TIPO AQUÍ
  // En lugar de escribir los roles a mano, usamos el tipo global
  requiredRole?: Rol; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole = 'administrador' }) => {
  
  const { isLoggedIn, user } = useAuth();

  // 1. Verificar si no ha iniciado sesión
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />; 
  }

  // 2. Verificar Rol
  // Ahora TypeScript sabe que user.rol y requiredRole son compatibles (ambos son tipo Rol)
  if (user && requiredRole && user.rol !== requiredRole) {
    console.warn(`Acceso denegado. Rol actual: ${user.rol}, Requerido: ${requiredRole}`);
    // Redirigimos a la página principal si no tiene permisos
    return <Navigate to="/equipos" replace />; 
  }

  // 3. Acceso Permitido
  return <>{children}</>;
};

export default ProtectedRoute;