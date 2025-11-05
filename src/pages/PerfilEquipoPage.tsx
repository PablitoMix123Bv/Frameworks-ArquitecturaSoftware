// src/pages/PerfilEquipoPage.tsx

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderNav from '../components/HeaderNav';
import type { Equipo } from '../types';
import './PerfilEquipoPage.css';

// Mock de datos para simular la obtención de UN equipo específico
const mockEquipoDetalle: Equipo = {
  id: 1,
  nombre: 'Hunters',
  logoUrl: '/img/hunters.png',
  facultad: 'Facultad de Ingeniería',
  victorias: 5,
  derrotas: 1,
  empates: 2,
  puntos: 17,
  jugadores: ['Capitán Juan P.', 'Ana López', 'Carlos M.', 'Sofía G.', 'Pedro R.'],
  deporte: 'FÚTBOL',
};

const PerfilEquipoPage: React.FC = () => {
  // useParams: Hook de React Router DOM que extrae parámetros de la URL
  const { equipoId } = useParams<{ equipoId: string }>(); 
  const navigate = useNavigate();

  // En una aplicación real, aquí usarías useEffect para llamar a la API:
  // const [equipo, setEquipo] = useState<Equipo | null>(null);
  
  // Usamos el mock temporalmente
  const equipo = mockEquipoDetalle;

  if (!equipo) {
    return <h1>Cargando perfil del equipo {equipoId}...</h1>;
  }
  
  return (
    <div>
      <HeaderNav />
      <div className="content-container">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Regresar
        </button>
        
        <div className="perfil-header">
          <img src={equipo.logoUrl} alt={equipo.nombre} className="perfil-logo" />
          <h1>{equipo.nombre}</h1>
          <p>Facultad: {equipo.facultad}</p>
        </div>
        
        <div className="perfil-stats">
          <h2>Estadísticas del Torneo</h2>
          <p>Victorias: {equipo.victorias} | Derrotas: {equipo.derrotas} | Empates: {equipo.empates} | Puntos: **{equipo.puntos}**</p>
        </div>

        <div className="perfil-jugadores">
          <h2>Jugadores</h2>
          <ul>
            {equipo.jugadores.map((jugador, index) => (
              <li key={index}>{jugador}</li>
            ))}
          </ul>
        </div>
        
      </div>
    </div>
  );
};

export default PerfilEquipoPage;