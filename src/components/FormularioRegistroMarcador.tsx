// src/components/FormularioRegistroMarcador.tsx

import React, { useState, useEffect } from 'react';
import type { Partido } from '../types';
import './FormularioRegistroMarcador.css'; 
import { FaPaperPlane } from 'react-icons/fa';

interface MarcadorProps {
    partido: Partido;
    onFinalizar: (marcadorLocal: number, marcadorVisitante: number) => void;
    onUpdate?: (data: any) => void;
}

const FormularioRegistroMarcador: React.FC<MarcadorProps> = ({ partido, onFinalizar }) => {
    
    const storageKey = `marcador_partido_${partido.id}`;

    // Estado inicial seguro
    const [marcadorLocal, setMarcadorLocal] = useState<number>(() => {
        const saved = localStorage.getItem(storageKey);
        return saved ? Number(JSON.parse(saved).local) : (partido.marcadorLocal || 0);
    });

    const [marcadorVisitante, setMarcadorVisitante] = useState<number>(() => {
        const saved = localStorage.getItem(storageKey);
        return saved ? Number(JSON.parse(saved).visitante) : (partido.marcadorVisitante || 0);
    });

    // Guardar cambios automáticamente en navegador
    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify({ 
            local: marcadorLocal, 
            visitante: marcadorVisitante 
        }));
    }, [marcadorLocal, marcadorVisitante, storageKey]);

    const handleScoreChange = (equipo: 'local' | 'visitante', delta: number) => {
        if (equipo === 'local') {
            setMarcadorLocal(prev => Math.max(0, prev + delta));
        } else {
            setMarcadorVisitante(prev => Math.max(0, prev + delta));
        }
    };

    const handleEnviar = () => {
        const mensaje = `¿Confirmas enviar este resultado final?\n\n${partido.equipoLocal.nombre}: ${marcadorLocal}\n${partido.equipoVisitante.nombre}: ${marcadorVisitante}`;
        
        if (window.confirm(mensaje)) {
            onFinalizar(marcadorLocal, marcadorVisitante);
            // No borramos el storage inmediatamente por si falla el envío, 
            // lo ideal es que el padre lo limpie al tener éxito o redirigir.
            localStorage.removeItem(storageKey);
        }
    };

    return (
        <div className="marcador-control-box">
            <h3>Control de Juego</h3>
            <p className="vs-title">{partido.equipoLocal.nombre} vs {partido.equipoVisitante.nombre}</p>
            
            {/* VISOR */}
            <div className="marcador-display">
                <div className="score-group">
                    <span className="team-name-display">{partido.equipoLocal.nombre}</span>
                    <div className="score-equipo">{marcadorLocal}</div>
                </div>
                
                <div className="separator-marcador">-</div>
                
                <div className="score-group">
                    <span className="team-name-display">{partido.equipoVisitante.nombre}</span>
                    <div className="score-equipo">{marcadorVisitante}</div>
                </div>
            </div>

            <hr className="divider"/>

            {/* CONTROLES DE PUNTAJE */}
            <div className="score-controles">
                <div className="control-local">
                    <button className="btn-score btn-blue" onClick={() => handleScoreChange('local', 1)}>+1</button>
                    <button className="btn-score btn-blue-outline" onClick={() => handleScoreChange('local', -1)}>-1</button>
                </div>

                <div className="control-visitante">
                    <button className="btn-score btn-blue" onClick={() => handleScoreChange('visitante', 1)}>+1</button>
                    <button className="btn-score btn-blue-outline" onClick={() => handleScoreChange('visitante', -1)}>-1</button>
                </div>
            </div>

            {/* ACCIÓN FINAL */}
            <div className="juego-controles">
                <button 
                    onClick={handleEnviar} 
                    className="btn-enviar"
                    title="Guardar resultado final"
                >
                    <FaPaperPlane /> ENVIAR RESULTADO
                </button>
            </div>
        </div>
    );
};

export default FormularioRegistroMarcador;