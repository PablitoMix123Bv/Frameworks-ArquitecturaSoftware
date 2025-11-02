// src/components/FormularioAviso.tsx

import React, { useState } from 'react';
import type { FormularioAvisoProps, CategoriaAviso, PrioridadAviso } from '../types'; 
// Asumimos que los estilos de modal están disponibles

const mockTorneos = [{ id: 101, nombre: 'Fútbol Apertura' }, { id: 102, nombre: 'Baloncesto Relámpago' }];

const initialAvisoState = (aviso: FormularioAvisoProps['avisoAEditar']) => ({
  titulo: aviso?.titulo || '',
  contenido: aviso?.contenido || '',
  categoria: aviso?.categoria || 'GENERAL' as CategoriaAviso,
  prioridad: aviso?.prioridad || 'NORMAL' as PrioridadAviso,
  idTorneoAsociado: aviso?.idTorneoAsociado || null,
});

const FormularioAviso: React.FC<FormularioAvisoProps> = ({ avisoAEditar, onClose, onSuccess }) => {
  
  const [formData, setFormData] = useState(initialAvisoState(avisoAEditar));
  const isEditing = !!avisoAEditar; 
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Manejar el ID de torneo (número o null)
    let newValue: string | number | null = value;
    if (name === 'idTorneoAsociado') {
        newValue = value === '' ? null : parseInt(value);
    }

    setFormData(prevData => ({ ...prevData, [name]: newValue as any }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones de frontend
    if (formData.categoria === 'TORNEO' && !formData.idTorneoAsociado) {
        alert('Error: Un aviso de TORNEO debe estar asociado a un torneo.');
        return;
    }

    // Lógica de POST o PUT a la API (simulación)
    console.log('Aviso Guardado/Publicado:', formData);
    alert(`Aviso ${isEditing ? 'actualizado' : 'creado'} con éxito.`);

    onSuccess();
    onClose();
  };
  
  return (
    <div className="modal-overlay"> 
      <div className="modal-content"> 
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        
        <h2>{isEditing ? 'Editar Aviso' : 'Crear Nuevo Aviso'}</h2>
        
        <form onSubmit={handleSubmit}>
          
          {/* Título del Aviso */}
          <div className="form-group">
            <label htmlFor="titulo">Título</label>
            <input type="text" id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} required />
          </div>

          {/* Contenido/Cuerpo del Aviso */}
          <div className="form-group">
            <label htmlFor="contenido">Contenido / Detalles</label>
            <textarea id="contenido" name="contenido" rows={4} value={formData.contenido} onChange={handleChange} required />
          </div>
          
          {/* Categoría y Prioridad */}
          <div className="form-group-row">
            <div className="form-group half">
              <label htmlFor="categoria">Categoría</label>
              <select id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} required>
                <option value="GENERAL">GENERAL (Comunidad)</option>
                <option value="INSCRIPCIÓN">INSCRIPCIÓN (Fechas)</option>
                <option value="TORNEO">TORNEO (Partidos/Resultados)</option>
              </select>
            </div>
            <div className="form-group half">
              <label htmlFor="prioridad">Prioridad</label>
              <select id="prioridad" name="prioridad" value={formData.prioridad} onChange={handleChange} required>
                <option value="NORMAL">NORMAL</option>
                <option value="URGENTE">URGENTE (Notificación)</option>
              </select>
            </div>
          </div>
          
          {/* Asociación a Torneo (Condicional) */}
          <div className="form-group">
            <label htmlFor="idTorneoAsociado">Asociar a Torneo (Opcional)</label>
            <select id="idTorneoAsociado" name="idTorneoAsociado" value={formData.idTorneoAsociado || ''} onChange={handleChange}>
              <option value="">Ninguno (Aviso General)</option>
              {mockTorneos.map(torneo => (
                <option key={torneo.id} value={torneo.id}>{torneo.nombre}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            {isEditing ? 'Actualizar Aviso' : 'Publicar Aviso'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormularioAviso;