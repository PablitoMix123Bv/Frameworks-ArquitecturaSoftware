// src/pages/TorneoAdminPage.tsx

import React, { useState, useEffect } from 'react';
import type { Torneo, ProgramarPartidoData } from '../types'; 
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import { FaPlus, FaCalendarAlt } from 'react-icons/fa';
import CardTorneoAdmin from '../components/CardTorneoAdmin'; 
import FormularioTorneo from '../components/FormularioTorneo'; 
import FormularioJornada from '../components/FormularioJornada'; 
import { getTorneos, deleteTorneo } from '../services/torneosService';
import { generarJornadaAutomatica } from '../services/jornadaService'; 
import '../main.css'; 
import './TorneoAdminPage.css'; 

const TorneoAdminPage: React.FC = () => {
  const [torneos, setTorneos] = useState<Torneo[]>([]); 
  const [torneoAEditar, setTorneoAEditar] = useState<Torneo | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJornadaModalOpen, setIsJornadaModalOpen] = useState(false);
  const [partidoAEditar, setPartidoAEditar] = useState<ProgramarPartidoData | null>(null);
  
  const fetchTorneos = async () => {
    try { const data = await getTorneos(); setTorneos(data); } catch (error) { console.error(error); }
  };
  
  useEffect(() => { fetchTorneos(); }, []);
  
  const handleOpenJornadaModal = () => { setPartidoAEditar(null); setIsJornadaModalOpen(true); };
  const handleOpenModal = (torneo: Torneo | null = null) => { setTorneoAEditar(torneo); setIsModalOpen(true); };
  
  const handleDelete = async (id: string) => { 
    if (window.confirm('¿Seguro que deseas eliminar este torneo?')) {
        try { await deleteTorneo(id); fetchTorneos(); } catch (error) { alert('Error al eliminar'); }
    }
  };

  const handleGenerarJornada = (idTorneo: string, nombre: string) => {
      if(window.confirm(`¿Generar automáticamente la siguiente jornada para ${nombre}?`)) {
          generarJornadaAutomatica(idTorneo)
            .then(res => alert(res.mensaje))
            .catch(err => alert(err.response?.data?.message || 'Error generando jornada'));
      }
  };

  return (
    <div>
      <HeaderNav />
      <div className="content-container"> 
        
        <div className="dashboard-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid #EEE', paddingBottom: '15px'}}>
            <div className="header-titles">
                <h2 style={{margin: 0, color: '#1976D2'}}>Gestión de Torneos</h2>
                <p style={{margin: '5px 0 0', color: '#666'}}>Administra las competiciones activas.</p>
            </div>
            
            <div className="admin-header-actions" style={{display: 'flex', gap: '10px'}}>
              <button 
                className="btn-primary" 
                style={{borderRadius: '25px', padding: '10px 20px'}}
                onClick={() => handleOpenJornadaModal()}
              >
                <FaCalendarAlt /> Partido Extra
              </button>
              
              <button 
                className="btn-primary" 
                style={{borderRadius: '25px', padding: '10px 20px'}}
                onClick={() => handleOpenModal()} 
              >
                <FaPlus /> Crear Torneo
              </button>
            </div>
        </div>
          
        <div className="torneos-list-vertical" style={{display: 'flex', flexDirection: 'column', gap: '20px'}}> 
            {torneos.map(torneo => (
                <CardTorneoAdmin
                    key={torneo.id}
                    torneo={torneo}
                    onEdit={() => handleOpenModal(torneo)}
                    onDelete={() => handleDelete(torneo.id)}
                    onGenerarJornada={() => handleGenerarJornada(torneo.id, torneo.nombre)}
                />
            ))}
        </div>

      </div> 
      <Footer />

      {isModalOpen && (
        <FormularioTorneo
          torneo={torneoAEditar}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => { setIsModalOpen(false); fetchTorneos(); }} 
        />
      )}
      
      {isJornadaModalOpen && (
        <FormularioJornada
          partidoAEditar={partidoAEditar}
          onClose={() => setIsJornadaModalOpen(false)}
          onSuccess={() => { setIsJornadaModalOpen(false); alert("Partido programado exitosamente"); }}
        />
      )}
    </div>
  );
};

export default TorneoAdminPage;