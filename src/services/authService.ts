// src/services/authService.ts
import api from '../api/axios';
import type { Usuario } from '../types';

// Función independiente para registrar usuarios (usada por Admin para crear Árbitros)
export const registerUser = async (nombre: string, email: string, expediente: string, password: string): Promise<Usuario> => {
    // Endpoint: POST /auth/register
    const { data } = await api.post('/auth/register', { 
        nombre, 
        email, 
        expediente, 
        password 
    });
    
    // El backend devuelve { ...user, token }. Retornamos todo el objeto.
    return data;
};