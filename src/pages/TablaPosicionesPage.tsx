// src/pages/TablaPosicionesPage.tsx

import React, { useState, useEffect } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import type { ClasificacionTeam } from '../types'; 
import './TablaPosicionesPage.css';

// Datos mock de una tabla de clasificación de ejemplo
const mockClasificacion: ClasificacionTeam[] = [
    { posicion: 1, nombreEquipo: 'Hunters', pj: 8, pg: 6, pe: 1, pp: 1, gf: 22, gc: 8, puntos: 19 },
    { posicion: 2, nombreEquipo: 'Astros', pj: 8, pg: 5, pe: 2, pp: 1, gf: 18, gc: 10, puntos: 17 },
    { posicion: 3, nombreEquipo: 'Tigres', pj: 8, pg: 4, pe: 3, pp: 1, gf: 15, gc: 9, puntos: 15 },
    { posicion: 4, nombreEquipo: 'Águilas', pj: 8, pg: 3, pe: 2, pp: 3, gf: 12, gc: 11, puntos: 11 },
    { posicion: 5, nombreEquipo: 'Fénix', pj: 8, pg: 2, pe: 1, pp: 5, gf: 9, gc: 16, puntos: 7 },
    { posicion: 6, nombreEquipo: 'Gladiadores', pj: 8, pg: 0, pe: 1, pp: 7, gf: 5, gc: 27, puntos: 1 },
];

const TablaPosicionesPage: React.FC = () => {
    const [clasificacion, setClasificacion] = useState<ClasificacionTeam[]>([]);
    const [torneosDisponibles, _setTorneosDisponibles] = useState(['Fútbol 2024', 'Básquetbol A', 'Voleibol']);
    const [torneoSeleccionado, setTorneoSeleccionado] = useState('Fútbol 2024');

    useEffect(() => {
        // Simulación de carga de la tabla de clasificación para el torneo seleccionado
        console.log(`Cargando clasificación para: ${torneoSeleccionado}`);
        // En una app real, aquí se llamaría a la API con el ID del torneo
        setClasificacion(mockClasificacion);
    }, [torneoSeleccionado]);

    return (
        <div>
            <HeaderNav />
            <div className="content-container tabla-posiciones-page">
                <h1>Tabla de Posiciones</h1>
                
                {/* Selector de Torneo/Filtro */}
                <div className="filtro-torneo">
                    <label htmlFor="selector-torneo">Seleccionar Torneo:</label>
                    <select 
                        id="selector-torneo" 
                        value={torneoSeleccionado} 
                        onChange={(e) => setTorneoSeleccionado(e.target.value)}
                    >
                        {torneosDisponibles.map(torneo => (
                            <option key={torneo} value={torneo}>{torneo}</option>
                        ))}
                    </select>
                </div>

                <div className="tabla-responsive">
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
                            {clasificacion.map(equipo => (
                                <tr key={equipo.posicion} className={equipo.posicion % 2 === 0 ? 'fila-par' : 'fila-impar'}>
                                    <td className="col-posicion">{equipo.posicion}</td>
                                    <td className="col-equipo">
                                        <div className="equipo-nombre-logo">
                                            {/* Aquí iría un logo simulado */}
                                            <span className="equipo-logo">⚽</span> 
                                            {equipo.nombreEquipo}
                                        </div>
                                    </td>
                                    <td>{equipo.pj}</td>
                                    <td>{equipo.pg}</td>
                                    <td>{equipo.pe}</td>
                                    <td>{equipo.pp}</td>
                                    <td>{equipo.gf}</td>
                                    <td>{equipo.gc}</td>
                                    <td className="col-puntos"><strong>{equipo.puntos}</strong></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default TablaPosicionesPage;