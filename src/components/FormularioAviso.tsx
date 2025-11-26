// src/components/FormularioAviso.tsx

import React, { useState, useEffect } from 'react';
import type { FormularioAvisoProps, CategoriaAviso, PrioridadAviso, Torneo } from '../types';
import { createAviso, updateAviso } from '../services/avisosService';
import { getTorneos } from '../services/torneosService';
// Asegúrate de importar los estilos globales o el CSS unificado
import '../main.css'; 

const FormularioAviso: React.FC<FormularioAvisoProps> = ({ avisoAEditar, onClose, onSuccess }) => {
  
  const isEditing = !!avisoAEditar; 
  const [formData, setFormData] = useState({
    titulo: avisoAEditar?.titulo || '',
    contenido: avisoAEditar?.contenido || '',
    categoria: avisoAEditar?.categoria || 'GENERAL' as CategoriaAviso,
    prioridad: avisoAEditar?.prioridad || 'NORMAL' as PrioridadAviso,
    idTorneo: avisoAEditar?.torneo?.id || '', 
  });

  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
      const loadTorneos = async () => {
          try { const data = await getTorneos(); setTorneos(data); } catch (e) { console.error(e); }
      };
      loadTorneos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.categoria === 'TORNEO' && !formData.idTorneo) {
        alert('Selecciona un torneo para esta categoría.');
        return;
    }
    setIsSubmitting(true);
    try {
        const payload = { ...formData, idTorneo: formData.idTorneo || undefined };
        if (isEditing && avisoAEditar) await updateAviso(avisoAEditar.id, payload);
        else await createAviso(payload);
        
        onSuccess(); onClose();
    } catch (error: any) {
        alert('Error: ' + (error.response?.data?.message || error.message));
    } finally {
        setIsSubmitting(false);
    }
  };
  
  return (
    <div className="modal-overlay"> 
      <div className="modal-content-unified"> {/* CLASE MODERNA */}
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        <div className="modal-header">
            <h2>{isEditing ? 'Editar Aviso' : 'Nuevo Aviso'}</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título</label>
            <input type="text" name="titulo" className="form-control" value={formData.titulo} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Contenido</label>
            <textarea name="contenido" className="form-control" rows={4} value={formData.contenido} onChange={handleChange} required />
          </div>
          
          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label>Categoría</label>
                <select name="categoria" className="form-control" value={formData.categoria} onChange={handleChange} required>
                    <option value="GENERAL">General</option>
                    <option value="INSCRIPCIÓN">Inscripción</option>
                    <option value="TORNEO">Torneo</option>
                </select>
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <label>Prioridad</label>
                <select name="prioridad" className="form-control" value={formData.prioridad} onChange={handleChange} required>
                    <option value="NORMAL">Normal</option>
                    <option value="URGENTE">Urgente</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label>Asociar a Torneo</label>
            <select name="idTorneo" className="form-control" value={formData.idTorneo} onChange={handleChange} disabled={formData.categoria !== 'TORNEO'}>
              <option value="">-- Ninguno --</option>
              {torneos.map(t => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{width: '100%'}} disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar Aviso'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormularioAviso;