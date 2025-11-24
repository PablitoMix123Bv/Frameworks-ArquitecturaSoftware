import React, { useState, useEffect } from 'react';
import type { FormularioJornadaProps, ProgramarPartidoData, Torneo, Equipo } from '../types'; 
import { getTorneos } from '../services/torneosService';
import { getEquiposPublicos } from '../services/equiposService';
import './FormularioJornada.css'; 

// KOWALSKI ANALYSIS: Eliminados valores por defecto. Ahora todo inicia vacío.
const initializeFormState = (partido: ProgramarPartidoData | null) => ({
  idTorneo: partido?.idTorneo || '',
  idEquipoLocal: partido?.idEquipoLocal || '',
  idEquipoVisitante: partido?.idEquipoVisitante || '',
  fecha: partido?.fecha || '',
  hora: partido?.hora || '',   // Corregido: Sin hora simulada
  lugar: partido?.lugar || '', // Corregido: Sin lugar simulado
});

const FormularioJornada: React.FC<FormularioJornadaProps> = ({ partidoAEditar, onClose, onSuccess }) => {
  
  const [formData, setFormData] = useState(initializeFormState(partidoAEditar));
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  
  const isEditing = !!partidoAEditar; 
  const title = isEditing ? 'Editar Partido' : 'Programar Nuevo Partido';

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [torneosData, equiposData] = await Promise.all([
                getTorneos(),
                getEquiposPublicos()
            ]);
            setTorneos(torneosData);
            setEquipos(equiposData);
            
            // Si es creación, no pre-seleccionamos nada para no asumir datos
        } catch (error) {
            console.error("Error cargando datos para jornada", error);
        }
    };
    fetchData();
  }, [isEditing]); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (formData.idEquipoLocal === formData.idEquipoVisitante) {
        alert('Error: El equipo local y el equipo visitante no pueden ser el mismo.');
        return;
    }
    if (!formData.idEquipoLocal || !formData.idEquipoVisitante) {
        alert('Error: Debe seleccionar ambos equipos.');
        return;
    }
    if (!formData.idTorneo) {
        alert('Error: Debe seleccionar un torneo.');
        return;
    }

    // Aquí iría la llamada real al servicio
    console.log('Datos de Jornada:', formData);
    
    // Feedback real
    alert(`Partido ${isEditing ? 'actualizado' : 'programado'} con éxito.`);

    onSuccess();
    onClose();
  };
  
  return (
    <div className="modal-overlay"> 
      <div className="modal-content-jornada"> 
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        
        <h2>{title}</h2>
        
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="idTorneo">Torneo</label>
            <select id="idTorneo" name="idTorneo" value={formData.idTorneo} onChange={handleChange} required>
              <option value="" disabled>Selecciona un Torneo</option>
              {torneos.map(torneo => (
                <option key={torneo.id} value={torneo.id}>{torneo.nombre}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group-row">
            <div className="form-group half">
              <label htmlFor="idEquipoLocal">Equipo Local</label>
              <select id="idEquipoLocal" name="idEquipoLocal" value={formData.idEquipoLocal} onChange={handleChange} required>
                <option value="" disabled>Selecciona Local</option>
                {equipos.map(equipo => (
                  <option key={equipo.id} value={equipo.id}>{equipo.nombre}</option>
                ))}
              </select>
            </div>
            <div className="form-group half">
              <label htmlFor="idEquipoVisitante">Equipo Visitante</label>
              <select id="idEquipoVisitante" name="idEquipoVisitante" value={formData.idEquipoVisitante} onChange={handleChange} required>
                <option value="" disabled>Selecciona Visitante</option>
                {equipos.map(equipo => (
                  <option key={equipo.id} value={equipo.id}>{equipo.nombre}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group-row">
            <div className="form-group half">
              <label htmlFor="fecha">Fecha</label>
              <input type="date" id="fecha" name="fecha" value={formData.fecha} onChange={handleChange} required />
            </div>
            <div className="form-group half">
              <label htmlFor="hora">Hora</label>
              <input type="time" id="hora" name="hora" value={formData.hora} onChange={handleChange} required />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="lugar">Lugar de Juego</label>
            <input type="text" id="lugar" name="lugar" value={formData.lugar} onChange={handleChange} required placeholder="Ej: Cancha 1" />
          </div>

          <button type="submit" className="btn-primary">
            {isEditing ? 'Guardar Cambios' : 'Programar Partido'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormularioJornada;