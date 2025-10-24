// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Componentes de la aplicación
import Login from './Login.tsx';
import TorneoAdminPage from './pages/TorneoAdminPage'; 
import PublicHomePage from './pages/PublicHomePage'; // Nuevo componente de página pública
import PartidosPage from '../src/pages/PartidosPage.tsx'
import ProtectedRoute from './components/ProtectedRoute';
import PerfilEquipoPage from './pages/PerfilEquipoPage';

// Componente para la vista pública de resultados (ejemplo)
const ResultadosPublicos: React.FC = () => <div><PublicHomePage /></div>; 
// Componente de prueba para la lista de partidos (ejemplo)
const PartidosPublicos: React.FC = () => <div><PublicHomePage /></div>; 

function App() {
  return (
    <Router>
      <Routes>
        {/* -------------------- 1. Rutas de Acceso Público -------------------- */}
        
        {/* RUTA RAÍZ: La página de inicio ahora carga la vista principal de tu sistema. */}
        <Route path="/" element={<Navigate to="/public/equipos" replace />} />
        
        {/* Rutas para la navegación pública (Cualquier usuario puede ver esto) */}
        <Route path="/public/equipos" element={<PublicHomePage />} />
        <Route path="/public/torneos" element={<div><PublicHomePage /></div>} /> 
        <Route path="/public/resultados" element={<ResultadosPublicos />} /> 
        {/* <Route path="/public/partidos" element={<PartidosPublicos />} /> */}
        <Route path= "/public/partidos" element={<PartidosPage/>} />
        {/* RUTA PROTEGIDA: Ahora envuelve la página de administración */}
        <Route 
          path="/admin/torneos" 
          element={
            // Usamos el componente guardián
            <ProtectedRoute requiredRole="administrador">
              <TorneoAdminPage /> {/* El contenido hijo que se debe proteger */}
            </ProtectedRoute>
          } 
        />
        
        {/* -------------------- 2. Rutas de Acceso Restringido (Coordinador) -------------------- */}
        
        {/* RUTA DE LOGIN: Los usuarios van aquí para autenticarse */}
        <Route path="/login" element={<Login />} /> 
        
{/* RUTA DINÁMICA: Usa :equipoId para capturar el ID de la URL */}
        <Route path="/public/equipos/:equipoId/perfil" element={<PerfilEquipoPage />} />

        {/* RUTA DE ADMINISTRACIÓN: El usuario DEBE estar logueado para acceder a esto. */}
        {/* Por ahora, cargamos la página de administración de torneos directamente aquí: */}
        <Route path="/admin/torneos" element={<TorneoAdminPage />} />

        {/* Si el usuario intenta ir a una ruta que no existe */}
        <Route path="*" element={<h1>404 | Página no encontrada</h1>} />
      </Routes>
    </Router>
  );
}

export default App;