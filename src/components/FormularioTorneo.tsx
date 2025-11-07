// src/components/FormularioTorneo.tsx (Implementación de nuevos campos)

import React, { useState } from 'react';
import type { FormularioTorneoProps, Torneo } from '../types'; 
import './FormularioTorneo.css';

// Función auxiliar para inicializar el estado del formulario (AÑADIR NUEVOS CAMPOS)
const initializeFormState = (torneo: Torneo | null) => ({
  nombre: torneo?.nombre || '',
  deporte: torneo?.deporte || '',
  fechaLimiteInscripcion: torneo?.fechaLimiteInscripcion || '',
  descripcion: torneo?.descripcion || '',
  lugar: torneo?.lugar || '',
  minJugadores: torneo?.minJugadores || 0, // Inicializar números a 0
  maxJugadores: torneo?.maxJugadores || 0,
  reglas: torneo?.reglas || '',
  // ... (otros campos)
});

const FormularioTorneo: React.FC<FormularioTorneoProps> = ({ torneo, onClose, onSuccess }) => {
  
  const [formData, setFormData] = useState(initializeFormState(torneo));
  const isEditing = !!torneo; 
  
  // Modificar handleChange para manejar correctamente números de los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Si es un campo de tipo número, convertimos el valor a número, sino lo mantenemos como cadena
    const newValue = type === 'number' ? parseInt(value) || 0 : value; 
    
    setFormData(prevData => ({ ...prevData, [name]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: IMPLEMENTAR VALIDACIÓN DE FRONTEND antes de llamar a la API
    if (formData.minJugadores > formData.maxJugadores) {
        alert('Error: La cantidad mínima de jugadores no puede ser mayor que la máxima.');
        return;
    }
    
    // Lógica de POST o PUT a la API (simulación)
    console.log('Datos de Torneo enviados:', formData);
    alert(`Torneo ${isEditing ? 'actualizado' : 'creado'} con éxito.`);

    onSuccess();
    onClose();
  };
  
  // Estructura del Modal (JSX)
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

          {/* Campo Deporte (Select - Dropdown) */}
          <div className="form-group">
            <label htmlFor="deporte">Deporte</label>
            {/* ... (Select con opciones de Deporte) ... */}
          </div>
          
          {/* Campo Lugar del Evento */}
          <div className="form-group">
            <label htmlFor="lugar">Lugar del Evento</label>
            <input type="text" id="lugar" name="lugar" value={formData.lugar} onChange={handleChange} required />
          </div>

          {/* Campo Fecha Límite de Inscripción */}
          <div className="form-group">
            <label htmlFor="fechaLimiteInscripcion">Fecha Límite de Inscripción</label>
            {/* ... (Input tipo date) ... */}
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

          {/* Campo Descripción del Torneo */}
          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            {/* ... (Textarea de descripción) ... */}
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