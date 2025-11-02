// src/pages/AvisosPage.tsx

import React from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer'; 
import CardAviso from '../components/CardAviso'; // Componente que crearemos
import FiltroDeporte from '../components/FiltroDeporte'; // Reutilizamos el filtro para categorizar
import type { Aviso } from '../types';
import './AvisosPage.css';

const mockAvisos: Aviso[] = [
    { id: 1, titulo: '¡Inscripciones Abiertas! Torneo de Fútbol', contenido: 'Recuerden que el límite es el 15 de febrero.', fechaPublicacion: '2025-10-25', autor: 'Coordinador A', categoria: 'INSCRIPCIÓN', prioridad: 'URGENTE', idTorneoAsociado: 101 },
    { id: 2, titulo: 'Reglas para el uso de Canchas', contenido: 'La cancha A solo puede usarse después de las 5 PM.', fechaPublicacion: '2025-10-20', autor: 'Coordinador B', categoria: 'GENERAL', prioridad: 'NORMAL', idTorneoAsociado: null },
    { id: 3, titulo: 'Cambio de Horario - Partido Pythons vs Castrosos', contenido: 'El partido de mañana se mueve a las 6 PM.', fechaPublicacion: '2025-10-27', autor: 'Coordinador A', categoria: 'TORNEO', prioridad: 'NORMAL', idTorneoAsociado: 102 },
];

const AvisosPage: React.FC = () => {
    // Para simplificar, usamos un filtro simple para la categoría
    const [categoriaSeleccionada, setCategoriaSeleccionada] = React.useState('TODOS'); 

    const avisosFiltrados = mockAvisos.filter(aviso => {
        if (categoriaSeleccionada === 'TODOS') return true;
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
                
                <div className="avisos-list">
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