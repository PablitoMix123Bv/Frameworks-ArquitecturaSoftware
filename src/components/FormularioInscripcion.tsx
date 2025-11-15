// src/components/FormularioInscripcion.tsx (CORREGIDO)

import React, { useState, useEffect } from 'react';
import type { FormularioInscripcionProps, SolicitudInscripcion, Equipo, Torneo, JugadorInscripcion } from '../types'; 
import './FormularioInscripcion.css'; 
import { FaUpload } from 'react-icons/fa'; // Importamos un icono

interface FormularioInscripcionPropsActualizadas {
    torneo: Torneo;
    equipoAEditar?: Equipo; 
    onClose: () => void;
    onSuccess: (solicitud: SolicitudInscripcion) => void;
}

const FormularioInscripcion: React.FC<FormularioInscripcionPropsActualizadas> = ({ torneo, equipoAEditar, onClose, onSuccess }) => {
    
    const [nombreEquipo, setNombreEquipo] = useState(equipoAEditar?.nombre || '');
    const [integrantes, setIntegrantes] = useState(equipoAEditar?.jugadores.join('\n') || '');

    // --- 1. NUEVOS ESTADOS PARA EL ARCHIVO DE IMAGEN ---
    // El archivo real que se subiría al backend
    const [logoFile, setLogoFile] = useState<File | null>(null); 
    // La URL local para mostrar la vista previa
    const [logoPreview, setLogoPreview] = useState<string>(equipoAEditar?.logoUrl || '/img/logo_placeholder.png');

    const isEditing = !!equipoAEditar; 

    // --- 2. NUEVA FUNCIÓN PARA MANEJAR LA SELECCIÓN DE ARCHIVO ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file); // Guardamos el archivo
            
            // Creamos una URL de vista previa y la guardamos
            setLogoPreview(URL.createObjectURL(file)); 
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const jugadoresArray = integrantes.split('\n').filter(nombre => nombre.trim() !== '');

        if (jugadoresArray.length < (torneo.minJugadores || 1)) {
            alert(`Se requiere un mínimo de ${torneo.minJugadores} jugadores.`);
            return;
        }

        const integrantesCompletos: JugadorInscripcion[] = jugadoresArray.map((nombre, index) => {
            return {
                nombre: nombre.replace('(Capitán)', '').trim(), 
                expediente: '000000', 
                edad: 18, 
                fotoUrl: '', 
                esCapitan: index === 0 
            };
        });
        
        // --- 3. SIMULACIÓN DE SUBIDA ---
        // En una app real, aquí harías:
        // const urlDelBackend = await subirArchivoAlStorage(logoFile);
        // Por ahora, solo enviaremos la URL de vista previa (o la original)
        // y registraremos el archivo en consola.

        console.log('Archivo de logo para subir:', logoFile);

        const solicitud: SolicitudInscripcion = {
            idTorneo: torneo.id,
            nombreEquipo,
            logoUrl: logoPreview, // Usamos la URL de vista previa como placeholder
            integrantes: integrantesCompletos, 
            fechaSolicitud: new Date().toISOString().split('T')[0]
        };
        
        console.log(isEditing ? 'Actualizando solicitud:' : 'Enviando nueva solicitud:', solicitud);
        
        onSuccess(solicitud);
        alert(isEditing ? 'Solicitud actualizada y reenviada.' : 'Inscripción enviada para revisión.');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content-inscripcion"> 
                <button className="modal-close-button" onClick={onClose}>&times;</button>
                
                <h2>{isEditing ? 'Editar Solicitud de Inscripción' : 'Inscribir Equipo'}</h2>
                <h4>Torneo: {torneo.nombre}</h4>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nombreEquipo">Nombre del Equipo</label>
                        <input type="text" id="nombreEquipo" value={nombreEquipo} onChange={(e) => setNombreEquipo(e.target.value)} required />
                    </div>

                    {/* --- 4. NUEVO CAMPO DE CARGA DE LOGO --- */}
                    <div className="form-group-logo">
                        <label>Logo del Equipo (Opcional)</label>
                        <div className="logo-uploader">
                            <img src={logoPreview} alt="Vista previa del logo" className="logo-preview" />
                            
                            {/* Input de archivo real (oculto) */}
                            <input 
                                type="file" 
                                id="logoUpload" 
                                className="input-file-hidden" 
                                onChange={handleFileChange}
                                accept="image/png, image/jpeg" 
                            />
                            {/* Botón falso (label) que activa el input real */}
                            <label htmlFor="logoUpload" className="btn-file-upload">
                                <FaUpload /> {logoFile ? 'Cambiar Imagen' : 'Subir Imagen'}
                            </label>
                        </div>
                    </div>


                    <div className="form-group">
                        <label htmlFor="integrantes">Lista de Integrantes (un nombre por línea)</label>
                        <textarea 
                            id="integrantes" 
                            rows={8} 
                            value={integrantes} 
                            onChange={(e) => setIntegrantes(e.target.value)}
                            placeholder="Juan Pérez (Será el Capitán)&#10;Ana García&#10;Luis Martínez"
                            required
                        />
                        <small>Mínimo: {torneo.minJugadores} / Máximo: {torneo.maxJugadores}. El primer jugador de la lista será el capitán.</small>
                    </div>

                    <button type="submit" className="btn-primary">
                        {isEditing ? 'Reenviar Solicitud' : 'Enviar Inscripción'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormularioInscripcion;