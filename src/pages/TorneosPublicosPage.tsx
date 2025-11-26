// src/pages/TorneosPublicosPage.tsx

import React, { useState, useEffect } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import FiltroDeporte from '../components/FiltroDeporte'; 
import type { Torneo } from '../types'; 
import './TorneosPublicosPage.css';
import { getTorneos, getDeportesUnicos } from '../services/torneosService'; 

const TorneosPublicosPage: React.FC = () => {
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deporteSeleccionado, setDeporteSeleccionado] = useState('TODOS');
  const [opcionesFiltro, setOpcionesFiltro] = useState<string[]>(['TODOS']);

  useEffect(() => {
    const fetchTorneos = async () => {
      setIsLoading(true);
      try {
        const [data, deportes] = await Promise.all([
            getTorneos(),
            getDeportesUnicos()
        ]);
        setTorneos(data);
        setOpcionesFiltro(deportes);
      } catch (error) {
        console.error("Error cargando torneos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTorneos();
  }, []);
  
  const torneosFiltrados = torneos.filter(torneo => {
    if (deporteSeleccionado === 'TODOS') return true;
    
    const deporteTorneo = (torneo.deporte || 'GENERAL').toUpperCase().trim();
    const seleccion = deporteSeleccionado.toUpperCase().trim();
    
    return deporteTorneo === seleccion; 
  });

  return (
    <div>
      <HeaderNav />
      <div className="content-container">
        
        <FiltroDeporte 
            onFiltroChange={setDeporteSeleccionado}
            valorActual={deporteSeleccionado}
            opciones={opcionesFiltro}
        />

        <h2>Torneos Activos</h2>
        
        {isLoading ? (
          <p>Cargando torneos...</p>
        ) : (
          <div className="torneos-list">
            {torneosFiltrados.length > 0 ? (
              torneosFiltrados.map(torneo => (
                  <div key={torneo.id} className="card-torneo-publico">
                      <h3>{torneo.nombre} ({torneo.deporte})</h3>
                      <p>{torneo.descripcion}</p>
                      <p><strong>Lugar:</strong> {torneo.lugar}</p>
                      <p>Inscripción hasta: {new Date(torneo.fechaLimiteInscripcion).toLocaleDateString()}</p>
                      <small>Del {new Date(torneo.fechaInicio).toLocaleDateString()} al {new Date(torneo.fechaFin).toLocaleDateString()}</small>
                  </div>
              ))
            ) : (
              <p>No hay torneos disponibles para este deporte.</p>
            )}
          </div>
        )}
        
      </div>
      <Footer />
    </div>
  );
};

export default TorneosPublicosPage;