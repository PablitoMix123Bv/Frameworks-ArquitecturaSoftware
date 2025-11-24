import React, { useState, useEffect } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import FiltroDeporte from '../components/FiltroDeporte'; 
import TablaClasificacion from '../components/TablaClasificacion'; 
import type { Torneo, Partido } from '../types';
import { getTorneos } from '../services/torneosService';
import { getPartidos } from '../services/partidosService';
import CardPartido from '../components/CardPartido';

// 1. IMPORTACIÓN CORRECTA: Debe ser 'useNavigate' (el hook), NO 'Navigate' (el componente)
import { useNavigate } from 'react-router-dom'; 

const ResultadosPublicosPage: React.FC = () => {
  // 2. DECLARACIÓN CORRECTA: Ejecutamos el hook
  const navigate = useNavigate(); 

  const [allTorneos, setAllTorneos] = useState<Torneo[]>([]);
  const [partidosFinalizados, setPartidosFinalizados] = useState<Partido[]>([]);
  const [deporteSeleccionado, setDeporteSeleccionado] = useState('TODOS'); 
  const [torneoSeleccionadoId, setTorneoSeleccionadoId] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
        const dataTorneos = await getTorneos();
        setAllTorneos(dataTorneos);

        if (dataTorneos.length > 0) {
             setTorneoSeleccionadoId(dataTorneos[0].id);
        }

        const dataPartidos = await getPartidos();
        setPartidosFinalizados(dataPartidos.filter(p => p.estado === 'FINALIZADO'));
    };
    loadData();
  }, []);

  const torneosFiltradosPorDeporte = allTorneos.filter(t => {
      if (deporteSeleccionado === 'TODOS') return true;
      return t.deporte?.toUpperCase() === deporteSeleccionado;
  });

  useEffect(() => {
      if (torneosFiltradosPorDeporte.length > 0) {
          setTorneoSeleccionadoId(torneosFiltradosPorDeporte[0].id);
      } else {
          setTorneoSeleccionadoId('');
      }
  }, [deporteSeleccionado, allTorneos]);

  const handleTorneoDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setTorneoSeleccionadoId(e.target.value);
  };

  const torneoActualObj = allTorneos.find(t => t.id === torneoSeleccionadoId);

  return (
    <div>
      <HeaderNav />
      <div className="content-container">
        
        <h2 style={{ color: '#1976D2' }}>Resultados y Clasificación</h2>

        <FiltroDeporte 
            onFiltroChange={setDeporteSeleccionado}
            valorActual={deporteSeleccionado}
        />

        {torneosFiltradosPorDeporte.length > 0 && (
            <div style={{ marginTop: '10px', marginBottom: '20px' }}>
                <label htmlFor="select-torneo" style={{ fontWeight: 'bold', marginRight: '10px' }}>Torneo:</label>
                <select 
                    id="select-torneo" 
                    value={torneoSeleccionadoId} 
                    onChange={handleTorneoDropdownChange}
                    style={{ padding: '5px', borderRadius: '4px', border: '1px solid #CCC' }}
                >
                    {torneosFiltradosPorDeporte.map(t => (
                        <option key={t.id} value={t.id}>{t.nombre}</option>
                    ))}
                </select>
            </div>
        )}

        {torneoActualObj ? (
            <TablaClasificacion 
                deporte={torneoActualObj.deporte}
                idTorneo={torneoActualObj.id} 
            />
        ) : (
            <div style={{ padding: '30px', textAlign: 'center', color: '#666', background: '#f5f5f5', borderRadius: '8px' }}>
                <p>No hay torneos registrados para este deporte.</p>
            </div>
        )}
        
        <h3 style={{ marginTop: '40px', borderBottom: '2px solid #E0E0E0', paddingBottom: '10px' }}>Últimos Resultados</h3>
        <div className="partidos-list">
            {partidosFinalizados.length > 0 ? (
                partidosFinalizados.map(p => (
                    // 3. USO CORRECTO: navigate('/ruta')
                    <div 
                        key={p.id} 
                        onClick={() => navigate(`/partido/${p.id}`)}
                        style={{ cursor: 'pointer' }}
                        title="Ver detalles del partido"
                    >
                        <CardPartido partido={p} />
                    </div>
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