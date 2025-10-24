// src/pages/PartidosPage.tsx

import React, { useState, useEffect } from 'react';
// Importamos el tipo Partido (solo el tipo, con 'import type')
import type { Partido } from '../types'; 
// Importamos los componentes que ya creamos
import CardPartido from '../components/CardPartido';
import HeaderNav from '../components/HeaderNav'; 

// --- 1. Datos Mock (Simulación de la respuesta de la API) ---
const mockPartidos: Partido[] = [
  {
    id: 1,
    equipoLocal: { nombre: 'Hunters', logoUrl: '/img/logo1.png' }, // Asume que tienes carpetas o rutas de imágenes
    equipoVisitante: { nombre: 'Aston Birria', logoUrl: '/img/logo2.png' },
    estado: 'EN PROCESO',
    marcadorLocal: null,
    marcadorVisitante: null,
  },
  {
    id: 2,
    equipoLocal: { nombre: 'Castrosos', logoUrl: '/img/logo3.png' },
    equipoVisitante: { nombre: 'Pythons', logoUrl: '/img/logo4.png' },
    estado: 'FINALIZADO',
    marcadorLocal: 3,
    marcadorVisitante: 2,
  },
  {
    id: 3,
    equipoLocal: { nombre: 'Águilas', logoUrl: '/img/logo5.png' },
    equipoVisitante: { nombre: 'Leones', logoUrl: '/img/logo6.png' },
    estado: 'POR INICIAR',
    marcadorLocal: null,
    marcadorVisitante: null,
  },
  {
    id: 4,
    equipoLocal: { nombre: 'Búfalos', logoUrl: '/img/logo7.png' },
    equipoVisitante: { nombre: 'Tigres', logoUrl: '/img/logo8.png' },
    estado: 'CANCELADO',
    marcadorLocal: null,
    marcadorVisitante: null,
  },
];


// --- 2. Componente de Página ---
const PartidosPage: React.FC = () => {
  
  // ESTADO: Almacena la lista de partidos. Se tipa como un arreglo de objetos Partido.
  const [partidos, setPartidos] = useState<Partido[]>([]); 
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar la carga

  /**
   * HOOK DE EFECTO (useEffect)
   * * Concepto: useEffect es un hook de React que te permite ejecutar 'efectos secundarios'
   * después de que el componente ha sido renderizado. Un efecto secundario es cualquier
   * operación que afecta al mundo exterior (ej. llamadas a APIs, manipulación del DOM, suscripciones).
   * * Finalidad: Aquí lo usamos para simular la llamada a tu API, cargando los datos iniciales
   * una sola vez, justo después de que la página se monta. El array vacío '[]' como segundo
   * argumento asegura que el efecto solo se ejecute al inicio (montaje del componente).
   */
  useEffect(() => {
    // Simulación de la carga de la API (con un retraso de 1 segundo)
    const fetchPartidos = () => {
      // Simula el tiempo que tardaría la red
      setTimeout(() => {
        setPartidos(mockPartidos); // Guardamos los datos en el estado
        setIsLoading(false);      // Desactivamos el estado de carga
      }, 1000); 
    };

    fetchPartidos();
  }, []); // El array vacío indica que se ejecuta SÓLO una vez al montar

  
  return (
    <div>
      <HeaderNav /> {/* Se mantiene la barra de navegación */}
      <div className="content-container">
        
        {/* Aquí va la estructura de filtro */}
        <div className="filter-bar">Filtrar por torneos ▶</div>
        
        <h2>Listado de Partidos</h2>
        
        {/* Lógica de Carga */}
        {isLoading && <p>Cargando partidos...</p>}
        
        <div className="partidos-list">
          
          {/* RENDERIZADO DE LISTAS (Array.prototype.map) */}
          {/* Concepto: El método .map() de JavaScript se usa para transformar cada elemento
            de un array en algo nuevo. En React, lo usamos para transformar cada objeto
            'Partido' en un componente <CardPartido />.
            
            Importancia de la 'key': La prop 'key' (usando partido.id) es esencial.
            Le permite a React identificar qué elementos han cambiado, se han añadido o
            se han eliminado en la lista, optimizando el rendimiento. La 'key' debe ser
            única para cada elemento de la lista.
          */}
          {partidos.map((partido) => (
            <CardPartido 
              key={partido.id} // Clave única para optimización
              partido={partido} // Pasamos el objeto completo como prop
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartidosPage;