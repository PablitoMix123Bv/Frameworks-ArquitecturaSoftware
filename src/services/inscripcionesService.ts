// src/services/inscripcionesService.ts
import api from '../api/axios';
import type { Equipo, SolicitudInscripcion } from '../types';

// Inscribir equipo existente
export const inscribirEquipoEnTorneo = async (equipoId: string, torneoId: string) => {
    const { data } = await api.post('/inscripciones', { equipoId, torneoId });
    return data;
};

// Crear equipo nuevo
export const crearEquipo = async (nombre: string, jugadores: string[], logoUrl?: string) => {
    const { data } = await api.post('/equipos', { nombre, jugadores, logoUrl });
    return data;
};

// NUEVO: Obtener TODOS los equipos del capitán con sus inscripciones
export const getMisEquipos = async (userId: string): Promise<any[]> => {
    try {
        const { data } = await api.get<any[]>('/equipos');
        
        // Filtramos los equipos donde el usuario es capitán
        const misEquiposBackend = data.filter((e: any) => e.capitan && e.capitan.id === userId);

        // Mapeamos para incluir la info de inscripción (si existe)
        return misEquiposBackend.map((miEquipo) => {
            // Buscamos la inscripción más reciente o relevante
            const inscripcion = miEquipo.inscripciones && miEquipo.inscripciones.length > 0 
                ? miEquipo.inscripciones[0] // Tomamos la primera por simplicidad
                : null;

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
                    maxJugadores: inscripcion?.torneo?.maxJugadores || 0
                },
                rolUsuario: 'Capitán',
                solicitud: {
                    idTorneo: inscripcion?.torneo?.idTorneo,
                    // Mapeamos el estado del backend al del frontend
                    estado: mapEstadoInscripcion(inscripcion?.estado), 
                    motivo: inscripcion?.comentarios || null
                }
            };
        });
    } catch (error) {
        console.error("Error buscando equipos del capitán", error);
        return [];
    }
};

// Función auxiliar para traducir estados
const mapEstadoInscripcion = (estado: string) => {
    if (!estado) return null;
    if (estado === 'APROBADO') return 'Aprobado';
    if (estado === 'PENDIENTE') return 'Pendiente';
    if (estado === 'RECHAZADO') return 'Rechazado';
    return 'Pendiente';
};

// Mantenemos la anterior por compatibilidad si se usa en otro lado, o la redirigimos
export const getMiEquipo = async (userId: string) => {
    const equipos = await getMisEquipos(userId);
    return equipos.length > 0 ? equipos[0].equipo : null;
};