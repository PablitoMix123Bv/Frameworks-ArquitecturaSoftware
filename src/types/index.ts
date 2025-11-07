// Tipo que define todos los roles posibles en el sistema
export type Rol = 'administrador' | 'jugador' | 'árbitro'; 

export interface ClasificacionTeam {
    posicion: number;
    nombreEquipo: string;
    pj: number; // Partidos Jugados
    pg: number; // Partidos Ganados
    pe: number; // Partidos Empatados
    pp: number; // Partidos Perdidos
    gf: number; // Goles/Puntos a Favor
    gc: number; // Goles/Puntos en Contra
    puntos: number;
}

// Interfaz para la información que el administrador gestionará sobre los árbitros
export interface Arbitro {
  id: number;
  nombreCompleto: string;
  email: string;
  rol: 'árbitro'; 
  // Otros datos necesarios para la gestión
}

// Props para el formulario de adición/edición de árbitros
export interface FormularioArbitroProps {
    arbitroAEditar: Arbitro | null;
    onClose: () => void;
    onSuccess: () => void;
}

// Tipos para la Categoría y Prioridad del Aviso
export type CategoriaAviso = 'GENERAL' | 'TORNEO' | 'INSCRIPCIÓN';
export type PrioridadAviso = 'NORMAL' | 'URGENTE';

// Interfaz para el objeto Aviso
export interface Aviso {
  id: number;
  titulo: string;
  contenido: string;
  fechaPublicacion: string;
  autor: string; // Nombre del coordinador que lo publica
  categoria: CategoriaAviso;
  prioridad: PrioridadAviso;
  idTorneoAsociado: number | null; // Null si es un aviso GENERAL
}

// Props para el formulario de creación/edición de avisos
export interface FormularioAvisoProps {
    avisoAEditar: Aviso | null;
    onClose: () => void;
    onSuccess: () => void;
}

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
  Deporte: string; // Deporte al que pertenece el partido
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
  deporte: string; 
  minJugadores?: number; // Opcional, para mostrar en el dashboard
  maxJugadores?: number; // Opcional, para mostrar en el dashboard
  reglas?: string;       // Opcional, para mostrar en el dashboard
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

// Interfaz para el componente FiltroDeporte
export interface FiltroDeporteProps {
  // Función que el componente padre usará para saber qué deporte se seleccionó
  onFiltroChange: (deporte: string) => void; 
  // Valor actual del filtro (para resaltarlo en la UI)
  valorActual: string; 
}

// Datos que el capitán registra para cada integrante
export interface JugadorInscripcion {
  nombre: string;
  expediente: string; // La matrícula o número de expediente
  edad: number | ''; // Usamos '' para que el input sea controlable
  // Simulación de subida de archivo: la URL o un objeto File si manejáramos subida directa
  fotoUrl: string; 
  esCapitan: boolean;
}

// Interfaz para la solicitud de inscripción de un equipo
export interface SolicitudInscripcion {
  idTorneo: number;
  nombreEquipo: string;
  logoUrl: string; // Logo del equipo (simulación de subida de archivo)
  integrantes: JugadorInscripcion[];
  fechaSolicitud: string;
}

// Props para el formulario de inscripción
export interface FormularioInscripcionProps {
  idTorneo: number; // El torneo al que se inscribe
  minJugadores: number; // Mínimo requerido para la validación
  maxJugadores: number; // Máximo permitido para la validación
  onClose: () => void;
  onSuccess: () => void;
}

// Interfaz para la información estadística de un equipo en la tabla
export interface EquipoEstadistica {
  idEquipo: number;
  nombreEquipo: string;
  partidosJugados: number;
  victorias: number;
  derrotas: number;
  empates: number;
  golesFavor: number;
  golesContra: number;
  puntos: number;
}

// Props para el componente de la tabla
export interface TablaClasificacionProps {
  deporte: string; // Para filtrar y mostrar la tabla correcta
  idTorneo: number; // El torneo cuya tabla se está mostrando
}