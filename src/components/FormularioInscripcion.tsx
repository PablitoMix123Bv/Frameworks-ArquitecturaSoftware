// ...existing code...
import React, { useState } from 'react';
import type { FormularioInscripcionProps, JugadorInscripcion, SolicitudInscripcion } from '../types'; 
import './FormularioInscripcion.css'; 

const initialJugador: JugadorInscripcion = { nombre: '', expediente: '', edad: 18, fotoUrl: '', esCapitan: false };

const FormularioInscripcion: React.FC<FormularioInscripcionProps> = ({ idTorneo, minJugadores, maxJugadores, onClose, onSuccess }) => {
  
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null); // Para el logo del equipo
  const [integrantes, setIntegrantes] = useState<JugadorInscripcion[]>([{ ...initialJugador, esCapitan: true }]); // Inicia con 1 capitán
  const [error, setError] = useState('');

  type JugadorCampo = Exclude<keyof JugadorInscripcion, 'esCapitan'>;

// ...existing code...
  const handleJugadorChange = (index: number, field: JugadorCampo, value: string) => {
    const nuevosIntegrantes = [...integrantes];
    const jugadorActual = { ...nuevosIntegrantes[index] };

    if (field === 'edad') {
      jugadorActual.edad = value === '' ? 0 : parseInt(value, 10);
    } else if (field === 'nombre') {
      jugadorActual.nombre = value;
    } else if (field === 'expediente') {
      jugadorActual.expediente = value;
    } else if (field === 'fotoUrl') {
      jugadorActual.fotoUrl = value;
    }

    nuevosIntegrantes[index] = jugadorActual;
    setIntegrantes(nuevosIntegrantes);
  };
  
  const addJugador = () => {
    if (integrantes.length >= maxJugadores) {
        setError(`Límite excedido: El torneo solo permite hasta ${maxJugadores} jugadores.`);
        return;
    }
    setIntegrantes([...integrantes, { ...initialJugador, esCapitan: false }]);
    setError('');
  };
  
  const removeJugador = (index: number) => {
    if (integrantes[index].esCapitan) {
        setError('No puede eliminar al capitán. Asigne el rol a otro jugador antes de eliminar.');
        return;
    }
    setIntegrantes(integrantes.filter((_, i) => i !== index));
    setError('');
  };

  // --- LÓGICA DE ENVÍO Y VALIDACIÓN ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validación de cantidad mínima
    if (integrantes.length < minJugadores) {
        setError(`El equipo necesita al menos ${minJugadores} jugadores para inscribirse.`);
        return;
    }
    
    // 2. Validación de campos obligatorios (Ej: nombre del equipo y nombre de jugadores)
    if (!nombreEquipo.trim()) {
        setError('Debe ingresar el nombre del equipo.');
        return;
    }
    
    // 3. Simulación de la solicitud de inscripción
    const solicitud: SolicitudInscripcion = {
        idTorneo,
        nombreEquipo,
        logoUrl: logoFile ? logoFile.name : '', // En la vida real, se sube el archivo
        integrantes,
        fechaSolicitud: new Date().toISOString().split('T')[0],
    };
    
    console.log('Solicitud de Inscripción enviada para revisión:', solicitud);
    alert('Solicitud enviada. Espere la aprobación del coordinador.');
    
    onSuccess();
    onClose();
  };


  return (
    <div className="modal-overlay">
      <div className="modal-content-inscripcion">
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <h2>Inscripción de Equipo al Torneo #{idTorneo}</h2>
        
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          
          {/* SECCIÓN 1: DATOS DEL EQUIPO */}
          <section className="seccion-equipo">
            <h3>Datos del Equipo</h3>
            <div className="form-group">
              <label htmlFor="nombreEquipo">Nombre del Equipo</label>
              <input type="text" id="nombreEquipo" value={nombreEquipo} onChange={(e) => setNombreEquipo(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="logo">Logo del Equipo (Subir Archivo)</label>
              <input type="file" id="logo" accept="image/*" onChange={(e) => setLogoFile(e.target.files ? e.target.files[0] : null)} />
            </div>
          </section>

          {/* SECCIÓN 2: INTEGRANTES DEL EQUIPO */}
          <section className="seccion-integrantes">
            <h3>Integrantes (Mín: {minJugadores}, Actual: {integrantes.length})</h3>
            
            {integrantes.map((jugador, index) => (
                <div key={index} className={`jugador-card ${jugador.esCapitan ? 'capitan' : ''}`}>
                    <span className="rol-label">{jugador.esCapitan ? 'CAPITÁN' : `Jugador ${index}`}</span>
                    
                    <div className="form-group-row">
                        <input type="text" placeholder="Nombre Completo" value={jugador.nombre} onChange={(e) => handleJugadorChange(index, 'nombre', e.target.value)} required />
                        <input type="text" placeholder="Expediente/Matrícula" value={jugador.expediente} onChange={(e) => handleJugadorChange(index, 'expediente', e.target.value)} required />
                        <input type="number" placeholder="Edad" value={jugador.edad} onChange={(e) => handleJugadorChange(index, 'edad', e.target.value)} min={18} required />
                    </div>
                    
                    <div className="form-group-row">
                        <input type="file" onChange={(e) => {
                          const file = e.target.files ? e.target.files[0] : null;
                          if (file) {
                            const nuevos = [...integrantes];
                            nuevos[index] = { ...nuevos[index], fotoUrl: file.name };
                            setIntegrantes(nuevos);
                          }
                        }} />
                        
                        {!jugador.esCapitan && (
                            <button type="button" onClick={() => removeJugador(index)} className="btn-remove">
                                Eliminar
                            </button>
                        )}
                    </div>
                </div>
            ))}
            
            <button type="button" onClick={addJugador} className="btn-add">
                + Añadir Jugador
            </button>
          </section>
          
          <button type="submit" className="btn-primary submit-btn">
            Enviar Solicitud de Inscripción
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormularioInscripcion;
// ...existing code...