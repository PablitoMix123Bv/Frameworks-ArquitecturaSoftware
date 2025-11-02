// src/pages/PublicHomePage.tsx

import React, { useState } from 'react'; // Necesitamos useState
import HeaderNav from '../components/HeaderNav'; 
import CardEquipo from '../components/CardEquipo';
import FiltroDeporte from '../components/FiltroDeporte'; // Importar el filtro
import type { Equipo } from '../types';
// ... (Importar estilos si los tienes) ...

// Datos mock para simular la lista de equipos (añadir el deporte para filtrar)
const mockEquipos: Equipo[] = [
    { id: 1, nombre: 'Hunters', logoUrl: '/img/logo1.png', facultad: 'Ingeniería', victorias: 5, derrotas: 1, empates: 2, puntos: 17, jugadores: [], deporte: 'FÚTBOL' },
    { id: 2, nombre: 'Castrosos', logoUrl: '/img/logo2.png', facultad: 'Derecho', victorias: 4, derrotas: 2, empates: 1, puntos: 13, jugadores: [], deporte: 'BALONCESTO' },
    { id: 3, nombre: 'Pythons', logoUrl: '/img/logo3.png', facultad: 'Informática', victorias: 6, derrotas: 0, empates: 0, puntos: 18, jugadores: [], deporte: 'FÚTBOL' },
    { id: 4, nombre: 'Aces', logoUrl: '/img/logo4.png', facultad: 'Medicina', victorias: 2, derrotas: 4, empates: 0, puntos: 6, jugadores: [], deporte: 'BALONCESTO' },
];

const PublicHomePage: React.FC = () => {
  // 1. Estado para guardar el deporte seleccionado (inicialmente 'TODOS')
  const [deporteSeleccionado, setDeporteSeleccionado] = useState('TODOS');
  
  // 2. Función para manejar la selección del filtro
  const handleFiltroChange = (deporte: string) => {
    setDeporteSeleccionado(deporte);
  };

  // 3. Lógica para filtrar la lista de equipos
  const equiposFiltrados = mockEquipos.filter(equipo => {
    if (deporteSeleccionado === 'TODOS') {
      return true; // Muestra todos
    }
    // Compara el deporte seleccionado con el deporte del equipo
    return equipo.deporte === deporteSeleccionado; 
  });

  return (
    <div>
      <HeaderNav />
      <div className="content-container">
        
        {/* Renderizado del Componente de Filtro */}
        <FiltroDeporte 
            onFiltroChange={handleFiltroChange}
            valorActual={deporteSeleccionado}
        />

        <h2>Equipos</h2>
        
        {/* Implementación de la cuadrícula de equipos */}
        <div className="equipos-grid">
            {equiposFiltrados.map(equipo => (
                <CardEquipo key={equipo.id} equipo={equipo} />
            ))}
        </div>
        
      </div>
    </div>
  );
};

export default PublicHomePage;