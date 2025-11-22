// src/pages/PanelArbitro.tsx

import React, { useState, useEffect } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Partido } from '../types'; 
import { getPartidos } from '../services/partidosService';
import './PanelArbitro.css'; 
import { FaPlay, FaEye } from 'react-icons/fa';

const PanelArbitro: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [partidos, setPartidos] = useState<Partido[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPartidos = async () => {
            const data = await getPartidos();
            // Filtramos para mostrar solo los NO finalizados o todos, según preferencia.
            // Mostraremos todos para que pueda ver historial también.
            setPartidos(data);
            setIsLoading(false);
        };
        fetchPartidos();
    }, []);

    const handleButtonClick = (partido: Partido) => {
        if (partido.estado === 'FINALIZADO') {
            navigate(`/public/partido/${partido.id}`); // Ver reporte
        } else {
            navigate(`/arbitro/juego/${partido.id}`); // Controlar juego
        }
    };

    return (
        <div>
            <HeaderNav />
            <div className="content-container arbitro-dashboard">
                <h1>Panel de Control de Árbitro</h1>
                <p className="sub-header">Bienvenido, {user?.email}. Partidos disponibles.</p>
                
                <h2>Listado de Partidos</h2>
                {isLoading ? <p>Cargando partidos...</p> : (
                    <div className="partidos-asignados-list">
                        {partidos.map(p => (
                            <div key={p.id} className={`card-partido-arbitro estado-${p.estado.toLowerCase().replace(' ', '-')}`}>
                                <div className="partido-info-resumen">
                                    <h4>{p.equipoLocal.nombre} vs {p.equipoVisitante.nombre}</h4>
                                    <p>Estado: <strong>{p.estado}</strong> | {p.Deporte}</p>
                                    <small>{p.lugar} - {p.fechaInicio}</small>
                                </div>
                                
                                <button 
                                    className="btn-primary panel-arbitro-card__button" 
                                    onClick={() => handleButtonClick(p)}
                                >
                                    {p.estado === 'FINALIZADO' ? <FaEye /> : <FaPlay />}
                                    <span>
                                        {p.estado === 'FINALIZADO' ? 'Ver Reporte' : 'Controlar'}
                                    </span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default PanelArbitro;