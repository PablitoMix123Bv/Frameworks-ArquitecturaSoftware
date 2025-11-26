// src/services/userService.ts
import api from '../api/axios';
import type { Usuario } from '../types';

export const getUsers = async (): Promise<Usuario[]> => {
    const { data } = await api.get<Usuario[]>('/auth'); 
    return data;
};

// Como no hay endpoint específico para "revocar rol arbitro", 
// usamos el de editar usuario para quitarle el rol (simulación lógica con endpoint existente)
export const updateUserRole = async (id: string, roles: string[]) => {
    const { data } = await api.patch(`/auth/${id}`, { roles });
    return data;
};