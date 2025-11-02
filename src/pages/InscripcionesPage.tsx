// src/pages/InscripcionesPage.tsx

import React, { useState } from 'react';
import HeaderNav from '../components/HeaderNav'; 
import FormularioInscripcion from '../components/FormularioInscripcion';
import { useAuth } from '../context/AuthContext'; // Para verificar si es estudiante/capitán
import type { Torneo } from '../types'; 
import { useNavigate } from 'react-router-dom';
import './InscripcionesPage.css';

// Datos mock de torneos disponibles para inscripción
const mockTorneosDisponibles: Torneo[] = [
    { id: 101, nombre: 'Fútbol Apertura 2026', deporte: 'FÚTBOL', lugar: 'Canchas FIF', minJugadores: 8, maxJugadores: 12, fechaInicio: '2026-03-01', fechaFin: '2026-05-30', fechaLimiteInscripcion: '2026-02-15', descripcion: 'Torneo regular de la facultad.', detalles: 'Abierto a todos.', reglas: 'Reglas FIFA.' },
    { id: 102, nombre: 'Baloncesto Relámpago', deporte: 'BALONCESTO', lugar: 'Gimnasio', minJugadores: 5, maxJugadores: 8, fechaInicio: '2026-04-10', fechaFin: '2026-04-20', fechaLimiteInscripcion: '2026-03-30', descripcion: 'Torneo rápido de 3 contra 3.', detalles: 'Solo equipos de la FIF.', reglas: 'Reglas FIBA.' },
    // Asumimos que aquí solo se listan los torneos con inscripción abierta
];


const InscripcionesPage: React.FC = () => {
    const { isLoggedIn, user } = useAuth();
    const navigate = useNavigate();
    
    // Estado para controlar el modal de inscripción
    const [modalAbierto, setModalAbierto] = useState(false);
    // Estado para guardar la información del torneo seleccionado (para pasar al formulario)
    const [torneoSeleccionado, setTorneoSeleccionado] = useState<Torneo | null>(null);

    // Determina si el usuario es un estudiante/capitán y puede inscribir
    const puedeInscribir = isLoggedIn && user?.rol === 'estudiante'; 

    const handleInscribirClick = (torneo: Torneo) => {
        if (!puedeInscribir) {
            alert('Debes iniciar sesión como estudiante para inscribir un equipo.');
            return;
        }
        setTorneoSeleccionado(torneo);
        setModalAbierto(true);
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
                            <p><strong>Jugadores Requeridos:</strong> {torneo.minJugadores} - {torneo.maxJugadores}</p>
                        </div>

                        <div className="torneo-actions">
                            {/* Renderizado condicional del botón de acción */}
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

            {/* Modal de Inscripción */}
            {modalAbierto && torneoSeleccionado && (
                <FormularioInscripcion
                    idTorneo={torneoSeleccionado.id}
                    minJugadores={torneoSeleccionado.minJugadores}
                    maxJugadores={torneoSeleccionado.maxJugadores}
                    onClose={() => setModalAbierto(false)}
                    onSuccess={() => setModalAbierto(false)}
                />
            )}
        </div>
    );
};

export default InscripcionesPage;