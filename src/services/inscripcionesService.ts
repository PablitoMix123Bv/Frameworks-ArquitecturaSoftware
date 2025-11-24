// src/services/inscripcionesService.ts
import api from '../api/axios';
import type { Equipo } from '../types';

// --- Lógica del Capitán (Ya existente) ---
export const inscribirEquipoEnTorneo = async (equipoId: string, torneoId: string) => {
    const { data } = await api.post('/inscripciones', { equipoId, torneoId });
    return data;
};

export const crearEquipo = async (nombre: string, jugadores: string[], logoUrl?: string) => {
    const { data } = await api.post('/equipos', { nombre, jugadores, logoUrl });
    return data;
};

export const getMiEquipo = async (userId: string): Promise<Equipo | null> => {
    try {
        const equipos = await getMisEquipos(userId);
        return equipos.length > 0 ? equipos[0].equipo : null;
    } catch (error) {
        return null;
    }
};

export const getMisEquipos = async (userId: string): Promise<any[]> => {
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
                    // Lógica de logo segura
                    logoUrl: miEquipo.logoUrl 
                        ? (miEquipo.logoUrl.startsWith('http') ? miEquipo.logoUrl : `http://localhost:3001/uploads/equipos/${miEquipo.logoUrl}`)
                        : '/img/logo_placeholder.png',
                    facultad: 'Ingeniería',
                    victorias: miEquipo.victorias,
                    derrotas: miEquipo.derrotas,
                    empates: miEquipo.empates,
                    puntos: miEquipo.puntos,
                    jugadores: miEquipo.jugadores,
                    deporte: inscripcion?.torneo?.nombreDeporte || 'General',
                    maxJugadores: inscripcion?.torneo?.maxJugadores || 0
                },
                rolUsuario: 'Capitán',
                solicitud: {
                    idTorneo: inscripcion?.torneo?.idTorneo,
                    estado: inscripcion?.estado === 'APROBADO' ? 'Aprobado' : (inscripcion?.estado === 'RECHAZADO' ? 'Rechazado' : 'Pendiente'), 
                    motivo: inscripcion?.comentarios || null
                }
            };
        });
    } catch (error) {
        console.error("Error buscando equipos del capitán", error);
        return [];
    }
};

// --- NUEVA LÓGICA PARA EL ADMINISTRADOR ---

// 1. Obtener TODAS las inscripciones (para que el admin las revise)
export const getTodasInscripciones = async () => {
    const { data } = await api.get<any[]>('/inscripciones');
    
    // Mapeamos la respuesta cruda a un formato útil para la tabla
    return data.map(ins => ({
        id: ins.id, // ID de la inscripción
        torneo: ins.torneo?.nombreTorneo || 'Torneo Desconocido',
        deporte: ins.torneo?.nombreDeporte || 'General',
        equipo: ins.equipo?.nombre || 'Sin nombre',
        logoUrl: ins.equipo?.logoUrl 
            ? (ins.equipo.logoUrl.startsWith('http') ? ins.equipo.logoUrl : `http://localhost:3001/uploads/equipos/${ins.equipo.logoUrl}`)
            : '/img/logo_placeholder.png',
        integrantesCount: ins.equipo?.noIntegrantes || 0,
        estado: ins.estado, // PENDIENTE, APROBADO, RECHAZADO
        fechaSolicitud: ins.fechaSolicitud,
        cumpleRequisitos: ins.cumpleRequisitos
    }));
};

// 2. Actualizar Estado (Aprobar/Rechazar)
export const actualizarEstadoInscripcion = async (idInscripcion: string, estado: 'APROBADO' | 'RECHAZADO', comentarios?: string) => {
    const { data } = await api.patch(`/inscripciones/${idInscripcion}`, {
        estado,
        comentarios
    });
    return data;
};