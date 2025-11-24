import React from 'react';
import type { CardTorneoAdminProps } from '../types';
import { useAuth } from '../context/AuthContext';
import './CardTorneoAdmin.css';
import { FaTrash, FaPencilAlt, FaCalendarPlus } from 'react-icons/fa'; // Importamos icono de calendario
import { generarCalendarioTorneo } from '../services/torneosService';

const CardTorneoAdmin: React.FC<CardTorneoAdminProps> = ({ torneo, onEdit, onDelete }) => {
  const { user } = useAuth();

  const handleGenerar = async () => {
      if(window.confirm(`¿Generar calendario automático para ${torneo.nombre}?`)) {
          try {
              const res = await generarCalendarioTorneo(torneo.id);
              alert(res.mensaje);
          } catch (error: any) {
              alert('Error: ' + (error.response?.data?.message || 'No se pudo generar'));
          }
      }
  };

  return (
    <div className="card-torneo">
      <div className="torneo-content">
        <h3>{torneo.nombre}</h3>
        <p><strong>Deporte:</strong> {torneo.deporte}</p>
        <p>Inscripciones hasta: {torneo.fechaLimiteInscripcion}</p>
        <p>Equipos: {torneo.minJugadores} - {torneo.maxJugadores} jugadores</p>
      </div>

      {user?.rol === 'administrador' && (
        <div className="torneo-admin-actions">
            {/* Botón Generar Calendario */}
            <button className="btn-icon" onClick={handleGenerar} title="Generar Fixture/Calendario">
              <FaCalendarPlus style={{color: '#4CAF50'}} />
            </button>

            <button className="btn-icon edit" onClick={onEdit} title="Editar">
              <FaPencilAlt />
            </button>
            <button className="btn-icon delete" onClick={onDelete} title="Eliminar">
              <FaTrash />
            </button>
        </div>
      )}
    </div>
  );
};

export default CardTorneoAdmin;