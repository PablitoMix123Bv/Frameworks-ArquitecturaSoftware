// src/pages/PerfilJugadorPage.tsx

import React, { useState, useEffect } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import './PerfilJugadorPage.css';

// Interfaz mínima para datos de jugador
interface JugadorPerfil {
    id: number;
    nombre: string;
    expediente: string;
    edad: number;
    equipoActual: string;
    rolEquipo: string;
    partidosJugados: number;
    maximoGoles: number; // Estadísticas ficticias
}

const mockJugador: JugadorPerfil = {
    id: 42,
    nombre: 'Juan Pérez García',
    expediente: '183456',
    edad: 22,
    equipoActual: 'Hunters - Fútbol',
    rolEquipo: 'Capitán',
    partidosJugados: 5,
    maximoGoles: 7,
};


const PerfilJugadorPage: React.FC = () => {
    // En una aplicación real, aquí usarías el ID del usuario logueado o el ID de la URL
    const { user } = useAuth();
    const { jugadorId } = useParams<{ jugadorId: string }>();
    
    const [perfil, setPerfil] = useState<JugadorPerfil | null>(null);

    useEffect(() => {
        // Simulación de la carga del perfil del jugador
        setTimeout(() => {
            setPerfil(mockJugador);
        }, 500);
    }, [jugadorId]);


    if (!perfil) {
        return (
            <div>
                <HeaderNav />
                <div className="content-container">Cargando perfil...</div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <HeaderNav />
            <div className="content-container perfil-jugador-page">
                
                <div className="perfil-header-jugador">
                    <h1>{perfil.nombre}</h1>
                    <p className="perfil-rol">{perfil.rolEquipo} del equipo **{perfil.equipoActual}**</p>
                </div>

                <div className="perfil-grid">
                    
                    {/* 1. Información Personal */}
                    <section className="seccion-info card-detalle">
                        <h3>Información de Contacto</h3>
                        <p><strong>Expediente:</strong> {perfil.expediente}</p>
                        <p><strong>Email:</strong> {user?.email || 'No disponible'}</p>
                        <p><strong>Edad:</strong> {perfil.edad}</p>
                        <button className="btn-primary edit-btn">Editar Perfil</button>
                    </section>
                    
                    {/* 2. Estadísticas Deportivas */}
                    <section className="seccion-stats card-detalle">
                        <h3>Estadísticas Recientes</h3>
                        <div className="stats-box">
                            <div className="stat-item">
                                <h4>{perfil.partidosJugados}</h4>
                                <p>PJ</p>
                            </div>
                            <div className="stat-item">
                                <h4>{perfil.maximoGoles}</h4>
                                <p>Goles / Puntos</p>
                            </div>
                            {/* Añadir más stats como Goles Contra, Asistencias, etc. */}
                            <div className="stat-item">
                                <h4>3</h4>
                                <p>Tarjetas Amarillas</p>
                            </div>
                        </div>
                    </section>
                </div>
                
                <section className="historial-seccion">
                    <h3>Historial de Torneos</h3>
                    <p>En este espacio se mostrarán los torneos en los que ha participado.</p>
                </section>
                
            </div>
            <Footer />
        </div>
    );
};

export default PerfilJugadorPage;