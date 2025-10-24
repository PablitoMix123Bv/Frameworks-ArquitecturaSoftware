// src/components/CardTorneoAdmin.tsx

import React from 'react';
import type { CardTorneoAdminProps } from '../types'; // Importamos el tipo
import { useAuth } from '../context/AuthContext';//Importa el hook de autenticación
// Asignamos el tipo a las props (React.FC = Function Component)
const CardTorneoAdmin: React.FC<CardTorneoAdminProps> = ({ torneo, onEdit, onDelete }) => {
  const { user } = useAuth();

  return (
    <div className="card-torneo">
      {/* ... (Tu contenido HTML/JSX de la tarjeta aquí) ... */}
      <img src="..." alt={torneo.nombre} className="torneo-image" />
      
      <div className="torneo-content">
        <h3>{torneo.nombre}</h3>
        <p>Detalles: {torneo.detalles}</p>
        <p>Lugar: {torneo.lugar}</p>
        <p>Cantidad mínima de jugadores: {torneo.minJugadores}</p>
        <p>Fecha de inicio: {torneo.fechaInicio}</p>
        <p>Fecha de fin: {torneo.fechaFin}</p>
      </div>

      {/* 3. Renderizado Condicional de los botones de acción */}
      {user?.rol === 'administrador' && (
        <div className="torneo-admin-actions">
          {/* Botón de Eliminar */}
          <button className="btn-icon delete" onClick={onDelete}>
            🗑️
          </button>
          
          {/* Botón de Editar */}
          <button className="btn-icon edit" onClick={onEdit}>
            ✏️
          </button>
        </div>
      )}
    </div>
  );
};

export default CardTorneoAdmin;