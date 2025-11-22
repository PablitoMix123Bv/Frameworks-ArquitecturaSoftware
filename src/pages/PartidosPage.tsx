// src/pages/PartidosPage.tsx
import React, { useState, useEffect } from 'react';
import type { Partido } from '../types'; 
import CardPartido from '../components/CardPartido';
import HeaderNav from '../components/HeaderNav'; 
import Footer from '../components/Footer';
import FiltroDeporte from '../components/FiltroDeporte';
import { getPartidos } from '../services/partidosService.ts'; // Importar servicio

const PartidosPage: React.FC = () => {
  
  const [partidos, setPartidos] = useState<Partido[]>([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [deporteSeleccionado, setDeporteSeleccionado] = useState('TODOS');

  useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await getPartidos();
            setPartidos(data);
        } catch (error) {
            console.error("Error al cargar partidos", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, []); 

  const partidosFiltrados = partidos.filter(partido => {
    if (deporteSeleccionado === 'TODOS') return true;
    return partido.Deporte.toUpperCase() === deporteSeleccionado;
  });
  
  return (
    <div>
      <HeaderNav /> 
      <div className="content-container">
        
        <FiltroDeporte 
            onFiltroChange={setDeporteSeleccionado}
            valorActual={deporteSeleccionado}
        />
        
        <h2>Listado de Partidos</h2>
        
        {isLoading ? <p>Cargando partidos...</p> : (
            <div className="partidos-list">
            {partidosFiltrados.length > 0 ? (
                partidosFiltrados.map((partido) => (
                <CardPartido 
                    key={partido.id} 
                    partido={partido}
                />
                ))
            ) : (
                <p>No hay partidos programados para el deporte seleccionado.</p>
            )}
            </div>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default PartidosPage;