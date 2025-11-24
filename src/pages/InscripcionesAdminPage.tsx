// src/pages/InscripcionesAdminPage.tsx

import React, { useState, useEffect } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import { getTodasInscripciones, actualizarEstadoInscripcion } from '../services/inscripcionesService';
import './InscripcionesAdminPage.css'; 
import { FaCheck, FaTimesCircle, FaCommentDots } from 'react-icons/fa'; 
    
// Modal interno para rechazo con motivo
const ModalRechazo: React.FC<{ onClose: () => void, onSubmit: (motivo: string) => void }> = ({ onClose, onSubmit }) => {
    const [motivo, setMotivo] = useState('');
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-button" onClick={onClose}>&times;</button>
                <h2>Rechazar Inscripción</h2>
                <div className="form-group">
                    <label>Motivo del rechazo:</label>
                    <textarea 
                        rows={4}
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        placeholder="Ej: El logo es inapropiado, faltan jugadores..."
                        required
                    />
                </div>
                <button className="btn-danger" style={{width: '100%'}} onClick={() => onSubmit(motivo)}>
                    Confirmar Rechazo
                </button>
            </div>
        </div>
    );
};

const InscripcionesAdminPage: React.FC = () => {
    const [solicitudes, setSolicitudes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [idParaRechazar, setIdParaRechazar] = useState<string | null>(null);

    // Cargar datos reales
    const fetchSolicitudes = async () => {
        setIsLoading(true);
        try {
            const data = await getTodasInscripciones();
            // Filtramos para ver principalmente las PENDIENTES primero
            // Opcional: podrías mostrar todas separadas por estado
            setSolicitudes(data.filter(s => s.estado === 'PENDIENTE'));
        } catch (error) {
            console.error("Error cargando inscripciones", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSolicitudes();
    }, []);

    const handleAprobar = async (id: string) => {
        if (window.confirm('¿Aprobar este equipo para el torneo?')) {
            try {
                await actualizarEstadoInscripcion(id, 'APROBADO');
                fetchSolicitudes(); // Recargar lista
            } catch (error) {
                alert('Error al aprobar');
            }
        }
    };

    const handleConfirmarRechazo = async (motivo: string) => {
        if (idParaRechazar && motivo) {
            try {
                await actualizarEstadoInscripcion(idParaRechazar, 'RECHAZADO', motivo);
                setIdParaRechazar(null);
                fetchSolicitudes();
            } catch (error) {
                alert('Error al rechazar');
            }
        }
    };

    return (
        <div>
            <HeaderNav />
            <div className="content-container">
                <h2>Gestión de Inscripciones Pendientes</h2>
                
                {isLoading && <p>Cargando solicitudes...</p>}
                
                {!isLoading && solicitudes.length === 0 && (
                    <div style={{padding: '40px', textAlign: 'center', color: '#666', background: '#f9f9f9', borderRadius: '8px'}}>
                        <p>No hay solicitudes pendientes de revisión.</p>
                    </div>
                )}
                
                <div className="solicitudes-list">
                    {solicitudes.map((solicitud) => (
                        <div key={solicitud.id} className="card-solicitud-admin">
                            <img src={solicitud.logoUrl} alt="Logo" className="solicitud-logo" />
                            <div className="solicitud-details">
                                <h4>{solicitud.equipo}</h4>
                                <p><strong>Torneo:</strong> {solicitud.torneo} ({solicitud.deporte})</p>
                                <p>Integrantes: {solicitud.integrantesCount}</p>
                                <small>Fecha solicitud: {new Date(solicitud.fechaSolicitud).toLocaleDateString()}</small>
                                {!solicitud.cumpleRequisitos && (
                                    <p style={{color: 'red', fontWeight: 'bold', fontSize: '0.8rem'}}>
                                        No cumple con el mínimo de jugadores
                                    </p>
                                )}
                            </div>
                            
                            <div className="solicitud-actions">
                                <button className="btn-aprobar" onClick={() => handleAprobar(solicitud.id)}>
                                    <FaCheck /> Aprobar
                                </button>
                                <button className="btn-rechazar-definitivo" onClick={() => setIdParaRechazar(solicitud.id)}>
                                    <FaTimesCircle /> Rechazar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />

            {idParaRechazar && (
                <ModalRechazo
                    onClose={() => setIdParaRechazar(null)}
                    onSubmit={handleConfirmarRechazo}
                />
            )}
        </div>
    );
};

export default InscripcionesAdminPage;