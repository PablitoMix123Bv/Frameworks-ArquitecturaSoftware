// src/pages/ResultadosPublicosPage.tsx

import React, { useState, useEffect } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import FiltroDeporte from '../components/FiltroDeporte'; // Restored!
import TablaClasificacion from '../components/TablaClasificacion'; 
import type { Torneo, Partido } from '../types';
import { getTorneos } from '../services/torneosService';
import { getPartidos } from '../services/partidosService';
import CardPartido from '../components/CardPartido';

const ResultadosPublicosPage: React.FC = () => {
  // Datos crudos de la API
  const [allTorneos, setAllTorneos] = useState<Torneo[]>([]);
  const [partidosFinalizados, setPartidosFinalizados] = useState<Partido[]>([]);
  
  // Estados de filtro visual
  const [deporteSeleccionado, setDeporteSeleccionado] = useState('TODOS'); // Filtro de botones
  const [torneoSeleccionadoId, setTorneoSeleccionadoId] = useState<string>(''); // Filtro de dropdown

  // 1. Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
        const dataTorneos = await getTorneos();
        setAllTorneos(dataTorneos);

        // Seleccionar por defecto el primero disponible si hay
        if (dataTorneos.length > 0) {
             setTorneoSeleccionadoId(dataTorneos[0].id);
        }

        const dataPartidos = await getPartidos();
        setPartidosFinalizados(dataPartidos.filter(p => p.estado === 'FINALIZADO'));
    };
    loadData();
  }, []);

  // 2. Lógica de filtrado: Torneos disponibles según el botón de deporte presionado
  const torneosFiltradosPorDeporte = allTorneos.filter(t => {
      if (deporteSeleccionado === 'TODOS') return true;
      return t.deporte?.toUpperCase() === deporteSeleccionado;
  });

  // Efecto: Si cambio de deporte, resetear el dropdown al primer torneo de ese deporte
  useEffect(() => {
      if (torneosFiltradosPorDeporte.length > 0) {
          setTorneoSeleccionadoId(torneosFiltradosPorDeporte[0].id);
      } else {
          setTorneoSeleccionadoId('');
      }
  }, [deporteSeleccionado, allTorneos]); // Dependencias: si cambia deporte o cargan torneos

  // Manejar cambio manual en el dropdown
  const handleTorneoDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setTorneoSeleccionadoId(e.target.value);
  };

  // Obtener el objeto torneo completo para pasarlo a la tabla
  const torneoActualObj = allTorneos.find(t => t.id === torneoSeleccionadoId);

  return (
    <div>
      <HeaderNav />
      <div className="content-container">
        
        <h2 style={{ color: '#1976D2' }}>Resultados y Clasificación</h2>

        {/* 1. FILTRO DE BOTONES (Respetando diseño original) */}
        <FiltroDeporte 
            onFiltroChange={setDeporteSeleccionado}
            valorActual={deporteSeleccionado}
        />

        {/* 2. SELECTOR DE TORNEO (Filtrado por el botón de arriba) */}
        <div style={{ marginTop: '20px', marginBottom: '20px', padding: '15px', backgroundColor: '#F8F8F8', borderRadius: '8px', border: '1px solid #E0E0E0' }}>
            <label htmlFor="select-torneo" style={{ fontWeight: 'bold', marginRight: '10px' }}>Ver tabla de:</label>
            <select 
                id="select-torneo" 
                value={torneoSeleccionadoId} 
                onChange={handleTorneoDropdownChange}
                style={{ padding: '8px', borderRadius: '4px', minWidth: '250px', border: '1px solid #CCC' }}
                disabled={torneosFiltradosPorDeporte.length === 0}
            >
                {torneosFiltradosPorDeporte.length === 0 && <option value="">No hay torneos para este deporte</option>}
                {torneosFiltradosPorDeporte.map(t => (
                    <option key={t.id} value={t.id}>{t.nombre} ({t.deporte})</option>
                ))}
            </select>
        </div>

        {/* 3. TABLA DE CLASIFICACIÓN (Se muestra solo si hay torneo seleccionado) */}
        {torneoActualObj ? (
            <TablaClasificacion 
                deporte={torneoActualObj.deporte}
                idTorneo={torneoActualObj.id} 
            />
        ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#777', backgroundColor: '#F9F9F9', borderRadius: '8px' }}>
                <p>Selecciona un torneo para ver la tabla de posiciones.</p>
            </div>
        )}
        
        <h3 style={{ marginTop: '40px', borderBottom: '2px solid #E0E0E0', paddingBottom: '10px' }}>Últimos Resultados</h3>
        <div className="partidos-list">
            {partidosFinalizados.length > 0 ? (
                partidosFinalizados.map(p => (
                    <CardPartido key={p.id} partido={p} />
                ))
            ) : (
                <p>No hay partidos finalizados recientemente.</p>
            )}
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default ResultadosPublicosPage;