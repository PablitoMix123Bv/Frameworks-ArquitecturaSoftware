// src/components/FiltroDeporte.tsx
import React from 'react';
import type { FiltroDeporteProps } from '../types';
import './FiltroDeporte.css';

interface FiltroProps extends FiltroDeporteProps {
    opciones?: string[];
}

const FiltroDeporte: React.FC<FiltroProps> = ({ onFiltroChange, valorActual, opciones }) => {
  const lista = opciones || ['TODOS', 'FUTBOL', 'BASQUETBOL']; 

  return (
    <div className="filtro-contenedor">
      <span className="filtro-label">Filtrar:</span>
      <div className="filtro-opciones">
        {lista.map((cat) => (
          <button
            key={cat}
            onClick={() => onFiltroChange(cat)}
            className={`btn-filtro ${valorActual === cat ? 'activo' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
export default FiltroDeporte;