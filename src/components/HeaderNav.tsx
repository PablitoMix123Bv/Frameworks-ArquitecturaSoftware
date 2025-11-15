// src/components/HeaderNav.tsx (VERSIÓN DESDE CERO)

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HeaderNav.css'; // Importamos el CSS que también vamos a rehacer

const HeaderNav: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth(); 

  const renderNavLinks = () => {
    return (
        // Usamos la nueva clase .sportflow-nav-links
        <div className="sportflow-nav-links">
            {/* --- ENLACES PÚBLICOS --- */}
            <NavLink to="/public/torneos" className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}>Torneos</NavLink>
            <NavLink to="/public/resultados" className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}>Resultados</NavLink>
            <NavLink to="/public/equipos" className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}>Equipos</NavLink>
            <NavLink to="/public/partidos" className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}>Partidos</NavLink>
            <NavLink to="/public/inscripciones" className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}>Inscripciones</NavLink>
            <NavLink to="/public/avisos" className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}>Avisos</NavLink>

            {user && <span className="nav-separator"></span>}

            {/* --- ENLACES DE GESTIÓN (ADMIN) --- */}
            {user?.rol === 'administrador' && (
                <>
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
        </div>
    );
  };

  return (
    <>
      {/* 1. BARRA SUPERIOR (NUEVA CLASE) */}
      <div className="sportflow-top-bar">
        <div className="sportflow-top-bar__content">
            <div className="title">SportFlow FIF</div>
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
      </div>

      {/* 2. BARRA DE NAVEGACIÓN (NUEVA CLASE) */}
      <div className="sportflow-nav-bar">
        {renderNavLinks()}
      </div>
    </>
  );
};

export default HeaderNav;