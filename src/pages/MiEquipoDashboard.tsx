// src/pages/MiEquipoDashboard.tsx

import React, { useEffect, useState } from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import FormularioRoster from '../components/FormularioRoster';
import { useAuth } from '../context/AuthContext';
import { getMisEquipos } from '../services/inscripcionesService';
import { createEquipo, uploadEquipoLogo } from '../services/equiposService';
import type { Equipo } from '../types';
import { FaPlus, FaUsers, FaCamera } from 'react-icons/fa';
import './MiEquipoDashboard.css'; 

interface MiEquipoData {
    equipo: Equipo;
    solicitud: { estado: string | null; motivo: string | null; };
}

const MiEquipoDashboard: React.FC = () => {
    const { user } = useAuth();
    const [misEquipos, setMisEquipos] = useState<MiEquipoData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [showCrearModal, setShowCrearModal] = useState(false);
    const [equipoParaRoster, setEquipoParaRoster] = useState<Equipo | null>(null);

    const [nombreNuevo, setNombreNuevo] = useState('');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchEquipos = async () => {
        if (!user) return;
        try {
            const data = await getMisEquipos(user.id);
            setMisEquipos(data);
        } catch (error) { console.error(error); } 
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchEquipos(); }, [user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleCrearEquipo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombreNuevo.trim()) return;
        setIsSubmitting(true);
        try {
            const equipoCreado = await createEquipo(nombreNuevo, []); 
            if (logoFile && equipoCreado.id) {
                await uploadEquipoLogo(equipoCreado.id, logoFile);
            }
            alert('¡Equipo creado! Ahora añade a tus jugadores en "Gestionar Jugadores".');
            setNombreNuevo(''); setLogoFile(null); setLogoPreview(null);
            setShowCrearModal(false);
            fetchEquipos();
        } catch (error: any) {
            alert('Error: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Función para renderizar la etiqueta de estado con estilos claros
    const renderEstadoTag = (estado: string | null) => {
        // Si no hay estado (null o undefined), mostramos "Sin Inscripción" en gris
        if (!estado) return <span className="estado-tag sin-inscripcion">Sin Inscripción</span>;
        
        const clase = estado.toLowerCase() === 'aprobado' ? 'aprobado' 
                    : estado.toLowerCase() === 'rechazado' ? 'rechazado-definitivo' 
                    : 'pendiente';
        
        return <span className={`estado-tag ${clase}`}>{estado}</span>;
    };

    return (
        <div>
            <HeaderNav />
            <div className="content-container">
                
                <div className="dashboard-header">
                    <div className="header-titles">
                        <h1>Mis Equipos</h1>
                        <p>Administra tu equipo y jugadores.</p>
                    </div>
                    <button className="btn-action-header" onClick={() => setShowCrearModal(true)}>
                        <FaPlus /> Registrar Nuevo Equipo
                    </button>
                </div>

                {isLoading ? <p>Cargando...</p> : (
                    misEquipos.length === 0 ? (
                        <div style={{textAlign:'center', padding:'40px', color:'#777'}}>
                            <h3>No tienes equipos registrados.</h3>
                            <p>Usa el botón de arriba para comenzar.</p>
                        </div>
                    ) : (
                        <div className="equipos-grid">
                            {misEquipos.map((item) => (
                                <div key={item.equipo.id} className="card-mi-equipo">
                                    <div className="card-mi-equipo-header">
                                        <img 
                                            src={item.equipo.logoUrl || '/img/logo_placeholder.png'} 
                                            alt="Logo" 
                                            className="mi-equipo-logo" 
                                        />
                                        <div className="mi-equipo-info">
                                            <h3>{item.equipo.nombre}</h3>
                                            <div className="meta-tags">
                                                <span className="deporte-badge">{item.equipo.deporte || 'General'}</span>
                                                {/* AQUÍ SE RENDERIZA EL ESTATUS */}
                                                {renderEstadoTag(item.solicitud.estado)}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {item.solicitud.motivo && (
                                        <div className="feedback-mensaje">
                                            <strong>Mensaje Admin:</strong> {item.solicitud.motivo}
                                        </div>
                                    )}

                                    {/* CORRECCIÓN 1: BOTÓN AZUL (btn-primary) */}
                                    <button 
                                        className="btn-primary" 
                                        style={{width:'100%', borderRadius:'8px', marginTop: 'auto'}} 
                                        onClick={() => setEquipoParaRoster(item.equipo)}
                                    >
                                        <FaUsers /> Gestionar Jugadores
                                    </button>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
            <Footer />

            {/* MODAL DE CREACIÓN */}
            {showCrearModal && (
                <div className="modal-overlay">
                    <div className="modal-content-unified">
                        <button className="modal-close-btn" onClick={() => setShowCrearModal(false)}>&times;</button>
                        
                        <div className="modal-header">
                            <h2>Registrar Equipo</h2>
                        </div>
                        
                        <form onSubmit={handleCrearEquipo}>
                            <div className="form-group">
                                <label>Nombre del Equipo</label>
                                <input 
                                    type="text" 
                                    className="form-control"
                                    value={nombreNuevo} 
                                    onChange={e => setNombreNuevo(e.target.value)} 
                                    required 
                                    placeholder="Ej. Los Rayos FC"
                                />
                            </div>

                            <div className="form-group">
                                <label>Logotipo (Opcional)</label>
                                <div className="logo-uploader-wrapper">
                                    <div className="logo-preview-circle">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Vista previa" className="logo-preview-img" />
                                        ) : (
                                            <span>Sin Logo</span>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="logoFile" className="btn-upload-custom">
                                            <FaCamera style={{marginRight:'5px'}}/> Seleccionar Imagen
                                        </label>
                                        <input 
                                            type="file" 
                                            id="logoFile" 
                                            className="input-file-hidden" 
                                            accept="image/png, image/jpeg" 
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{backgroundColor:'#E3F2FD', padding:'10px', borderRadius:'6px', marginBottom:'20px'}}>
                                <p style={{margin:0, fontSize:'0.85rem', color:'#0D47A1'}}>
                                    <strong>Nota:</strong> Al crear el equipo, tú serás el Capitán. Podrás agregar integrantes después.
                                </p>
                            </div>

                            <button type="submit" className="btn-primary" style={{width:'100%'}} disabled={isSubmitting}>
                                {isSubmitting ? 'Creando...' : 'Crear Equipo'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {equipoParaRoster && (
                <FormularioRoster 
                    equipo={equipoParaRoster} 
                    onClose={() => { setEquipoParaRoster(null); fetchEquipos(); }} 
                />
            )}
        </div>
    );
};

export default MiEquipoDashboard;