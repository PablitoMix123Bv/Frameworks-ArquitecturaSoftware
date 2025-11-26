// src/components/TablaClasificacion.tsx

import React, { useEffect, useState } from 'react';
import type { TablaClasificacionProps, EquipoEstadistica } from '../types';
import { getTablaClasificacion } from '../services/estadisticasService';
import './TablaClasificacion.css';

const TablaClasificacion: React.FC<TablaClasificacionProps> = ({ deporte, idTorneo }) => {
    
    const [clasificacion, setClasificacion] = useState<EquipoEstadistica[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!idTorneo) return;
            
            setLoading(true);
            // idTorneo ya es string por la interfaz, lo pasamos directo
            const data = await getTablaClasificacion(idTorneo);
            setClasificacion(data);
            setLoading(false);
        };

        fetchData();
    }, [idTorneo]); 

    if (loading) return <p className="tabla-loading">Cargando tabla de posiciones...</p>;
    
    if (clasificacion.length === 0) {
        return (
            <div className="tabla-clasificacion-contenedor">
                 <h3>Clasificación - {deporte}</h3>
                 <p>No hay datos registrados para este torneo aún.</p>
            </div>
        );
    }

    return (
        <div className="tabla-clasificacion-contenedor">
            <h3>Clasificación - {deporte}</h3>
            
            <table>
                <thead>
                                        <tr>
                        <th>#</th>
                        <th>Equipo</th>
                        <th>Jugados</th>
                        <th>Ganados</th>
                        <th>Empatados</th>
                        <th>Perdidos</th>
                        <th>Favor</th> 
                        <th>Contra</th> 
                        <th>Pts</th>
                    </tr>

                </thead>
                <tbody>
                    {clasificacion.map((equipo, index) => (
                        <tr key={`${equipo.nombreEquipo}-${index}`} className={index < 3 ? 'top-team' : ''}>
                            <td>{index + 1}</td>
                            <td className="equipo-nombre-col">{equipo.nombreEquipo}</td>
                            <td>{equipo.partidosJugados}</td>
                            <td>{equipo.victorias}</td>
                            <td>{equipo.empates}</td>
                            <td>{equipo.derrotas}</td>
                            <td>{equipo.golesFavor}</td>
                            <td>{equipo.golesContra}</td>
                            <td className="puntos-col">{equipo.puntos}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TablaClasificacion;