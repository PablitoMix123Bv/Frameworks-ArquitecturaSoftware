// src/components/FormularioTorneo.tsx
import React, { useState } from 'react';
import type { FormularioTorneoProps, Torneo } from '../types'; 
import { createTorneo, updateTorneo } from '../services/torneosService'; // Servicio
import './FormularioTorneo.css';

const initializeFormState = (torneo: Torneo | null) => ({
  nombre: torneo?.nombre || '',
  deporte: torneo?.deporte || 'FÚTBOL',
  fechaLimiteInscripcion: torneo?.fechaLimiteInscripcion || '',
  descripcion: torneo?.descripcion || '',
  lugar: torneo?.lugar || '',
  minJugadores: torneo?.minJugadores || 1,
  maxJugadores: torneo?.maxJugadores || 20,
  reglas: torneo?.reglas || '',
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
    
    try {
        if (isEditing && torneo) {
            await updateTorneo(torneo.id, formData);
            alert('Torneo actualizado');
        } else {
            // TypeScript necesita saber que formData cumple con Omit<Torneo, 'id'>
            // Convertimos a 'any' temporalmente para facilitar el paso al servicio
            await createTorneo(formData as any);
            alert('Torneo creado con éxito');
        }
        onSuccess(); // Esto recargará la tabla en el padre
    } catch (error) {
        console.error(error);
        alert('Error al guardar el torneo');
    }
  };
  
  return (
    <div className="modal-overlay"> 
      <div className="modal-content"> 
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        
        <h2>{isEditing ? 'Editar Torneo' : 'Generar Nuevo Torneo'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre del Torneo</label>
            <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="deporte">Deporte</label>
            <select id="deporte" name="deporte" value={formData.deporte} onChange={handleChange} required>
                <option value="FÚTBOL">Fútbol</option>
                <option value="BALONCESTO">Baloncesto</option>
                <option value="VOLEIBOL">Voleibol</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="lugar">Lugar</label>
            <input type="text" id="lugar" name="lugar" value={formData.lugar} onChange={handleChange} required />
          </div>

          <div className="form-group-row">
             <div className="form-group half">
                <label>Inicio</label>
                <input type="date" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} required />
             </div>
             <div className="form-group half">
                <label>Fin</label>
                <input type="date" name="fechaFin" value={formData.fechaFin} onChange={handleChange} required />
             </div>
          </div>

          <div className="form-group">
            <label htmlFor="fechaLimiteInscripcion">Límite Inscripción</label>
            <input type="date" id="fechaLimiteInscripcion" name="fechaLimiteInscripcion" value={formData.fechaLimiteInscripcion} onChange={handleChange} required />
          </div>

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
          
          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea id="descripcion" name="descripcion" rows={2} value={formData.descripcion} onChange={handleChange} />
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