# SportFlow FIF 

##  Descripción

**SportFlow FIF** es una plataforma web integral para la administración y gestión de torneos deportivos internos dentro de una facultad. La aplicación permite a los administradores crear y gestionar torneos, a los jugadores inscribir sus equipos, y a los árbitros controlar los partidos en tiempo real.

---

##  Características Principales

Este proyecto está construido con un sistema de roles para manejar las diferentes necesidades de los usuarios:

###  Rol de Administrador
* **Gestión de Torneos:** Crear, editar y eliminar torneos (Fútbol, Baloncesto, etc.).
* **Gestión de Jornadas:** Programar partidos y enfrentamientos entre equipos.
* **Gestión de Inscripciones:** Aprobar, rechazar o solicitar cambios en las solicitudes de equipos.
* **Gestión de Árbitros:** Dar de alta o de baja a los árbitros en el sistema.
* **Gestión de Avisos:** Publicar comunicados oficiales para todos los usuarios.

###  Rol de Árbitro
* **Panel de Control:** Ver una lista de partidos asignados (pendientes, en proceso, finalizados).
* **Control de Juego:** Llevar el marcador y el tiempo/periodo del partido en tiempo real. La interfaz se adapta dinámicamente al deporte (Tiempos para Fútbol, Cuartos para Baloncesto).
* **Ver Reporte:** Consultar el resultado final de un partido ya arbitrado.

###  Rol de Jugador (Capitán)
* **Dashboard "Mi Equipo":** Ver todos los equipos en los que está inscrito y su estado (Aprobado, Pendiente, Requiere Cambios).
* **Gestión de Roster:** Añadir o eliminar jugadores de su equipo a través de un modal.
* **Inscripción:** Inscribir a su equipo en torneos abiertos.
* **Corregir Solicitud:** Editar y reenviar una solicitud si un administrador la marcó con "Requiere Cambios".

###  Vista Pública (Sin Iniciar Sesión)
* **Ver Torneos:** Explorar los torneos disponibles.
* **Ver Resultados:** Consultar la tabla de clasificación.
* **Ver Partidos:** Ver la lista de próximos partidos y resultados.
* **Ver Equipos:** Explorar los perfiles de los equipos inscritos.

---

##  Stack de Tecnologías

* **Frontend:** React 19
* **Lenguaje:** TypeScript
* **Bundler:** Vite
* **Routing:** React Router DOM
* **Gestión de Estado:** React Context (para Autenticación)
* **Iconos:** React Icons

---

##  Cómo ejecutar el proyecto

Este proyecto fue inicializado con Vite.
npm run dev

### 1. Instalación
En la carpeta raíz, instala las dependencias:
```bash
npm install