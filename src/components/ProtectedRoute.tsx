// src/components/ProtectedRoute.tsx

import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Rol } from '../types';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: Rol; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole = 'admin' }) => {
  const { isLoggedIn, user, isLoading } = useAuth();

  if (isLoading) return <div>Cargando...</div>;

  // Validación de sesión
  if (!isLoggedIn || !user || !user.roles || !Array.isArray(user.roles)) {
    return <Navigate to="/login" replace />; 
  }

  // Verificación directa contra la BD (user.roles contiene 'admin', 'user', etc.)
  const tienePermiso = user.roles.includes(requiredRole);

  if (!tienePermiso) {
    return <Navigate to="/" replace />; 
  }

  return <>{children}</>;
};

export default ProtectedRoute;