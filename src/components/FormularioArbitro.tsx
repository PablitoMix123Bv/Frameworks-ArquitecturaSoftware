// src/components/FormularioArbitro.tsx

import React, { useState, useEffect } from 'react';
import type { FormularioArbitroProps, Usuario } from '../types'; 
import { registerUser } from '../services/authService';
import { getUsers, updateUserRole } from '../services/userService';
import "./FormularioArbitro.css";

const FormularioArbitro: React.FC<FormularioArbitroProps> = ({ onClose, onSuccess }) => {
  
  const [modo, setModo] = useState<'NUEVO' | 'EXISTENTE'>('NUEVO');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [idUsuarioSeleccionado, setIdUsuarioSeleccionado] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado para mensajes (Reemplaza a los alerts feos)
  const [status, setStatus] = useState<{type: 'success' | 'error' | '', msg: string}>({type: '', msg: ''});

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '', email: '', expediente: '', password: ''
  });

  useEffect(() => {
    if (modo === 'EXISTENTE') {
        const loadUsers = async () => {
            try {
                const data = await getUsers();
                // Filtramos a los que NO son árbitros ni admins
                const candidatos = data.filter(u => !u.roles.includes('arbitro') && !u.roles.includes('admin'));
                setUsuarios(candidatos);
            } catch (error) {
                console.error("Error cargando usuarios", error);
            }
        };
        loadUsers();
    }
    setStatus({type: '', msg: ''}); // Limpiar mensajes al cambiar tab
  }, [modo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({type: '', msg: ''});
    setIsSubmitting(true);

    try {
        if (modo === 'NUEVO') {
            // 1. Registrar usuario
            const usuarioCreado = await registerUser(
                nuevoUsuario.nombre, 
                nuevoUsuario.email, 
                nuevoUsuario.expediente, 
                nuevoUsuario.password
            );

            if (usuarioCreado && usuarioCreado.id) {
                // 2. Asignar rol. IMPORTANTE: Esto funcionará gracias al cambio en el DTO del backend
                await updateUserRole(usuarioCreado.id, ['arbitro']);
                
                setStatus({type: 'success', msg: `¡Éxito! El árbitro ${nuevoUsuario.nombre} ha sido registrado.`});
                
                // Esperamos un momento para que el usuario lea el mensaje antes de cerrar
                setTimeout(() => { onSuccess(); onClose(); }, 1500);
            }

        } else {
            if (!idUsuarioSeleccionado) {
                setStatus({type: 'error', msg: 'Debes seleccionar un usuario de la lista.'});
                setIsSubmitting(false);
                return;
            }

            const usuarioOriginal = usuarios.find(u => u.id === idUsuarioSeleccionado);
            if (usuarioOriginal) {
                // Mantener roles previos + arbitro
                const nuevosRoles = [...usuarioOriginal.roles, 'arbitro'];
                await updateUserRole(usuarioOriginal.id, nuevosRoles);
                
                setStatus({type: 'success', msg: `¡Listo! ${usuarioOriginal.nombre} ahora tiene permisos de árbitro.`});
                
                setTimeout(() => { onSuccess(); onClose(); }, 1500);
            }
        }

    } catch (error: any) {
        console.error(error);
        let errMsg = 'Ocurrió un error inesperado.';
        
        // Mensajes amigables
        if (error.response?.data?.message) {
            const backendMsg = error.response.data.message;
            if (Array.isArray(backendMsg)) errMsg = backendMsg.join(', ');
            else if (backendMsg.includes('Key (email)')) errMsg = 'El correo electrónico ya está en uso.';
            else if (backendMsg.includes('Key (expediente)')) errMsg = 'El expediente ya está registrado.';
            else errMsg = backendMsg;
        }
        
        setStatus({type: 'error', msg: errMsg});
    } finally {
        setIsSubmitting(false);
    }
  };

  const usuariosFiltrados = usuarios.filter(u => 
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.expediente.includes(busqueda)
  );

  return (
    <div className="modal-overlay"> 
      <div className="modal-content-arbitro"> 
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        
        <h2>Gestión de Árbitros</h2>

        {/* Mensaje de Estado Integrado */}
        {status.msg && (
            <div className={`status-message ${status.type}`}>
                {status.msg}
            </div>
        )}

        <div className="tabs-arbitro">
            <button 
                type="button" 
                className={`tab-btn ${modo === 'NUEVO' ? 'active' : ''}`}
                onClick={() => setModo('NUEVO')}
            >
                Nuevo (Externo)
            </button>
            <button 
                type="button" 
                className={`tab-btn ${modo === 'EXISTENTE' ? 'active' : ''}`}
                onClick={() => setModo('EXISTENTE')}
            >
                Existente (Alumno)
            </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          
          {modo === 'NUEVO' ? (
            <>
                <div className="form-group">
                    <label>Nombre Completo</label>
                    <input type="text" value={nuevoUsuario.nombre} onChange={e => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label>Expediente (o ID)</label>
                    <input type="text" value={nuevoUsuario.expediente} onChange={e => setNuevoUsuario({...nuevoUsuario, expediente: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={nuevoUsuario.email} onChange={e => setNuevoUsuario({...nuevoUsuario, email: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label>Contraseña</label>
                    <input type="password" value={nuevoUsuario.password} onChange={e => setNuevoUsuario({...nuevoUsuario, password: e.target.value})} required minLength={6} />
                </div>
            </>
          ) : (
            <>
                <div className="form-group">
                    <label>Buscar Usuario</label>
                    <input 
                        type="text" 
                        placeholder="Nombre o Expediente..." 
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        autoFocus
                    />
                </div>
                
                {/* LISTA PERSONALIZADA (No más select feo) */}
                <div className="form-group">
                    <label>Seleccionar de la lista:</label>
                    <div className="user-selection-list">
                        {usuariosFiltrados.length === 0 ? (
                            <div style={{padding:'15px', color:'#999', textAlign:'center'}}>No se encontraron usuarios.</div>
                        ) : (
                            usuariosFiltrados.map(u => (
                                <div 
                                    key={u.id} 
                                    className={`user-item ${idUsuarioSeleccionado === u.id ? 'selected' : ''}`}
                                    onClick={() => setIdUsuarioSeleccionado(u.id)}
                                >
                                    <div className="user-avatar">
                                        {u.nombre.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="user-info">
                                        <span className="user-name">{u.nombre}</span>
                                        <span className="user-meta">{u.email} • {u.expediente}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </>
          )}

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Procesando...' : (modo === 'NUEVO' ? 'Crear Árbitro' : 'Asignar Rol')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormularioArbitro;