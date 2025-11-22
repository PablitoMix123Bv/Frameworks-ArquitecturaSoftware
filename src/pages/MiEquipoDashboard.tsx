// src/pages/MiEquipoDashboard.tsx

import React, { useEffect, useState } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import FormularioInscripcion from '../components/FormularioInscripcion';
import type { Equipo, Torneo } from '../types'; 
import { useNavigate } from 'react-router-dom';
import FormularioRoster from '../components/FormularioRoster';
import './MiEquipoDashboard.css'; 
import { FaPencilAlt, FaCommentDots, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getMisEquipos } from '../services/inscripcionesService';

interface MiEquipoInfo {
  equipo: Equipo;
  rolUsuario: string;
  solicitud: {
    idTorneo: string; 
    estado: 'Aprobado' | 'Pendiente' | 'RequiereCambios' | 'Rechazado' | null;
    motivo?: string | null; 
  }
}

const MiEquipoDashboard: React.FC = () => {
    const { user } = useAuth();
    const [misEquipos, setMisEquipos] = useState<MiEquipoInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [equipoGestionRoster, setEquipoGestionRoster] = useState<Equipo | null>(null);
    // El formulario de edición requiere un Torneo completo, por simplicidad, aquí solo editaremos datos básicos si es necesario
    // o lo omitimos si la lógica de "editar solicitud" es compleja.
    const [equipoAEditar, setEquipoAEditar] = useState<Equipo | null>(null); 

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                const data = await getMisEquipos(user.id);
                setMisEquipos(data);
            }
            setIsLoading(false);
        };
        fetchData();
    }, [user]);

    const handleCerrarModalRoster = () => setEquipoGestionRoster(null);
    const handleCerrarModalEdicion = () => setEquipoAEditar(null);

    const renderEstadoInscripcion = (item: MiEquipoInfo) => {
        const { estado } = item.solicitud;
        if (!estado) return <div className="estado-tag">Sin Inscripción</div>;

        switch (estado) {
            case 'Aprobado':
                return <div className="estado-tag aprobado"><FaCheckCircle /> Aprobado</div>;
            case 'Pendiente':
                return <div className="estado-tag pendiente">⏳ Pendiente</div>;
            case 'Rechazado':
                return (
                    <div className="estado-tag rechazado-definitivo"> 
                        <span><FaTimesCircle /> Rechazado</span>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <HeaderNav />
            <div className="content-container mi-equipo-dashboard">
                <h1>Mis Equipos</h1>
                <p className="sub-header">Gestiona los equipos en los que estás inscrito.</p>

                {isLoading && <p>Cargando tus equipos...</p>}

                <div className="lista-mis-equipos">
                    {!isLoading && misEquipos.length === 0 && (
                        <p>No estás inscrito en ningún equipo actualmente.</p>
                    )}

                    {misEquipos.map((item) => (
                        <div key={item.equipo.id} className="card-mi-equipo">
                            
                            <div className="card-mi-equipo-header">
                                <img src={item.equipo.logoUrl} alt="Logo" className="mi-equipo-logo" />
                                <div className="mi-equipo-info">
                                    <h3>{item.equipo.nombre}</h3>
                                    <span className="mi-equipo-deporte">{item.equipo.deporte}</span>
                                </div>
                                {renderEstadoInscripcion(item)}
                            </div>
                            
                            {item.solicitud.motivo && (
                                <div className={`feedback-admin ${item.solicitud.estado === 'Rechazado' ? 'feedback-rojo' : ''}`}>
                                    <strong><FaCommentDots /> Mensaje del Admin:</strong>
                                    <p>{item.solicitud.motivo}</p>
                                </div>
                            )}

                            <div className="mi-equipo-stats">
                                <p><strong>Victorias:</strong> {item.equipo.victorias}</p>
                                <p><strong>Derrotas:</strong> {item.equipo.derrotas}</p>
                                <p><strong>Puntos:</strong> {item.equipo.puntos}</p>
                                <p><strong>Jugadores:</strong> {item.equipo.jugadores.length} {item.equipo.maxJugadores ? `/ ${item.equipo.maxJugadores}` : ''}</p>
                            </div>
                            
                            <button 
                                className="btn-primary" 
                                onClick={() => setEquipoGestionRoster(item.equipo)}
                            >
                                Ver Roster
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />

            {equipoGestionRoster && (
                <FormularioRoster
                    equipo={equipoGestionRoster}
                    onClose={handleCerrarModalRoster}
                />
            )}
        </div>
    );
};

export default MiEquipoDashboard;