// src/pages/TorneosPublicosPage.tsx

import React, { useState } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import FiltroDeporte from '../components/FiltroDeporte'; 
import type { Torneo } from '../types'; 

// Componente para una tarjeta de torneo pública (debe ser creado)
// import CardTorneoPublico from '../components/CardTorneoPublico'; 

// Datos mock para simular la lista de torneos (reutiliza la estructura de Torneo)
const mockTorneos: Torneo[] = [
    { id: 1, nombre: 'Apertura', deporte: 'FÚTBOL', lugar: 'Canchas A', minJugadores: 11, maxJugadores: 15, fechaInicio: '2026-03-01', fechaFin: '2026-05-30', fechaLimiteInscripcion: '2026-02-15', descripcion: 'Fútbol varonil.', detalles: 'Detalles del evento.', reglas: 'Reglas estándar.', /* ... (otros campos) */ },
    { id: 2, nombre: 'Relámpago', deporte: 'BALONCESTO', lugar: 'Gimnasio', minJugadores: 5, maxJugadores: 8, fechaInicio: '2026-04-10', fechaFin: '2026-04-20', fechaLimiteInscripcion: '2026-03-30', descripcion: 'Baloncesto mixto.', detalles: 'Detalles del evento.', reglas: 'Reglas FIBA.', /* ... (otros campos) */ },
];


const TorneosPublicosPage: React.FC = () => {
  const [deporteSeleccionado, setDeporteSeleccionado] = useState('TODOS');
  
  const torneosFiltrados = mockTorneos.filter(torneo => {
    if (deporteSeleccionado === 'TODOS') {
      return true;
    }
    return torneo.deporte === deporteSeleccionado; 
  });

  return (
    <div>
      <HeaderNav />
      <div className="content-container">
        
        <FiltroDeporte 
            onFiltroChange={setDeporteSeleccionado}
            valorActual={deporteSeleccionado}
        />

        <h2>Torneos Activos</h2>
        
        <div className="torneos-list">
            {torneosFiltrados.map(torneo => (
                <div key={torneo.id} className="card-torneo-publico">
                    {/* Aquí iría el componente <CardTorneoPublico torneo={torneo} /> */}
                    {/* Por ahora, solo visualizamos la información para confirmar la ruta */}
                    <h3>{torneo.nombre} ({torneo.deporte})</h3>
                    <p>{torneo.descripcion}</p>
                    <p>Inscripción hasta: {torneo.fechaLimiteInscripcion}</p>
                </div>
            ))}
        </div>
        
      </div>
      <Footer />
    </div>
  );
};

export default TorneosPublicosPage;