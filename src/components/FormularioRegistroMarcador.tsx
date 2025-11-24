import React, { useState, useEffect, useRef } from 'react';
import type { Partido } from '../types';
import './FormularioRegistroMarcador.css'; 
import { FaPlay, FaPause, FaFlagCheckered, FaArrowRight } from 'react-icons/fa';
// 1. Importamos el servicio para iniciar el partido
import { iniciarPartido } from '../services/partidosService';

interface MarcadorProps {
    partido: Partido;
    onFinalizar: (marcadorLocal: number, marcadorVisitante: number) => void;
    onUpdate: (data: { marcadorLocal: number, marcadorVisitante: number, tiempo: string, periodo: string }) => void;
}

// --- LÓGICA DE CONTROL DE PERIODO ---
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
                nombre: 'Set / Entrada', 
                total: Infinity, 
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
    
    // --- LÓGICA DE ESTADO ---
    const [marcadorLocal, setMarcadorLocal] = useState(partido.marcadorLocal || 0);
    const [marcadorVisitante, setMarcadorVisitante] = useState(partido.marcadorVisitante || 0);
    const [isRunning, setIsRunning] = useState(partido.estado === 'EN PROCESO');
    
    // Configuración dinámica basada en el deporte
    const configDeporte = getPeriodoConfig(partido.Deporte);
    const [periodoActual, setPeriodoActual] = useState(1);
    
    const [segundos, setSegundos] = useState(0); 
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Lógica del Cronómetro
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

    // --- LÓGICA DE PERIODO ---
    const handleNextPeriodo = () => {
        if (periodoActual < configDeporte.total) { 
            setPeriodoActual(prev => prev + 1);
            setSegundos(0); 
            setIsRunning(false); 
        } else if (configDeporte.total === Infinity) {
            setPeriodoActual(prev => prev + 1);
            setSegundos(0);
            setIsRunning(false);
        }
    };

    // --- 2. NUEVA LÓGICA PARA INICIAR/PAUSAR ---
    const toggleTimer = async () => {
        // Si el cronómetro está detenido y el partido sigue marcado como 'POR INICIAR' en la BD,
        // significa que es el primer inicio. Llamamos a la API para cambiar el estado.
        if (!isRunning && partido.estado === 'POR INICIAR') {
            try {
                await iniciarPartido(partido.id);
                console.log("Partido iniciado en base de datos");
            } catch (e) { 
                console.error("Error al iniciar partido:", e); 
                alert("No se pudo actualizar el estado del partido en el servidor.");
            }
        }
        // Alternar estado del cronómetro local
        setIsRunning(!isRunning);
    };

    const estaEnUltimoPeriodo = periodoActual === configDeporte.total;

    return (
        <div className="marcador-control-box">
            <h3>Control de Juego: {partido.equipoLocal.nombre} vs {partido.equipoVisitante.nombre}</h3>
            
            {/* Visor de Marcador */}
            <div className="marcador-display">
                <div className="score-equipo">{marcadorLocal}</div>
                <div className="separator-marcador">-</div>
                <div className="score-equipo">{marcadorVisitante}</div>
            </div>

            {/* --- Visor de Tiempo y Periodo --- */}
            <div className="tiempo-control">
                <span className="cuarto-display">
                    {configDeporte.nombre.toUpperCase()} {periodoActual}
                    {configDeporte.total !== Infinity && ` / ${configDeporte.total}`}
                </span>
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

            {/* --- Controles de Juego --- */}
            <div className="juego-controles">
                <button 
                    onClick={toggleTimer} // <--- 3. Usamos la nueva función aquí
                    className={isRunning ? 'btn-pause' : 'btn-start'}
                >
                    {isRunning ? <FaPause /> : <FaPlay />}
                    {isRunning ? 'PAUSAR' : 'INICIAR TIEMPO'}
                </button>
                
                <button 
                    onClick={handleNextPeriodo} 
                    disabled={isRunning || estaEnUltimoPeriodo} 
                    className="btn-next"
                >
                    <FaArrowRight />
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