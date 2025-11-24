// src/services/torneosService.ts
import api from '../api/axios';
import type { Torneo } from '../types';

// 1. Obtener todos los torneos
export const getTorneos = async (): Promise<Torneo[]> => {
    const { data } = await api.get<any[]>('/torneos');
    
    return data.map(backendTorneo => ({
        id: backendTorneo.idTorneo,
        nombre: backendTorneo.nombreTorneo,
        deporte: backendTorneo.nombreDeporte,
        // Formateo seguro de fechas
        fechaInicio: backendTorneo.fechaInicio ? backendTorneo.fechaInicio.split('T')[0] : '',
        fechaFin: backendTorneo.fechaFin ? backendTorneo.fechaFin.split('T')[0] : '',
        fechaLimiteInscripcion: backendTorneo.fechaInscripcionLimite ? backendTorneo.fechaInscripcionLimite.split('T')[0] : '',
        lugar: backendTorneo.lugar,
        descripcion: backendTorneo.descripcion,
        detalles: backendTorneo.detalles,
        minJugadores: backendTorneo.minJugadores,
        maxJugadores: backendTorneo.maxJugadores,
        reglas: backendTorneo.reglas
    }));
};

// 2. Crear Torneo (ESTA ES LA QUE TE FALTABA)
export const createTorneo = async (torneo: Omit<Torneo, 'id'>) => {
    // Mapeo inverso: Frontend -> Backend DTO
    const payload = {
        nombreTorneo: torneo.nombre,
        nombreDeporte: torneo.deporte,
        // Convertimos strings de fecha a objetos Date si es necesario, o strings ISO
        fechaInicio: new Date(torneo.fechaInicio),
        fechaFin: new Date(torneo.fechaFin),
        fechaInscripcionLimite: new Date(torneo.fechaLimiteInscripcion),
        minJugadores: torneo.minJugadores,
        maxJugadores: torneo.maxJugadores,
        lugar: torneo.lugar,
        descripcion: torneo.descripcion,
        detalles: torneo.detalles || 'Sin detalles',
        reglas: torneo.reglas || 'Sin reglas'
    };
    
    const { data } = await api.post('/torneos', payload);
    return data;
};

// 3. Actualizar Torneo
export const updateTorneo = async (id: string, torneo: Partial<Torneo>) => {
    // Mapeamos solo los campos que vienen para actualizar
    const payload: any = {};
    if(torneo.nombre) payload.nombreTorneo = torneo.nombre;
    if(torneo.deporte) payload.nombreDeporte = torneo.deporte;
    if(torneo.lugar) payload.lugar = torneo.lugar;
    if(torneo.descripcion) payload.descripcion = torneo.descripcion;
    if(torneo.fechaInicio) payload.fechaInicio = new Date(torneo.fechaInicio);
    if(torneo.fechaFin) payload.fechaFin = new Date(torneo.fechaFin);
    // ... puedes agregar el resto de campos aquí
    
    const { data } = await api.patch(`/torneos/${id}`, payload);
    return data;
};

// 4. Eliminar Torneo
export const deleteTorneo = async (id: string) => {
    const { data } = await api.delete(`/torneos/${id}`);
    return data;
};

// 5. Generar Calendario (Jornadas)
export const generarCalendarioTorneo = async (idTorneo: string) => {
    const { data } = await api.post('/jornada/generar', { idTorneo });
    return data;
};