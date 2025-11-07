// src/pages/InscripcionesAdminPage.tsx
import React, { useState } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import type { SolicitudInscripcion } from '../types';
import './InscripcionesAdminPage.css'; // Crearemos este CSS

// Mock de solicitudes pendientes
const mockSolicitudes: SolicitudInscripcion[] = [
    { idTorneo: 101, nombreEquipo: 'Hunters', logoUrl: '/img/hunters.png', integrantes: [/*...*/] as any, fechaSolicitud: '2025-11-04' },
    { idTorneo: 101, nombreEquipo: 'Los Mamados', logoUrl: '/img/logo_placeholder.png', integrantes: [/*...*/] as any, fechaSolicitud: '2025-11-03' },
];

const InscripcionesAdminPage: React.FC = () => {
    const [solicitudes, setSolicitudes] = useState(mockSolicitudes);

    const handleAprobar = (nombreEquipo: string) => {
        alert(`Equipo "${nombreEquipo}" APROBADO.`);
        setSolicitudes(solicitudes.filter(s => s.nombreEquipo !== nombreEquipo));
    };

    const handleRechazar = (nombreEquipo: string) => {
        const motivo = prompt(`Motivo del rechazo para "${nombreEquipo}":`);
        if (motivo) {
            alert(`Equipo "${nombreEquipo}" RECHAZADO. Motivo: ${motivo}`);
            setSolicitudes(solicitudes.filter(s => s.nombreEquipo !== nombreEquipo));
        }
    };

    return (
        <div>
            <HeaderNav />
            <div className="content-container">
                <h2>Gestión de Inscripciones Pendientes</h2>
                
                <div className="solicitudes-list">
                    {solicitudes.length === 0 && <p>No hay solicitudes pendientes.</p>}
                    
                    {solicitudes.map((solicitud, index) => (
                        <div key={index} className="card-solicitud-admin">
                            <img src={solicitud.logoUrl} alt="Logo" className="solicitud-logo" />
                            <div className="solicitud-details">
                                <h4>{solicitud.nombreEquipo}</h4>
                                <p>Solicitud para Torneo ID: {solicitud.idTorneo}</p>
                                <small>Enviada: {solicitud.fechaSolicitud}</small>
                            </div>
                            <div className="solicitud-actions">
                                <button className="btn-aprobar" onClick={() => handleAprobar(solicitud.nombreEquipo)}>Aprobar</button>
                                <button className="btn-rechazar" onClick={() => handleRechazar(solicitud.nombreEquipo)}>Rechazar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};
export default InscripcionesAdminPage;