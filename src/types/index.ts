// src/types/index.ts

// 1. AGREGAMOS 'capitan' A LOS ROLES
export type Rol = 'administrador' | 'jugador' | 'árbitro' | 'capitan';

export interface EquipoInfo {
  nombre: string;
  logoUrl: string;
}

export type EstadoPartido = 'POR INICIAR' | 'EN PROCESO' | 'CANCELADO' | 'FINALIZADO';

export interface Partido {
  id: string; // UUID es string
  equipoLocal: EquipoInfo;
  equipoVisitante: EquipoInfo;
  estado: EstadoPartido;
  marcadorLocal: number | null;
  marcadorVisitante: number | null;
  Deporte: string;
  fechaInicio?: string;
  lugar?: string;
}

export interface CardPartidoProps {
    partido: Partido;
}

export interface Torneo {
  id: string; // UUID es string
  nombre: string;
  deporte: string;
  fechaLimiteInscripcion: string;
  descripcion: string;
  detalles: string;
  lugar: string;
  minJugadores: number;
  maxJugadores: number;
  reglas: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface Equipo {
  id: string; // UUID es string
  nombre: string;
  logoUrl: string;
  facultad: string;
  victorias: number;
  derrotas: number;
  empates: number;
  puntos: number;
  jugadores: string[];
  deporte: string;
  minJugadores?: number;
  maxJugadores?: number;
  reglas?: string;
}

// Corrección: idTorneo ahora es string para coincidir con el UUID
export interface TablaClasificacionProps {
  deporte: string;
  idTorneo: string; 
}

export interface EquipoEstadistica {
  idEquipo: number | string;
  nombreEquipo: string;
  partidosJugados: number;
  victorias: number;
  derrotas: number;
  empates: number;
  golesFavor: number;
  golesContra: number;
  puntos: number;
}

export interface FiltroDeporteProps {
  onFiltroChange: (deporte: string) => void;
  valorActual: string;
}

// ... (El resto de interfaces como Aviso, SolicitudInscripcion se mantienen igual)
export type CategoriaAviso = 'GENERAL' | 'TORNEO' | 'INSCRIPCIÓN';
export type PrioridadAviso = 'NORMAL' | 'URGENTE';

export interface Aviso {
  id: number;
  titulo: string;
  contenido: string;
  fechaPublicacion: string;
  autor: string; 
  categoria: CategoriaAviso;
  prioridad: PrioridadAviso;
  idTorneoAsociado: number | null;
}

export interface CardAvisoProps {
    aviso: Aviso;
}

export interface JugadorInscripcion {
  nombre: string;
  expediente: string; 
  edad: number | ''; 
  fotoUrl: string; 
  esCapitan: boolean;
}

export interface SolicitudInscripcion {
  idTorneo: number | string; // Flexible para aceptar UUIDs
  nombreEquipo: string;
  logoUrl: string; 
  integrantes: JugadorInscripcion[];
  fechaSolicitud: string;
}

export interface FormularioInscripcionProps {
  torneo: Torneo; 
  equipoAEditar?: Equipo;
  onClose: () => void;
  onSuccess: (solicitud: SolicitudInscripcion) => void;
}

export interface CardTorneoAdminProps {
  torneo: Torneo;
  onEdit: () => void;
  onDelete: () => void;
}

export interface FormularioTorneoProps {
  torneo: Torneo | null; 
  onClose: () => void;
  onSuccess: () => void; 
}

export interface ProgramarPartidoData {
  id: number | null; 
  idTorneo: number; 
  idEquipoLocal: number;
  idEquipoVisitante: number;
  fecha: string;
  hora: string;
  lugar: string;
}

export interface FormularioJornadaProps {
  partidoAEditar: ProgramarPartidoData | null;
  onClose: () => void;
  onSuccess: () => void;
}

export interface Arbitro {
  id: number;
  nombreCompleto: string;
  email: string;
  rol: 'árbitro'; 
}

export interface FormularioArbitroProps {
    arbitroAEditar: Arbitro | null;
    onClose: () => void;
    onSuccess: () => void;
}

export interface FormularioAvisoProps {
    avisoAEditar: Aviso | null;
    onClose: () => void;
    onSuccess: () => void;
}

export interface CardEquipoProps {
  equipo: Equipo;
}