// src/pages/TorneoAdminPage.tsx

import React, { useState, useEffect } from 'react';
import type { Torneo, ProgramarPartidoData } from '../types'; 
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import '../main.css'; 
import './TorneoAdminPage.css'; 
import { FaPlus, FaCalendarAlt } from 'react-icons/fa';
import CardTorneoAdmin from '../components/CardTorneoAdmin'; 
import FormularioTorneo from '../components/FormularioTorneo'; 
import FormularioJornada from '../components/FormularioJornada'; 

// Importamos los servicios reales
import { getTorneos, createTorneo, deleteTorneo } from '../services/torneosService';

const TorneoAdminPage: React.FC = () => {
  const [torneos, setTorneos] = useState<Torneo[]>([]); 
  const [torneoAEditar, setTorneoAEditar] = useState<Torneo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJornadaModalOpen, setIsJornadaModalOpen] = useState(false);
  const [partidoAEditar, setPartidoAEditar] = useState<ProgramarPartidoData | null>(null);
  
  const fetchTorneos = async () => {
    try {
        const data = await getTorneos();
        setTorneos(data);
    } catch (error) {
        console.error("Error cargando torneos", error);
    }
  };
  
  useEffect(() => { fetchTorneos(); }, []);
  
  const handleOpenJornadaModal = (partido: ProgramarPartidoData | null = null) => {
    setPartidoAEditar(partido);
    setIsJornadaModalOpen(true);
  };
  
  const handleOpenModal = (torneo: Torneo | null = null) => {
    setTorneoAEditar(torneo);
    setIsModalOpen(true);
  };
  
  const handleDelete = async (torneoId: string) => { // ID ahora es string
    if (window.confirm('¿Seguro que deseas eliminar este torneo?')) {
        try {
            await deleteTorneo(torneoId);
            fetchTorneos(); // Recargar lista
        } catch (error) {
            alert('Error al eliminar torneo');
        }
    }
  };

  // Manejador para cuando el formulario guarda con éxito
  // El formulario devuelve un objeto Torneo, pero createTorneo se encarga del mapeo
  const handleSuccessTorneo = async (data?: any) => {
      // Nota: Idealmente FormularioTorneo llamaría al servicio, 
      // pero si FormularioTorneo solo devuelve los datos, lo llamamos aquí.
      // Asumiremos que FormularioTorneo ha sido actualizado para llamar al servicio O lo hacemos aquí.
      // Para mantener limpio FormularioTorneo, lo ideal es que reciba "onSubmit" y lo manejemos aquí.
      // Pero según tu estructura anterior, FormularioTorneo hacía el console.log.
      // Vamos a RE-IMPLEMENTAR FormularioTorneo abajo brevemente para que funcione con la API.
      
      fetchTorneos();
      setIsModalOpen(false);
  };

  return (
    <div>
      <HeaderNav />
      <div className="content-container"> 
        <div className="admin-container">
          
          <div className="admin-page-header">
            <h2>Gestión de Torneos</h2>
            
            <div className="admin-header-actions">
              <button 
                className="btn-primary" 
                onClick={() => handleOpenJornadaModal()}
              >
                <FaCalendarAlt /> Programar Partido
              </button>
              
              <button 
                className="btn-primary" 
                onClick={() => handleOpenModal()} 
              >
                <FaPlus /> Crear Torneo
              </button>
            </div>
          </div>
          
          <div className="torneos-list-grid"> 
              {torneos.map(torneo => (
                <CardTorneoAdmin
                    key={torneo.id}
                    torneo={torneo}
                    onEdit={() => handleOpenModal(torneo)}
                    onDelete={() => handleDelete(torneo.id)}
                />
              ))}
          </div>
        </div>

      </div> 
      <Footer />

      {isModalOpen && (
        <FormularioTorneo
          torneo={torneoAEditar}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccessTorneo} // Recarga la lista
        />
      )}
      
      {isJornadaModalOpen && (
        <FormularioJornada
          partidoAEditar={partidoAEditar}
          onClose={() => setIsJornadaModalOpen(false)}
          onSuccess={() => console.log("Jornada programada")}
        />
      )}
    </div>
  );
};

export default TorneoAdminPage;