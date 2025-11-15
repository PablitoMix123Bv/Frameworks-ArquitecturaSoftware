// src/pages/ReportePartidoPage.tsx (NUEVO ARCHIVO)

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import type { Partido } from '../types';
import './ReportePartidoPage.css'; // Crearemos este CSS

// Mock de todos los partidos (simulando la BD)
const mockPartidosRepo: Partido[] = [
    { id: 10, equipoLocal: { nombre: 'Hunters', logoUrl: '/img/logo1.png' }, equipoVisitante: { nombre: 'Astros', logoUrl: '/img/logo2.png' }, estado: 'POR INICIAR', marcadorLocal: null, marcadorVisitante: null, Deporte: 'FUTBOL' },
    { id: 11, equipoLocal: { nombre: 'Águilas', logoUrl: '/img/logo5.png' }, equipoVisitante: { nombre: 'Tigres', logoUrl: '/img/logo6.png' }, estado: 'EN PROCESO', marcadorLocal: 1, marcadorVisitante: 0, Deporte: 'FUTBOL' },
    { id: 12, equipoLocal: { nombre: 'Leones', logoUrl: '/img/logo_placeholder.png' }, equipoVisitante: { nombre: 'Pythons', logoUrl: '/img/logo4.png' }, estado: 'FINALIZADO', marcadorLocal: 3, marcadorVisitante: 2, Deporte: 'FUTBOL' },
];

const ReportePartidoPage: React.FC = () => {
    const { idPartido } = useParams<{ idPartido: string }>();
    const [partido, setPartido] = useState<Partido | null>(null);

    useEffect(() => {
        // Buscamos el partido en nuestro mock
        const idNum = parseInt(idPartido || '0');
        const partidoEncontrado = mockPartidosRepo.find(p => p.id === idNum);
        
        if (partidoEncontrado) {
            setPartido(partidoEncontrado);
        } else {
            console.error("No se encontró el reporte para el partido ID:", idPartido);
        }
    }, [idPartido]);

    if (!partido) {
        return (
            <div>
                <HeaderNav />
                <div className="content-container">
                    <h2>Cargando reporte...</h2>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <HeaderNav />
            <div className="content-container">
                <div className="reporte-card">
                    <div className="reporte-header">
                        <h2>Reporte de Partido (Finalizado)</h2>
                        <span className="reporte-deporte">{partido.Deporte}</span>
                    </div>
                    
                    <div className="reporte-equipos">
                        {/* Equipo Local */}
                        <div className="equipo-col">
                            <img src={partido.equipoLocal.logoUrl} alt={partido.equipoLocal.nombre} className="equipo-logo-reporte" />
                            <h3>{partido.equipoLocal.nombre}</h3>
                            <span className="marcador-final local">{partido.marcadorLocal}</span>
                        </div>

                        <span className="vs-reporte">VS</span>

                        {/* Equipo Visitante */}
                        <div className="equipo-col">
                            <img src={partido.equipoVisitante.logoUrl} alt={partido.equipoVisitante.nombre} className="equipo-logo-reporte" />
                            <h3>{partido.equipoVisitante.nombre}</h3>
                            <span className="marcador-final visitante">{partido.marcadorVisitante}</span>
                        </div>
                    </div>
                    
                    <div className="reporte-footer">
                        <p>Partido ID: {partido.id} | Arbitrado por: (Nombre del Árbitro)</p>
                        <Link to="/public/resultados" className="btn-primary">Volver a Resultados</Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ReportePartidoPage;