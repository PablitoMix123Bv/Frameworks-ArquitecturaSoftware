// src/pages/PanelArbitro.tsx (CORREGIDO)

import React, { useState, useEffect } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Partido } from '../types'; 
import './PanelArbitro.css'; 

// --- 1. IMPORTAMOS LOS ICONOS ---
import { FaPlay, FaEye } from 'react-icons/fa';

// Datos mock 
const mockPartidosAsignados: Partido[] = [
    { id: 10, equipoLocal: { nombre: 'Hunters', logoUrl: '' }, equipoVisitante: { nombre: 'Astros', logoUrl: '' }, estado: 'POR INICIAR', marcadorLocal: null, marcadorVisitante: null , Deporte: 'FUTBOL'},
    { id: 11, equipoLocal: { nombre: 'Águilas', logoUrl: '' }, equipoVisitante: { nombre: 'Tigres', logoUrl: '' }, estado: 'EN PROCESO', marcadorLocal: 1, marcadorVisitante: 0 , Deporte: 'FUTBOL'},
    { id: 12, equipoLocal: { nombre: 'Leones', logoUrl: '' }, equipoVisitante: { nombre: 'Pythons', logoUrl: '' }, estado: 'FINALIZADO', marcadorLocal: 3, marcadorVisitante: 2 , Deporte: 'FUTBOL'},
];

const PanelArbitro: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [partidos, setPartidos] = useState<Partido[]>([]);

    useEffect(() => {
        setPartidos(mockPartidosAsignados);
    }, []);
        // Esta función ahora decide a dónde navegar
        const handleButtonClick = (partido: Partido) => {
            if (partido.estado === 'FINALIZADO') {
                // Si ya terminó, lo mandamos a la PÁGINA DE REPORTE PÚBLICA
                navigate(`/public/partido/${partido.id}`);
            } else {
                // Si está por iniciar o en proceso, lo mandamos al control de juego
                navigate(`/arbitro/juego/${partido.id}`);
            }
    };

    return (
        <div>
            <HeaderNav />
            <div className="content-container arbitro-dashboard">
                <h1>Panel de Control de Árbitro</h1>
                <p className="sub-header">Bienvenido, {user?.email}. Aquí están tus partidos programados para hoy.</p>
                
                <h2>Partidos Asignados</h2>
                <div className="partidos-asignados-list">
                    {partidos.map(p => (
                        // Usamos tus clases originales
                        <div key={p.id} className={`card-partido-arbitro estado-${p.estado.toLowerCase().replace(' ', '-')}`}>
                            
                            <div className="partido-info-resumen">
                                <h4>{p.equipoLocal.nombre} vs {p.equipoVisitante.nombre}</h4>
                                <p>Estado: **{p.estado}**</p>
                            </div>
                            
                            {/* --- 2. BOTÓN CON ICONO Y TEXTO SEPARADOS --- */}
                            <button 
                                className="btn-primary panel-arbitro-card__button" 
                                onClick={() => handleButtonClick(p)} // Pasamos el objeto 'p' completo
                            >
                                {p.estado === 'FINALIZADO' ? <FaEye /> : <FaPlay />}
                                <span>
                                    {p.estado === 'FINALIZADO' ? 'Ver Reporte' : 'Iniciar/Continuar Control'}
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PanelArbitro;