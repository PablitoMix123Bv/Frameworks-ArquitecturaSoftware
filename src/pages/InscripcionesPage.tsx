// src/pages/InscripcionesPage.tsx

import React, { useState, useEffect } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import FormularioInscripcion from '../components/FormularioInscripcion'; 
import type { Torneo, SolicitudInscripcion, Equipo } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getTorneos } from '../services/torneosService';
import { getMiEquipo, crearEquipo, inscribirEquipoEnTorneo } from '../services/inscripcionesService';
import './InscripcionesPage.css'; 

const InscripcionesPage: React.FC = () => {
    const [torneosDisponibles, setTorneosDisponibles] = useState<Torneo[]>([]);
    const [torneoSeleccionado, setTorneoSeleccionado] = useState<Torneo | null>(null);
    const [miEquipo, setMiEquipo] = useState<Equipo | undefined>(undefined); 
    
    const { isLoggedIn, user } = useAuth();
    const navigate = useNavigate();
    
    // Lógica de seguridad: Solo el Capitán puede ver el botón activo.
    const esCapitan = isLoggedIn && user?.rol === 'capitan';

    useEffect(() => {
        const initData = async () => {
            const torneos = await getTorneos();
            setTorneosDisponibles(torneos);

            // Solo cargamos el equipo si el usuario es capitán
            if (isLoggedIn && user && user.rol === 'capitan') {
                const equipo = await getMiEquipo(user.id);
                setMiEquipo(equipo || undefined);
            }
        };
        initData();
    }, [isLoggedIn, user]);

    const handleInscribirClick = (torneo: Torneo) => {
        setTorneoSeleccionado(torneo);
    };

    const handleCloseModal = () => {
        setTorneoSeleccionado(null);
    };

    const handleProcessInscripcion = async (solicitud: SolicitudInscripcion) => {
        if (!torneoSeleccionado || !user) return;

        try {
            let idEquipoAInscribir = '';

            if (miEquipo && miEquipo.id) {
                idEquipoAInscribir = miEquipo.id;
            } else {
                const nombresJugadores = solicitud.integrantes.map(j => j.nombre);
                const nuevoEquipo = await crearEquipo(
                    solicitud.nombreEquipo, 
                    nombresJugadores, 
                    solicitud.logoUrl 
                );
                idEquipoAInscribir = nuevoEquipo.id;
            }

            await inscribirEquipoEnTorneo(idEquipoAInscribir, torneoSeleccionado.id);

            alert('¡Inscripción realizada con éxito!');
            handleCloseModal();
            navigate('/perfil/mi-equipo');

        } catch (error: any) {
            console.error("Error en inscripción:", error);
            alert('Error al procesar: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div>
            <HeaderNav />
            <div className="content-container">
                <h2>Torneos Abiertos a Inscripción</h2>
                
                {torneosDisponibles.length === 0 && <p>Cargando torneos disponibles...</p>}

                {torneosDisponibles.map(torneo => (
                    <div key={torneo.id} className="card-inscripcion-torneo">
                        <div className="torneo-info">
                            <h3>{torneo.nombre} ({torneo.deporte})</h3>
                            <p><strong>Límite:</strong> {torneo.fechaLimiteInscripcion}</p>
                            <p><strong>Jugadores:</strong> Min {torneo.minJugadores} - Max {torneo.maxJugadores}</p>
                        </div>
                        <div className="torneo-actions">
                            {/* Renderizado condicional estricto para Capitanes */}
                            {esCapitan ? (
                                <button 
                                    className="btn-primary" 
                                    onClick={() => handleInscribirClick(torneo)}
                                >
                                    {miEquipo ? 'Inscribir Mi Equipo' : 'Crear Equipo e Inscribir'}
                                </button>
                            ) : (
                                <button 
                                    className="btn-primary disabled"
                                    onClick={() => !isLoggedIn && navigate('/login')}
                                    disabled={isLoggedIn && !esCapitan}
                                >
                                    {isLoggedIn ? 'Solo Capitanes' : 'Inicia Sesión para Inscribir'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
            
            {torneoSeleccionado && (
                <FormularioInscripcion
                    torneo={torneoSeleccionado}
                    equipoAEditar={miEquipo} 
                    onClose={handleCloseModal}
                    onSuccess={handleProcessInscripcion}
                />
            )}
        </div>
    );
};

export default InscripcionesPage;