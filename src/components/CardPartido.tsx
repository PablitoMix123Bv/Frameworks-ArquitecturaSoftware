// src/components/CardPartido.tsx (CORREGIDO)

import React from 'react';
import type { CardPartidoProps, EstadoPartido } from '../types'; 
import './CardPartido.css'; // Importa los estilos

// Renderiza el tablero de resultados (FINALIZADO o EN PROCESO)
const RenderTablero: React.FC<{ estado: EstadoPartido, local: number | null, visitante: number | null }> = ({ estado, local, visitante }) => {
  
  if (estado === 'POR INICIAR' || estado === 'CANCELADO') {
      return null; // No hay marcador para estos estados
  }
  
  // El marcador para 'EN PROCESO' es 0 si es nulo. Para 'FINALIZADO' usamos el valor real.
  const scoreLocal = (estado === 'EN PROCESO' && local === null) ? 0 : local;
  const scoreVisitante = (estado === 'EN PROCESO' && visitante === null) ? 0 : visitante;

  const isEnProceso = estado === 'EN PROCESO';
  
  return (
    // Usa estilos estándar de 'tablero'
    <div className={`tablero ${isEnProceso ? 'tablero-en-proceso' : ''}`}>
      <div className="score local">{scoreLocal}</div>
      <div className="separator">-</div>
      <div className="score visitante">{scoreVisitante}</div>
    </div>
  );
};

// Renderiza el indicador de Estado (PRÓXIMAMENTE, CANCELADO, EN PROCESO)
const RenderIndicadorEstado: React.FC<{ estado: EstadoPartido }> = ({ estado }) => {
  
  switch (estado) {
    case 'EN PROCESO':
      // La pastilla de EN PROCESO se muestra DEBAJO del tablero 0-0
      return <div className="estado en-proceso">EN PROCESO</div>;
    case 'POR INICIAR':
      return <div className="estado por-iniciar">PRÓXIMAMENTE</div>;
    case 'CANCELADO':
      return <div className="estado cancelado">CANCELADO</div>;
    
    // --- INICIO DE LA CORRECCIÓN ---
    case 'FINALIZADO':
      // Añadimos la pastilla gris para 'FINALIZADO'
      return <div className="estado finalizado">FINALIZADO</div>; 
    // --- FIN DE LA CORRECCIÓN ---

    default:
      return null;
  }
};


// Componente principal CardPartido
const CardPartido: React.FC<CardPartidoProps> = ({ partido }) => {
  const { equipoLocal, equipoVisitante, estado, marcadorLocal, marcadorVisitante } = partido;

  return (
    <div className="card-partido">
      
      {/* Columna Izquierda: Información de los equipos y VS */}
      <div className="partido-info-principal">
          
          <div className="equipo-datos">
              <img src={equipoLocal.logoUrl} alt={equipoLocal.nombre} className="equipo-logo" />
              <p className="equipo-nombre">{equipoLocal.nombre}</p>
          </div>

          <span className="vs-text">VS</span>

          <div className="equipo-datos">
              <img src={equipoVisitante.logoUrl} alt={equipoVisitante.nombre} className="equipo-logo" />
              <p className="equipo-nombre">{equipoVisitante.nombre}</p>
          </div>
          
      </div>

      {/* Columna Derecha: Tablero y Evento */}
      <div className="partido-info-resultado">
          
          {/* Muestra el tablero si aplica (FINALIZADO o EN PROCESO) */}
          <RenderTablero 
            estado={estado} 
            local={marcadorLocal} 
            visitante={marcadorVisitante} 
          />

          {/* Muestra el indicador de estado si aplica */}
          <RenderIndicadorEstado estado={estado} />
          
      </div>

    </div>
  );
};

export default CardPartido;