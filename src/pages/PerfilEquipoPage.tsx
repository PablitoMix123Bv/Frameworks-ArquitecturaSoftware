// src/pages/PerfilEquipoPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderNav from '../components/HeaderNav';
import type { Equipo } from '../types';
import './PerfilEquipoPage.css';
import Footer from '../components/Footer';
import { getEquipoById } from '../services/equiposService';

const PerfilEquipoPage: React.FC = () => {
  const { equipoId } = useParams<{ equipoId: string }>();
  const navigate = useNavigate();

  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipo = async () => {
      try {
        if (!equipoId) return;
        const data = await getEquipoById(equipoId);
        setEquipo(data);
      } catch (err) {
        console.error("Error cargando equipo:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipo();
  }, [equipoId]);

  if (loading) return (
      <div>
          <HeaderNav />
          <div className="content-container"><h1>Cargando equipo...</h1></div>
          <Footer />
      </div>
  );

  if (!equipo) return (
      <div>
          <HeaderNav />
          <div className="content-container"><h1>No se encontró el equipo</h1></div>
          <Footer />
      </div>
  );

  // CORRECCIÓN: Manejo seguro de logoUrl. 
  // Si es null, usamos el placeholder por defecto.
  const logoSrc = equipo.logoUrl || '/img/logo_placeholder.png';

  return (
    <div>
      <HeaderNav />
      <div className="content-container">

        <button onClick={() => navigate(-1)} className="btn-back">
          ← Regresar
        </button>

        <div className="perfil-header">
          {/* Aquí usamos la variable segura logoSrc */}
          <img src={logoSrc} alt={equipo.nombre} className="perfil-logo" />
          <h1>{equipo.nombre}</h1>
          <p>Facultad: {equipo.facultad || 'Ingeniería'}</p>
        </div>

        <div className="perfil-stats">
          <h2>Estadísticas del Torneo</h2>
          <p>
            Victorias: {equipo.victorias} | 
            Derrotas: {equipo.derrotas} | 
            Empates: {equipo.empates} | 
            Puntos: {equipo.puntos}
          </p>
        </div>

        <div className="perfil-jugadores">
          <h2>Jugadores</h2>
          {equipo.jugadores && equipo.jugadores.length > 0 ? (
              <ul>
                {equipo.jugadores.map((jugador, index) => (
                  <li key={index}>{jugador}</li>
                ))}
              </ul>
          ) : (
              <p>No hay jugadores registrados en este equipo.</p>
          )}
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default PerfilEquipoPage;