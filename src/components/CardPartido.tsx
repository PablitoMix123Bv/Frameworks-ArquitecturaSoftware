import React, { useState } from 'react';
import type { CardPartidoProps, EstadoPartido } from '../types'; 
import './CardPartido.css'; 

// --- UTILIDADES (Generar color e iniciales) ---
const getInitials = (name: string) => {
    if (!name) return "SF";
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
};

const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
};

// --- COMPONENTE DE AVATAR ROBUSTO ---
const EquipoAvatar: React.FC<{ nombre: string; url: string }> = ({ nombre, url }) => {
    const [imgFailed, setImgFailed] = useState(false);

    // LÓGICA CLAVE:
    // Si no hay URL O si la imagen ya falló al intentar cargar...
    if (!url || imgFailed) {
        // ...Renderizamos un DIV (Círculo de color). Esto NO PUEDE fallar.
        return (
            <div 
                className="equipo-logo-fallback" 
                style={{ backgroundColor: stringToColor(nombre) }}
                title={nombre}
            >
                <span className="initials">{getInitials(nombre)}</span>
            </div>
        );
    }

    // Si creemos que hay imagen, intentamos mostrarla.
    return (
        <img 
            src={url} 
            alt={nombre} 
            className="equipo-logo" 
            onError={() => setImgFailed(true)} // Si falla, activamos el estado de error
        />
    );
};

// --- SUBCOMPONENTES DE TABLERO Y ESTADO (Sin cambios) ---
const RenderTablero: React.FC<{ estado: EstadoPartido, local: number | null, visitante: number | null }> = ({ estado, local, visitante }) => {
  if (estado === 'POR INICIAR' || estado === 'CANCELADO') return null;
  const scoreLocal = (estado === 'EN PROCESO' && local === null) ? 0 : local;
  const scoreVisitante = (estado === 'EN PROCESO' && visitante === null) ? 0 : visitante;
  
  return (
    <div className={`tablero ${estado === 'EN PROCESO' ? 'tablero-en-proceso' : ''}`}>
      <div className="score local">{scoreLocal}</div>
      <div className="separator">-</div>
      <div className="score visitante">{scoreVisitante}</div>
    </div>
  );
};

const RenderIndicadorEstado: React.FC<{ estado: EstadoPartido }> = ({ estado }) => {
  switch (estado) {
    case 'EN PROCESO': return <div className="estado en-proceso">EN PROCESO</div>;
    case 'POR INICIAR': return <div className="estado por-iniciar">PRÓXIMAMENTE</div>;
    case 'CANCELADO': return <div className="estado cancelado">CANCELADO</div>;
    case 'FINALIZADO': return <div className="estado finalizado">FINALIZADO</div>;
    default: return null;
  }
};

// --- COMPONENTE PRINCIPAL ---
const CardPartido: React.FC<CardPartidoProps> = ({ partido }) => {
  if (!partido || !partido.equipoLocal || !partido.equipoVisitante) return null;

  const { equipoLocal, equipoVisitante, estado, marcadorLocal, marcadorVisitante } = partido;

  return (
    <div className="card-partido">
      <div className="partido-info-principal">
          {/* Equipo LOCAL */}
          <div className="equipo-datos">
              <EquipoAvatar nombre={equipoLocal.nombre} url={equipoLocal.logoUrl} />
              <p className="equipo-nombre">{equipoLocal.nombre}</p>
          </div>

          <span className="vs-text">VS</span>

          {/* Equipo VISITANTE */}
          <div className="equipo-datos">
              <EquipoAvatar nombre={equipoVisitante.nombre} url={equipoVisitante.logoUrl} />
              <p className="equipo-nombre">{equipoVisitante.nombre}</p>
          </div>
      </div>

      <div className="partido-info-resultado">
          <RenderTablero estado={estado} local={marcadorLocal} visitante={marcadorVisitante} />
          <RenderIndicadorEstado estado={estado} />
      </div>
    </div>
  );
};

export default CardPartido;