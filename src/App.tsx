// src/App.tsx (CORREGIDO)
// import React from 'react'; // React 17+ ya no necesita esta importación en cada archivo
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- 1. ELIMINAMOS ESTA LÍNEA ---
// import './App.css'; // <--- ESTA LÍNEA SE VA

// Componentes de la aplicación
import Login from './pages/Login.tsx';
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
// import FormularioRegistroMarcador from './components/FormularioRegistroMarcador.tsx'; // Ya no se importa aquí
import ArbitroAdminPage from './pages/ArbitroAdminPage.tsx'; 
import MiEquipoDashboard from './pages/MiEquipoDashboard.tsx';
import ControlPartidoPage from './pages/ControlPartidoPage.tsx'; 
import InscripcionesAdminPage from './pages/InscripcionesAdminPage.tsx';
import ReportePartidoPage from './pages/ReportePartidoPage.tsx';
function App() {
  return (
    <Router>
      <Routes>
        {/* RUTA RAÍZ: Redirige a la lista de EQUIPOS */}
        <Route path="/" element={<Navigate to="/public/equipos" replace />} />
        
        {/* -------------------- Rutas Públicas -------------------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/public/equipos" element={<PublicHomePage />} />
        <Route path="/public/equipos/:id/perfil" element={<PerfilEquipoPage />} />
        <Route path="/public/torneos" element={<TorneosPublicosPage />} />
        <Route path="/public/resultados" element={<ResultadosPublicosPage />} />
        <Route path="/public/partidos" element={<PartidosPage />} />
        <Route path="/public/inscripciones" element={<InscripcionesPage />} />
        <Route path="/public/avisos" element={<AvisosPage />} />
        <Route path="/public/partido/:idPartido" element={<ReportePartidoPage />} />
        {/* -------------------- Rutas Protegidas -------------------- */}
        
        {/* JUGADOR: */}
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
        {/* ADMIN: Gestión Árbitros */}
        <Route 
          path="/admin/arbitros" 
          element={<ProtectedRoute requiredRole="administrador"><ArbitroAdminPage /></ProtectedRoute>} 
        />
        {/* ADMIN: Gestión Inscripciones */}
        <Route 
          path="/admin/inscripciones" 
          element={<ProtectedRoute requiredRole="administrador"><InscripcionesAdminPage /></ProtectedRoute>} 
        />

        {/* ÁRBITRO: Dashboard */}
        <Route 
          path="/arbitro/dashboard" 
          element={<ProtectedRoute requiredRole="árbitro"><PanelArbitro /></ProtectedRoute>} 
        />
        
        {/* ÁRBITRO: Control de Juego */}
        <Route 
          path="/arbitro/juego/:idPartido" 
          element={<ProtectedRoute requiredRole="árbitro">
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