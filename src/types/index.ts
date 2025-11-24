// src/types/index.ts

export type Rol = 'administrador' | 'jugador' | 'árbitro' | 'capitan';

export interface EquipoInfo {
  nombre: string;
  logoUrl: string;
}

export type EstadoPartido = 'POR INICIAR' | 'EN PROCESO' | 'CANCELADO' | 'FINALIZADO';

export interface Partido {
  id: string; 
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
  id: string; 
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
  id: string; 
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

export interface TablaClasificacionProps {
  deporte: string;
  idTorneo: string; 
}

export interface EquipoEstadistica {
  idEquipo: string | number; 
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

export type CategoriaAviso = 'GENERAL' | 'TORNEO' | 'INSCRIPCIÓN';
export type PrioridadAviso = 'NORMAL' | 'URGENTE';

export interface Aviso {
  id: string; // Corregido a string (UUID)
  titulo: string;
  contenido: string;
  fechaPublicacion: string;
  autor: string; 
  categoria: CategoriaAviso;
  prioridad: PrioridadAviso;
  idTorneoAsociado: string | null; // Corregido a string (UUID)
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
  idTorneo: string; 
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
  id: string | null; // Corregido
  idTorneo: string; 
  idEquipoLocal: string;
  idEquipoVisitante: string;
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
  id: string; // Corregido
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