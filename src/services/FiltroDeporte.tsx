// src/components/FiltroDeporte.tsx

import React from 'react';
import type { FiltroDeporteProps } from '../types';
import './FiltroDeporte.css';

// Extendemos la interfaz para aceptar opciones dinámicas
interface FiltroProps extends FiltroDeporteProps {
    opciones?: string[]; // <--- ESTA ES LA CLAVE
}

const FiltroDeporte: React.FC<FiltroProps> = ({ onFiltroChange, valorActual, opciones }) => {
  
  // Si recibimos opciones del servicio, las usamos.
  // Si no (por seguridad), usamos una lista base por defecto.
  const listaCategorias = opciones || ['TODOS', 'FUTBOL', 'BASQUETBOL']; 

  return (
    <div className="filtro-contenedor">
      <span className="filtro-label">Filtrar por deporte:</span>
      
      <div className="filtro-opciones">
        {listaCategorias.map((cat) => (
          <button
            key={cat}
            onClick={() => onFiltroChange(cat)}
            // La comparación sigue siendo robusta
            className={`btn-filtro ${valorActual.toUpperCase() === cat ? 'activo' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FiltroDeporte;