// src/pages/PerfilEquipoPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderNav from '../components/HeaderNav';
import type { Equipo } from '../types';
import { getEquipoById } from '../services/equiposService'; // Importar servicio real
import './PerfilEquipoPage.css';
import Footer from '../components/Footer';

const PerfilEquipoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // "id" debe coincidir con la ruta en App.tsx
  const navigate = useNavigate();
  
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipo = async () => {
        if (id) {
            const data = await getEquipoById(id);
            setEquipo(data);
        }
        setLoading(false);
    };
    fetchEquipo();
  }, [id]);

  if (loading) return <div className="content-container">Cargando perfil...</div>;
  
  if (!equipo) {
    return (
        <div className="content-container">
            <h2>Equipo no encontrado</h2>
            <button onClick={() => navigate(-1)} className="btn-back">Regresar</button>
        </div>
    );
  }
  
  return (
    <div>
      <HeaderNav />
      <div className="content-container">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Regresar
        </button>
        
        <div className="perfil-header">
          {/* El logo ahora usa la URL procesada por el servicio (localhost:3001...) */}
          <img src={equipo.logoUrl} alt={equipo.nombre} className="perfil-logo" />
          <h1>{equipo.nombre}</h1>
          <p>Facultad: {equipo.facultad}</p>
          <span style={{background: '#eee', padding: '5px 10px', borderRadius: '10px', fontSize: '0.9rem'}}>
            {equipo.deporte}
          </span>
        </div>
        
        <div className="perfil-stats">
          <h2>Estadísticas</h2>
          <p>Victorias: {equipo.victorias} | Derrotas: {equipo.derrotas} | Empates: {equipo.empates} | Puntos: <strong>{equipo.puntos}</strong></p>
        </div>

        <div className="perfil-jugadores">
          <h2>Jugadores Registrados</h2>
          {equipo.jugadores.length > 0 ? (
              <ul>
                {equipo.jugadores.map((jugador, index) => (
                  <li key={index}>{jugador}</li>
                ))}
              </ul>
          ) : (
              <p>No hay jugadores registrados aún.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PerfilEquipoPage;