// src/components/FiltroDeporte.tsx

import React from 'react';
import type { FiltroDeporteProps } from '../types';
import './FiltroDeporte.css'; // Implementaremos los estilos a continuación

// Datos mock para simular la lista de deportes que vendría de la API
const mockDeportes = ['TODOS', 'FÚTBOL', 'BALONCESTO', 'VOLEIBOL', 'BÉISBOL'];

const FiltroDeporte: React.FC<FiltroDeporteProps> = ({ onFiltroChange, valorActual }) => {

  return (
    <div className="filtro-contenedor">
      <span className="filtro-label">Filtrar por deporte ▶</span>
      
      <div className="filtro-opciones">
        {mockDeportes.map((deporte) => (
          <button
            key={deporte}
            onClick={() => onFiltroChange(deporte)}
            // Clase condicional para resaltar el botón activo
            className={`btn-filtro ${valorActual === deporte ? 'activo' : ''}`}
          >
            {deporte}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FiltroDeporte;