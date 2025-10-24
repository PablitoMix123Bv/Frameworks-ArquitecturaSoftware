// src/components/FormularioJornada.tsx

import React, { useState } from 'react';
import type { FormularioJornadaProps } from '../types'; 
import type { ProgramarPartidoData } from '../types'; 
import './FormularioJornada.css'; // Implementaremos los estilos a continuación


// Datos mock para simular la lista de torneos y equipos disponibles
const mockTorneosDisponibles = [{ id: 1, nombre: 'Torneo Fútbol Apertura' }, { id: 2, nombre: 'Torneo Baloncesto Clausura' }];
const mockEquiposDisponibles = [
    { id: 1, nombre: 'Hunters' },
    { id: 2, nombre: 'Castrosos' },
    { id: 3, nombre: 'Pythons' },
    { id: 4, nombre: 'Aston Birria' },
];

const initializeFormState = (partido: ProgramarPartidoData | null) => ({
  idTorneo: partido?.idTorneo || mockTorneosDisponibles[0].id,
  idEquipoLocal: partido?.idEquipoLocal || 0,
  idEquipoVisitante: partido?.idEquipoVisitante || 0,
  fecha: partido?.fecha || '',
  hora: partido?.hora || '17:00', // Hora por defecto
  lugar: partido?.lugar || 'Cancha Principal A',
});

const FormularioJornada: React.FC<FormularioJornadaProps> = ({ partidoAEditar, onClose, onSuccess }) => {
  
  const [formData, setFormData] = useState(initializeFormState(partidoAEditar));
  const isEditing = !!partidoAEditar; 
  const title = isEditing ? 'Editar Partido' : 'Programar Nuevo Partido';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Los IDs de equipo y torneo son números
    const newValue = name.startsWith('id') ? parseInt(value) || 0 : value; 
    setFormData(prevData => ({ ...prevData, [name]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones de frontend
    if (formData.idEquipoLocal === formData.idEquipoVisitante) {
        alert('Error: El equipo local y el equipo visitante no pueden ser el mismo.');
        return;
    }
    if (formData.idEquipoLocal === 0 || formData.idEquipoVisitante === 0) {
        alert('Error: Debe seleccionar ambos equipos.');
        return;
    }

    // Lógica de POST o PUT a la API (simulación)
    console.log('Datos de Jornada enviados:', formData);
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
          
          {/* SELECCIÓN DE TORNEO */}
          <div className="form-group">
            <label htmlFor="idTorneo">Torneo</label>
            <select id="idTorneo" name="idTorneo" value={formData.idTorneo} onChange={handleChange} required>
              {mockTorneosDisponibles.map(torneo => (
                <option key={torneo.id} value={torneo.id}>{torneo.nombre}</option>
              ))}
            </select>
          </div>
          
          {/* SELECCIÓN DE EQUIPOS */}
          <div className="form-group-row">
            <div className="form-group half">
              <label htmlFor="idEquipoLocal">Equipo Local</label>
              <select id="idEquipoLocal" name="idEquipoLocal" value={formData.idEquipoLocal} onChange={handleChange} required>
                <option value="0" disabled>Selecciona Local</option>
                {mockEquiposDisponibles.map(equipo => (
                  <option key={equipo.id} value={equipo.id}>{equipo.nombre}</option>
                ))}
              </select>
            </div>
            <div className="form-group half">
              <label htmlFor="idEquipoVisitante">Equipo Visitante</label>
              <select id="idEquipoVisitante" name="idEquipoVisitante" value={formData.idEquipoVisitante} onChange={handleChange} required>
                <option value="0" disabled>Selecciona Visitante</option>
                {mockEquiposDisponibles.map(equipo => (
                  <option key={equipo.id} value={equipo.id}>{equipo.nombre}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* FECHA Y HORA */}
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
          
          {/* LUGAR */}
          <div className="form-group">
            <label htmlFor="lugar">Lugar de Juego</label>
            <input type="text" id="lugar" name="lugar" value={formData.lugar} onChange={handleChange} required />
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