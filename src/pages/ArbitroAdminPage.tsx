// src/pages/ArbitroAdminPage.tsx

import React, { useState } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import FormularioArbitro from '../components/FormularioArbitro'; 
import type { Arbitro } from '../types'; 
import './ArbitroAdminPage.css';
// Datos mock
const mockArbitros: Arbitro[] = [
    { id: 1, nombreCompleto: 'Laura González', email: 'laura.g@uaq.mx', rol: 'árbitro' },
    { id: 2, nombreCompleto: 'Roberto Castillo', email: 'roberto.c@uaq.mx', rol: 'árbitro' },
];

const ArbitroAdminPage: React.FC = () => {
    const [arbitros, setArbitros] = useState(mockArbitros);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [arbitroAEditar, setArbitroAEditar] = useState<Arbitro | null>(null);

    const handleSuccess = () => { /* Recargar lista */ setIsModalOpen(false); };
    const handleEdit = (arbitro: Arbitro) => { setArbitroAEditar(arbitro); setIsModalOpen(true); };
    
    const handleDelete = (id: number) => {
        if (window.confirm('¿Desea revocar el rol de árbitro a este usuario?')) {
            // En una aplicación real, aquí se llamaría a la API para cambiar el rol del usuario a 'estudiante' o eliminarlo.
            setArbitros(arbitros.filter(a => a.id !== id));
        }
    };

    return (
        <div>
            <HeaderNav /> 
            <div className="content-container">
                <div className="admin-avisos-header">
                    <h2>Gestión de Árbitros</h2>
                    <button className="btn-primary" onClick={() => { setArbitroAEditar(null); setIsModalOpen(true); }}>
                        + Añadir Árbitro
                    </button>
                </div>
                
                <div className="arbitros-list">
                    {arbitros.map(arbitro => (
                        <div key={arbitro.id} className="card-arbitro">
                            <div className="arbitro-details">
                                <h4>{arbitro.nombreCompleto}</h4>
                                <p>{arbitro.email}</p>
                            </div>
                            <div className="arbitro-actions">
                                <button className="btn-icon edit" onClick={() => handleEdit(arbitro)}>✏️</button>
                                <button className="btn-icon delete" onClick={() => handleDelete(arbitro.id)}>🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />

            {isModalOpen && (
                <FormularioArbitro arbitroAEditar={arbitroAEditar} onClose={() => setIsModalOpen(false)} onSuccess={handleSuccess} />
            )}
        </div>
    );
};

export default ArbitroAdminPage;