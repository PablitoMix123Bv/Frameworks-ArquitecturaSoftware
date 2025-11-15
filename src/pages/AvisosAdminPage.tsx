// src/pages/AvisosAdminPage.tsx (CORREGIDO)

import React, { useState } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import FormularioAviso from '../components/FormularioAviso';
import type { Aviso } from '../types'; 
import './AvisosAdminPage.css'; // Sigue usando su propio CSS

// 1. Importamos el icono que vamos a usar
import { FaPlus, FaPencilAlt, FaTrash } from 'react-icons/fa';

// Datos mock
const mockAvisos: Aviso[] = [
    { id: 1, titulo: 'Inscripciones Abiertas', contenido: 'Recuerden que el límite es el 15 de febrero.', fechaPublicacion: '2025-10-25', autor: 'Coordinador A', categoria: 'INSCRIPCIÓN', prioridad: 'URGENTE', idTorneoAsociado: 101 },
    { id: 2, titulo: 'Reglas Canchas', contenido: 'La cancha A solo puede usarse después de las 5 PM.', fechaPublicacion: '2025-10-20', autor: 'Coordinador B', categoria: 'GENERAL', prioridad: 'NORMAL', idTorneoAsociado: null },
];

const AvisosAdminPage: React.FC = () => {
    const [avisos, setAvisos] = useState(mockAvisos);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [avisoAEditar, setAvisoAEditar] = useState<Aviso | null>(null);

    const handleSuccess = () => {
        console.log("Lista de avisos actualizada.");
        setIsModalOpen(false);
    };

    const handleEdit = (aviso: Aviso) => {
        setAvisoAEditar(aviso);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este aviso?')) {
            setAvisos(avisos.filter(a => a.id !== id));
        }
    };

    return (
        <div>
            <HeaderNav />
            <div className="content-container">
                
                {/* --- 2. ESTRUCTURA DE ENCABEZADO CORREGIDA --- */}
                <div className="admin-page-header">
                    <h2>Gestión de Avisos</h2>
                    
                    {/* Agrupamos el botón a la derecha */}
                    <div className="admin-header-actions">
                        <button 
                            className="btn-primary" 
                            onClick={() => { setAvisoAEditar(null); setIsModalOpen(true); }}
                        >
                            <FaPlus /> Crear Nuevo Aviso
                        </button>
                    </div>
                </div>
                {/* --- FIN DE LA CORRECCIÓN --- */}


                <div className="avisos-admin-list">
                    {avisos.map(aviso => (
                        <div key={aviso.id} className="card-aviso-admin">
                            <div className="aviso-details">
                                <h4>{aviso.titulo}</h4>
                                <p>{aviso.contenido.substring(0, 80)}...</p>
                                <small>Categoría: {aviso.categoria} | Prioridad: {aviso.prioridad}</small>
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