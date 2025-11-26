// src/services/avisosService.ts
import api from '../api/axios';
import type { Aviso, AvisoDTO } from '../types';

export const getAvisos = async (): Promise<Aviso[]> => {
    const { data } = await api.get<Aviso[]>('/avisos');
    return data;
};

export const createAviso = async (aviso: AvisoDTO) => {
    // El backend toma el usuario del token automáticamente
    const { data } = await api.post('/avisos', aviso);
    return data;
};

export const updateAviso = async (id: string, aviso: Partial<AvisoDTO>) => {
    const { data } = await api.patch(`/avisos/${id}`, aviso);
    return data;
};

export const deleteAviso = async (id: string) => {
    const { data } = await api.delete(`/avisos/${id}`);
    return data;
};