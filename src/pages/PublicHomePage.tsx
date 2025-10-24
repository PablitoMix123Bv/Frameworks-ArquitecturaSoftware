// src/pages/PublicHomePage.tsx (Vista de la lista de equipos)

import React from 'react';
import HeaderNav from '../components/HeaderNav'; 
import CardEquipo from '../components/CardEquipo';
import type { Equipo } from '../types';

// Datos mock para simular la lista de equipos
const mockEquipos: Equipo[] = [
    { id: 1, nombre: 'Hunters', logoUrl: '/img/logo1.png', facultad: 'Ingeniería', victorias: 5, derrotas: 1, empates: 2, puntos: 17, jugadores: [] },
    { id: 2, nombre: 'Castrosos', logoUrl: '/img/logo2.png', facultad: 'Derecho', victorias: 4, derrotas: 2, empates: 1, puntos: 13, jugadores: [] },
    { id: 3, nombre: 'Pythons', logoUrl: '/img/logo3.png', facultad: 'Informática', victorias: 6, derrotas: 0, empates: 0, puntos: 18, jugadores: [] },
    // ... agrega más equipos mock para llenar la cuadrícula
];

const PublicHomePage: React.FC = () => {
  return (
    <div>
      <HeaderNav />
      <div className="content-container">
        <div className="filter-bar">Filtrar por deporte ▶</div>
        
        <h2>Equipos</h2>
        
        {/* Implementación de la cuadrícula de equipos */}
        <div className="equipos-grid">
            {mockEquipos.map(equipo => (
                <CardEquipo key={equipo.id} equipo={equipo} />
            ))}
        </div>
        
      </div>
    </div>
  );
};

export default PublicHomePage;