// src/pages/AvisosPage.tsx

import React, { useState, useEffect } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer'; 
import CardAviso from '../components/CardAviso';
import FiltroDeporte from '../components/FiltroDeporte';
import type { Aviso } from '../types';
import { getAvisos } from '../services/avisosService'; // <--- SERVICIO REAL
import './AvisosPage.css';

const AvisosPage: React.FC = () => {
    const [avisos, setAvisos] = useState<Aviso[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('TODOS'); 

    useEffect(() => {
        const fetchAvisos = async () => {
            try {
                const data = await getAvisos();
                setAvisos(data);
            } catch (error) {
                console.error("Error al cargar avisos:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAvisos();
    }, []);
    
    // El filtro usa categorías, no deportes, así que ajustamos la lógica
    const avisosFiltrados = avisos.filter(aviso => {
        if (categoriaSeleccionada === 'TODOS') return true;
        // Asumimos que el filtro de deporte puede recibir las categorías del aviso
        return aviso.categoria === categoriaSeleccionada;
    });

    return (
        <div>
            <HeaderNav />
            <div className="content-container">
                <h2>Avisos y Comunicados Oficiales</h2>
                
                {/* Reutilizamos el Filtro para la Categoría */}
                <FiltroDeporte 
                    onFiltroChange={setCategoriaSeleccionada}
                    valorActual={categoriaSeleccionada}
                />
                
                {isLoading && <p>Cargando comunicados...</p>}

                <div className="avisos-list">
                    {avisosFiltrados.length === 0 && !isLoading && (
                        <p className="no-avisos-message">No hay avisos disponibles en esta categoría.</p>
                    )}
                    {avisosFiltrados.map(aviso => (
                        <CardAviso key={aviso.id} aviso={aviso} />
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AvisosPage;