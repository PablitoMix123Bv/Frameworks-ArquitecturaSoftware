import api from '../api/axios';
import type { Partido } from '../types';

// 1. Esta es la misma lógica que usa equiposService
const getLogoUrl = (logoUrl?: string) => {
    if (!logoUrl) return '/img/logo_placeholder.png';
    
    // Si ya es web, se deja
    if (logoUrl.startsWith('http')) return logoUrl;
    
    // Construimos la URL apuntando a la carpeta que me mostraste en la captura
    // Puerto 3001, carpeta uploads/equipos/
    return `http://localhost:3001/uploads/equipos/${logoUrl}`;
};

const mapPartidoBackend = (p: any): Partido => {
    // Verificamos si los equipos vienen en el array
    const e1 = p.equipos && p.equipos[0] ? p.equipos[0] : null;
    const e2 = p.equipos && p.equipos[1] ? p.equipos[1] : null;

    // Debug: Ver en consola qué nombres de archivo estamos recibiendo
    // Presiona F12 en el navegador para ver esto
    if (e1) console.log(`Equipo 1 (${e1.nombre}) imagen cruda:`, e1.logoUrl);
    if (e2) console.log(`Equipo 2 (${e2.nombre}) imagen cruda:`, e2.logoUrl);

    return {
        id: p.idPartido,
        equipoLocal: { 
            nombre: e1 ? e1.nombre : 'Por Definir', 
            // Aquí aplicamos la transformación
            logoUrl: e1 ? getLogoUrl(e1.logoUrl) : '/img/logo_placeholder.png'
        },
        equipoVisitante: { 
            nombre: e2 ? e2.nombre : 'Por Definir', 
            logoUrl: e2 ? getLogoUrl(e2.logoUrl) : '/img/logo_placeholder.png'
        },
        estado: p.estado,
        marcadorLocal: p.golesEquipo1,
        marcadorVisitante: p.golesEquipo2,
        Deporte: p.jornada?.torneo?.nombreDeporte || 'General',
        fechaInicio: p.fechaInicio,
        lugar: p.lugar
    };
};

export const getPartidos = async (): Promise<Partido[]> => {
    const { data } = await api.get<any[]>('/partidos');
    return data.map(mapPartidoBackend);
};

export const getPartidoById = async (id: string): Promise<Partido | null> => {
    try {
        const { data } = await api.get(`/partidos/${id}`);
        return mapPartidoBackend(data);
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const iniciarPartido = async (id: string) => {
    const { data } = await api.patch(`/partidos/${id}/iniciar`);
    return data;
};

export const finalizarPartido = async (id: string) => {
    const { data } = await api.patch(`/partidos/${id}/finalizar`);
    return data;
};

export const updateMarcador = async (id: string, golesLocal: number, golesVisitante: number) => {
    const { data } = await api.patch(`/partidos/${id}/marcador`, {
        golesEquipo1: golesLocal,
        golesEquipo2: golesVisitante
    });
    return data;
};