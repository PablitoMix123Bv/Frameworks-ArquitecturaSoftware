// src/pages/InscripcionesAdminPage.tsx
import React, { useState, useEffect } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import { getAllInscripciones, updateEstadoInscripcion } from '../services/inscripcionesService';
import type { InscripcionBackend } from '../types';
import './InscripcionesAdminPage.css'; 
import { FaCheck, FaCommentDots, FaTimesCircle } from 'react-icons/fa'; 

// Modal local simple para retroalimentación
const ModalRetro = ({ onClose, onSubmit }: { onClose: () => void, onSubmit: (m: string) => void }) => {
    const [txt, setTxt] = useState('');
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Motivo de Rechazo / Cambios</h3>
                <textarea value={txt} onChange={e => setTxt(e.target.value)} rows={4} style={{width: '100%'}} />
                <button className="btn-primary" onClick={() => onSubmit(txt)} style={{marginTop: 10}}>Enviar</button>
                <button onClick={onClose} style={{marginTop: 10, background: 'none', border:'none', textDecoration:'underline', cursor:'pointer'}}>Cancelar</button>
            </div>
        </div>
    );
};

const InscripcionesAdminPage: React.FC = () => {
    const [solicitudes, setSolicitudes] = useState<InscripcionBackend[]>([]);
    const [loading, setLoading] = useState(true);
    const [accionId, setAccionId] = useState<string | null>(null); // ID de inscripción a procesar con motivo

    const fetchInscripciones = async () => {
        setLoading(true);
        try {
            const data = await getAllInscripciones();
            // Filtramos solo las PENDIENTES para esta vista
            setSolicitudes(data.filter(i => i.estado === 'PENDIENTE'));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInscripciones();
    }, []);

    const procesar = async (id: string, estado: 'APROBADO' | 'RECHAZADO', motivo?: string) => {
        try {
            await updateEstadoInscripcion(id, estado, motivo);
            alert(`Inscripción ${estado}`);
            fetchInscripciones();
        } catch (error) {
            alert('Error al procesar solicitud');
        }
        setAccionId(null);
    };

    return (
        <div>
            <HeaderNav />
            <div className="content-container">
                <h2>Gestión de Inscripciones Pendientes</h2>
                
                {loading ? <p>Cargando...</p> : (
                    <div className="solicitudes-list">
                        {solicitudes.length === 0 && <p>No hay solicitudes pendientes.</p>}
                        
                        {solicitudes.map((sol) => (
                            <div key={sol.id} className="card-solicitud-admin">
                                <div className="solicitud-details">
                                    <h4>{sol.equipo.nombre}</h4>
                                    <p>Torneo: {sol.torneo.nombre}</p>
                                    <small>Fecha: {new Date(sol.fechaSolicitud).toLocaleDateString()}</small>
                                    <p>Integrantes: {sol.equipo.noIntegrantes}</p>
                                </div>
                                
                                <div className="solicitud-actions">
                                    <button className="btn-aprobar" onClick={() => procesar(sol.id, 'APROBADO')}>
                                        <FaCheck /> Aprobar
                                    </button>
                                    
                                    <button className="btn-rechazar-definitivo" onClick={() => setAccionId(sol.id)}>
                                        <FaTimesCircle /> Rechazar / Observaciones
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />

            {accionId && (
                <ModalRetro 
                    onClose={() => setAccionId(null)}
                    onSubmit={(motivo) => procesar(accionId, 'RECHAZADO', motivo)}
                />
            )}
        </div>
    );
};
export default InscripcionesAdminPage;