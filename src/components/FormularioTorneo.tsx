// src/components/FormularioTorneo.tsx

import React, { useState, useEffect } from 'react';
import type { FormularioTorneoProps, Torneo } from '../types'; 
import { createTorneo, updateTorneo, getDeportesUnicos } from '../services/torneosService';
import '../main.css'; // Importamos estilos globales unificados
//import './FormularioTorneo.css'; // Estilos específicos (si los hubiera)

const initializeFormState = (torneo: Torneo | null) => ({
  nombre: torneo?.nombre || '',
  deporte: torneo?.deporte || '',
  fechaLimiteInscripcion: torneo?.fechaLimiteInscripcion || '',
  descripcion: torneo?.descripcion || '',
  detalles: torneo?.detalles || '', // Nuevo campo
  lugar: torneo?.lugar || '',
  minJugadores: torneo?.minJugadores || 1,
  maxJugadores: torneo?.maxJugadores || 20,
  reglas: torneo?.reglas || '', // Nuevo campo
  fechaInicio: torneo?.fechaInicio || '',
  fechaFin: torneo?.fechaFin || '',
});

const FormularioTorneo: React.FC<FormularioTorneoProps> = ({ torneo, onClose, onSuccess }) => {
  
  const [formData, setFormData] = useState(initializeFormState(torneo));
  const [listaDeportes, setListaDeportes] = useState<string[]>([]);
  const isEditing = !!torneo; 
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Cargar deportes existentes para sugerencias (Autocompletado inteligente)
  useEffect(() => {
      const cargarDeportes = async () => {
          try {
              const deps = await getDeportesUnicos();
              setListaDeportes(deps.filter(d => d !== 'TODOS'));
          } catch (error) {
              console.error("Error cargando deportes", error);
          }
      };
      cargarDeportes();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseInt(value) || 0 : value; 
    setFormData(prevData => ({ ...prevData, [name]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        if (isEditing && torneo) {
            await updateTorneo(torneo.id, formData);
            alert('Torneo actualizado correctamente.');
        } else {
            // El servicio se encarga de crear el torneo y el nuevo deporte si no existía
            await createTorneo(formData as any);
            alert('Torneo creado exitosamente.');
        }
        onSuccess(); 
    } catch (error: any) {
        console.error(error);
        alert('Error al guardar: ' + (error.response?.data?.message || error.message));
    } finally {
        setIsSubmitting(false);
    }
  };
  
  return (
    <div className="modal-overlay"> 
      {/* Usamos la clase unificada para diseño consistente */}
      <div className="modal-content-unified" style={{maxWidth: '650px'}}> 
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        <div className="modal-header">
            <h2>{isEditing ? 'Editar Torneo' : 'Registrar Nuevo Torneo'}</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          
          {/* SECCIÓN 1: DATOS PRINCIPALES */}
          <div className="form-group">
            <label>Nombre del Torneo</label>
            <input 
                type="text" 
                name="nombre" 
                className="form-control" 
                value={formData.nombre} 
                onChange={handleChange} 
                required 
            />
          </div>

          <div className="form-row">
             <div className="form-col">
                <div className="form-group">
                    <label>Deporte</label>
                    {/* INPUT DE TEXTO + DATALIST: Permite escribir nuevo o seleccionar existente */}
                    <input 
                        type="text" 
                        name="deporte" 
                        className="form-control" 
                        value={formData.deporte} 
                        onChange={handleChange} 
                        list="lista-deportes-sugeridos"
                        required 
                        autoComplete="off"
                    />
                    <datalist id="lista-deportes-sugeridos">
                        {listaDeportes.map(dep => <option key={dep} value={dep} />)}
                    </datalist>
                </div>
             </div>
             <div className="form-col">
                <div className="form-group">
                    <label>Lugar / Sede</label>
                    <input type="text" name="lugar" className="form-control" value={formData.lugar} onChange={handleChange} required />
                </div>
             </div>
          </div>

          {/* SECCIÓN 2: FECHAS */}
          <div className="form-row">
             <div className="form-col">
                <div className="form-group">
                    <label>Fecha Inicio</label>
                    <input type="date" name="fechaInicio" className="form-control" value={formData.fechaInicio} onChange={handleChange} required />
                </div>
             </div>
             <div className="form-col">
                <div className="form-group">
                    <label>Fecha Fin</label>
                    <input type="date" name="fechaFin" className="form-control" value={formData.fechaFin} onChange={handleChange} required />
                </div>
             </div>
             <div className="form-col">
                <div className="form-group">
                    <label>Cierre Inscripción</label>
                    <input type="date" name="fechaLimiteInscripcion" className="form-control" value={formData.fechaLimiteInscripcion} onChange={handleChange} required />
                </div>
             </div>
          </div>

          {/* SECCIÓN 3: REGLAS DE JUGADORES */}
          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label>Min. Jugadores</label>
                <input type="number" name="minJugadores" className="form-control" value={formData.minJugadores} onChange={handleChange} min="1" required />
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <label>Máx. Jugadores</label>
                <input type="number" name="maxJugadores" className="form-control" value={formData.maxJugadores} onChange={handleChange} min="1" required />
              </div>
            </div>
          </div>
          
          {/* SECCIÓN 4: DETALLES EXTENDIDOS */}
          <div className="form-group">
            <label>Descripción Breve</label>
            <input 
                type="text" 
                name="descripcion" 
                className="form-control" 
                value={formData.descripcion} 
                onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Detalles Adicionales</label>
            <textarea 
                name="detalles" 
                className="form-control" 
                rows={2} 
                value={formData.detalles} 
                onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Reglas del Torneo</label>
            <textarea 
                name="reglas" 
                className="form-control" 
                rows={3} 
                value={formData.reglas} 
                onChange={handleChange} 
            />
          </div>

          <button type="submit" className="btn-primary" style={{width: '100%', marginTop: 20}} disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Torneo')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormularioTorneo;