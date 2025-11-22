// src/services/estadisticasService.ts
import api from '../api/axios';
import type { EquipoEstadistica } from '../types';

export const getTablaClasificacion = async (idTorneo: string): Promise<EquipoEstadistica[]> => {
    try {
        // El backend devuelve { torneo: string, leaderboard: [...] }
        const { data } = await api.get<any>(`/torneos/${idTorneo}/leaderboard`);
        
        // Mapeamos la respuesta del backend a la interfaz del frontend
        return data.leaderboard.map((item: any, index: number) => ({
            // Usamos el índice como ID temporal ya que el leaderboard es calculado
            idEquipo: index, 
            nombreEquipo: item.equipo, 
            partidosJugados: item.victorias + item.derrotas + item.empates,
            victorias: item.victorias,
            empates: item.empates,
            derrotas: item.derrotas,
            golesFavor: item.golesAFavor,
            golesContra: item.golesEnContra,
            puntos: item.puntos
        }));
    } catch (error) {
        console.error("Error obteniendo clasificación:", error);
        return [];
    }
};