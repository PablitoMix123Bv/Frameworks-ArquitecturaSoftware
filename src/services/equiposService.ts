// src/services/equiposService.ts

import api from '../api/axios';
import type { Equipo } from '../types';

// --- HELPER PARA IMÁGENES ---
// Evita rutas rotas o dobles (http://localhost...http://localhost...)
const normalizeLogo = (logoUrl?: string | null) => {
    if (!logoUrl || logoUrl === '') return '/img/logo_placeholder.png';
    if (logoUrl.startsWith('http')) return logoUrl; // Si ya es absoluta, la dejamos
    return `http://localhost:3000/uploads/equipos/${logoUrl}`; // Si es relativa, le pegamos el dominio
};

// 1. Obtener todos los equipos (Público)
export const getEquiposPublicos = async (): Promise<Equipo[]> => {
    const { data } = await api.get<any[]>('/equipos');
    
    return data.map(backendEquipo => ({
        id: backendEquipo.id, 
        nombre: backendEquipo.nombre,
        logoUrl: normalizeLogo(backendEquipo.logoUrl), // <--- Imagen Corregida
        facultad: 'Ingeniería',
        victorias: backendEquipo.victorias,
        derrotas: backendEquipo.derrotas,
        empates: backendEquipo.empates,
        puntos: backendEquipo.puntos,
        golesAFavor: backendEquipo.golesAFavor,
        golesEnContra: backendEquipo.golesEnContra,
        noIntegrantes: backendEquipo.noIntegrantes,
        jugadores: backendEquipo.jugadores || [],
        
        // Mantenemos las inscripciones para filtrar por torneo
        inscripciones: backendEquipo.inscripciones || [], 
        
        // Deporte principal visual
        deporte: backendEquipo.inscripciones?.[0]?.torneo?.nombreDeporte || 'General', 
    }));
};

// 2. Obtener un equipo por ID
export const getEquipoById = async (id: string): Promise<Equipo> => {
    const { data } = await api.get(`/equipos/${id}`);
    return {
        id: data.id,
        nombre: data.nombre,
        logoUrl: normalizeLogo(data.logoUrl), // <--- Imagen Corregida
        facultad: 'Ingeniería',
        victorias: data.victorias,
        derrotas: data.derrotas,
        empates: data.empates,
        puntos: data.puntos,
        golesAFavor: data.golesAFavor,
        golesEnContra: data.golesEnContra,
        noIntegrantes: data.noIntegrantes,
        jugadores: data.jugadores || [],
        deporte: 'General',
        inscripciones: data.inscripciones || []
    };
};

// 3. Crear equipo (Capitán)
export const createEquipo = async (nombre: string, jugadores: string[]) => {
    const { data } = await api.post('/equipos', { nombre, jugadores });
    return data; 
};

// 4. Subir Logo
export const uploadEquipoLogo = async (equipoId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const { data } = await api.post(`/equipos/${equipoId}/logo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
};

// 5. Actualizar equipo (Capitán)
export const updateEquipo = async (id: string, data: { nombre?: string; jugadores?: string[] }) => {
    const response = await api.patch(`/equipos/${id}`, data);
    return response.data;
};