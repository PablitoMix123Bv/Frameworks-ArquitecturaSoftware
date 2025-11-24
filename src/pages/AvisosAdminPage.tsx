// src/pages/AvisosAdminPage.tsx

import React, { useState, useEffect } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import FormularioAviso from '../components/FormularioAviso';
import type { Aviso } from '../types'; 
import { getAvisos, deleteAviso } from '../services/avisosService'; // <--- SERVICIO REAL
import './AvisosAdminPage.css';
import { FaPlus, FaPencilAlt, FaTrash } from 'react-icons/fa';

const AvisosAdminPage: React.FC = () => {
    const [avisos, setAvisos] = useState<Aviso[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [avisoAEditar, setAvisoAEditar] = useState<Aviso | null>(null);

    const fetchAvisos = async () => {
        setIsLoading(true);
        try {
            const data = await getAvisos();
            setAvisos(data);
        } catch (error) {
            console.error("Error al cargar avisos:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => { fetchAvisos(); }, []);

    const handleSuccess = () => {
        fetchAvisos(); // Recarga la lista después de crear/editar
        setIsModalOpen(false);
    };

    const handleEdit = (aviso: Aviso) => {
        setAvisoAEditar(aviso);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string | number) => {
        if (window.confirm('¿Está seguro de eliminar este aviso?')) {
            try {
                await deleteAviso(id);
                fetchAvisos();
            } catch (error) {
                alert('Error al eliminar el aviso');
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

                {isLoading && <p>Cargando avisos...</p>}

                <div className="avisos-admin-list">
                    {avisos.length === 0 && !isLoading && <p>No hay avisos registrados.</p>}

                    {avisos.map(aviso => (
                        <div key={aviso.id} className="card-aviso-admin">
                            <div className="aviso-details">
                                <h4>{aviso.titulo}</h4>
                                <p>{aviso.contenido.substring(0, 80)}...</p>
                                <small>Categoría: {aviso.categoria} | Prioridad: {aviso.prioridad} | Autor: {aviso.autor}</small>
                            </div>
                            <div className="aviso-actions">
                                <button className="btn-icon edit" onClick={() => handleEdit(aviso)}>
                                    <FaPencilAlt />
                                </button>
                                <button className="btn-icon delete" onClick={() => handleDelete(aviso.id)}>
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />

            {isModalOpen && (
                <FormularioAviso
                    avisoAEditar={avisoAEditar}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
};

export default AvisosAdminPage;