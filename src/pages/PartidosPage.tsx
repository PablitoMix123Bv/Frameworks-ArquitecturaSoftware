// src/pages/PartidosPage.tsx
import React, { useState, useEffect } from 'react';
import type { Partido } from '../types'; 
import CardPartido from '../components/CardPartido';
import HeaderNav from '../components/HeaderNav'; 
import Footer from '../components/Footer'; // Eliminado si no existe
import FiltroDeporte from '../components/FiltroDeporte';
// --- Datos Mock (Simulación) ---
const mockPartidos: Partido[] = [
  {
    id: 1,
    equipoLocal: { nombre: 'Hunters', logoUrl: '/img/logo1.png' }, 
    equipoVisitante: { nombre: 'Aston Birria', logoUrl: '/img/logo2.png' },
    estado: 'EN PROCESO',
    marcadorLocal: 0,
    marcadorVisitante: 0,
    Deporte: 'FUTBOL',
  },
  {
    id: 2,
    equipoLocal: { nombre: 'Castrosos', logoUrl: '/img/logo3.png' },
    equipoVisitante: { nombre: 'Pythons', logoUrl: '/img/logo4.png' },
    estado: 'FINALIZADO',
    marcadorLocal: 3,
    marcadorVisitante: 2,
    Deporte: 'FUTBOL',
  },
  {
    id: 3,
    equipoLocal: { nombre: 'Águilas', logoUrl: '/img/logo5.png' },
    equipoVisitante: { nombre: 'Leones', logoUrl: '/img/logo6.png' },
    estado: 'POR INICIAR',
    marcadorLocal: null,
    marcadorVisitante: null,
    Deporte: 'FUTBOL',
  },
];

const PartidosPage: React.FC = () => {
  
  const [partidos, setPartidos] = useState<Partido[]>([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [deporteSeleccionado, setDeporteSeleccionado] = useState('TODOS');

  useEffect(() => {
    // Simulación de la carga de la API
    setTimeout(() => {
      setPartidos(mockPartidos); 
      setIsLoading(false);
    }, 500); // Reducido el tiempo de carga
  }, []); 

  
  return (
    <div>
      <HeaderNav /> 
      <div className="content-container">
        
        <FiltroDeporte 
            onFiltroChange={setDeporteSeleccionado}
            valorActual={deporteSeleccionado}
        />
        
        <h2>Listado de Partidos</h2>
        
        {isLoading && <p>Cargando partidos...</p>}
        
        <div className="partidos-list">
          {partidos.map((partido) => (
            <CardPartido 
              key={partido.id} 
              partido={partido}
            />
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default PartidosPage;