// src/pages/ResultadosPublicosPage.tsx

import React, { useState, useEffect } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import FiltroDeporte from '../components/FiltroDeporte';
import TablaClasificacion from '../components/TablaClasificacion'; 
import type { Torneo, Partido } from '../types';
import { getTorneos } from '../services/torneosService';
import { getPartidos } from '../services/partidosService';
import CardPartido from '../components/CardPartido';

const ResultadosPublicosPage: React.FC = () => {
  const [allTorneos, setAllTorneos] = useState<Torneo[]>([]);
  const [partidosFinalizados, setPartidosFinalizados] = useState<Partido[]>([]);
  const [deporteSeleccionado, setDeporteSeleccionado] = useState('TODOS'); 
  const [torneoSeleccionadoId, setTorneoSeleccionadoId] = useState<string>(''); 
  const [deportesDisponibles, setDeportesDisponibles] = useState<string[]>(['TODOS']);

  useEffect(() => {
    const loadData = async () => {
        const dataTorneos = await getTorneos();
        setAllTorneos(dataTorneos);

        // Generar opciones de filtro dinámicas
        const deportesUnicos = Array.from(new Set(dataTorneos.map(t => t.deporte?.toUpperCase() || 'GENERAL')));
        setDeportesDisponibles(['TODOS', ...deportesUnicos]);

        if (dataTorneos.length > 0) setTorneoSeleccionadoId(dataTorneos[0].id);

        const dataPartidos = await getPartidos();
        setPartidosFinalizados(dataPartidos.filter(p => p.estado === 'FINALIZADO'));
    };
    loadData();
  }, []);

  const torneosFiltrados = allTorneos.filter(t => {
      if (deporteSeleccionado === 'TODOS') return true;
      return (t.deporte?.toUpperCase() || 'GENERAL') === deporteSeleccionado;
  });

  useEffect(() => {
      if (torneosFiltrados.length > 0) setTorneoSeleccionadoId(torneosFiltrados[0].id);
      else setTorneoSeleccionadoId('');
  }, [deporteSeleccionado]);

  const torneoActualObj = allTorneos.find(t => t.id === torneoSeleccionadoId);

  return (
    <div>
      <HeaderNav />
      <div className="content-container">
        <h2 style={{ color: '#1976D2', marginBottom: 20 }}>Resultados y Clasificación</h2>

        {/* FILTRO DINÁMICO */}
        <FiltroDeporte 
            opciones={deportesDisponibles}
            onFiltroChange={setDeporteSeleccionado}
            valorActual={deporteSeleccionado}
        />

        {/* SELECTOR MEJORADO */}
        <div style={{ marginTop: 30, marginBottom: 30, padding: 20, background: 'white', borderRadius: 12, border: '1px solid #E0E0E0', display: 'flex', alignItems: 'center', gap: 15 }}>
            <label style={{ fontWeight: 'bold', color: '#333', fontSize: '1.1rem' }}>🏆 Seleccionar Torneo:</label>
            <select 
                value={torneoSeleccionadoId} 
                onChange={(e) => setTorneoSeleccionadoId(e.target.value)}
                style={{ padding: '10px 15px', borderRadius: 8, flex: 1, border: '1px solid #CCC', fontSize: '1rem' }}
                disabled={torneosFiltrados.length === 0}
            >
                {torneosFiltrados.length === 0 && <option>No hay torneos</option>}
                {torneosFiltrados.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
            </select>
        </div>

        {torneoActualObj ? (
            <TablaClasificacion deporte={torneoActualObj.deporte} idTorneo={torneoActualObj.id} />
        ) : (
            <p style={{textAlign:'center', color:'#777'}}>Selecciona un torneo.</p>
        )}
        
        <h3 style={{ marginTop: 40, borderBottom: '2px solid #EEE', paddingBottom: 10 }}>Últimos Resultados</h3>
        <div className="partidos-list">
            {partidosFinalizados.length > 0 ? partidosFinalizados.map(p => <CardPartido key={p.id} partido={p} />) : <p>No hay resultados recientes.</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResultadosPublicosPage;