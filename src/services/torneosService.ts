// src/services/torneosService.ts
import api from '../api/axios';
import type { Torneo } from '../types';

export const getTorneos = async (): Promise<Torneo[]> => {
    const { data } = await api.get<any[]>('/torneos');
    return data.map(backendTorneo => ({
        id: backendTorneo.idTorneo,
        nombre: backendTorneo.nombreTorneo,
        deporte: backendTorneo.nombreDeporte,
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

// NUEVO: Crear Torneo
// Omitimos ID porque lo genera el backend
export const createTorneo = async (torneo: Omit<Torneo, 'id'>) => {
    // Mapeo inverso: Frontend -> Backend DTO
    const payload = {
        nombreTorneo: torneo.nombre,
        nombreDeporte: torneo.deporte,
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

// NUEVO: Actualizar Torneo
export const updateTorneo = async (id: string, torneo: Partial<Torneo>) => {
     // Mapeo similar al create si el backend usa nombres distintos
    const payload: any = {};
    if(torneo.nombre) payload.nombreTorneo = torneo.nombre;
    if(torneo.deporte) payload.nombreDeporte = torneo.deporte;
    // ... mapear resto de campos si se editan
    
    const { data } = await api.patch(`/torneos/${id}`, payload);
    return data;
};

// NUEVO: Eliminar Torneo
export const deleteTorneo = async (id: string) => {
    const { data } = await api.delete(`/torneos/${id}`);
    return data;
};