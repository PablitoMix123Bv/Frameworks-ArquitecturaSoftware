// src/components/HeaderNav.tsx

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HeaderNav.css';

const HeaderNav: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth(); 

  // Función auxiliar para asignar clase activa
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => 
    isActive ? "nav-tab active" : "nav-tab";

  const getAdminLinkClass = ({ isActive }: { isActive: boolean }) => 
    isActive ? "nav-tab admin active" : "nav-tab admin";

  const renderNavLinks = () => {
    return (
        <div className="sportflow-nav-links">
            {/* --- ENLACES PÚBLICOS (Rutas limpias) --- */}
            <NavLink to="/torneos" className={getNavLinkClass}>Torneos</NavLink>
            <NavLink to="/resultados" className={getNavLinkClass}>Resultados</NavLink>
            <NavLink to="/equipos" className={getNavLinkClass}>Equipos</NavLink>
            <NavLink to="/partidos" className={getNavLinkClass}>Partidos</NavLink>
            <NavLink to="/inscripciones" className={getNavLinkClass}>Inscripciones</NavLink>
            <NavLink to="/avisos" className={getNavLinkClass}>Avisos</NavLink>

            {user && <span className="nav-separator"></span>}

            {/* --- ENLACES DE GESTIÓN (ADMIN) --- */}
            {user?.rol === 'administrador' && (
                <>
                    <NavLink to="/admin/torneos" className={getAdminLinkClass}>Gestión Torneos</NavLink>
                    <NavLink to="/admin/avisos" className={getAdminLinkClass}>Gestión Avisos</NavLink>
                    <NavLink to="/admin/arbitros" className={getAdminLinkClass}>Gestión Árbitros</NavLink>
                    <NavLink to="/admin/inscripciones" className={getAdminLinkClass}>Gestión Inscripciones</NavLink>
                </>
            )}

            {/* --- ENLACE JUGADOR (CAPITÁN) --- */}
            {user?.rol === 'capitan' && (
                <NavLink to="/perfil/mi-equipo" className={getAdminLinkClass}>Mi Equipo</NavLink>
            )}

            {/* --- ENLACE ÁRBITRO --- */}
            {user?.rol === 'árbitro' && (
                <NavLink to="/arbitro/dashboard" className={getAdminLinkClass}>Panel Árbitro</NavLink>
            )}
        </div>
    );
  };

  return (
    <>
      <div className="sportflow-top-bar">
        <div className="sportflow-top-bar__content">
            <div className="title" style={{cursor: 'pointer'}} onClick={() => navigate('/')}>
                SportFlow FIF
            </div>
            <div className="auth-controls">
            {isLoggedIn ? (
                <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                    <span style={{fontSize: '0.9rem'}}>{user?.nombre}</span>
                    <button className="btn-secondary" onClick={() => { logout(); navigate('/login'); }}>
                        Cerrar Sesión
                    </button>
                </div>
            ) : (
                <button className="btn-primary" onClick={() => navigate('/login')}>
                Iniciar Sesión
                </button>
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