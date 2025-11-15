// src/components/FormularioRoster.tsx (CORREGIDO)

import React, { useState } from 'react';
import type { Equipo } from '../types';
import './FormularioRoster.css'; 

interface FormularioRosterProps {
    equipo: Equipo;
    onClose: () => void;
}

const FormularioRoster: React.FC<FormularioRosterProps> = ({ equipo, onClose }) => {
    
    // CORRECCIÓN: Asignamos un valor por defecto si maxJugadores es undefined
    // Usamos Infinity (infinito) para no poner un límite si no está definido.
    const maxJugadores = equipo.maxJugadores || Infinity;

    const [jugadores, setJugadores] = useState(equipo.jugadores);
    const [nombreNuevo, setNombreNuevo] = useState('');
    const [expedienteNuevo, setExpedienteNuevo] = useState('');
    const [error, setError] = useState('');

    const handleAddJugador = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // CORRECCIÓN: Usamos la variable segura 'maxJugadores'
        if (jugadores.length >= maxJugadores) { 
            setError(`Límite alcanzado (${maxJugadores} jugadores).`);
            return;
        }
        if (!nombreNuevo || !expedienteNuevo) {
            setError('El nombre y el expediente son obligatorios.');
            return;
        }

        const nuevoJugador = `${nombreNuevo} (${expedienteNuevo})`;
        
        console.log(`Añadiendo a ${equipo.nombre}: ${nuevoJugador}`);
        setJugadores([...jugadores, nuevoJugador]);

        setNombreNuevo('');
        setExpedienteNuevo('');
    };

    const handleRemoveJugador = (indice: number) => {
        const jugadorARemover = jugadores[indice];
        if (jugadorARemover.includes('(Capitán)')) {
            setError('No puedes eliminar al capitán desde aquí.');
            return;
        }
        if (window.confirm(`¿Seguro que deseas eliminar a ${jugadorARemover}?`)) {
            console.log(`Eliminando a ${jugadorARemover} de ${equipo.nombre}`);
            setJugadores(jugadores.filter((_, i) => i !== indice));
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content-roster">
                <button className="modal-close-button" onClick={onClose}>&times;</button>
                <h2>Administrar Roster</h2>
                <h3>Equipo: {equipo.nombre} ({equipo.deporte})</h3>

                <div className="roster-list">
                    {/* CORRECCIÓN: Usamos la variable segura 'maxJugadores' */}
                    <h4>Jugadores Actuales ({jugadores.length}/{maxJugadores === Infinity ? 'Ilimitado' : maxJugadores})</h4>
                    
                    {jugadores.length === 0 && <p>Aún no hay jugadores.</p>}
                    <ul>
                        {jugadores.map((jugador, index) => (
                            <li key={index}>
                                <span>{jugador}</span>
                                {!jugador.includes('(Capitán)') && (
                                    <button 
                                        className="btn-remove-jugador" 
                                        onClick={() => handleRemoveJugador(index)}
                                    >
                                        &times;
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                <form className="form-add-jugador" onSubmit={handleAddJugador}>
                    <h4>Añadir Nuevo Jugador</h4>
                    {error && <p className="error-message">{error}</p>}
                    <div className="form-group-row">
                        <div className="form-group half">
                            <label htmlFor="nombreNuevo">Nombre Completo</label>
                            <input 
                                type="text" 
                                id="nombreNuevo" 
                                value={nombreNuevo} 
                                onChange={(e) => setNombreNuevo(e.target.value)} 
                            />
                        </div>
                        <div className="form-group half">
                            <label htmlFor="expedienteNuevo">Expediente</label>
                            <input 
                                type="text" 
                                id="expedienteNuevo"
                                value={expedienteNuevo}
                                onChange={(e) => setExpedienteNuevo(e.target.value)}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary">Añadir Jugador</button>
                </form>

            </div>
        </div>
    );
};

export default FormularioRoster;