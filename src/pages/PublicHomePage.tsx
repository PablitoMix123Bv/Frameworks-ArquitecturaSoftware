// src/pages/PublicHomePage.tsx

import React, { useState, useEffect } from 'react';
import HeaderNav from '../components/HeaderNav'; 
import CardEquipo from '../components/CardEquipo';
import FiltroDeporte from '../components/FiltroDeporte';
import type { Equipo } from '../types';
import Footer from '../components/Footer';
import { getEquiposPublicos } from '../services/equiposService'; 
import { getDeportesUnicos } from '../services/torneosService'; // Importar servicio

const PublicHomePage: React.FC = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deporteSeleccionado, setDeporteSeleccionado] = useState('TODOS');
  const [opcionesFiltro, setOpcionesFiltro] = useState<string[]>(['TODOS']); // Estado para el filtro

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Cargamos equipos y deportes en paralelo
            const [equiposData, deportesData] = await Promise.all([
                getEquiposPublicos(),
                getDeportesUnicos()
            ]);
            setEquipos(equiposData);
            setOpcionesFiltro(deportesData);
        } catch (error) {
            console.error("Error cargando datos", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, []);

  const handleFiltroChange = (deporte: string) => {
    setDeporteSeleccionado(deporte);
  };

  // FILTRO ROBUSTO
  const equiposFiltrados = equipos.filter(equipo => {
    if (deporteSeleccionado === 'TODOS') return true;
    
    const deporteEquipo = (equipo.deporte || 'GENERAL').toUpperCase().trim();
    const seleccion = deporteSeleccionado.toUpperCase().trim();
    
    return deporteEquipo === seleccion; 
  });

  return (
    <div>
      <HeaderNav />
      <div className="content-container">
        
        {/* Pasamos las opciones dinámicas */}
        <FiltroDeporte 
            onFiltroChange={handleFiltroChange}
            valorActual={deporteSeleccionado}
            opciones={opcionesFiltro} 
        />

        <h2>Equipos</h2>
        
        {isLoading ? (
            <p>Cargando equipos...</p>
        ) : (
            <div className="equipos-grid">
                {equiposFiltrados.length > 0 ? (
                    equiposFiltrados.map(equipo => (
                        <CardEquipo key={equipo.id} equipo={equipo} />
                    ))
                ) : (
                    <div style={{padding: '40px', textAlign: 'center', color: '#666'}}>
                        <p>No hay equipos registrados para {deporteSeleccionado}.</p>
                    </div>
                )}
            </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PublicHomePage;