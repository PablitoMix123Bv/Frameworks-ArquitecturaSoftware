// src/components/HeaderNav.tsx

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Hook del Contexto de Autenticación
import './HeaderNav.css'; // Asegúrate de importar tus estilos

const HeaderNav: React.FC = () => {
  const navigate = useNavigate();
  // Obtenemos el estado global del usuario y la función de cierre de sesión
  const { isLoggedIn, user, logout } = useAuth(); 

  // Función para manejar el botón principal de autenticación
  const handleAuthClick = () => {
    if (isLoggedIn) {
      // Si está logueado, lo enviamos al perfil o al dashboard de admin
      if (user?.rol === 'administrador') {
        navigate('/admin/torneos');
      } else {
        // En un futuro, aquí iría la ruta al perfil del capitán/jugador
        alert('Funcionalidad de Perfil de Jugador Pendiente.');
      }
    } else {
      // Si no está logueado, lo enviamos al login
      navigate('/login');
    }
  };

  return (
    <>
      <div className="header-container">
        <div className="title">Coordinadores - Administración de deportes</div>
        
        {/* Controles de Autenticación */}
        <div className="auth-controls">
          
          {/* Botón Principal (Login / Perfil) */}
          <button className="btn-primary" onClick={handleAuthClick}>
            {isLoggedIn ? (user?.rol === 'administrador' ? 'Dashboard Admin' : 'Mi Perfil') : 'Iniciar Sesión'}
          </button>

          {/* Botón de Cerrar Sesión (Solo visible si está logueado) */}
          {isLoggedIn && (
            <button className="btn-secondary" onClick={logout}>
              Cerrar Sesión
            </button>
          )}

        </div>
      </div>

      {/* Barra de Navegación Azul */}
      <div className="nav-bar-container">
        {/* La navegación pública debe ser accesible por todos */}
        <NavLink to="/public/torneos" className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}>Torneos</NavLink>
        <NavLink to="/public/resultados" className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}>Resultados</NavLink>
        <NavLink to="/public/equipos" className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}>Equipos</NavLink>
        <NavLink to="/public/partidos" className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}>Partidos</NavLink>
        <NavLink to="/public/inscripciones" className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}>Inscripciones</NavLink>
        <NavLink to="/public/avisos" className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}>Avisos</NavLink>

        {/* Ejemplo de un enlace solo para administradores (Gestión de Jornadas, etc.) */}
        {user?.rol === 'administrador' && (
          <NavLink to="/admin/jornadas" className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}>Gestión Admin</NavLink>
        )}
      </div>
    </>
  );
};

export default HeaderNav;