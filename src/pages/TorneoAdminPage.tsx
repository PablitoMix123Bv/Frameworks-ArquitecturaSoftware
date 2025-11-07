// src/pages/TorneoAdminPage.tsx

import React, { useState, useEffect } from 'react';
import type { Torneo, ProgramarPartidoData } from '../types'; 
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import '../main.css'; // Para usar .content-container
import './TorneoAdminPage.css';
// Las rutas son relativas a la posición de este archivo
import CardTorneoAdmin from '../components/CardTorneoAdmin'; 
import FormularioTorneo from '../components/FormularioTorneo'; 
import FormularioJornada from '../components/FormularioJornada'; 

const TorneoAdminPage: React.FC = () => {
  // 1. ESTADO: Especificamos que es un array de Torneos (<Torneo[]>)
  const [torneos, setTorneos] = useState<Torneo[]>([]); 
  // 2. ESTADO: Especificamos que puede ser un objeto Torneo o nulo (<Torneo | null>)
  const [torneoAEditar, setTorneoAEditar] = useState<Torneo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJornadaModalOpen, setIsJornadaModalOpen] = useState(false);
  const [partidoAEditar, setPartidoAEditar] = useState<ProgramarPartidoData | null>(null);
 
  // LÓGICA DE DATOS
  const fetchTorneos = async () => {
    // Datos mock (Asegúrate de que sean válidos)
    setTorneos([
      { id: 1, nombre: 'Apertura', deporte: 'FUTBOL', lugar: 'Canchas...', minJugadores: 8, fechaInicio: '12 Nov', fechaFin: '12 Dic', fechaLimiteInscripcion: '10 Nov', descripcion: 'Torneo de prueba', detalles: 'Torneo de fútbol abierto a todos los estudiantes de la FIF.' , maxJugadores: 15, reglas: 'Reglas estándar de fútbol.' },
    ]);
  };

  useEffect(() => {
    fetchTorneos();
  }, []);

  // Función para abrir el modal de jornada
  const handleOpenJornadaModal = (partido: ProgramarPartidoData | null = null) => {
    setPartidoAEditar(partido);
    setIsJornadaModalOpen(true);
  };

  // Función para abrir el modal de torneo
  const handleOpenModal = (torneo: Torneo | null = null) => {
    setTorneoAEditar(torneo); 
    setIsModalOpen(true);
  };

  // Función para eliminar un torneo
  const handleDelete = async (torneoId: number) => { 
    if (!window.confirm('¿Estás seguro de eliminar este torneo?')) return;
    setTorneos(torneos.filter(t => t.id !== torneoId));
  };
  
return (
    // --- 2. ENVUELVE TODO EN EL LAYOUT ---
    <div>
      <HeaderNav />
      <div className="content-container"> {/* <--- USA EL CONTENEDOR */}
        
        {/* (Tu código JSX existente va aquí dentro) */}
        <div className="admin-container">
     
          <button 
            className="btn-generar btn-primary" 
            onClick={() => handleOpenModal()} 
          >
            Generar torneo +
          </button>

          <button 
            className="btn-programar-jornada btn-primary" 
            onClick={() => handleOpenJornadaModal()}
            style={{ marginLeft: '10px' }}
          >
            Programar Partido +
          </button>
          
          <h2>Torneos existentes</h2>
          
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

      </div> {/* <--- CIERRA EL CONTENEDOR */}
      
      <Footer />
      
      {/* Modal de CREACIÓN/EDICIÓN de Torneos (Existente) */}
      {isModalOpen && (
        <FormularioTorneo
          torneo={torneoAEditar}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchTorneos}
        />
      )}
      
      {/* Modal de PROGRAMACIÓN DE JORNADAS (CORREGIDO) */}
      {isJornadaModalOpen && ( // <-- Controlado por el estado isJornadaModalOpen
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