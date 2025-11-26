// src/components/CardEquipo.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { CardEquipoProps } from '../types'; 
import './CardEquipo.css';

const CardEquipo: React.FC<CardEquipoProps> = ({ equipo }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (!equipo.id) return;
    // CAMBIO: Ruta actualizada
    navigate(`/vista/equipos/${equipo.id}/perfil`);
  };

  const logoSrc = equipo.logoUrl
    ? (equipo.logoUrl.startsWith('http')
        ? equipo.logoUrl
        : `http://localhost:3000/uploads/equipos/${equipo.logoUrl}`)
    : '/img/logo_placeholder.png';

  return (
    <div className="card-equipo" onClick={handleCardClick} role="button" tabIndex={0}>
      <div className="equipo-actions">...</div>
      <img src={logoSrc} alt={`Escudo de ${equipo.nombre}`} className="equipo-logo" />
      <div className="equipo-nombre-box">
        {equipo.nombre}
      </div>
    </div>
  );
};

export default CardEquipo;