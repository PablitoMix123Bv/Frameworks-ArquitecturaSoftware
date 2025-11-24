import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import FormularioRegistroMarcador from '../components/FormularioRegistroMarcador';
import type { Partido } from '../types';
import { getPartidoById, updateMarcador, iniciarPartido, finalizarPartido } from '../services/partidosService';
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
            }
        };
        fetchMatch();
    }, [idPartido]);

    // Función para actualizar marcadores en BD
    const handleUpdate = async (data: { marcadorLocal: number, marcadorVisitante: number }) => {
        if (!partido) return;
        try {
            // Enviamos actualización al backend cada vez que cambia el marcador
            await updateMarcador(partido.id, data.marcadorLocal, data.marcadorVisitante);
        } catch (error) {
            console.error("Error al actualizar marcador", error);
        }
    };

    // Función para FINALIZAR el partido
    const handleFinalizar = async (local: number, visitante: number) => {
        if (!partido) return;
        if (window.confirm('¿Finalizar el partido definitivamente?')) {
            try {
                await updateMarcador(partido.id, local, visitante); // Asegurar último marcador
                await finalizarPartido(partido.id); // Cambiar estado a FINALIZADO
                alert('Partido finalizado correctamente.');
                navigate('/arbitro/dashboard');
            } catch (error) {
                alert('Error al finalizar el partido');
            }
        }
    };

    // Función Wrapper para FormularioRegistroMarcador que maneja el INICIO
    // Nota: FormularioRegistroMarcador maneja 'isRunning' internamente, 
    // pero necesitamos interceptar el primer clic de "Iniciar" para llamar a la API.
    
    // Para simplificar sin modificar FormularioRegistroMarcador excesivamente,
    // podemos asumir que el árbitro presiona "Iniciar Tiempo" y el componente hijo llama a esta prop.
    // Sin embargo, como tu componente hijo no tiene prop 'onStart', 
    // vamos a inyectar la lógica de "Iniciar" en el botón de Play dentro de `FormularioRegistroMarcador`.
    
    // CORRECCIÓN RÁPIDA: Modificar FormularioRegistroMarcador.tsx para aceptar onStart
    // Si prefieres no tocar ese archivo, el árbitro deberá manualmente asegurar que el estado sea correcto.
    
    return (
        <div>
            <HeaderNav />
            <div className="content-container">
                {partido ? (
                    <FormularioRegistroMarcador 
                        partido={partido}
                        onFinalizar={handleFinalizar}
                        onUpdate={handleUpdate}
                        // Aquí pasamos una función extra si decides modificar el componente hijo
                        // para llamar a iniciarPartido(partido.id) cuando den click a Play.
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