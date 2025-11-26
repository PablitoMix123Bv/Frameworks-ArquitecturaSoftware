// src/components/CardPartido.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importar hook de navegación
import type { CardPartidoProps, EstadoPartido } from '../types'; 
import './CardPartido.css'; 

// Componente auxiliar para el tablero (sin cambios en lógica)
const RenderTablero: React.FC<{ estado: EstadoPartido, local: number | null, visitante: number | null }> = ({ estado, local, visitante }) => {
  if (estado === 'POR INICIAR' || estado === 'CANCELADO') {
      return null; 
  }
  
  const scoreLocal = (estado === 'EN PROCESO' && local === null) ? 0 : local;
  const scoreVisitante = (estado === 'EN PROCESO' && visitante === null) ? 0 : visitante;
  const isEnProceso = estado === 'EN PROCESO';
  
  return (
    <div className={`tablero ${isEnProceso ? 'tablero-en-proceso' : ''}`}>
      <div className="score local">{scoreLocal}</div>
      <div className="separator">-</div>
      <div className="score visitante">{scoreVisitante}</div>
    </div>
  );
};

// Componente auxiliar para estado (sin cambios en lógica)
const RenderIndicadorEstado: React.FC<{ estado: EstadoPartido }> = ({ estado }) => {
  switch (estado) {
    case 'EN PROCESO':
      return <div className="estado en-proceso">EN PROCESO</div>;
    case 'POR INICIAR':
      return <div className="estado por-iniciar">PRÓXIMAMENTE</div>;
    case 'CANCELADO':
      return <div className="estado cancelado">CANCELADO</div>;
    case 'FINALIZADO':
      return <div className="estado finalizado">FINALIZADO</div>; 
    default:
      return null;
  }
};

const CardPartido: React.FC<CardPartidoProps> = ({ partido }) => {
  const navigate = useNavigate();
  
  // Función para navegar al reporte
  const handleClick = () => {
      // Usamos la ruta '/vista/partido/' + ID
      navigate(`/vista/partido/${partido.id}`);
  };

  // Helper para imágenes (por si acaso no vienen normalizadas del padre)
  const getLogo = (url: string) => {
      if (!url) return '/img/logo_placeholder.png';
      return url.startsWith('http') ? url : `http://localhost:3000/uploads/equipos/${url}`;
  };

  return (
    <div 
        className="card-partido clickable" 
        onClick={handleClick}
        title="Ver detalles del partido"
    >
      
      {/* Columna Izquierda: Equipos */}
      <div className="partido-info-principal">
          <div className="equipo-datos">
              <img src={getLogo(partido.equipoLocal.logoUrl)} alt={partido.equipoLocal.nombre} className="equipo-logo" />
              <p className="equipo-nombre">{partido.equipoLocal.nombre}</p>
          </div>

          <span className="vs-text">VS</span>

          <div className="equipo-datos">
              <img src={getLogo(partido.equipoVisitante.logoUrl)} alt={partido.equipoVisitante.nombre} className="equipo-logo" />
              <p className="equipo-nombre">{partido.equipoVisitante.nombre}</p>
          </div>
      </div>

      {/* Columna Derecha: Resultado */}
      <div className="partido-info-resultado">
          <RenderTablero 
            estado={partido.estado} 
            local={partido.marcadorLocal} 
            visitante={partido.marcadorVisitante} 
          />
          <RenderIndicadorEstado estado={partido.estado} />
      </div>

    </div>
  );
};

export default CardPartido;