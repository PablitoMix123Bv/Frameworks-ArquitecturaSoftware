// src/pages/PanelArbitro.tsx

import React, { useState, useEffect } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Partido } from '../types'; 
import './PanelArbitro.css'; 

// Datos mock para simular los partidos asignados al árbitro para hoy
const mockPartidosAsignados: Partido[] = [
    { id: 10, equipoLocal: { nombre: 'Hunters', logoUrl: '' }, equipoVisitante: { nombre: 'Astros', logoUrl: '' }, estado: 'POR INICIAR', marcadorLocal: null, marcadorVisitante: null },
    { id: 11, equipoLocal: { nombre: 'Águilas', logoUrl: '' }, equipoVisitante: { nombre: 'Tigres', logoUrl: '' }, estado: 'EN PROCESO', marcadorLocal: 1, marcadorVisitante: 0 },
];

const PanelArbitro: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [partidos, setPartidos] = useState<Partido[]>([]);

    useEffect(() => {
        // Simulación de carga de partidos asignados al árbitro (user.email)
        setPartidos(mockPartidosAsignados);
    }, []);

    const handleControlPartido = (idPartido: number) => {
        // Navega a la interfaz de control en tiempo real
        navigate(`/arbitro/juego/${idPartido}`);
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
                        <div key={p.id} className={`card-partido-arbitro estado-${p.estado.toLowerCase().replace(' ', '-')}`}>
                            <div className="partido-info-resumen">
                                <h4>{p.equipoLocal.nombre} vs {p.equipoVisitante.nombre}</h4>
                                <p>Estado: **{p.estado}**</p>
                            </div>
                            <button 
                                className="btn-primary" 
                                onClick={() => handleControlPartido(p.id)}
                            >
                                {p.estado === 'FINALIZADO' ? 'Ver Reporte' : 'Iniciar/Continuar Control'}
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