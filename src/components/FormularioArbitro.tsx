// src/components/FormularioArbitro.tsx

import React, { useState } from 'react';
import type { FormularioArbitroProps } from '../types'; 
import "./FormularioArbitro.css"
// Reutilizamos estilos de modal

const FormularioArbitro: React.FC<FormularioArbitroProps> = ({ arbitroAEditar, onClose, onSuccess }) => {
  
  const initialData = {
    nombreCompleto: arbitroAEditar?.nombreCompleto || '',
    email: arbitroAEditar?.email || '',
    // El rol siempre será 'árbitro'
  };
  
  const [formData, setFormData] = useState(initialData);
  const isEditing = !!arbitroAEditar; 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Lógica de POST/PUT: Enviar formData + rol: 'árbitro'
    console.log(`Guardando árbitro: ${formData.nombreCompleto} como rol árbitro.`);
    alert(`Árbitro ${isEditing ? 'actualizado' : 'añadido'} con éxito.`);

    onSuccess();
    onClose();
  };
  
  return (
    <div className="modal-overlay"> 
      <div className="modal-content"> 
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        
        <h2>{isEditing ? 'Editar Árbitro' : 'Añadir Nuevo Árbitro'}</h2>
        
        <form onSubmit={handleSubmit}>
          
          {/* Nombre Completo */}
          <div className="form-group">
            <label htmlFor="nombreCompleto">Nombre Completo</label>
            <input type="text" id="nombreCompleto" name="nombreCompleto" value={formData.nombreCompleto} onChange={handleChange} required />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          
          {/* Nota: El campo rol es fijo ('árbitro') */}

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            {isEditing ? 'Guardar Cambios' : 'Añadir Árbitro'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormularioArbitro;