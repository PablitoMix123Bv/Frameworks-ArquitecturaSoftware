// src/pages/AvisosPage.tsx

import React, { useState, useEffect } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer'; 
import CardAviso from '../components/CardAviso';
import FiltroDeporte from '../components/FiltroDeporte'; // Usaremos esto como filtro de categoría visualmente
import type { Aviso } from '../types';
import { getAvisos } from '../services/avisosService';
import './AvisosPage.css';

const AvisosPage: React.FC = () => {
    const [avisos, setAvisos] = useState<Aviso[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Estado para filtrar en cliente (puedes adaptar FiltroDeporte o crear uno simple de categorías)
    // Por simplicidad, cargamos todo.

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAvisos();
                setAvisos(data);
            } catch (error) {
                console.error("Error cargando avisos públicos", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <HeaderNav />
            <div className="content-container">
                <h2>Avisos y Comunicados Oficiales</h2>
                
                {loading ? <p>Cargando avisos...</p> : (
                    <div className="avisos-list">
                        {avisos.length === 0 ? (
                            <div className="no-avisos-message">No hay avisos recientes.</div>
                        ) : (
                            avisos.map(aviso => (
                                <CardAviso key={aviso.id} aviso={aviso} />
                            ))
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default AvisosPage;  