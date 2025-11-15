// src/components/FormularioRegistroMarcador.tsx (CORREGIDO)

import React, { useState, useEffect, useRef } from 'react';
import type { Partido } from '../types';
import './FormularioRegistroMarcador.css'; 
import { FaPlay, FaPause, FaFlagCheckered, FaArrowRight } from 'react-icons/fa'; // Importamos iconos

interface MarcadorProps {
    partido: Partido;
    onFinalizar: (marcadorLocal: number, marcadorVisitante: number) => void;
    onUpdate: (data: { marcadorLocal: number, marcadorVisitante: number, tiempo: string, periodo: string }) => void;
}

// --- LÓGICA DE CONTROL DE PERIODO (NUEVO) ---
const getPeriodoConfig = (deporte: string) => {
    switch (deporte.toUpperCase()) {
        case 'FUTBOL':
            return {
                nombre: 'Tiempo',
                total: 2,
                botonSiguiente: 'Medio Tiempo',
                botonFinal: 'Fin 2do Tiempo'
            };
        case 'BALONCESTO':
            return {
                nombre: 'Cuarto',
                total: 4,
                botonSiguiente: 'Siguiente Cuarto',
                botonFinal: 'Fin 4to Cuarto'
            };
        case 'VOLEIBOL':
        case 'BÉISBOL':
            return {
                nombre: 'Set / Entrada', // Simplificado
                total: Infinity, // No hay límite fijo
                botonSiguiente: 'Siguiente Set',
                botonFinal: 'Finalizar'
            };
        default:
            return {
                nombre: 'Periodo',
                total: 2,
                botonSiguiente: 'Siguiente Periodo',
                botonFinal: 'Finalizar'
            };
    }
};

const FormularioRegistroMarcador: React.FC<MarcadorProps> = ({ partido, onFinalizar, onUpdate }) => {
    
    // --- LÓGICA DE ESTADO (ACTUALIZADA) ---
    const [marcadorLocal, setMarcadorLocal] = useState(partido.marcadorLocal || 0);
    const [marcadorVisitante, setMarcadorVisitante] = useState(partido.marcadorVisitante || 0);
    const [isRunning, setIsRunning] = useState(partido.estado === 'EN PROCESO');
    
    // Configuración dinámica basada en el deporte
    const configDeporte = getPeriodoConfig(partido.Deporte);
    const [periodoActual, setPeriodoActual] = useState(1);
    
    const [segundos, setSegundos] = useState(0); 
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Lógica del Cronómetro (Se queda igual)
    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setSegundos(prev => prev + 1);
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        return () => { 
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
        
        let nuevoMarcadorLocal = marcadorLocal;
        let nuevoMarcadorVisitante = marcadorVisitante;

        if (equipo === 'local') {
            nuevoMarcadorLocal = Math.max(0, marcadorLocal + delta);
            setMarcadorLocal(nuevoMarcadorLocal);
        } else {
            nuevoMarcadorVisitante = Math.max(0, marcadorVisitante + delta);
            setMarcadorVisitante(nuevoMarcadorVisitante);
        }
        
        onUpdate({ 
            marcadorLocal: nuevoMarcadorLocal, 
            marcadorVisitante: nuevoMarcadorVisitante, 
            tiempo: formatTime(segundos), 
            periodo: `${configDeporte.nombre} ${periodoActual}`
        });
    };

    // --- LÓGICA DE PERIODO (ACTUALIZADA) ---
    const handleNextPeriodo = () => {
        if (periodoActual < configDeporte.total) { 
            setPeriodoActual(prev => prev + 1);
            setSegundos(0); // Reiniciar tiempo
            setIsRunning(false); // Pausar automáticamente
        } else if (configDeporte.total === Infinity) {
            // Para Voleibol/Béisbol, solo incrementa
            setPeriodoActual(prev => prev + 1);
            setSegundos(0);
            setIsRunning(false);
        }
        // Si ya está en el último periodo (ej. 4/4), no hace nada
    };

    const estaEnUltimoPeriodo = periodoActual === configDeporte.total;

    return (
        <div className="marcador-control-box">
            <h3>Control de Juego: {partido.equipoLocal.nombre} vs {partido.equipoVisitante.nombre}</h3>
            
            {/* Visor de Marcador (Sin cambios) */}
            <div className="marcador-display">
                <div className="score-equipo">{marcadorLocal}</div>
                <div className="separator-marcador">-</div>
                <div className="score-equipo">{marcadorVisitante}</div>
            </div>

            {/* --- Visor de Tiempo y Periodo (DINÁMICO) --- */}
            <div className="tiempo-control">
                <span className="cuarto-display">
                    {configDeporte.nombre.toUpperCase()} {periodoActual}
                    {configDeporte.total !== Infinity && ` / ${configDeporte.total}`}
                </span>
                <span className="tiempo-display">{formatTime(segundos)}</span>
            </div>

            {/* Controles de Puntaje (Sin cambios) */}
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

            {/* --- Controles de Juego (DINÁMICOS) --- */}
            <div className="juego-controles">
                <button 
                    onClick={() => setIsRunning(!isRunning)}
                    className={isRunning ? 'btn-pause' : 'btn-start'}
                >
                    {isRunning ? <FaPause /> : <FaPlay />}
                    {isRunning ? 'PAUSAR' : 'INICIAR TIEMPO'}
                </button>
                
                <button 
                    onClick={handleNextPeriodo} 
                    disabled={isRunning || estaEnUltimoPeriodo} // Deshabilitado si el tiempo corre o si es el último periodo
                    className="btn-next"
                >
                    <FaArrowRight />
                    {/* Botón dinámico */}
                    {estaEnUltimoPeriodo ? configDeporte.botonFinal : `${configDeporte.botonSiguiente} (${periodoActual + 1})`}
                </button>
                
                <button 
                    onClick={() => onFinalizar(marcadorLocal, marcadorVisitante)} 
                    className="btn-finalizar"
                    disabled={partido.estado === 'FINALIZADO'}
                >
                    <FaFlagCheckered />
                    FINALIZAR PARTIDO
                </button>
            </div>
        </div>
    );
};

export default FormularioRegistroMarcador;