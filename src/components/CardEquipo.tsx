// src/components/CardEquipo.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { CardEquipoProps } from '../types'; 
import './CardEquipo.css'; // Implementaremos este CSS en el siguiente paso

const CardEquipo: React.FC<CardEquipoProps> = ({ equipo }) => {
  const navigate = useNavigate();

  // Función para manejar el clic y redirigir al perfil
  const handleCardClick = () => {
    // Redirige a la URL dinámica: /public/equipos/1/perfil
    navigate(`/public/equipos/${equipo.id}/perfil`); 
  };

  return (
    <div className="card-equipo" onClick={handleCardClick} role="button" tabIndex={0}>
      <div className="equipo-actions">...</div> {/* Icono de tres puntos, si aplica */}
      <img src={equipo.logoUrl} alt={`Escudo de ${equipo.nombre}`} className="equipo-logo" />
      <div className="equipo-nombre-box">
        {equipo.nombre}
      </div>
    </div>
  );
};

export default CardEquipo;