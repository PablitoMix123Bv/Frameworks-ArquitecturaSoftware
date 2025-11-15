// src/pages/PartidosPage.tsx (CORREGIDO)
import React, { useState, useEffect } from 'react';
import type { Partido } from '../types'; 
import CardPartido from '../components/CardPartido';
import HeaderNav from '../components/HeaderNav'; 
import Footer from '../components/Footer';
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
    Deporte: 'BALONCESTO', // Deporte diferente para probar el filtro
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
    }, 500);
  }, []); 

  // --- INICIO DE LA CORRECCIÓN ---
  // Lógica para filtrar los partidos basada en el estado 'deporteSeleccionado'
  const partidosFiltrados = partidos.filter(partido => {
    // Si el filtro es 'TODOS', muestra todos los partidos
    if (deporteSeleccionado === 'TODOS') {
      return true;
    }
    // Compara el deporte del partido (en mayúsculas) con el filtro
    // Asumimos que el filtro también viene en mayúsculas (como en FiltroDeporte.tsx)
    return partido.Deporte.toUpperCase() === deporteSeleccionado;
  });
  // --- FIN DE LA CORRECCIÓN ---

  
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
          
          {/* CORRECCIÓN: Usamos 'partidosFiltrados' en lugar de 'partidos' */}
          {partidosFiltrados.length > 0 ? (
            partidosFiltrados.map((partido) => (
              <CardPartido 
                key={partido.id} 
                partido={partido}
              />
            ))
          ) : (
            // Mensaje si no hay partidos para ese filtro
            <p>No hay partidos programados para el deporte seleccionado.</p>
          )}

        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default PartidosPage;