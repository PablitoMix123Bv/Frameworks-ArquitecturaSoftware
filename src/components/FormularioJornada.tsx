// src/components/FormularioJornada.tsx

import React, { useState, useEffect } from 'react';
import type { FormularioJornadaProps, ProgramarPartidoData, Torneo, Equipo } from '../types';
import { getTorneos } from '../services/torneosService';
import { getEquiposPublicos } from '../services/equiposService';
import { createPartido } from '../services/partidosService'; 
import '../main.css'; // Estilos globales unificados

const initializeFormState = (partido: ProgramarPartidoData | null) => ({
  idTorneo: partido?.idTorneo || '',
  idEquipoLocal: partido?.idEquipoLocal || '',
  idEquipoVisitante: partido?.idEquipoVisitante || '',
  fecha: partido?.fecha || '',
  hora: partido?.hora || '17:00',
  lugar: partido?.lugar || 'Cancha Principal',
});

const FormularioJornada: React.FC<FormularioJornadaProps> = ({ partidoAEditar, onClose, onSuccess }) => {
  
  const [formData, setFormData] = useState(initializeFormState(partidoAEditar));
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [todosEquipos, setTodosEquipos] = useState<Equipo[]>([]);
  const [equiposFiltrados, setEquiposFiltrados] = useState<Equipo[]>([]); 
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!partidoAEditar; 
  const title = isEditing ? 'Editar Partido' : 'Programar Nuevo Partido';

  // 1. Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
        try {
            const [torneosData, equiposData] = await Promise.all([
                getTorneos(),
                getEquiposPublicos()
            ]);
            setTorneos(torneosData);
            setTodosEquipos(equiposData);
        } catch (e) {
            console.error("Error cargando datos:", e);
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, []);

  // 2. FILTRADO INTELIGENTE: Equipos aprobados en el torneo seleccionado
  useEffect(() => {
      if (!formData.idTorneo) {
          setEquiposFiltrados([]);
          return;
      }

      const validos = todosEquipos.filter(equipo => {
          if (!equipo.inscripciones) return false;
          return equipo.inscripciones.some((ins: any) => 
              ins.torneo?.idTorneo === formData.idTorneo && ins.estado === 'APROBADO'
          );
      });

      setEquiposFiltrados(validos);
      
      // Resetear selección si cambia el torneo
      setFormData(prev => ({...prev, idEquipoLocal: '', idEquipoVisitante: ''}));

  }, [formData.idTorneo, todosEquipos]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.idEquipoLocal === formData.idEquipoVisitante) {
        alert('El equipo local y visitante no pueden ser el mismo.');
        return;
    }

    setIsSubmitting(true);
    try {
        const fechaInicio = new Date(`${formData.fecha}T${formData.hora}:00`);
        const fechaFin = new Date(fechaInicio.getTime() + 90 * 60000); 

        const payload = {
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            lugar: formData.lugar,
            duracion: "90 min",
            estado: "POR INICIAR",
            idEquipos: [formData.idEquipoLocal, formData.idEquipoVisitante],
        };

        await createPartido(payload);
        onSuccess();
        onClose();
    } catch (error: any) {
        console.error(error);
        alert('Error: ' + (error.response?.data?.message || error.message));
    } finally {
        setIsSubmitting(false);
    }
  };
  
  if (loading) return <div className="modal-overlay"><div className="modal-content-unified"><p style={{textAlign:'center'}}>Cargando...</p></div></div>;

  return (
    <div className="modal-overlay"> 
      <div className="modal-content-unified"> 
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        <div className="modal-header">
            <h2>{title}</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Torneo</label>
            <select name="idTorneo" className="form-control" value={formData.idTorneo} onChange={handleChange} required>
              <option value="" disabled>Selecciona un torneo</option>
              {torneos.map(torneo => (
                <option key={torneo.id} value={torneo.id}>{torneo.nombre} ({torneo.deporte})</option>
              ))}
            </select>
          </div>
          
          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label>Local</label>
                <select 
                    name="idEquipoLocal" 
                    className="form-control" 
                    value={formData.idEquipoLocal} 
                    onChange={handleChange} 
                    required
                    disabled={!formData.idTorneo}
                >
                    <option value="" disabled>
                        {formData.idTorneo ? (equiposFiltrados.length > 0 ? 'Seleccionar' : 'Sin equipos') : 'Elige torneo'}
                    </option>
                    {equiposFiltrados.map(equipo => (
                    <option key={equipo.id} value={equipo.id}>{equipo.nombre}</option>
                    ))}
                </select>
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <label>Visitante</label>
                <select 
                    name="idEquipoVisitante" 
                    className="form-control" 
                    value={formData.idEquipoVisitante} 
                    onChange={handleChange} 
                    required
                    disabled={!formData.idTorneo}
                >
                    <option value="" disabled>
                        {formData.idTorneo ? (equiposFiltrados.length > 0 ? 'Seleccionar' : 'Sin equipos') : 'Elige torneo'}
                    </option>
                    {equiposFiltrados.map(equipo => (
                    <option key={equipo.id} value={equipo.id}>{equipo.nombre}</option>
                    ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-col">
                <div className="form-group">
                    <label>Fecha</label>
                    <input type="date" name="fecha" className="form-control" value={formData.fecha} onChange={handleChange} required />
                </div>
            </div>
            <div className="form-col">
                <div className="form-group">
                    <label>Hora</label>
                    <input type="time" name="hora" className="form-control" value={formData.hora} onChange={handleChange} required />
                </div>
            </div>
          </div>
          
          <div className="form-group">
            <label>Lugar</label>
            <input type="text" name="lugar" className="form-control" value={formData.lugar} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn-primary" style={{width:'100%', marginTop: 15}} disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Programar Partido'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormularioJornada;