// src/pages/ControlPartidoPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import FormularioRegistroMarcador from '../components/FormularioRegistroMarcador';
import type { Partido } from '../types';
import { getPartidoById, updateMarcador } from '../services/partidosService';
import '../main.css'; 

const ControlPartidoPage: React.FC = () => {
    const { idPartido } = useParams<{ idPartido: string }>();
    const navigate = useNavigate();
    const [partido, setPartido] = useState<Partido | null>(null);

    useEffect(() => {
        const fetchMatch = async () => {
            if (idPartido) {
                const data = await getPartidoById(idPartido);
                if (data) setPartido(data);
                else alert('Partido no encontrado');
            }
        };
        fetchMatch();
    }, [idPartido]);

    const handleFinalizar = async (local: number, visitante: number) => {
        if (!partido) return;
        try {
            // Actualizar una última vez y el backend finalizará el partido
            await updateMarcador(partido.id, local, visitante);
            alert('Partido finalizado y marcador guardado.');
            navigate('/arbitro/dashboard');
        } catch (error) {
            console.error("Error al finalizar", error);
            alert("Error al guardar el resultado final.");
        }
    };

    // Esta función se llama cada vez que se suman puntos (para guardar en BD en tiempo real si quieres)
    // O solo actualiza estado local. Aquí lo haremos guardar en BD para persistencia.
    const handleUpdate = async (data: { marcadorLocal: number, marcadorVisitante: number, tiempo: string, periodo: string }) => {
        if (!partido) return;
        // Opcional: Guardar en BD cada vez que cambia el marcador (Live Score)
        // Esto hace muchas peticiones, pero asegura persistencia.
        try {
             // Nota: Si el backend cambia estado a finalizado automáticamente, ten cuidado. 
             // Asumimos que updateMarcador solo cambia goles.
             // await updateMarcador(partido.id, data.marcadorLocal, data.marcadorVisitante);
        } catch (e) {
            console.log("Error guardando live score");
        }
        console.log('Live update:', data);
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
                    <h2>Cargando datos del partido...</h2>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ControlPartidoPage;