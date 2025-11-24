import api from '../api/axios';
import type { Aviso } from '../types';

// Helper para mapear la respuesta del backend al frontend
const mapAvisoBackend = (a: any): Aviso => ({
    id: a.id, // Ahora es string/UUID
    titulo: a.titulo,
    contenido: a.contenido,
    fechaPublicacion: a.fechaPublicacion,
    autor: a.autor?.nombre || 'Coordinador', 
    categoria: a.categoria,
    prioridad: a.prioridad,
    // Verificación segura: si existe torneoAsociado, tomamos su ID, si no, null
    idTorneoAsociado: a.torneoAsociado?.idTorneo || null, 
});

export const getAvisos = async (): Promise<Aviso[]> => {
    const { data } = await api.get<any[]>('/avisos');
    return data.map(mapAvisoBackend);
};

export const createAviso = async (avisoData: any) => {
    // El backend espera 'idTorneoAsociado' (no el objeto torneo)
    const { idTorneoAsociado, ...data } = avisoData;
    
    // Si idTorneoAsociado es una cadena vacía o 0, lo mandamos como undefined o null
    const payload = { 
      ...data, 
      idTorneoAsociado: idTorneoAsociado ? idTorneoAsociado : null 
    };
    
    const { data: createdAviso } = await api.post('/avisos', payload);
    return mapAvisoBackend(createdAviso);
};

export const updateAviso = async (id: string, avisoData: any) => {
     const { idTorneoAsociado, ...data } = avisoData;
     const payload = {
        ...data,
        idTorneoAsociado: idTorneoAsociado ? idTorneoAsociado : null
     };
     const { data: updatedAviso } = await api.patch(`/avisos/${id}`, payload);
     return mapAvisoBackend(updatedAviso);
};

export const deleteAviso = async (id: string | number) => {
    await api.delete(`/avisos/${id}`);
};