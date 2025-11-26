// src/pages/TablaPosicionesPage.tsx
import React, { useState, useEffect } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import type { EquipoEstadistica, Torneo } from '../types'; 
import { getTablaClasificacion } from '../services/estadisticasService';
import { getTorneos } from '../services/torneosService';
import './TablaPosicionesPage.css';

const TablaPosicionesPage: React.FC = () => {
    const [clasificacion, setClasificacion] = useState<EquipoEstadistica[]>([]);
    const [torneos, setTorneos] = useState<Torneo[]>([]);
    const [torneoSeleccionadoId, setTorneoSeleccionadoId] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // 1. Cargar Torneos
    useEffect(() => {
        const cargarTorneos = async () => {
            const data = await getTorneos();
            setTorneos(data);
            if (data.length > 0) {
                setTorneoSeleccionadoId(data[0].id);
            }
        };
        cargarTorneos();
    }, []);

    // 2. Cargar Clasificación cuando cambia el torneo seleccionado
    useEffect(() => {
        const cargarClasificacion = async () => {
            if (!torneoSeleccionadoId) return;
            setLoading(true);
            try {
                const data = await getTablaClasificacion(torneoSeleccionadoId);
                setClasificacion(data);
            } catch (error) {
                console.error(error);
                setClasificacion([]);
            } finally {
                setLoading(false);
            }
        };
        cargarClasificacion();
    }, [torneoSeleccionadoId]);

    return (
        <div>
            <HeaderNav />
            <div className="content-container tabla-posiciones-page">
                <h1>Tabla de Posiciones</h1>
                
                <div className="filtro-torneo">
                    <label htmlFor="selector-torneo">Seleccionar Torneo:</label>
                    <select 
                        id="selector-torneo" 
                        value={torneoSeleccionadoId} 
                        onChange={(e) => setTorneoSeleccionadoId(e.target.value)}
                        disabled={torneos.length === 0}
                    >
                        {torneos.map(t => (
                            <option key={t.id} value={t.id}>{t.nombre}</option>
                        ))}
                    </select>
                </div>

                {loading ? <p>Calculando estadísticas...</p> : (
                    <div className="tabla-responsive">
                        {clasificacion.length === 0 ? (
                            <p>No hay datos suficientes o partidos finalizados en este torneo.</p>
                        ) : (
                            <table className="tabla-clasificacion">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Equipo</th>
                                        <th>PJ</th>
                                        <th>PG</th>
                                        <th>PE</th>
                                        <th>PP</th>
                                        <th>GF</th>
                                        <th>GC</th>
                                        <th>PTS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clasificacion.map((equipo, index) => (
                                        <tr key={index} className={(index + 1) % 2 === 0 ? 'fila-par' : 'fila-impar'}>
                                            <td className="col-posicion">{index + 1}</td>
                                            <td className="col-equipo">
                                                <div className="equipo-nombre-logo">
                                                    {equipo.nombreEquipo}
                                                </div>
                                            </td>
                                            <td>{equipo.partidosJugados}</td>
                                            <td>{equipo.victorias}</td>
                                            <td>{equipo.empates}</td>
                                            <td>{equipo.derrotas}</td>
                                            <td>{equipo.golesFavor}</td>
                                            <td>{equipo.golesContra}</td>
                                            <td className="col-puntos"><strong>{equipo.puntos}</strong></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default TablaPosicionesPage;