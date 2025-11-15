// src/pages/MiEquipoDashboard.tsx (CORREGIDO)

import React, { useEffect, useState } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import FormularioInscripcion from '../components/FormularioInscripcion';
import type { Equipo, SolicitudInscripcion, Torneo } from '../types'; 
import { useNavigate } from 'react-router-dom';
import FormularioRoster from '../components/FormularioRoster';
import './MiEquipoDashboard.css'; 
import { FaPencilAlt, FaCommentDots, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';

// (Simulamos un objeto Torneo para pasarlo al modal)
const mockTorneo: Torneo = {
    id: 101,
    nombre: 'Torneo de Voleibol Apertura',
    deporte: 'VOLEIBOL',
    minJugadores: 6,
    maxJugadores: 10,
    fechaLimiteInscripcion: '2025-11-20',
} as Torneo;


// (La estructura del Mock se queda igual)
interface MiEquipoInfo {
  equipo: Equipo;
  rolUsuario: 'Capitán' | 'Jugador';
  solicitud: {
    idTorneo: number; 
    estado: 'Aprobado' | 'Pendiente' | 'RequiereCambios' | 'Rechazado';
    motivo?: string | null; 
  }
}

const mockMisEquipos: MiEquipoInfo[] = [
    { 
      equipo: { 
        id: 1, nombre: 'Hunters', logoUrl: '/img/hunters.png', facultad: 'Ingeniería', 
        victorias: 5, derrotas: 1, empates: 2, puntos: 17, jugadores: ['Juan P. (Capitán)', 'Ana L.', 'Carlos M.'],
        deporte: 'FÚTBOL', minJugadores: 8, maxJugadores: 12, reglas: 'Reglas estándar.'
      },
      rolUsuario: 'Capitán',
      solicitud: { idTorneo: 100, estado: 'Aprobado', motivo: null }
    },
    { 
      equipo: { 
        id: 6, nombre: 'Los Nuevos', logoUrl: '/img/logo_placeholder.png', facultad: 'Ingeniería', 
        victorias: 0, derrotas: 0, empates: 0, puntos: 0, jugadores: ['Juan P. (Capitán)'],
        deporte: 'VOLEIBOL', minJugadores: 6, maxJugadores: 10, reglas: 'N/A'
      },
      rolUsuario: 'Capitán',
      solicitud: { idTorneo: 101, estado: 'RequiereCambios', motivo: 'El nombre del equipo ("Los Nuevos") no es apropiado. Por favor, cámbialo.' }
    },
    { 
      equipo: { 
        id: 7, nombre: 'Equipo Fantasma', logoUrl: '/img/logo_placeholder.png', facultad: 'Ingeniería', 
        victorias: 0, derrotas: 0, empates: 0, puntos: 0, jugadores: ['Jugador Falso 1'],
        deporte: 'FÚTBOL', minJugadores: 8, maxJugadores: 12, reglas: 'N/A'
      },
      rolUsuario: 'Capitán',
      solicitud: { 
        idTorneo: 102, // <-- CORRECCIÓN AQUÍ
        estado: 'Rechazado', 
        motivo: 'Jugadores no válidos. Inscripción denegada.' 
      }
    },
];


const MiEquipoDashboard: React.FC = () => {
    const [misEquipos, setMisEquipos] = useState<MiEquipoInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [equipoGestionRoster, setEquipoGestionRoster] = useState<Equipo | null>(null);
    const [equipoAEditar, setEquipoAEditar] = useState<Equipo | null>(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        setTimeout(() => {
            setMisEquipos(mockMisEquipos); 
            setIsLoading(false);
        }, 500);
    }, []); 

    const handleCerrarModalRoster = () => setEquipoGestionRoster(null);
    
    const handleEditarSolicitud = (equipo: Equipo) => {
        setEquipoAEditar(equipo); 
    };

    const handleCerrarModalEdicion = () => {
        setEquipoAEditar(null);
    };

    const renderEstadoInscripcion = (item: MiEquipoInfo) => {
        const { estado, motivo } = item.solicitud;
        switch (estado) {
            case 'Aprobado':
                return <div className="estado-tag aprobado"><FaCheckCircle /> Aprobado</div>;
            case 'Pendiente':
                return <div className="estado-tag pendiente">⏳ Pendiente</div>;
            case 'RequiereCambios':
                return (
                    <div className="estado-tag requiere-cambios"> 
                        <span><FaCommentDots /> Requiere Cambios</span>
                        {item.rolUsuario === 'Capitán' && (
                            <button 
                                className="btn-editar-solicitud" 
                                onClick={() => handleEditarSolicitud(item.equipo)} 
                            >
                                <FaPencilAlt /> Editar Solicitud
                            </button>
                        )}
                    </div>
                );
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
                                    <strong><FaCommentDots /> Revisión del Admin:</strong>
                                    <p>{item.solicitud.motivo}</p>
                                </div>
                            )}

                            <div className="mi-equipo-stats">
                                <p><strong>Victorias:</strong> {item.equipo.victorias}</p>
                                <p><strong>Derrotas:</strong> {item.equipo.derrotas}</p>
                                <p><strong>Empates:</strong> {item.equipo.empates}</p>
                                <p><strong>Puntos:</strong> {item.equipo.puntos}</p>
                                <p><strong>Jugadores:</strong> {item.equipo.jugadores.length} / {item.equipo.maxJugadores || 'N/A'}</p>
                            </div>
                            
                            {item.rolUsuario === 'Capitán' && (
                                <button 
                                    className="btn-primary" 
                                    onClick={() => setEquipoGestionRoster(item.equipo)}
                                >
                                    Administrar Jugadores
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <Footer />

            {/* Modal de Roster */}
            {equipoGestionRoster && (
                <FormularioRoster
                    equipo={equipoGestionRoster}
                    onClose={handleCerrarModalRoster}
                />
            )}

            {/* Modal de Edición */}
            {equipoAEditar && (
                <FormularioInscripcion
                    // Usamos el mockTorneo (en una app real, buscarías el torneo por ID)
                    torneo={mockTorneo} 
                    equipoAEditar={equipoAEditar}
                    onClose={handleCerrarModalEdicion}
                    onSuccess={handleCerrarModalEdicion} 
                />
            )}
        </div>
    );
};

export default MiEquipoDashboard;