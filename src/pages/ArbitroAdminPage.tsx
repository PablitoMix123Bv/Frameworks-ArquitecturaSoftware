import React, { useState, useEffect } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import FormularioArbitro from '../components/FormularioArbitro'; 
import type { Arbitro } from '../types'; 
import api from '../api/axios'; // Importamos api directamente
import './ArbitroAdminPage.css';
import { FaPlus, FaPencilAlt, FaTrash } from 'react-icons/fa';

const ArbitroAdminPage: React.FC = () => {
    const [arbitros, setArbitros] = useState<Arbitro[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [arbitroAEditar, setArbitroAEditar] = useState<Arbitro | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchArbitros = async () => {
        setIsLoading(true);
        try {
            // Obtenemos todos los usuarios y filtramos en cliente
            // (Idealmente el backend tendría un endpoint /auth/arbitros, pero esto funciona con lo que tenemos)
            const { data } = await api.get<any[]>('/auth'); 
            const listaArbitros = data
                .filter(u => u.roles.includes('arbitro'))
                .map(u => ({
                    id: u.id,
                    nombreCompleto: u.nombre,
                    email: u.email,
                    rol: 'árbitro' as const
                }));
            setArbitros(listaArbitros);
        } catch (error) {
            console.error("Error cargando árbitros", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchArbitros();
    }, []);

    const handleSuccess = () => { 
        setIsModalOpen(false); 
        fetchArbitros(); // Recargar lista
    };
    
    const handleEdit = (arbitro: Arbitro) => { 
        setArbitroAEditar(arbitro); 
        setIsModalOpen(true); 
    };
    
    const handleDelete = async (id: string) => {
        if (window.confirm('¿Desea eliminar a este usuario del sistema?')) {
            try {
                await api.delete(`/auth/${id}`);
                fetchArbitros();
            } catch (error) {
                alert('Error al eliminar árbitro');
            }
        }
    };

    return (
        <div>
            <HeaderNav /> 
            <div className="content-container">
                
                <div className="admin-page-header">
                    <h2>Gestión de Árbitros</h2>
                    
                    <div className="admin-header-actions">
                        <button className="btn-primary" onClick={() => { setArbitroAEditar(null); setIsModalOpen(true); }}>
                            <FaPlus /> Añadir Árbitro
                        </button>
                    </div>
                </div>

                {isLoading ? <p>Cargando lista de árbitros...</p> : (
                    <div className="arbitros-list">
                        {arbitros.length === 0 && <p>No hay árbitros registrados.</p>}
                        {arbitros.map(arbitro => (
                            <div key={arbitro.id} className="card-arbitro">
                                <div className="arbitro-details">
                                    <h4>{arbitro.nombreCompleto}</h4>
                                    <p>{arbitro.email}</p>
                                </div>
                                <div className="arbitro-actions">
                                    <button className="btn-icon edit" onClick={() => handleEdit(arbitro)}>
                                        <FaPencilAlt />
                                    </button>
                                    <button className="btn-icon delete" onClick={() => handleDelete(arbitro.id)}>
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
                <FormularioArbitro arbitroAEditar={arbitroAEditar} onClose={() => setIsModalOpen(false)} onSuccess={handleSuccess} />
            )}
        </div>
    );
};

export default ArbitroAdminPage;