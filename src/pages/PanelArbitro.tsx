// src/pages/PanelArbitro.tsx

import React, { useState, useEffect } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Partido } from '../types'; 
import { getPartidos, updateMarcador } from '../services/partidosService'; // Importamos updateMarcador
import ModalMarcador from '../components/ModalMarcador'; // IMPORTAMOS EL MODAL NUEVO
import './PanelArbitro.css'; 
import { FaPlay, FaEye } from 'react-icons/fa';

const PanelArbitro: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [partidos, setPartidos] = useState<Partido[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Estado para controlar qué partido se está editando en el modal
    const [partidoSeleccionado, setPartidoSeleccionado] = useState<Partido | null>(null);

    const fetchPartidos = async () => {
        try {
            const data = await getPartidos();
            setPartidos(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPartidos();
    }, []);

    const handleAccion = (partido: Partido) => {
        if (partido.estado === 'FINALIZADO') {
            // Si ya terminó, ver reporte
            navigate(`/vista/partido/${partido.id}`); 
        } else {
            // Si no, ABRIR MODAL DE MARCADOR
            setPartidoSeleccionado(partido);
        }
    };

    const finalizarPartidoDesdeModal = async (local: number, visitante: number) => {
        if (!partidoSeleccionado) return;
        
        try {
            // Llamada al servicio real
            await updateMarcador(partidoSeleccionado.id, local, visitante);
            alert('Partido registrado correctamente.');
            // Recargamos la lista para ver el cambio de estado
            fetchPartidos();
        } catch (error: any) {
            alert('Error al registrar resultado: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div>
            <HeaderNav />
            <div className="content-container arbitro-dashboard">
                <div className="dashboard-header">
                    <div className="header-titles">
                        <h1>Panel de Árbitro</h1>
                        <p>Gestiona los partidos asignados.</p>
                    </div>
                </div>
                
                {isLoading ? <p>Cargando partidos...</p> : (
                    <div className="partidos-asignados-list">
                        {partidos.length === 0 && <p className="empty-msg">No hay partidos programados.</p>}
                        
                        {partidos.map(p => (
                            <div key={p.id} className={`card-partido-arbitro estado-${p.estado.toLowerCase().replace(' ', '-')}`}>
                                <div className="partido-info-resumen">
                                    <h4>{p.equipoLocal.nombre} <span style={{color:'#ccc'}}>vs</span> {p.equipoVisitante.nombre}</h4>
                                    <div className="meta-info">
                                            <span className={`status-badge ${p.estado === 'FINALIZADO' ? 'finalizado' : 'pendiente'}`}>
                                                {p.estado}
                                        </span>
                                        {/* Espacio visual seguro */}
                                        <span className="sport-info">{p.Deporte}</span>
                                    </div>
                                    <small>{p.lugar} • {new Date(p.fechaInicio).toLocaleString()}</small>
                                </div>
                                
                                <button 
                                    className={p.estado === 'FINALIZADO' ? 'btn-secondary' : 'btn-primary'} 
                                    style={{borderRadius: '20px', padding: '8px 20px'}}
                                    onClick={() => handleAccion(p)}
                                >
                                    {p.estado === 'FINALIZADO' ? <FaEye /> : <FaPlay />}
                                    <span style={{marginLeft: 8}}>
                                        {p.estado === 'FINALIZADO' ? 'Ver Reporte' : 'Registrar Resultado'}
                                    </span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />

            {/* Renderizado Condicional del Modal */}
            {partidoSeleccionado && (
                <ModalMarcador 
                    partido={partidoSeleccionado}
                    onClose={() => setPartidoSeleccionado(null)}
                    onFinalizar={finalizarPartidoDesdeModal}
                />
            )}
        </div>
    );
};

export default PanelArbitro;