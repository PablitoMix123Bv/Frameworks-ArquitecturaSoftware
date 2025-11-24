// src/components/CardEquipo.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { CardEquipoProps } from '../types'; 
import './CardEquipo.css'; 

const CardEquipo: React.FC<CardEquipoProps> = ({ equipo }) => {
  const navigate = useNavigate();

  // Función para manejar el clic y redirigir al perfil
  const handleCardClick = () => {
    // CORRECCIÓN: Ajustamos la ruta para coincidir con App.tsx (/equipos/:id/perfil)
    navigate(`/equipos/${equipo.id}/perfil`); 
  };

  return (
    <div className="card-equipo" onClick={handleCardClick} role="button" tabIndex={0}>
      <div className="equipo-actions">...</div> 
      <img src={equipo.logoUrl} alt={`Escudo de ${equipo.nombre}`} className="equipo-logo" />
      <div className="equipo-nombre-box">
        {equipo.nombre}
      </div>
    </div>
  );
};

export default CardEquipo;