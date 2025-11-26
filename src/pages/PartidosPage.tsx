// src/pages/PartidosPage.tsx

import React, { useState, useEffect } from 'react';
import type { Partido } from '../types'; 
import CardPartido from '../components/CardPartido';
import HeaderNav from '../components/HeaderNav'; 
import Footer from '../components/Footer';
import FiltroDeporte from '../components/FiltroDeporte';
import { getPartidos } from '../services/partidosService';
import { getDeportesUnicos } from '../services/torneosService';

const PartidosPage: React.FC = () => {
  
  const [partidos, setPartidos] = useState<Partido[]>([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [deporteSeleccionado, setDeporteSeleccionado] = useState('TODOS');
  const [opcionesFiltro, setOpcionesFiltro] = useState<string[]>(['TODOS']);

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [data, deportes] = await Promise.all([
                getPartidos(),
                getDeportesUnicos()
            ]);
            setPartidos(data);
            setOpcionesFiltro(deportes);
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
    
    const deportePartido = (partido.Deporte || 'GENERAL').toUpperCase().trim();
    const seleccion = deporteSeleccionado.toUpperCase().trim();
    
    return deportePartido === seleccion;
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
                <p>No hay partidos programados para este deporte.</p>
            )}
            </div>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default PartidosPage;