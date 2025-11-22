// src/pages/TorneosPublicosPage.tsx

import React, { useState, useEffect } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import FiltroDeporte from '../components/FiltroDeporte'; 
import type { Torneo } from '../types'; 
import './TorneosPublicosPage.css';
import { getTorneos } from '../services/torneosService'; // Importamos servicio

const TorneosPublicosPage: React.FC = () => {
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deporteSeleccionado, setDeporteSeleccionado] = useState('TODOS');

  // Cargar torneos reales
  useEffect(() => {
    const fetchTorneos = async () => {
      try {
        const data = await getTorneos();
        setTorneos(data);
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
    return torneo.deporte?.toUpperCase() === deporteSeleccionado; 
  });

  return (
    <div>
      <HeaderNav />
      <div className="content-container">
        
        <FiltroDeporte 
            onFiltroChange={setDeporteSeleccionado}
            valorActual={deporteSeleccionado}
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
                      <p>Inscripción hasta: {torneo.fechaLimiteInscripcion}</p>
                      <small>Del {torneo.fechaInicio} al {torneo.fechaFin}</small>
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