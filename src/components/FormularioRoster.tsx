// src/components/FormularioRoster.tsx

import React, { useState } from 'react';
import type { Equipo } from '../types';
import { updateEquipo } from '../services/equiposService';
import './FormularioRoster.css'; 
import { FaTrash, FaUserShield, FaPlus } from 'react-icons/fa'; 

interface FormularioRosterProps {
    equipo: Equipo;
    onClose: () => void;
}

const FormularioRoster: React.FC<FormularioRosterProps> = ({ equipo, onClose }) => {
    
    const maxJugadores = 20; 

    const [jugadores, setJugadores] = useState<string[]>(equipo.jugadores || []);
    const [nombreNuevo, setNombreNuevo] = useState('');
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleAddJugador = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (jugadores.length >= maxJugadores) { 
            setError(`Límite alcanzado.`);
            return;
        }
        if (!nombreNuevo.trim()) return;

        const nuevaLista = [...jugadores, nombreNuevo.trim()];

        try {
            setIsSaving(true);
            await updateEquipo(equipo.id, { jugadores: nuevaLista });
            setJugadores(nuevaLista);
            setNombreNuevo('');
        } catch (err: any) {
            console.error(err);
            setError('Error al guardar.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemoveJugador = async (indice: number) => {
        if (indice === 0) {
            setError('No puedes eliminar al Capitán.');
            return;
        }
        if (!window.confirm('¿Eliminar a este jugador?')) return;

        const nuevaLista = jugadores.filter((_, i) => i !== indice);

        try {
            setIsSaving(true);
            await updateEquipo(equipo.id, { jugadores: nuevaLista });
            setJugadores(nuevaLista);
        } catch (err: any) {
            console.error(err);
            setError('Error al eliminar.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content-unified"> 
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                
                <div className="modal-header">
                    <h2>Gestión de Jugadores</h2>
                    <p style={{margin:0, color:'#666', fontSize:'0.9rem'}}>Equipo: <strong>{equipo.nombre}</strong></p>
                </div>
                
                <div className="roster-container">
                    <div className="roster-header-info">
                        <span>Total: {jugadores.length} / {maxJugadores}</span>
                    </div>
                    
                    <ul className="jugadores-list">
                        {jugadores.length === 0 && <li className="empty-msg">No hay jugadores registrados.</li>}
                        
                        {jugadores.map((jugador, index) => (
                            <li key={index} className={`jugador-item ${index === 0 ? 'capitan-item' : ''}`}>
                                <div className="jugador-info">
                                    {index === 0 ? (
                                        <>
                                            <FaUserShield className="capitan-icon" />
                                            <span className="jugador-nombre capitan-text">
                                                {jugador} <span className="badge-capitan">Capitán</span>
                                            </span>
                                        </>
                                    ) : (
                                        <span className="jugador-nombre">{jugador}</span>
                                    )}
                                </div>

                                {index !== 0 && (
                                    <button 
                                        className="btn-icon delete-action" 
                                        onClick={() => handleRemoveJugador(index)}
                                        disabled={isSaving}
                                        title="Eliminar jugador"
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* DISEÑO CORREGIDO: Input arriba, Botón azul abajo */}
                <form className="form-add-jugador-block" onSubmit={handleAddJugador}>
                    {error && <p className="error-text-small">{error}</p>}
                    
                    <div className="form-group">
                        <input 
                            type="text" 
                            className="form-control"
                            value={nombreNuevo} 
                            onChange={(e) => setNombreNuevo(e.target.value)} 
                            placeholder="Nombre del nuevo integrante..."
                            disabled={isSaving}
                            style={{width: '100%'}} /* Asegura ancho completo */
                        />
                    </div>
                    
                    <button type="submit" className="btn-primary full-width-btn" disabled={isSaving || !nombreNuevo}>
                        <FaPlus /> {isSaving ? 'Guardando...' : 'Añadir Integrante'}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default FormularioRoster;