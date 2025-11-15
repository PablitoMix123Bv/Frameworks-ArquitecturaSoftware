// src/pages/TorneoAdminPage.tsx (CORREGIDO)

import React, { useState, useEffect } from 'react';
import type { Torneo, ProgramarPartidoData } from '../types'; 

import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import '../main.css'; 
import './TorneoAdminPage.css'; // Importamos su CSS

// --- 1. IMPORTAMOS ICONOS ---
import { FaPlus, FaCalendarAlt } from 'react-icons/fa';

import CardTorneoAdmin from '../components/CardTorneoAdmin'; 
import FormularioTorneo from '../components/FormularioTorneo'; 
import FormularioJornada from '../components/FormularioJornada'; 

const TorneoAdminPage: React.FC = () => {
  const [torneos, setTorneos] = useState<Torneo[]>([]); 
  const [torneoAEditar, setTorneoAEditar] = useState<Torneo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJornadaModalOpen, setIsJornadaModalOpen] = useState(false);
  const [partidoAEditar, setPartidoAEditar] = useState<ProgramarPartidoData | null>(null);
  
  const fetchTorneos = async () => {
    // Simulación de carga
    setTorneos([
        { id: 1, nombre: 'Apertura', detalles: 'Torneo de fútbol abierto a todos los estudiantes de la FIF.', lugar: 'Canchas...', minJugadores: 8, maxJugadores: 12, fechaInicio: '12 Nov', fechaFin: '12 Dic', deporte: 'FUTBOL', fechaLimiteInscripcion: '2025-11-10', descripcion: '', reglas: '' }
    ]);
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
  
  const handleDelete = async (torneoId: number) => {
    if (window.confirm('¿Seguro que deseas eliminar este torneo?')) {
        setTorneos(torneos.filter(t => t.id !== torneoId));
    }
  };

  return (
    <div>
      <HeaderNav />
      <div className="content-container"> 
        <div className="admin-container">
          
          {/* --- 2. ESTRUCTURA DE ENCABEZADO CORREGIDA --- */}
          {/* Este div ahora contiene el título y los botones */}
          <div className="admin-page-header">
            <h2>Torneos existentes</h2>
            
            {/* Agrupamos los botones a la derecha */}
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
                <FaPlus /> Generar Torneo
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
          onSuccess={fetchTorneos}
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