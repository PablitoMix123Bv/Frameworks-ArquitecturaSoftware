// src/pages/MiEquipoDashboard.tsx

import React, { useEffect, useState } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import type { Equipo, SolicitudInscripcion } from '../types'; 
import './MiEquipoDashboard.css';

// Datos mock para simular la data del equipo del capitán
const mockEquipoCapitan: Equipo = {
    id: 1, nombre: 'Hunters', logoUrl: '/img/hunters.png', facultad: 'Ingeniería', 
    victorias: 5, derrotas: 1, empates: 2, puntos: 17, jugadores: ['Juan P. (Capitán)', 'Ana L.', 'Carlos M.'],
    // Añadimos campos del torneo para visualización
    deporte: 'FÚTBOL', minJugadores: 8, maxJugadores: 12, reglas: 'Reglas estándar.',
};

// Estado simulado de la solicitud de inscripción
const mockSolicitud: Partial<SolicitudInscripcion> & { estado: 'Aprobado' | 'Pendiente' | 'Rechazado', motivo?: string } = {
    estado: 'Pendiente', 
    nombreEquipo: 'Hunters',
};

const MiEquipoDashboard: React.FC = () => {
    // Aquí, en una aplicación real, se cargaría el ID del equipo asociado al usuario logueado.
    const [equipo, setEquipo] = useState<Equipo | null>(null);
    const [solicitud, setSolicitud] = useState(mockSolicitud);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulación de carga de datos del equipo (llamada a la API)
        setTimeout(() => {
            setEquipo(mockEquipoCapitan);
            setIsLoading(false);
        }, 800);
    }, []);

    if (isLoading) {
        return <p>Cargando información del equipo...</p>;
    }

    if (!equipo) {
        return <p>Aún no estás asociado a un equipo. ¡Crea o únete a uno!</p>;
    }

    // Lógica para mostrar el mensaje de estado de la solicitud
    const renderEstadoInscripcion = () => {
        switch (solicitud.estado) {
            case 'Aprobado':
                return <div className="estado-aprobado">✅ Inscripción Aprobada para el Torneo de {equipo.deporte}.</div>;
            case 'Rechazado':
                return (
                    <div className="estado-rechazado">
                        ❌ Solicitud Rechazada. Motivo: **{solicitud.motivo || 'Revisar datos de jugadores/logo.'}**
                        <button className="btn-secondary">Editar y Reenviar</button>
                    </div>
                );
            case 'Pendiente':
            default:
                return <div className="estado-pendiente">⏳ Solicitud Pendiente de Revisión por el Coordinador.</div>;
        }
    };

    return (
        <div>
            <HeaderNav />
            <div className="content-container mi-equipo-dashboard">
                <h1>Dashboard de Equipo: {equipo.nombre}</h1>
                <p className="sub-header">Gestión y seguimiento de tu equipo como capitán.</p>

                {/* 1. SECCIÓN DE ESTADO DE INSCRIPCIÓN */}
                <section className="estado-section">
                    <h3>Estado de Inscripción</h3>
                    {renderEstadoInscripcion()}
                </section>

                <div className="dashboard-grid">
                    {/* 2. SECCIÓN DE ROSTER Y DATOS */}
                    <section className="roster-section card-info">
                        <h3>Lista de Jugadores ({equipo.jugadores.length}/{equipo.maxJugadores})</h3>
                        <ul>
                            {equipo.jugadores.map((jugador, index) => (
                                <li key={index}>{jugador}</li>
                            ))}
                        </ul>
                        <button className="btn-secondary">Gestionar Roster</button>
                    </section>
                    
                    {/* 3. SECCIÓN DE ESTADÍSTICAS Y PRÓXIMO JUEGO */}
                    <section className="stats-section card-info">
                        <h3>Próximo Partido & Estadísticas</h3>
                        <p><strong>Puntos:</strong> {equipo.puntos}</p>
                        <p><strong>Récord (V/D/E):</strong> {equipo.victorias} / {equipo.derrotas} / {equipo.empates}</p>
                        <hr/>
                        <p><strong>Próximo Partido:</strong> Miércoles 15 Nov, 7:00 PM</p>
                        <p>VS **Astros** en Cancha B.</p>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MiEquipoDashboard;