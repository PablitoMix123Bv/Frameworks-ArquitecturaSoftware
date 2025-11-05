// src/components/FormularioRegistroMarcador.tsx

import React, { useState, useEffect, useRef } from 'react';
import type { Partido } from '../types';
import './FormularioRegistroMarcador.css'; 

interface MarcadorProps {
    partido: Partido;
    onFinalizar: (marcadorLocal: number, marcadorVisitante: number) => void;
    // Función para simular el registro de tiempo/cuarto
    onUpdate: (data: { marcadorLocal: number, marcadorVisitante: number, tiempo: string, cuarto: number }) => void;
}

const FormularioRegistroMarcador: React.FC<MarcadorProps> = ({ partido, onFinalizar, onUpdate }) => {
    const [marcadorLocal, setMarcadorLocal] = useState(partido.marcadorLocal || 0);
    const [marcadorVisitante, setMarcadorVisitante] = useState(partido.marcadorVisitante || 0);
    const [isRunning, setIsRunning] = useState(partido.estado === 'EN PROCESO');
    const [cuartoActual, setCuartoActual] = useState(1);
    const [segundos, setSegundos] = useState(0); 
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Lógica del Cronómetro (Se ejecuta cada segundo si isRunning es true)
    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setSegundos(prev => prev + 1);
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        return () => { // Función de limpieza al desmontar
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRunning]);

    const formatTime = (totalSegundos: number) => {
        const min = Math.floor(totalSegundos / 60);
        const sec = totalSegundos % 60;
        return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    const handleScoreChange = (equipo: 'local' | 'visitante', delta: number) => {
        if (partido.estado === 'FINALIZADO') return;
        
        if (equipo === 'local') {
            setMarcadorLocal(prev => Math.max(0, prev + delta));
        } else {
            setMarcadorVisitante(prev => Math.max(0, prev + delta));
        }
        // Simular el envío de actualización al backend
        onUpdate({ marcadorLocal: marcadorLocal, marcadorVisitante: marcadorVisitante, tiempo: formatTime(segundos), cuarto: cuartoActual });
    };

    const handleNextCuarto = () => {
        if (cuartoActual < 4) { // Límite de 4 cuartos/tiempos
            setCuartoActual(prev => prev + 1);
            setSegundos(0); // Reiniciar tiempo para el nuevo cuarto
            setIsRunning(false); // Pausar automáticamente al finalizar un cuarto
        }
    };

    return (
        <div className="marcador-control-box">
            <h3>Control de Juego: {partido.equipoLocal.nombre} vs {partido.equipoVisitante.nombre}</h3>
            
            {/* Visor de Marcador */}
            <div className="marcador-display">
                <div className="score-equipo">{marcadorLocal}</div>
                <div className="separator-marcador">-</div>
                <div className="score-equipo">{marcadorVisitante}</div>
            </div>

            {/* Visor de Tiempo y Cuarto */}
            <div className="tiempo-control">
                <span className="cuarto-display">CUARTO {cuartoActual}/4</span>
                <span className="tiempo-display">{formatTime(segundos)}</span>
            </div>

            {/* Controles de Puntaje */}
            <div className="score-controles">
                <div className="control-local">
                    <button onClick={() => handleScoreChange('local', 1)}>+1</button>
                    <button onClick={() => handleScoreChange('local', -1)}>-1</button>
                </div>
                <div className="control-visitante">
                    <button onClick={() => handleScoreChange('visitante', 1)}>+1</button>
                    <button onClick={() => handleScoreChange('visitante', -1)}>-1</button>
                </div>
            </div>

            {/* Controles de Tiempo y Juego */}
            <div className="juego-controles">
                <button 
                    onClick={() => setIsRunning(!isRunning)}
                    className={isRunning ? 'btn-pause' : 'btn-start'}
                >
                    {isRunning ? 'PAUSAR' : 'INICIAR TIEMPO'}
                </button>
                
                <button onClick={handleNextCuarto} disabled={isRunning} className="btn-next">
                    Siguiente Cuarto ({cuartoActual < 4 ? cuartoActual + 1 : 'Fin'})
                </button>
                
                <button 
                    onClick={() => onFinalizar(marcadorLocal, marcadorVisitante)} 
                    className="btn-finalizar"
                    disabled={partido.estado === 'FINALIZADO'}
                >
                    FINALIZAR PARTIDO
                </button>
            </div>
        </div>
    );
};

export default FormularioRegistroMarcador;