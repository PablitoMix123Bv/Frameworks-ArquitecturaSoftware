import React, { useState, useEffect } from 'react';
import type { FormularioAvisoProps, CategoriaAviso, PrioridadAviso, Torneo } from '../types'; 
import { getTorneos } from '../services/torneosService';
import { createAviso, updateAviso } from '../services/avisosService'; // Asegúrate de tener updateAviso exportado
import './FormularioAviso.css';

const initialAvisoState = (aviso: FormularioAvisoProps['avisoAEditar']) => ({
  titulo: aviso?.titulo || '',
  contenido: aviso?.contenido || '',
  categoria: aviso?.categoria || 'GENERAL' as CategoriaAviso,
  prioridad: aviso?.prioridad || 'NORMAL' as PrioridadAviso,
  idTorneoAsociado: aviso?.idTorneoAsociado || '',
});

const FormularioAviso: React.FC<FormularioAvisoProps> = ({ avisoAEditar, onClose, onSuccess }) => {
  
  const [formData, setFormData] = useState(initialAvisoState(avisoAEditar));
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const isEditing = !!avisoAEditar; 

  // Cargar torneos reales
  useEffect(() => {
    const fetchTorneos = async () => {
        try {
            const data = await getTorneos();
            setTorneos(data);
        } catch (error) {
            console.error("Error al cargar torneos", error);
        }
    };
    fetchTorneos();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.categoria === 'TORNEO' && !formData.idTorneoAsociado) {
        alert('Error: Un aviso de TORNEO debe estar asociado a un torneo.');
        return;
    }

    try {
        if (isEditing && avisoAEditar) {
            await updateAviso(avisoAEditar.id, formData);
        } else {
            await createAviso(formData);
        }
        alert(`Aviso ${isEditing ? 'actualizado' : 'creado'} con éxito.`);
        onSuccess();
        onClose();
    } catch (error) {
        console.error(error);
        alert('Error al guardar el aviso.');
    }
  };
  
  return (
    <div className="modal-overlay"> 
      <div className="modal-content"> 
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        
        <h2>{isEditing ? 'Editar Aviso' : 'Crear Nuevo Aviso'}</h2>
        
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="titulo">Título</label>
            <input type="text" id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="contenido">Contenido / Detalles</label>
            <textarea id="contenido" name="contenido" rows={4} value={formData.contenido} onChange={handleChange} required />
          </div>
          
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
          
          <div className="form-group">
            <label htmlFor="idTorneoAsociado">Asociar a Torneo (Opcional)</label>
            <select id="idTorneoAsociado" name="idTorneoAsociado" value={formData.idTorneoAsociado || ''} onChange={handleChange}>
              <option value="">Ninguno (Aviso General)</option>
              {torneos.map(torneo => (
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