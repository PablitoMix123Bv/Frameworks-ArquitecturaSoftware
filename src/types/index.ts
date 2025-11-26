// src/types/index.ts

// Roles estrictos de la Base de Datos
export type Rol = 'admin' | 'user' | 'arbitro' | 'capitan';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  expediente: string;
  roles: Rol[];
  isActive: boolean;
  token?: string;
}

export type EstadoPartido = 'POR INICIAR' | 'EN PROCESO' | 'CANCELADO' | 'FINALIZADO';

export interface EquipoInfo {
  nombre: string;
  logoUrl: string;
}

export interface Partido {
  id: string;
  equipoLocal: EquipoInfo;
  equipoVisitante: EquipoInfo;
  estado: EstadoPartido;
  marcadorLocal: number | null;
  marcadorVisitante: number | null;
  Deporte: string;
  fechaInicio: string;
  lugar: string;
  jornada?: { numero: number };
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

// --- AQUÍ ESTABA EL ERROR: FALTABAN PROPIEDADES ---
export interface Equipo {
  id: string;
  nombre: string;
  logoUrl: string | null;
  facultad?: string;
  victorias: number;
  derrotas: number;
  empates: number;
  puntos: number;
  
  // Propiedades que faltaban y causaban el error:
  golesAFavor: number;
  golesEnContra: number;
  noIntegrantes: number;
  inscripciones?: any[]; // Array flexible para evitar conflictos de importación circular
  
  jugadores: string[];
  deporte?: string;
  capitan?: Usuario;
}

// DTO para Inscripciones (Admin)
export interface InscripcionBackend {
  id: string;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  fechaSolicitud: string;
  equipo: Equipo;
  torneo: Torneo;
  comentarios?: string;
}

export interface SolicitudInscripcion {
  idTorneo: string;
  nombreEquipo: string;
  logoUrl: string;
  integrantes: { nombre: string; expediente: string }[];
  fechaSolicitud: string;
  estado?: string;
  motivo?: string;
}

export interface JugadorInscripcion {
  nombre: string;
  expediente: string;
  edad: number | '';
  fotoUrl: string;
  esCapitan: boolean;
}

// --- Props de Componentes ---

export interface CardPartidoProps {
  partido: Partido;
}

export interface CardTorneoAdminProps {
  torneo: Torneo;
  onEdit: () => void;
  onDelete: () => void;
  onGenerarJornada: () => void;
}

export interface CardEquipoProps {
  equipo: Equipo;
}

export interface FormularioArbitroProps {
  arbitroAEditar: Usuario | null; 
  onClose: () => void;
  onSuccess: () => void;
}

export interface FormularioInscripcionProps {
  torneo: Torneo;
  equipoAEditar?: Equipo;
  onClose: () => void;
  onSuccess: (solicitud: SolicitudInscripcion) => void;
}

export interface FormularioTorneoProps {
  torneo: Torneo | null;
  onClose: () => void;
  onSuccess: () => void;
}

export interface TablaClasificacionProps {
  deporte: string;
  idTorneo: string;
}

export interface FiltroDeporteProps {
  onFiltroChange: (deporte: string) => void;
  valorActual: string;
}

// Tipos para Avisos
export type CategoriaAviso = 'GENERAL' | 'TORNEO' | 'INSCRIPCIÓN';
export type PrioridadAviso = 'NORMAL' | 'URGENTE';

export interface Aviso {
  id: string; // Ahora es UUID
  titulo: string;
  contenido: string;
  fechaPublicacion: string;
  categoria: CategoriaAviso;
  prioridad: PrioridadAviso;
  // El backend devuelve el objeto completo, no solo el nombre
  autor?: Usuario; 
  torneo?: Torneo; 
}

// DTO para crear/editar aviso desde el formulario
export interface AvisoDTO {
  titulo: string;
  contenido: string;
  categoria: CategoriaAviso;
  prioridad: PrioridadAviso;
  idTorneo?: string; // Enviamos solo el ID al backend
}

export interface FormularioAvisoProps {
  avisoAEditar: Aviso | null;
  onClose: () => void;
  onSuccess: () => void;
}

export interface ProgramarPartidoData {
  id?: string;
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

export interface CardAvisoProps {
    aviso: Aviso;
}