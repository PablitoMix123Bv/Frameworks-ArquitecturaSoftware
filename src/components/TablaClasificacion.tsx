// src/components/TablaClasificacion.tsx

import React from 'react';
import type { TablaClasificacionProps, EquipoEstadistica } from '../types';
import './TablaClasificacion.css'; // Implementaremos los estilos a continuación

// Datos mock para simular las estadísticas cargadas de la base de datos
const mockClasificacion: EquipoEstadistica[] = [
    // El orden en el array ya simula el orden por puntos
    { idEquipo: 3, nombreEquipo: 'Pythons', partidosJugados: 6, victorias: 5, empates: 1, derrotas: 0, golesFavor: 18, golesContra: 3, puntos: 16 },
    { idEquipo: 1, nombreEquipo: 'Hunters', partidosJugados: 6, victorias: 4, empates: 2, derrotas: 0, golesFavor: 15, golesContra: 5, puntos: 14 },
    { idEquipo: 4, nombreEquipo: 'Castrosos', partidosJugados: 7, victorias: 3, empates: 1, derrotas: 3, golesFavor: 9, golesContra: 10, puntos: 10 },
    { idEquipo: 2, nombreEquipo: 'Leones', partidosJugados: 6, victorias: 2, empates: 0, derrotas: 4, golesFavor: 7, golesContra: 12, puntos: 6 },
];

const TablaClasificacion: React.FC<TablaClasificacionProps> = ({ deporte, idTorneo }) => {
    
    // Aquí iría el useEffect para cargar los datos de la API según idTorneo y deporte
    // Por ahora, usamos el mock.

    return (
        <div className="tabla-clasificacion-contenedor">
            <h3>Clasificación del Torneo #{idTorneo} - {deporte}</h3>
            
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
                    {mockClasificacion.map((equipo, index) => (
                        <tr key={equipo.idEquipo} className={index < 3 ? 'top-team' : ''}>
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