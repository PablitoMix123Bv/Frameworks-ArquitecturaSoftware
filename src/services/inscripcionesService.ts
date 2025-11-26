// src/services/inscripcionesService.ts
import api from '../api/axios';
import type { InscripcionBackend } from '../types';

// --- CAPITÁN ---
export const inscribirEquipoEnTorneo = async (equipoId: string, torneoId: string) => {
    const { data } = await api.post('/inscripciones', { equipoId, torneoId });
    return data;
};

export const crearEquipo = async (nombre: string, jugadores: string[], logoUrl?: string) => {
    const { data } = await api.post('/equipos', { nombre, jugadores, logoUrl });
    return data;
};

export const getMisEquipos = async (userId: string): Promise<any[]> => {
    // ... (Misma implementación que tenías, funciona bien con los nuevos tipos)
    try {
        const { data } = await api.get<any[]>('/equipos');
        const misEquiposBackend = data.filter((e: any) => e.capitan && e.capitan.id === userId);
        return misEquiposBackend.map((miEquipo) => {
            const inscripcion = miEquipo.inscripciones && miEquipo.inscripciones.length > 0 
                ? miEquipo.inscripciones[0] : null;
            return {
                equipo: {
                    id: miEquipo.id,
                    nombre: miEquipo.nombre,
                    logoUrl: miEquipo.logoUrl 
                        ? (miEquipo.logoUrl.startsWith('http') ? miEquipo.logoUrl : `http://localhost:3000/uploads/equipos/${miEquipo.logoUrl}`)
                        : '/img/logo_placeholder.png',
                    facultad: 'Ingeniería',
                    victorias: miEquipo.victorias,
                    derrotas: miEquipo.derrotas,
                    empates: miEquipo.empates,
                    puntos: miEquipo.puntos,
                    jugadores: miEquipo.jugadores,
                    deporte: inscripcion?.torneo?.nombreDeporte || 'General',
                    noIntegrantes: miEquipo.noIntegrantes
                },
                rolUsuario: 'Capitán',
                solicitud: {
                    idTorneo: inscripcion?.torneo?.idTorneo,
                    estado: mapEstadoInscripcion(inscripcion?.estado), 
                    motivo: inscripcion?.comentarios || null
                }
            };
        });
    } catch (error) {
        console.error(error);
        return [];
    }
};

const mapEstadoInscripcion = (estado: string) => {
    if (!estado) return null;
    if (estado === 'APROBADO') return 'Aprobado';
    if (estado === 'PENDIENTE') return 'Pendiente';
    if (estado === 'RECHAZADO') return 'Rechazado';
    return 'Pendiente';
};

export const getMiEquipo = async (userId: string) => {
    const equipos = await getMisEquipos(userId);
    return equipos.length > 0 ? equipos[0].equipo : null;
};

// --- ADMINISTRADOR (Nuevas funciones) ---

// Obtener todas las inscripciones
export const getAllInscripciones = async (): Promise<InscripcionBackend[]> => {
    const { data } = await api.get<InscripcionBackend[]>('/inscripciones');
    return data;
};

// Actualizar estado (Aprobar/Rechazar)
export const updateEstadoInscripcion = async (idInscripcion: string, estado: 'APROBADO' | 'RECHAZADO' | 'PENDIENTE', comentarios?: string) => {
    const { data } = await api.patch(`/inscripciones/${idInscripcion}`, {
        estado,
        comentarios
    });
    return data;
};