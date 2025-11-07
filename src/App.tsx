// src/App.tsx
// import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Componentes de la aplicación (asumimos que todos están importados)
import Login from './pages/Login.tsx'; // Usar Login.tsx de la raíz
import ProtectedRoute from './components/ProtectedRoute';
import TorneoAdminPage from './pages/TorneoAdminPage'; 
import PartidosPage from './pages/PartidosPage.tsx'
import PublicHomePage from './pages/PublicHomePage'; // Equipos
import TorneosPublicosPage from './pages/TorneosPublicosPage';
import ResultadosPublicosPage from './pages/ResultadosPublicosPage';
import InscripcionesPage from './pages/InscripcionesPage';
import AvisosPage from './pages/AvisosPage.tsx';
import AvisosAdminPage from './pages/AvisosAdminPage.tsx';
import PerfilEquipoPage from './pages/PerfilEquipoPage';
import PanelArbitro from './pages/PanelArbitro.tsx';
import FormularioRegistroMarcador from './components/FormularioRegistroMarcador.tsx'; // Importamos el componente
import ArbitroAdminPage from './pages/ArbitroAdminPage.tsx'; // Asumimos esta importación
import MiEquipoDashboard from './pages/MiEquipoDashboard.tsx';
import ControlPartidoPage from './pages/ControlPartidoPage.tsx'; // Importamos la página de control de partido
import InscripcionesAdminPage from './pages/InscripcionesAdminPage.tsx';
function App() {
  return (
    <Router>
      <Routes>
        {/* RUTA RAÍZ: Redirige a la lista de EQUIPOS */}
        <Route path="/" element={<Navigate to="/public/equipos" replace />} />
        
        {/* -------------------- Rutas de Acceso Público -------------------- */}
        
        {/* CORRECCIÓN DE DUPLICIDAD: CADA RUTA DEBE APUNTAR A SU PÁGINA ESPECÍFICA */}
        <Route path="/public/equipos" element={<PublicHomePage />} /> // Equipos
        <Route path="/public/torneos" element={<TorneosPublicosPage />} /> // Torneos
        <Route path="/public/resultados" element={<ResultadosPublicosPage />} /> // Resultados (Tabla)
        <Route path="/public/partidos" element={<PartidosPage />} /> // Partidos
        <Route path="/public/inscripciones" element={<InscripcionesPage />} />
        <Route path="/public/avisos" element={<AvisosPage />} />
        <Route path="/public/equipos/:equipoId/perfil" element={<PerfilEquipoPage />} />

        {/* -------------------- Rutas de Acceso Restringido -------------------- */}
        <Route path="/login" element={<Login />} /> 
        <Route 
          path="/perfil/mi-equipo" 
          element={<ProtectedRoute requiredRole="jugador"><MiEquipoDashboard /></ProtectedRoute>} 
        />

        {/* ADMIN: Torneos (Dashboard Principal) */}
        <Route 
          path="/admin/torneos" 
          element={<ProtectedRoute requiredRole="administrador"><TorneoAdminPage /></ProtectedRoute>} 
        />
        {/* ADMIN: Avisos */}
        <Route 
          path="/admin/avisos" 
          element={<ProtectedRoute requiredRole="administrador"><AvisosAdminPage /></ProtectedRoute>} 
        />
        {/* ADMIN: Gestión Árbitros (Asumimos la ruta) */}
        <Route 
          path="/admin/arbitros" 
          element={<ProtectedRoute requiredRole="administrador"><ArbitroAdminPage /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/inscripciones" 
          element={<ProtectedRoute requiredRole="administrador"><InscripcionesAdminPage /></ProtectedRoute>} 
        />
        {/* ÁRBITRO: Dashboard */}
        <Route 
          path="/arbitro/dashboard" 
          element={<ProtectedRoute requiredRole="árbitro"><PanelArbitro /></ProtectedRoute>} 
        />
        
        {/* ÁRBITRO: Control de Juego (SOLUCIÓN AL 404) */}
        <Route 
          path="/arbitro/juego/:idPartido" 
          element={<ProtectedRoute requiredRole="árbitro">
              {/* Ahora renderiza la PÁGINA que sabe cómo buscar los datos */}
              <ControlPartidoPage />
            </ProtectedRoute>} 
        />
        
        {/* Si el usuario intenta ir a una ruta que no existe */}
        <Route path="*" element={<h1>404 | Página no encontrada</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
