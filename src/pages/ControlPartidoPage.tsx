// src/pages/ControlPartidoPage.tsx (CORREGIDO)

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import FormularioRegistroMarcador from '../components/FormularioRegistroMarcador';
import type { Partido } from '../types';
import '../main.css'; 

// --- CORRECCIÓN AQUÍ: Añadimos la propiedad "Deporte" al mock ---
const mockPartidosAsignados: Partido[] = [
    { id: 10, equipoLocal: { nombre: 'Hunters', logoUrl: '' }, equipoVisitante: { nombre: 'Astros', logoUrl: '' }, estado: 'POR INICIAR', marcadorLocal: null, marcadorVisitante: null, Deporte: 'FUTBOL' },
    { id: 11, equipoLocal: { nombre: 'Águilas', logoUrl: '' }, equipoVisitante: { nombre: 'Tigres', logoUrl: '' }, estado: 'EN PROCESO', marcadorLocal: 1, marcadorVisitante: 0, Deporte: 'BALONCESTO' }, // <-- Deporte diferente
];
// --- FIN DE LA CORRECCIÓN ---

const ControlPartidoPage: React.FC = () => {
    const { idPartido } = useParams<{ idPartido: string }>();
    const navigate = useNavigate();
    const [partido, setPartido] = useState<Partido | null>(null);

    useEffect(() => {
        const idNum = parseInt(idPartido || '0');
        const partidoEncontrado = mockPartidosAsignados.find(p => p.id === idNum);

        if (partidoEncontrado) {
            setPartido(partidoEncontrado);
        } else {
            console.error("No se encontró el partido con ID:", idPartido);
        }
    }, [idPartido, navigate]);

    // Funciones 'dummy' para pasar al formulario
    const handleFinalizar = (local: number, visitante: number) => {
        console.log(`Partido ${idPartido} finalizado: ${local} - ${visitante}`);
        alert('Partido finalizado');
        navigate('/arbitro/dashboard');
    };

    const handleUpdate = (data: any) => {
        // Simula el envío de datos en tiempo real (ej. WebSocket)
        console.log('Actualización de estado:', data);
    };

    return (
        <div>
            <HeaderNav />
            <div className="content-container">
                {partido ? (
                    <FormularioRegistroMarcador 
                        partido={partido}
                        onFinalizar={handleFinalizar}
                        onUpdate={handleUpdate}
                    />
                ) : (
                    <h2>Cargando datos del partido {idPartido}...</h2>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ControlPartidoPage;