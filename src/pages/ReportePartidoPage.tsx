// src/pages/ReportePartidoPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import type { Partido } from '../types';
import { getPartidoById } from '../services/partidosService';
import './ReportePartidoPage.css';

// Reutilizamos el componente visual de Avatar para mantener consistencia
const EquipoAvatar: React.FC<{ nombre: string; url: string }> = ({ nombre, url }) => {
    const [imgFailed, setImgFailed] = useState(false);
    
    const getInitials = (name: string) => {
        if (!name) return "SF";
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    const stringToColor = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
        const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        return '#' + '00000'.substring(0, 6 - c.length) + c;
    };

    if (!url || imgFailed) {
        return (
            <div style={{ 
                width: '100px', height: '100px', borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: stringToColor(nombre), color: 'white', 
                fontSize: '2.5rem', fontWeight: 'bold', margin: '0 auto 15px',
                border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}>
                {getInitials(nombre)}
            </div>
        );
    }

    return (
        <img 
            src={url} 
            alt={nombre} 
            className="equipo-logo-reporte" 
            onError={() => setImgFailed(true)}
        />
    );
};

const ReportePartidoPage: React.FC = () => {
    const { idPartido } = useParams<{ idPartido: string }>();
    const navigate = useNavigate();
    const [partido, setPartido] = useState<Partido | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDatos = async () => {
            if (idPartido) {
                try {
                    const data = await getPartidoById(idPartido);
                    setPartido(data);
                } catch (error) {
                    console.error("Error cargando partido", error);
                }
            }
            setLoading(false);
        };
        fetchDatos();
    }, [idPartido]);

    if (loading) return <div className="content-container">Cargando reporte...</div>;

    if (!partido) {
        return (
            <div>
                <HeaderNav />
                <div className="content-container">
                    <h2>Partido no encontrado</h2>
                    <button onClick={() => navigate('/vista/resultados')} className="btn-primary">Volver</button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <HeaderNav />
            <div className="content-container">
                {/* Botón Volver alineado a la izquierda */}
                <div style={{ marginBottom: '20px' }}>
                    <button onClick={() => navigate(-1)} className="btn-secondary">
                        ← Volver
                    </button>
                </div>

                <div className="reporte-card">
                    <div className="reporte-header">
                        <h2>Reporte Oficial</h2>
                        <span className="reporte-deporte">{partido.Deporte}</span>
                    </div>
                    
                    <div className="reporte-equipos">
                        {/* Equipo Local */}
                        <div className="equipo-col">
                            <EquipoAvatar nombre={partido.equipoLocal.nombre} url={partido.equipoLocal.logoUrl} />
                            <h3>{partido.equipoLocal.nombre}</h3>
                            <span className="marcador-final local">{partido.marcadorLocal ?? 0}</span>
                        </div>

                        {/* Centro: VS y Estado */}
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <span className="vs-reporte">VS</span>
                            
                            {/* CORRECCIÓN: Usamos la clase match-status-badge para el estilo correcto (Azul/Blanco) */}
                            <span className="match-status-badge">
                                {partido.estado}
                            </span>
                        </div>

                        {/* Equipo Visitante */}
                        <div className="equipo-col">
                            <EquipoAvatar nombre={partido.equipoVisitante.nombre} url={partido.equipoVisitante.logoUrl} />
                            <h3>{partido.equipoVisitante.nombre}</h3>
                            <span className="marcador-final visitante">{partido.marcadorVisitante ?? 0}</span>
                        </div>
                    </div>
                    
                    <div className="reporte-footer">
                        <p><strong>Lugar:</strong> {partido.lugar}</p>
                        <p><strong>Fecha:</strong> {new Date(partido.fechaInicio).toLocaleString()}</p>
                        {partido.jornada && <p style={{marginTop: '5px'}}>Jornada: {partido.jornada.numero}</p>}
                        <p style={{fontSize:'0.8rem', color:'#999', marginTop: '15px'}}>
                            ID de Partido: {partido.id}
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ReportePartidoPage;