// src/pages/InscripcionesAdminPage.tsx (CORREGIDO)
import React, { useState } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import type { SolicitudInscripcion } from '../types';
import './InscripcionesAdminPage.css'; 

// --- 1. IMPORTAR ICONOS (AÑADIMOS FaTimesCircle) ---
import { FaCheck, FaCommentDots, FaTimesCircle } from 'react-icons/fa'; 

// (El componente ModalRetroalimentacion se queda igual que en el paso anterior)
const ModalRetroalimentacion: React.FC<{ solicitud: SolicitudInscripcion, onClose: () => void, onSubmit: (motivo: string) => void }> = ({ solicitud, onClose, onSubmit }) => {
    const [motivo, setMotivo] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!motivo) {
            alert('Debes escribir un motivo para la revisión.');
            return;
        }
        onSubmit(motivo);
    };
    return (
        <div className="modal-overlay">
            <div className="modal-content-roster"> {/* Reutilizamos CSS del modal de roster */}
                <button className="modal-close-button" onClick={onClose}>&times;</button>
                <h2>Solicitar Cambios</h2>
                <h3>Equipo: {solicitud.nombreEquipo}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="motivo">Motivo de la revisión (será visible para el capitán):</label>
                        <textarea 
                            id="motivo" 
                            rows={4}
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            placeholder="Ej: Faltan jugadores, el logo no es válido..."
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{backgroundColor: '#FF9800'}}>Enviar Retroalimentación</button>
                </form>
            </div>
        </div>
    );
};


// Mock de solicitudes pendientes
const mockSolicitudes: SolicitudInscripcion[] = [
    { idTorneo: 101, nombreEquipo: 'Hunters', logoUrl: '/img/hunters.png', integrantes: [/*...*/] as any, fechaSolicitud: '2025-11-04' },
    { idTorneo: 101, nombreEquipo: 'Los Mamados', logoUrl: '/img/logo_placeholder.png', integrantes: [/*...*/] as any, fechaSolicitud: '2025-11-03' },
];

const InscripcionesAdminPage: React.FC = () => {
    const [solicitudes, setSolicitudes] = useState(mockSolicitudes);
    const [solicitudEnRevision, setSolicitudEnRevision] = useState<SolicitudInscripcion | null>(null);

    const handleAprobar = (nombreEquipo: string) => {
        alert(`Equipo "${nombreEquipo}" APROBADO.`);
        setSolicitudes(solicitudes.filter(s => s.nombreEquipo !== nombreEquipo));
    };

    const handleEnviarRetro = (motivo: string) => {
        if (!solicitudEnRevision) return;
        alert(`Retroalimentación enviada para "${solicitudEnRevision.nombreEquipo}".`);
        setSolicitudes(solicitudes.filter(s => s.nombreEquipo !== solicitudEnRevision.nombreEquipo));
        setSolicitudEnRevision(null); 
    };

    // --- 2. NUEVA FUNCIÓN PARA RECHAZO DEFINITIVO ---
    const handleRechazarDefinitivo = (nombreEquipo: string) => {
        if (window.confirm(`¿Estás seguro de RECHAZAR PERMANENTEMENTE a "${nombreEquipo}"? Esta acción no se puede deshacer.`)) {
            alert(`Equipo "${nombreEquipo}" RECHAZADO DEFINITIVAMENTE.`);
            // Aquí llamarías a la API para marcarlo como "Rechazado"
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
                            
                            {/* --- 3. TRES BOTONES DE ACCIÓN --- */}
                            <div className="solicitud-actions">
                                <button className="btn-aprobar" onClick={() => handleAprobar(solicitud.nombreEquipo)}>
                                    <FaCheck /> Aprobar
                                </button>
                                <button className="btn-solicitar-cambios" onClick={() => setSolicitudEnRevision(solicitud)}>
                                    <FaCommentDots /> Solicitar Cambios
                                </button>
                                <button className="btn-rechazar-definitivo" onClick={() => handleRechazarDefinitivo(solicitud.nombreEquipo)}>
                                    <FaTimesCircle /> Rechazar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />

            {solicitudEnRevision && (
                <ModalRetroalimentacion
                    solicitud={solicitudEnRevision}
                    onClose={() => setSolicitudEnRevision(null)}
                    onSubmit={handleEnviarRetro}
                />
            )}
        </div>
    );
};
export default InscripcionesAdminPage;