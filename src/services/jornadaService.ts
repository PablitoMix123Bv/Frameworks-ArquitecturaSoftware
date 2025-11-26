// src/services/jornadaService.ts
import api from '../api/axios';

export const generarJornadaAutomatica = async (idTorneo: string) => {
    // Endpoint: POST /jornada { idTorneo }
    const { data } = await api.post('/jornada', { idTorneo });
    return data;
};