// src/components/FormularioTorneo.tsx (CORREGIDO)

import React, { useState } from 'react';
import type { FormularioTorneoProps, Torneo } from '../types'; 
import './FormularioTorneo.css';

// Función auxiliar para inicializar el estado del formulario
const initializeFormState = (torneo: Torneo | null) => ({
  nombre: torneo?.nombre || '',
  deporte: torneo?.deporte || '',
  fechaLimiteInscripcion: torneo?.fechaLimiteInscripcion || '',
  descripcion: torneo?.descripcion || '',
  lugar: torneo?.lugar || '',
  minJugadores: torneo?.minJugadores || 0,
  maxJugadores: torneo?.maxJugadores || 0,
  reglas: torneo?.reglas || '',
  // Asumimos que también querrás manejar estas fechas
  fechaInicio: torneo?.fechaInicio || '',
  fechaFin: torneo?.fechaFin || '',
});

const FormularioTorneo: React.FC<FormularioTorneoProps> = ({ torneo, onClose, onSuccess }) => {
  
  const [formData, setFormData] = useState(initializeFormState(torneo));
  const isEditing = !!torneo; 
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    const newValue = type === 'number' ? parseInt(value) || 0 : value; 
    
    setFormData(prevData => ({ ...prevData, [name]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.minJugadores > formData.maxJugadores) {
        alert('Error: La cantidad mínima de jugadores no puede ser mayor que la máxima.');
        return;
    }
    
    console.log('Datos de Torneo enviados:', formData);
    alert(`Torneo ${isEditing ? 'actualizado' : 'creado'} con éxito.`);

    onSuccess();
    onClose();
  };
  
  return (
    <div className="modal-overlay"> 
      <div className="modal-content"> 
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        
        <h2>{isEditing ? 'Editar Torneo' : 'Generar Nuevo Torneo'}</h2>
        
        <form onSubmit={handleSubmit}>
          
          {/* Campo Nombre del Torneo */}
          <div className="form-group">
            <label htmlFor="nombre">Nombre del Torneo</label>
            <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
          </div>

          {/* --- CORRECCIÓN 1: CAMPO DEPORTE --- */}
          <div className="form-group">
            <label htmlFor="deporte">Deporte</label>
            <select id="deporte" name="deporte" value={formData.deporte} onChange={handleChange} required>
                <option value="" disabled>Seleccione un deporte</option>
                <option value="FÚTBOL">Fútbol</option>
                <option value="BALONCESTO">Baloncesto</option>
                <option value="VOLEIBOL">Voleibol</option>
                <option value="BÉISBOL">Béisbol</option>
            </select>
          </div>
          
          {/* Campo Lugar del Evento */}
          <div className="form-group">
            <label htmlFor="lugar">Lugar del Evento</label>
            <input type="text" id="lugar" name="lugar" value={formData.lugar} onChange={handleChange} required />
          </div>

          {/* --- CORRECCIÓN 2: CAMPO FECHA LÍMITE (CALENDARIO) --- */}
          <div className="form-group">
            <label htmlFor="fechaLimiteInscripcion">Fecha Límite de Inscripción</label>
            <input type="date" id="fechaLimiteInscripcion" name="fechaLimiteInscripcion" value={formData.fechaLimiteInscripcion} onChange={handleChange} required />
          </div>

          {/* GRUPO DE VALIDACIÓN DE JUGADORES */}
          <div className="form-group-row">
            <div className="form-group half">
              <label htmlFor="minJugadores">Min. Jugadores</label>
              <input type="number" id="minJugadores" name="minJugadores" value={formData.minJugadores} onChange={handleChange} min="1" required />
            </div>
            <div className="form-group half">
              <label htmlFor="maxJugadores">Máx. Jugadores</label>
              <input type="number" id="maxJugadores" name="maxJugadores" value={formData.maxJugadores} onChange={handleChange} min="1" required />
            </div>
          </div>
          
          {/* Campo Reglas Especiales */}
          <div className="form-group">
            <label htmlFor="reglas">Reglas Especiales</label>
            <textarea id="reglas" name="reglas" placeholder="Ingrese reglas específicas del torneo..." rows={4} value={formData.reglas} onChange={handleChange} />
          </div>

          {/* --- CORRECCIÓN 3: CAMPO DESCRIPCIÓN --- */}
          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea id="descripcion" name="descripcion" placeholder="Descripción breve del torneo..." rows={3} value={formData.descripcion} onChange={handleChange} />
          </div>


          <button type="submit" className="btn-primary">
            {isEditing ? 'Guardar Cambios' : 'Generar Torneo'}
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default FormularioTorneo;