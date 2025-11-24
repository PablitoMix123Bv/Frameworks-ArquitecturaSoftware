import api from '../api/axios';
import type { Equipo } from '../types';

// 1. Obtener la lista de todos los equipos (Esta es la que te faltaba)
export const getEquiposPublicos = async (): Promise<Equipo[]> => {
    const { data } = await api.get<any[]>('/equipos'); 
    
    return data.map(backendEquipo => {
        // Lógica para obtener el deporte de la primera inscripción (si existe)
        let deporteMostrado = 'General';
        if (backendEquipo.inscripciones && backendEquipo.inscripciones.length > 0) {
            // Buscamos si alguna inscripción tiene datos de torneo
            const ins = backendEquipo.inscripciones.find((i: any) => i.torneo?.nombreDeporte);
            if (ins) deporteMostrado = ins.torneo.nombreDeporte;
        }

        // Lógica de imagen (Puerto 3001)
        const logoUrlFinal = backendEquipo.logoUrl 
            ? (backendEquipo.logoUrl.startsWith('http') 
                ? backendEquipo.logoUrl 
                : `http://localhost:3001/uploads/equipos/${backendEquipo.logoUrl}`)
            : '/img/logo_placeholder.png';

        return {
            id: backendEquipo.id, 
            nombre: backendEquipo.nombre,
            logoUrl: logoUrlFinal,
            facultad: 'Ingeniería', 
            victorias: backendEquipo.victorias,
            derrotas: backendEquipo.derrotas,
            empates: backendEquipo.empates,
            puntos: backendEquipo.puntos,
            jugadores: backendEquipo.jugadores || [],
            deporte: deporteMostrado, 
            minJugadores: 0,
            maxJugadores: 0
        };
    });
};

// 2. Obtener un equipo individual por ID (Para el perfil)
export const getEquipoById = async (id: string): Promise<Equipo | null> => {
    try {
        const { data } = await api.get<any>(`/equipos/${id}`);
        
        const logoUrlFinal = data.logoUrl 
            ? (data.logoUrl.startsWith('http') ? data.logoUrl : `http://localhost:3001/uploads/equipos/${data.logoUrl}`)
            : '/img/logo_placeholder.png';

        let deporte = 'General';
        if (data.inscripciones && data.inscripciones.length > 0) {
             deporte = data.inscripciones[0].torneo?.nombreDeporte || 'General';
        }

        return {
            id: data.id,
            nombre: data.nombre,
            logoUrl: logoUrlFinal,
            facultad: 'Ingeniería',
            victorias: data.victorias,
            derrotas: data.derrotas,
            empates: data.empates,
            puntos: data.puntos,
            jugadores: data.jugadores || [],
            deporte: deporte,
            minJugadores: 0,
            maxJugadores: 0
        };
    } catch (error) {
        console.error("Error al cargar equipo:", error);
        return null;
    }
};