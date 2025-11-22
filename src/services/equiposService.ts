// src/services/equiposService.ts

import api from '../api/axios';
// CORRECCIÓN: Importamos 'Equipo' solo como tipo
import type { Equipo } from '../types';

export const getEquiposPublicos = async (): Promise<Equipo[]> => {
    // Solicitamos los equipos al backend (que incluye inscripciones y torneos)
    const { data } = await api.get<any[]>('/equipos'); 
    
    return data.map(backendEquipo => {
        
        // --- LÓGICA DINÁMICA PARA EL DEPORTE ---
        let deporteMostrado = 'General'; // Valor por defecto
        
        // Verificamos si el equipo tiene inscripciones y si alguna tiene torneo asociado
        if (backendEquipo.inscripciones && backendEquipo.inscripciones.length > 0) {
            // Buscamos la primera inscripción que tenga información del torneo
            const inscripcionValida = backendEquipo.inscripciones.find(
                (ins: any) => ins.torneo && ins.torneo.nombreDeporte
            );
            
            if (inscripcionValida) {
                deporteMostrado = inscripcionValida.torneo.nombreDeporte;
            }
        }

        // --- LÓGICA PARA EL LOGO (Rutas absolutas) ---
        // Si backendEquipo.logoUrl ya es http..., lo dejamos. Si es solo nombre de archivo, le pegamos la URL del backend.
        const logoUrlFinal = backendEquipo.logoUrl 
            ? (backendEquipo.logoUrl.startsWith('http') 
                ? backendEquipo.logoUrl 
                : `http://localhost:3000/uploads/equipos/${backendEquipo.logoUrl}`)
            : '/img/logo_placeholder.png';

        return {
            id: backendEquipo.id, 
            nombre: backendEquipo.nombre,
            logoUrl: logoUrlFinal,
            // Nota: 'facultad' no existe en la BD actual, se deja estático por ahora o podrías sacarlo del 'expediente' del capitán si tuviera un formato específico
            facultad: 'Ingeniería', 
            victorias: backendEquipo.victorias,
            derrotas: backendEquipo.derrotas,
            empates: backendEquipo.empates,
            puntos: backendEquipo.puntos,
            jugadores: backendEquipo.jugadores || [],
            
            deporte: deporteMostrado, // <--- AHORA ES DINÁMICO
            
            minJugadores: 0,
            maxJugadores: 0
        };
    });
};