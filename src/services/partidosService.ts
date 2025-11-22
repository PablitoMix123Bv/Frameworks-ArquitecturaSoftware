// src/services/partidosService.ts
import api from '../api/axios';
import type { Partido } from '../types';

// Función auxiliar para determinar estado (si el backend devuelve algo distinto)
const mapEstado = (estadoBackend: string): any => {
    // Aseguramos compatibilidad con los estados del frontend
    const est = estadoBackend.toUpperCase();
    if (['FINALIZADO', 'EN PROCESO', 'POR INICIAR', 'CANCELADO'].includes(est)) {
        return est;
    }
    return 'POR INICIAR'; // Default
};

export const getPartidos = async (): Promise<Partido[]> => {
    const { data } = await api.get<any[]>('/partidos');

    return data.map(p => {
        // Intentamos obtener el deporte desde la jornada -> torneo
        const deporte = p.jornada?.torneo?.nombreDeporte || 'GENERAL';

        // Mapeo de equipos (El backend devuelve array 'equipos' dentro del partido)
        // Asumimos que equipos[0] es local y equipos[1] es visitante
        const equipoLocal = p.equipos && p.equipos[0] 
            ? { nombre: p.equipos[0].nombre, logoUrl: p.equipos[0].logo || '/img/logo_placeholder.png' }
            : { nombre: 'TBD', logoUrl: '/img/logo_placeholder.png' };

        const equipoVisitante = p.equipos && p.equipos[1] 
            ? { nombre: p.equipos[1].nombre, logoUrl: p.equipos[1].logo || '/img/logo_placeholder.png' }
            : { nombre: 'TBD', logoUrl: '/img/logo_placeholder.png' };
        
        // Si el logo viene solo como nombre de archivo, pegarle la url
        if (equipoLocal.logoUrl !== '/img/logo_placeholder.png' && !equipoLocal.logoUrl.startsWith('http')) {
             equipoLocal.logoUrl = `http://localhost:3000/uploads/equipos/${equipoLocal.logoUrl}`;
        }
        if (equipoVisitante.logoUrl !== '/img/logo_placeholder.png' && !equipoVisitante.logoUrl.startsWith('http')) {
             equipoVisitante.logoUrl = `http://localhost:3000/uploads/equipos/${equipoVisitante.logoUrl}`;
        }

        return {
            id: p.idPartido,
            equipoLocal,
            equipoVisitante,
            estado: mapEstado(p.estado),
            marcadorLocal: p.golesEquipo1,
            marcadorVisitante: p.golesEquipo2,
            Deporte: deporte,
            fechaInicio: p.fechaInicio,
            lugar: p.lugar
        };
    });
};

// Obtener un partido por ID
export const getPartidoById = async (id: string): Promise<Partido | null> => {
    try {
        const { data } = await api.get(`/partidos/${id}`);
        
        // Mapeo similar a getPartidos
        const p = data;
        const deporte = p.jornada?.torneo?.nombreDeporte || 'GENERAL';
        
        // Manejo seguro de equipos (en caso de null)
        const equipoLocal = p.equipos && p.equipos[0] 
            ? { nombre: p.equipos[0].nombre, logoUrl: p.equipos[0].logoUrl ? `http://localhost:3000/uploads/equipos/${p.equipos[0].logoUrl}` : '/img/logo_placeholder.png' }
            : { nombre: 'TBD', logoUrl: '' };
        const equipoVisitante = p.equipos && p.equipos[1] 
            ? { nombre: p.equipos[1].nombre, logoUrl: p.equipos[1].logoUrl ? `http://localhost:3000/uploads/equipos/${p.equipos[1].logoUrl}` : '/img/logo_placeholder.png' }
            : { nombre: 'TBD', logoUrl: '' };

        return {
            id: p.idPartido,
            equipoLocal,
            equipoVisitante,
            estado: p.estado.toUpperCase(), // Asegurar mayúsculas
            marcadorLocal: p.golesEquipo1,
            marcadorVisitante: p.golesEquipo2,
            Deporte: deporte,
            fechaInicio: p.fechaInicio,
            lugar: p.lugar
        };
    } catch (error) {
        console.error("Error obteniendo partido", error);
        return null;
    }
};

// Actualizar marcador
export const updateMarcador = async (id: string, golesLocal: number, golesVisitante: number) => {
    // Endpoint: PATCH /partidos/:id/marcador
    const { data } = await api.patch(`/partidos/${id}/marcador`, {
        golesEquipo1: golesLocal,
        golesEquipo2: golesVisitante
    });
    return data;
};