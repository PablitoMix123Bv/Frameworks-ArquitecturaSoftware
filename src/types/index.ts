// src/types/index.ts

// Interfaz para la estructura del objeto Torneo
export interface Torneo {
  id: number;
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

// Interfaz para las propiedades (Props) del Formulario
export interface FormularioTorneoProps {
  torneo: Torneo | null; 
  onClose: () => void;
  onSuccess: () => void; 
}

// Interfaz para las propiedades (Props) de la Tarjeta
export interface CardTorneoAdminProps {
  torneo: Torneo;
  onEdit: () => void;
  onDelete: () => void;
}

// src/types/index.ts (Añadir estas interfaces)

export interface EquipoInfo {
  nombre: string;
  logoUrl: string; // URL de la imagen del escudo
}

// Estados posibles de un partido
export type EstadoPartido = 'POR INICIAR' | 'EN PROCESO' | 'CANCELADO' | 'FINALIZADO';

export interface Partido {
  id: number;
  equipoLocal: EquipoInfo;
  equipoVisitante: EquipoInfo;
  estado: 'POR INICIAR' | 'EN PROCESO' |'CANCELADO' |'FINALIZADO';
  marcadorLocal: number | null; // Será null si aún no termina
  marcadorVisitante: number | null; // Será null si aún no termina
}

export interface CardPartidoProps { 
    partido: Partido;
}

// src/types/index.ts (Añadir o actualizar)

// Interfaz para la información detallada de un Equipo
export interface Equipo {
  id: number;
  nombre: string;
  logoUrl: string;
  facultad: string;
  victorias: number;
  derrotas: number;
  empates: number;
  puntos: number;
  // Añadir la lista de jugadores (por ahora, solo un array de strings)
  jugadores: string[]; 
}

// Props para la Tarjeta de Equipo
export interface CardEquipoProps {
  equipo: Equipo;
}

// La información necesaria para que el administrador programe un juego
export interface ProgramarPartidoData {
  id: number | null; // Null si es nuevo
  idTorneo: number; // A qué torneo pertenece este partido
  idEquipoLocal: number;
  idEquipoVisitante: number;
  fecha: string;
  hora: string;
  lugar: string;
}

// Interfaz para las Props del formulario de jornada
export interface FormularioJornadaProps {
  partidoAEditar: ProgramarPartidoData | null;
  onClose: () => void;
  onSuccess: () => void;
}
