// src/components/HeaderNav.tsx

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Hook del Contexto de Autenticación
import './HeaderNav.css'; // Asegúrate de importar tus estilos

const HeaderNav: React.FC = () => {
  const navigate = useNavigate();
  // Obtenemos el estado global del usuario y la función de cierre de sesión
  const { isLoggedIn, user, logout } = useAuth(); 

  // --- Renderizado de Enlaces ---
  // Esta función ahora maneja TODOS los enlaces de navegación
  const renderNavLinks = () => {
    return (
        <>
            {/* --- ENLACES PÚBLICOS --- */}
            <NavLink to="/public/torneos" className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}>Torneos</NavLink>
            <NavLink to="/public/resultados" className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}>Resultados</NavLink>
            <NavLink to="/public/equipos" className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}>Equipos</NavLink>
            <NavLink to="/public/partidos" className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}>Partidos</NavLink>
            <NavLink to="/public/inscripciones" className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}>Inscripciones</NavLink>
            <NavLink to="/public/avisos" className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}>Avisos</NavLink>

            {/* Separador visual si hay roles logueados */}
            {user && <span className="nav-separator"></span>}

            {/* --- ENLACES DE GESTIÓN (ADMIN) --- */}
            {user?.rol === 'administrador' && (
                <>
                    {/* ENLACES MOVIMIENTOS A LA BARRA AZUL */}
                    <NavLink to="/admin/torneos" className={({ isActive }) => isActive ? "nav-tab admin active" : "nav-tab admin"}>Gestión Torneos</NavLink>
                    <NavLink to="/admin/avisos" className={({ isActive }) => isActive ? "nav-tab admin active" : "nav-tab admin"}>Gestión Avisos</NavLink>
                    <NavLink to="/admin/arbitros" className={({ isActive }) => isActive ? "nav-tab admin active" : "nav-tab admin"}>Gestión Árbitros</NavLink>
                    <NavLink to="/admin/inscripciones" className={({ isActive }) => isActive ? "nav-tab admin active" : "nav-tab admin"}>Gestión Inscripciones</NavLink>
                </>
            )}

            {/* --- ENLACE JUGADOR (CAPITÁN) --- */}
            {user?.rol === 'jugador' && (
                <NavLink to="/perfil/mi-equipo" className={({ isActive }) => isActive ? "nav-tab admin active" : "nav-tab admin"}>Mi Equipo</NavLink>
            )}

            {/* --- ENLACE ÁRBITRO --- */}
            {user?.rol === 'árbitro' && (
                <NavLink to="/arbitro/dashboard" className={({ isActive }) => isActive ? "nav-tab admin active" : "nav-tab admin"}>Panel Árbitro</NavLink>
            )}
        </>
    );
  };

  return (
    <>
      {/* 1. BARRA SUPERIOR (GRIS OSCURO) - Solo Título y Autenticación */}
      <div className="header-container">
        <div className="title">SportFlow FIF</div>
        
        {/* Controles de Autenticación (Solo Iniciar/Cerrar Sesión) */}
        <div className="auth-controls">
          {isLoggedIn ? (
            <button className="btn-secondary" onClick={logout}>
              Cerrar Sesión
            </button>
          ) : (
            <button className="btn-primary" onClick={() => navigate('/login')}>
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>

      {/* 2. BARRA DE NAVEGACIÓN (AZUL) - Contiene TODOS los enlaces */}
      <div className="nav-bar-container">
        {renderNavLinks()}
      </div>
    </>
  );
};

export default HeaderNav;
