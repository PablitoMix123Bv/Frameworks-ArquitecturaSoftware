// src/components/ModalMarcador.tsx

import React, { useState } from 'react';
import type { Partido } from '../types';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import './ModalMarcador.css'; // CSS Específico para este modal

interface ModalMarcadorProps {
    partido: Partido;
    onClose: () => void;
    onFinalizar: (local: number, visitante: number) => Promise<void>;
}

const ModalMarcador: React.FC<ModalMarcadorProps> = ({ partido, onClose, onFinalizar }) => {
    
    const [golesLocal, setGolesLocal] = useState(partido.marcadorLocal || 0);
    const [golesVisitante, setGolesVisitante] = useState(partido.marcadorVisitante || 0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const confirmar = window.confirm(
            `¿Confirmas el resultado final?\n\n${partido.equipoLocal.nombre}: ${golesLocal}\n${partido.equipoVisitante.nombre}: ${golesVisitante}`
        );

        if (!confirmar) return;

        setIsSubmitting(true);
        try {
            await onFinalizar(golesLocal, golesVisitante);
            onClose();
        } catch (error) {
            console.error(error);
            // El manejo de error visual lo puede hacer el padre o aquí
        } finally {
            setIsSubmitting(false);
        }
    };

    // Función auxiliar para el logo (misma lógica que en otros lados)
    const getLogoUrl = (url?: string) => {
        if (!url) return '/img/logo_placeholder.png';
        return url.startsWith('http') ? url : `http://localhost:3000/uploads/equipos/${url}`;
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content-marcador">
                <button className="modal-close-btn" onClick={onClose} disabled={isSubmitting}>
                    <FaTimes />
                </button>

                <div className="modal-header-center">
                    <h2>Registrar Resultado</h2>
                    <p className="sub-text">{partido.Deporte}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="matchup-container">
                        {/* LOCAL */}
                        <div className="team-column">
                            <img 
                                src={getLogoUrl(partido.equipoLocal.logoUrl)} 
                                alt={partido.equipoLocal.nombre} 
                                className="team-logo-lg"
                                onError={(e) => { e.currentTarget.src = '/img/logo_placeholder.png'; }}
                            />
                            <h3 className="team-name">{partido.equipoLocal.nombre}</h3>
                            
                            <div className="score-input-wrapper">
                                <button type="button" className="btn-adjust minus" onClick={() => setGolesLocal(Math.max(0, golesLocal - 1))}>-</button>
                                <input 
                                    type="number" 
                                    className="score-input" 
                                    value={golesLocal} 
                                    onChange={(e) => setGolesLocal(Math.max(0, parseInt(e.target.value) || 0))}
                                    min="0"
                                />
                                <button type="button" className="btn-adjust plus" onClick={() => setGolesLocal(golesLocal + 1)}>+</button>
                            </div>
                        </div>

                        <div className="vs-divider">VS</div>

                        {/* VISITANTE */}
                        <div className="team-column">
                            <img 
                                src={getLogoUrl(partido.equipoVisitante.logoUrl)} 
                                alt={partido.equipoVisitante.nombre} 
                                className="team-logo-lg"
                                onError={(e) => { e.currentTarget.src = '/img/logo_placeholder.png'; }}
                            />
                            <h3 className="team-name">{partido.equipoVisitante.nombre}</h3>
                            
                            <div className="score-input-wrapper">
                                <button type="button" className="btn-adjust minus" onClick={() => setGolesVisitante(Math.max(0, golesVisitante - 1))}>-</button>
                                <input 
                                    type="number" 
                                    className="score-input" 
                                    value={golesVisitante} 
                                    onChange={(e) => setGolesVisitante(Math.max(0, parseInt(e.target.value) || 0))}
                                    min="0"
                                />
                                <button type="button" className="btn-adjust plus" onClick={() => setGolesVisitante(golesVisitante + 1)}>+</button>
                            </div>
                        </div>
                    </div>

                    <div className="actions-footer">
                        <button type="submit" className="btn-primary btn-lg" disabled={isSubmitting}>
                            {isSubmitting ? 'Enviando...' : (
                                <> <FaCheckCircle /> Finalizar Partido </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalMarcador;