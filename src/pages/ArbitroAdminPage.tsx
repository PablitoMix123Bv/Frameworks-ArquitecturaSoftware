// src/pages/ArbitroAdminPage.tsx
import React, { useState, useEffect } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import FormularioArbitro from '../components/FormularioArbitro'; 
import type { Usuario } from '../types'; 
import { getUsers, updateUserRole } from '../services/userService'; // Servicio real
import './ArbitroAdminPage.css';
import { FaPlus, FaTrash } from 'react-icons/fa';

const ArbitroAdminPage: React.FC = () => {
    const [arbitros, setArbitros] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Carga real de datos
    const fetchArbitros = async () => {
        setLoading(true);
        try {
            const users = await getUsers();
            // Filtramos usuarios que tengan el rol 'arbitro'
            const soloArbitros = users.filter(u => u.roles.includes('arbitro'));
            setArbitros(soloArbitros);
        } catch (error) {
            console.error("Error cargando árbitros:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArbitros();
    }, []);

    const handleSuccess = () => { 
        setIsModalOpen(false); 
        fetchArbitros(); // Recargar lista
    };
    
    const handleDelete = async (usuario: Usuario) => {
        if (window.confirm(`¿Quitar rol de árbitro a ${usuario.nombre}?`)) {
            try {
                // Quitamos 'arbitro' del array de roles y actualizamos
                const nuevosRoles = usuario.roles.filter(r => r !== 'arbitro');
                // Si se queda sin roles, le dejamos 'user' por defecto
                if (nuevosRoles.length === 0) nuevosRoles.push('user');
                
                await updateUserRole(usuario.id, nuevosRoles);
                fetchArbitros();
            } catch (error) {
                alert('Error al actualizar usuario');
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
                        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                            <FaPlus /> Añadir Árbitro
                        </button>
                    </div>
                </div>
                
                {loading ? <p>Cargando lista...</p> : (
                    <div className="arbitros-list">
                        {arbitros.length === 0 && <p>No hay árbitros registrados.</p>}
                        {arbitros.map(arbitro => (
                            <div key={arbitro.id} className="card-arbitro">
                                <div className="arbitro-details">
                                    <h4>{arbitro.nombre}</h4>
                                    <p>{arbitro.email}</p>
                                    <small>Expediente: {arbitro.expediente}</small>
                                </div>
                                <div className="arbitro-actions">
                                    <button className="btn-icon delete" onClick={() => handleDelete(arbitro)}>
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
                <FormularioArbitro 
                    arbitroAEditar={null} 
                    onClose={() => setIsModalOpen(false)} 
                    onSuccess={handleSuccess} 
                />
            )}
        </div>
    );
};

export default ArbitroAdminPage;