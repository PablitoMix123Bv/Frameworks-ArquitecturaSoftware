// src/services/partidosService.ts

import api from '../api/axios';
import type { Partido } from '../types';

// --- LÓGICA DE REFERENCIA (IGUAL QUE EN EQUIPOS) ---
const normalizeLogo = (logoUrl?: string | null) => {
    if (!logoUrl || logoUrl === '') return '/img/logo_placeholder.png';
    // Si ya tiene http, NO le pegamos nada más. Esto arregla el error.
    if (logoUrl.startsWith('http')) return logoUrl; 
    // Si es solo el archivo, le pegamos tu backend
    return `http://localhost:3000/uploads/equipos/${logoUrl}`;
};

const mapEstado = (estadoBackend: string): any => {
    const est = estadoBackend.toUpperCase();
    if (['FINALIZADO', 'EN PROCESO', 'POR INICIAR', 'CANCELADO'].includes(est)) {
        return est;
    }
    return 'POR INICIAR'; 
};

// 1. Obtener LISTA (Esto ya funcionaba, ahora usa el helper)
export const getPartidos = async (): Promise<Partido[]> => {
    const { data } = await api.get<any[]>('/partidos');

    return data.map(p => {
        const deporte = p.jornada?.torneo?.nombreDeporte || 'GENERAL';

        // Mapeo seguro usando el helper
        const equipoLocal = p.equipos && p.equipos[0] 
            ? { nombre: p.equipos[0].nombre, logoUrl: normalizeLogo(p.equipos[0].logoUrl || p.equipos[0].logo) }
            : { nombre: 'TBD', logoUrl: '/img/logo_placeholder.png' };

        const equipoVisitante = p.equipos && p.equipos[1] 
            ? { nombre: p.equipos[1].nombre, logoUrl: normalizeLogo(p.equipos[1].logoUrl || p.equipos[1].logo) }
            : { nombre: 'TBD', logoUrl: '/img/logo_placeholder.png' };
        
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

// 2. Obtener DETALLE (Aquí estaba el fallo, ahora usa la MISMA lógica)
export const getPartidoById = async (id: string): Promise<Partido | null> => {
    try {
        const { data } = await api.get(`/partidos/${id}`);
        
        const p = data;
        const deporte = p.jornada?.torneo?.nombreDeporte || 'GENERAL';
        
        // APLICAMOS LA MISMA NORMALIZACIÓN QUE EN LA LISTA
        const equipoLocal = p.equipos && p.equipos[0] 
            ? { nombre: p.equipos[0].nombre, logoUrl: normalizeLogo(p.equipos[0].logoUrl) }
            : { nombre: 'TBD', logoUrl: '/img/logo_placeholder.png' };
            
        const equipoVisitante = p.equipos && p.equipos[1] 
            ? { nombre: p.equipos[1].nombre, logoUrl: normalizeLogo(p.equipos[1].logoUrl) }
            : { nombre: 'TBD', logoUrl: '/img/logo_placeholder.png' };

        return {
            id: p.idPartido,
            equipoLocal,
            equipoVisitante,
            estado: p.estado.toUpperCase(),
            marcadorLocal: p.golesEquipo1,
            marcadorVisitante: p.golesEquipo2,
            Deporte: deporte,
            fechaInicio: p.fechaInicio,
            lugar: p.lugar,
            jornada: p.jornada
        };
    } catch (error) {
        console.error("Error obteniendo partido", error);
        return null;
    }
};

export const updateMarcador = async (id: string, golesLocal: number, golesVisitante: number) => {
    const { data } = await api.patch(`/partidos/${id}/marcador`, {
        golesEquipo1: golesLocal,
        golesEquipo2: golesVisitante
    });
    return data;
};

export const createPartido = async (partidoData: any) => {
    const { data } = await api.post('/partidos', partidoData);
    return data;
};

export const updatePartido = async (id: string, partidoData: any) => {
    const { data } = await api.patch(`/partidos/${id}`, partidoData);
    return data;
};