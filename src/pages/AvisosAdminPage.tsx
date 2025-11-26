// src/pages/AvisosAdminPage.tsx

import React, { useState, useEffect } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import FormularioAviso from '../components/FormularioAviso';
import type { Aviso } from '../types'; 
import { getAvisos, deleteAviso } from '../services/avisosService';
import './AvisosAdminPage.css';
import { FaPlus, FaPencilAlt, FaTrash } from 'react-icons/fa';

const AvisosAdminPage: React.FC = () => {
    const [avisos, setAvisos] = useState<Aviso[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [avisoAEditar, setAvisoAEditar] = useState<Aviso | null>(null);

    const fetchAvisos = async () => {
        setLoading(true);
        try {
            const data = await getAvisos();
            setAvisos(data);
        } catch (error) {
            console.error("Error cargando avisos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAvisos();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Está seguro de eliminar este aviso permanentemente?')) {
            try {
                await deleteAviso(id);
                fetchAvisos(); // Recargar lista
            } catch (error) {
                alert('Error al eliminar aviso.');
            }
        }
    };

    return (
        <div>
            <HeaderNav />
            <div className="content-container">
                
                <div className="admin-page-header">
                    <h2>Gestión de Avisos</h2>
                    <div className="admin-header-actions">
                        <button 
                            className="btn-primary" 
                            onClick={() => { setAvisoAEditar(null); setIsModalOpen(true); }}
                        >
                            <FaPlus /> Crear Nuevo Aviso
                        </button>
                    </div>
                </div>

                {loading ? <p>Cargando avisos...</p> : (
                    <div className="avisos-admin-list">
                        {avisos.length === 0 && <p>No hay avisos publicados.</p>}
                        
                        {avisos.map(aviso => (
                            <div key={aviso.id} className="card-aviso-admin">
                                <div className="aviso-details">
                                    <h4>{aviso.titulo}</h4>
                                    <p>{aviso.contenido.substring(0, 100)}...</p>
                                    <small>
                                        Categoría: {aviso.categoria} | 
                                        Autor: {aviso.autor?.nombre || 'Desconocido'} | 
                                        Torneo: {aviso.torneo?.nombre || 'N/A'}
                                    </small>
                                </div>
                                <div className="aviso-actions">
                                    <button className="btn-icon edit" onClick={() => { setAvisoAEditar(aviso); setIsModalOpen(true); }}>
                                        <FaPencilAlt />
                                    </button>
                                    <button className="btn-icon delete" onClick={() => handleDelete(aviso.id)}>
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />

            {isModalOpen && (
                <FormularioAviso
                    avisoAEditar={avisoAEditar}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchAvisos}
                />
            )}
        </div>
    );
};

export default AvisosAdminPage;