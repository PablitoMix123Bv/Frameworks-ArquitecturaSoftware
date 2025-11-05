// src/pages/ResultadosPublicosPage.tsx (Modificación)

import React from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import FiltroDeporte from '../components/FiltroDeporte'; 
import TablaClasificacion from '../components/TablaClasificacion'; // <-- NUEVA IMPORTACIÓN
// ...

const ResultadosPublicosPage: React.FC = () => {
  const [deporteSeleccionado, setDeporteSeleccionado] = React.useState('FÚTBOL');
    
  return (
    <div>
      <HeaderNav />
      <div className="content-container">
        
        <FiltroDeporte 
            onFiltroChange={setDeporteSeleccionado}
            valorActual={deporteSeleccionado}
        />

        {/* Simulamos que la tabla siempre muestra el torneo ID 101 */}
        <TablaClasificacion 
            deporte={deporteSeleccionado}
            idTorneo={101}
        />
        
        <h2 style={{ marginTop: '40px' }}>Resultados Recientes</h2>
        {/* Aquí se listarán los CardPartido FINALIZADO */}
        <p>Los partidos finalizados se listarán aquí para consulta.</p>

      </div>
      <Footer />
    </div>
  );
};

export default ResultadosPublicosPage;