// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Componentes de la aplicación (Imports limpios sin .tsx)
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import TorneoAdminPage from './pages/TorneoAdminPage'; 
import PartidosPage from './pages/PartidosPage';
import PublicHomePage from './pages/PublicHomePage';
import TorneosPublicosPage from './pages/TorneosPublicosPage';
import ResultadosPublicosPage from './pages/ResultadosPublicosPage';
import InscripcionesPage from './pages/InscripcionesPage';
import AvisosPage from './pages/AvisosPage';
import AvisosAdminPage from './pages/AvisosAdminPage';
import PerfilEquipoPage from './pages/PerfilEquipoPage';
import PanelArbitro from './pages/PanelArbitro';
import ArbitroAdminPage from './pages/ArbitroAdminPage'; 
import MiEquipoDashboard from './pages/MiEquipoDashboard';
import ControlPartidoPage from './pages/ControlPartidoPage'; 
import InscripcionesAdminPage from './pages/InscripcionesAdminPage';
import ReportePartidoPage from './pages/ReportePartidoPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirección inicial corregida */}
        <Route path="/" element={<Navigate to="/equipos" replace />} />
        
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/equipos" element={<PublicHomePage />} />
        <Route path="/equipos/:id/perfil" element={<PerfilEquipoPage />} />
        <Route path="/torneos" element={<TorneosPublicosPage />} />
        <Route path="/resultados" element={<ResultadosPublicosPage />} />
        <Route path="/partidos" element={<PartidosPage />} />
        <Route path="/inscripciones" element={<InscripcionesPage />} />
        <Route path="/avisos" element={<AvisosPage />} />
        <Route path="/partido/:idPartido" element={<ReportePartidoPage />} />
        
        {/* Rutas Protegidas */}
        
        {/* JUGADOR (Capitán) */}
        <Route 
          path="/perfil/mi-equipo" 
          element={<ProtectedRoute requiredRole="capitan"><MiEquipoDashboard /></ProtectedRoute>} 
        />
        
        {/* ADMIN */}
        <Route 
          path="/admin/torneos" 
          element={<ProtectedRoute requiredRole="administrador"><TorneoAdminPage /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/avisos" 
          element={<ProtectedRoute requiredRole="administrador"><AvisosAdminPage /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/arbitros" 
          element={<ProtectedRoute requiredRole="administrador"><ArbitroAdminPage /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/inscripciones" 
          element={<ProtectedRoute requiredRole="administrador"><InscripcionesAdminPage /></ProtectedRoute>} 
        />

        {/* ÁRBITRO */}
        <Route 
          path="/arbitro/dashboard" 
          element={<ProtectedRoute requiredRole="árbitro"><PanelArbitro /></ProtectedRoute>} 
        />
        
        <Route 
          path="/arbitro/juego/:idPartido" 
          element={<ProtectedRoute requiredRole="árbitro"><ControlPartidoPage /></ProtectedRoute>} 
        />
        
        {/* Ruta 404 para evitar pantalla blanca si la ruta no existe */}
        <Route path="*" element={
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>404</h1>
                <p>Página no encontrada</p>
                <a href="/equipos" className="btn-primary">Volver al inicio</a>
            </div>
        } />
      </Routes>
    </Router>
  );
}

export default App; 