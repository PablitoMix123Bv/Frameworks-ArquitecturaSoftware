// src/components/HeaderNav.tsx

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HeaderNav.css';

const HeaderNav: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth(); 

  const isAdmin = user?.roles.includes('admin');
  const isArbitro = user?.roles.includes('arbitro');
  const isUserOrCapitan = user?.roles.includes('user') || user?.roles.includes('capitan');

  const primerNombre = user?.nombre ? user.nombre.split(' ')[0] : 'Usuario';

  const renderNavLinks = () => {
    return (
        <div className="sportflow-nav-links">
            {/* CAMBIO: Rutas actualizadas a /vista/... */}
            <NavLink to="/vista/torneos" className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}>Torneos</NavLink>
            <NavLink to="/vista/resultados" className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}>Resultados</NavLink>
            <NavLink to="/vista/equipos" className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}>Equipos</NavLink>
            <NavLink to="/vista/partidos" className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}>Partidos</NavLink>
            <NavLink to="/vista/inscripciones" className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}>Inscripciones</NavLink>
            <NavLink to="/vista/avisos" className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}>Avisos</NavLink>

            {isLoggedIn && <span className="nav-separator"></span>}

            {isAdmin && (
                <>
                    <NavLink to="/admin/torneos" className={({ isActive }) => isActive ? "nav-tab admin active" : "nav-tab admin"}>Gestión Torneos</NavLink>
                    <NavLink to="/admin/avisos" className={({ isActive }) => isActive ? "nav-tab admin active" : "nav-tab admin"}>Gestión Avisos</NavLink>
                    <NavLink to="/admin/arbitros" className={({ isActive }) => isActive ? "nav-tab admin active" : "nav-tab admin"}>Gestión Árbitros</NavLink>
                    <NavLink to="/admin/inscripciones" className={({ isActive }) => isActive ? "nav-tab admin active" : "nav-tab admin"}>Gestión Inscripciones</NavLink>
                </>
            )}

            {isUserOrCapitan && (
                <NavLink to="/perfil/mi-equipo" className={({ isActive }) => isActive ? "nav-tab admin active" : "nav-tab admin"}>Mi Equipo</NavLink>
            )}

            {isArbitro && (
                <NavLink to="/arbitro/dashboard" className={({ isActive }) => isActive ? "nav-tab admin active" : "nav-tab admin"}>Panel Árbitro</NavLink>
            )}
        </div>
    );
  };

  return (
    <>
      <div className="sportflow-top-bar">
        <div className="sportflow-top-bar__content">
            <div className="title">SportFlow FIF</div>
            <div className="auth-controls">
            {isLoggedIn ? (
                <div className="user-session-info">
                    <span className="welcome-text">Hola, {primerNombre}</span>
                    <button className="btn-header-login" onClick={() => { logout(); navigate('/login'); }}>
                    Cerrar Sesión
                    </button>
                </div>
            ) : (
                <>
                  <button className="btn-header-login" onClick={() => navigate('/login')}>
                    Iniciar Sesión
                  </button>
                  <button className="btn-header-register" onClick={() => navigate('/register')}>
                    Registrarse
                  </button>
                </>
            )}
            </div>
        </div>
      </div>
      <div className="sportflow-nav-bar">
        {renderNavLinks()}
      </div>
    </>
  );
};

export default HeaderNav;