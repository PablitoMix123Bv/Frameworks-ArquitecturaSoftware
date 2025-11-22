// src/pages/PublicHomePage.tsx
import React, { useState, useEffect } from 'react';
import HeaderNav from '../components/HeaderNav'; 
import CardEquipo from '../components/CardEquipo';
import FiltroDeporte from '../components/FiltroDeporte';
import type { Equipo } from '../types';
import Footer from '../components/Footer';
import { getEquiposPublicos } from '../services/equiposService'; // Importamos el servicio

const PublicHomePage: React.FC = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deporteSeleccionado, setDeporteSeleccionado] = useState('TODOS');
  
  // Carga de datos REALES
  useEffect(() => {
    const fetchEquipos = async () => {
        try {
            const data = await getEquiposPublicos();
            setEquipos(data);
        } catch (error) {
            console.error("Error cargando equipos", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchEquipos();
  }, []);

  const handleFiltroChange = (deporte: string) => {
    setDeporteSeleccionado(deporte);
  };

  // Filtrado en cliente (idealmente se haría en backend si son muchos datos)
  const equiposFiltrados = equipos.filter(equipo => {
    if (deporteSeleccionado === 'TODOS') return true;
    // Asegúrate de que el backend envíe el deporte o asígnalo correctamente en el servicio
    return equipo.deporte?.toUpperCase() === deporteSeleccionado; 
  });

  return (
    <div>
      <HeaderNav />
      <div className="content-container">
        <FiltroDeporte 
            onFiltroChange={handleFiltroChange}
            valorActual={deporteSeleccionado}
        />

        <h2>Equipos</h2>
        
        {isLoading ? (
            <p>Cargando equipos desde el servidor...</p>
        ) : (
            <div className="equipos-grid">
                {equiposFiltrados.length > 0 ? (
                    equiposFiltrados.map(equipo => (
                        <CardEquipo key={equipo.id} equipo={equipo} />
                    ))
                ) : (
                    <p>No hay equipos registrados para este deporte.</p>
                )}
            </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PublicHomePage;