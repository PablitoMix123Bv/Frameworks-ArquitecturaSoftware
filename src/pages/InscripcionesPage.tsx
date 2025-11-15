// src/pages/InscripcionesPage.tsx (CORREGIDO)

import React, { useState } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import FormularioInscripcion from '../components/FormularioInscripcion'; 
import type { Torneo, SolicitudInscripcion } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './InscripcionesPage.css'; 

// (Los mocks se quedan igual)
const mockTorneosDisponibles: Torneo[] = [
    { id: 101, nombre: 'Torneo de Voleibol Apertura', deporte: 'VOLEIBOL', minJugadores: 6, maxJugadores: 10, fechaLimiteInscripcion: '2025-11-20', detalles: '', lugar: '', fechaInicio: '', fechaFin: '', reglas: '', descripcion: '' },
    { id: 102, nombre: 'Liga de Fútbol Rápido', deporte: 'FUTBOL', minJugadores: 7, maxJugadores: 12, fechaLimiteInscripcion: '2025-11-25', detalles: '', lugar: '', fechaInicio: '', fechaFin: '', reglas: '', descripcion: '' },
];

const InscripcionesPage: React.FC = () => {
    const [torneoSeleccionado, setTorneoSeleccionado] = useState<Torneo | null>(null);
    const { isLoggedIn, user } = useAuth();
    const navigate = useNavigate();
    
    // Solo permitimos inscribir si es jugador (capitán)
    const puedeInscribir = isLoggedIn && user?.rol === 'jugador';

    const handleInscribirClick = (torneo: Torneo) => {
        setTorneoSeleccionado(torneo);
    };

    const handleCloseModal = () => {
        setTorneoSeleccionado(null);
    };

    const handleSuccess = (solicitud: SolicitudInscripcion) => {
        handleCloseModal();
        // Opcional: Redirigir al dashboard del equipo
        navigate('/perfil/mi-equipo');
    };

    return (
        <div>
            <HeaderNav />
            <div className="content-container">
                <h2>Torneos Abiertos a Inscripción</h2>
                
                {mockTorneosDisponibles.map(torneo => (
                    <div key={torneo.id} className="card-inscripcion-torneo">
                        <div className="torneo-info">
                            <h3>{torneo.nombre} ({torneo.deporte})</h3>
                            <p><strong>Límite de Inscripción:</strong> {torneo.fechaLimiteInscripcion}</p>
                            <p><strong>Mínimo de jugadores:</strong> {torneo.minJugadores}</p>
                            <p><strong>Máximo de jugadores:</strong> {torneo.maxJugadores}</p>
                        </div>
                        <div className="torneo-actions">
                            {puedeInscribir ? (
                                <button 
                                    className="btn-primary" 
                                    onClick={() => handleInscribirClick(torneo)}
                                >
                                    Inscribir Equipo
                                </button>
                            ) : (
                                <button 
                                    className="btn-primary disabled"
                                    onClick={() => navigate('/login')}
                                >
                                    Iniciar Sesión para Inscribir
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
                    // --- 1. PASAMOS 'undefined' AQUI ---
                    equipoAEditar={undefined} 
                    onClose={handleCloseModal}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
};

export default InscripcionesPage;