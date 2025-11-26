// src/components/CardTorneoAdmin.tsx

import React from 'react';
import type { CardTorneoAdminProps } from '../types';
import { useAuth } from '../context/AuthContext';
import './CardTorneoAdmin.css';
import { FaTrash, FaPencilAlt, FaMagic } from 'react-icons/fa';

const formatDate = (dateString: string) => {
    if(!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
};

const CardTorneoAdmin: React.FC<CardTorneoAdminProps> = ({ torneo, onEdit, onDelete, onGenerarJornada }) => {
  const { user } = useAuth();
  const isAdmin = user?.roles.includes('admin');

  return (
    <div className="card-torneo-admin">
      <div className="torneo-info">
        <h3 className="torneo-titulo">{torneo.nombre}</h3>
        
        <div className="torneo-detalles">
            <p className="torneo-desc">{torneo.descripcion || "Sin descripción"}</p>
            
            <div className="torneo-meta">
                <span className="meta-tag">🏆 {torneo.deporte}</span>
                <span className="meta-item">📍 {torneo.lugar}</span>
                <span className="meta-item">📅 {formatDate(torneo.fechaInicio)} - {formatDate(torneo.fechaFin)}</span>
            </div>
        </div>
      </div>

      {isAdmin && (
        <div className="torneo-actions">
            <button className="btn-icon-action magic" onClick={onGenerarJornada} title="Generar Jornada Automática">
              <FaMagic />
            </button>
            <button className="btn-icon-action edit" onClick={onEdit} title="Editar">
              <FaPencilAlt />
            </button>
            <button className="btn-icon-action delete" onClick={onDelete} title="Eliminar">
              <FaTrash />
            </button>
        </div>
      )}
    </div>
  );
};

export default CardTorneoAdmin;