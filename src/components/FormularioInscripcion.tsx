// src/components/FormularioInscripcion.tsx

import React, { useState, useEffect } from 'react';
import type { FormularioInscripcionProps, SolicitudInscripcion, Equipo } from '../types'; 
import { getMisEquipos } from '../services/inscripcionesService';
import { useAuth } from '../context/AuthContext';
import './FormularioInscripcion.css'; 

// Nota: Reutilizamos la prop 'equipoAEditar' como 'equipoPreseleccionado' si es necesario, 
// pero la lógica principal es cargar la lista.

const FormularioInscripcion: React.FC<FormularioInscripcionProps> = ({ torneo, onClose, onSuccess }) => {
    const { user } = useAuth();
    const [misEquipos, setMisEquipos] = useState<Equipo[]>([]);
    const [equipoSeleccionado, setEquipoSeleccionado] = useState<string>('');
    const [loading, setLoading] = useState(true);

    // Cargar equipos del capitán
    useEffect(() => {
        const fetchEquipos = async () => {
            if (user) {
                const data = await getMisEquipos(user.id);
                // Filtramos: Solo equipos que NO estén ya inscritos en este torneo (opcional, pero recomendado)
                // Por simplicidad mostramos todos los equipos propios.
                setMisEquipos(data.map(d => d.equipo));
            }
            setLoading(false);
        };
        fetchEquipos();
    }, [user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!equipoSeleccionado) return;

        const equipo = misEquipos.find(e => e.id === equipoSeleccionado);
        if (!equipo) return;

        // Construimos la solicitud con los datos del equipo existente
        const solicitud: SolicitudInscripcion = {
            idTorneo: torneo.id,
            nombreEquipo: equipo.nombre, // Se envía para referencia, pero el backend usa el ID
            logoUrl: equipo.logoUrl || '',
            integrantes: [], // El backend ya tiene los integrantes en la tabla Equipo
            fechaSolicitud: new Date().toISOString()
        };
        
        // Pasamos el ID real del equipo para que el padre llame al servicio
        // Hack: Añadimos una propiedad temporal al objeto solicitud o manejamos la lógica en el padre.
        // Lo ideal es pasar el objeto completo.
        // Para mantener compatibilidad con tu tipo, asumimos que el padre manejará la inscripción por ID de equipo.
        onSuccess({ ...solicitud, nombreEquipo: equipo.id }); // Enviamos ID en nombre para que el padre lo capture
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content-unified"> {/* Estilo moderno */}
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                
                <div className="modal-header">
                    <h2>Inscribirse al Torneo</h2>
                    <p style={{color: '#666', margin: 0}}>{torneo.nombre}</p>
                </div>
                
                {loading ? <p>Cargando tus equipos...</p> : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Selecciona tu Equipo:</label>
                            {misEquipos.length === 0 ? (
                                <div style={{padding: 20, textAlign: 'center', background: '#f9f9f9', borderRadius: 8}}>
                                    <p>No tienes equipos registrados.</p>
                                    <p style={{fontSize: '0.9rem'}}>Ve a "Mi Equipo" para crear uno primero.</p>
                                </div>
                            ) : (
                                <select 
                                    className="form-control"
                                    value={equipoSeleccionado} 
                                    onChange={(e) => setEquipoSeleccionado(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>-- Elige un equipo --</option>
                                    {misEquipos.map(eq => (
                                        <option key={eq.id} value={eq.id}>
                                            {eq.nombre} ({eq.deporte || 'General'})
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {misEquipos.length > 0 && (
                            <button type="submit" className="btn-primary" style={{width: '100%'}}>
                                Confirmar Inscripción
                            </button>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
};

export default FormularioInscripcion;