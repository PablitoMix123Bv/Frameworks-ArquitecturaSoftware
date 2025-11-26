// src/App.tsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import RegisterPage from './pages/RegisterPage'; 
import ProtectedRoute from './components/ProtectedRoute';

// Páginas Públicas
import PublicHomePage from './pages/PublicHomePage';
import TorneosPublicosPage from './pages/TorneosPublicosPage';
import ResultadosPublicosPage from './pages/ResultadosPublicosPage';
import PartidosPage from './pages/PartidosPage';
import InscripcionesPage from './pages/InscripcionesPage';
import AvisosPage from './pages/AvisosPage';
import ReportePartidoPage from './pages/ReportePartidoPage';
import PerfilEquipoPage from './pages/PerfilEquipoPage';

// Páginas Privadas
import TorneoAdminPage from './pages/TorneoAdminPage'; 
import AvisosAdminPage from './pages/AvisosAdminPage';
import ArbitroAdminPage from './pages/ArbitroAdminPage'; 
import InscripcionesAdminPage from './pages/InscripcionesAdminPage';
import PanelArbitro from './pages/PanelArbitro';
import MiEquipoDashboard from './pages/MiEquipoDashboard';

// NOTA: Se eliminó ControlPartidoPage porque ahora usamos un Modal dentro de PanelArbitro

function App() {
  return (
    <Router>
      <Routes>
        {/* RUTA RAÍZ */}
        <Route path="/" element={<Navigate to="/vista/equipos" replace />} />
        
        {/* -------------------- Rutas Auth -------------------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* -------------------- Rutas Públicas -------------------- */}
        <Route path="/vista/equipos" element={<PublicHomePage />} />
        <Route path="/vista/equipos/:equipoId/perfil" element={<PerfilEquipoPage />} />
        <Route path="/vista/torneos" element={<TorneosPublicosPage />} />
        <Route path="/vista/resultados" element={<ResultadosPublicosPage />} />
        <Route path="/vista/partidos" element={<PartidosPage />} />
        <Route path="/vista/inscripciones" element={<InscripcionesPage />} />
        <Route path="/vista/avisos" element={<AvisosPage />} />
        <Route path="/vista/partido/:idPartido" element={<ReportePartidoPage />} />

        {/* -------------------- Rutas Protegidas -------------------- */}
        
        {/* JUGADOR / CAPITÁN */}
        <Route 
          path="/perfil/mi-equipo" 
          element={<ProtectedRoute requiredRole="user"><MiEquipoDashboard /></ProtectedRoute>} 
        />
        
        {/* ADMIN */}
        <Route 
          path="/admin/torneos" 
          element={<ProtectedRoute requiredRole="admin"><TorneoAdminPage /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/avisos" 
          element={<ProtectedRoute requiredRole="admin"><AvisosAdminPage /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/arbitros" 
          element={<ProtectedRoute requiredRole="admin"><ArbitroAdminPage /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/inscripciones" 
          element={<ProtectedRoute requiredRole="admin"><InscripcionesAdminPage /></ProtectedRoute>} 
        />

        {/* ÁRBITRO */}
        <Route 
          path="/arbitro/dashboard" 
          element={<ProtectedRoute requiredRole="arbitro"><PanelArbitro /></ProtectedRoute>} 
        />
        
        {/* NOTA: Eliminamos la ruta /arbitro/juego/:idPartido porque ya no existe la página */}
        
        {/* 404 */}
        <Route path="*" element={<h1>404 | Página no encontrada</h1>} />
      </Routes>
    </Router>
  );
}

export default App;