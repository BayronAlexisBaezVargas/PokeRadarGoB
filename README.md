# Radar de Campo y Calendario de Eventos · Pokémon GO

Panel técnico de telemetría y consulta en tiempo real para Pokémon GO. Proporciona información sobre rotaciones de incursiones, apariciones silvestres activas, calendario de eventos y cálculo dinámico de multiplicadores de daño.

**Versión:** 1.5.4  
**Autor:** [BayronAlexisBaezVargas](https://github.com/BayronAlexisBaezVargas)

---

## Características Principales

### 1. Radar de Incursiones y Silvestres (`index.html`)
- **Monitoreo por niveles:** Incursiones 1★, 3★, 5★ Legendarias, Megaincursiones, Batallas Dinamax e Incursiones Sombra.
- **Sincronización en vivo:** La rotación de las incursiones activas se descarga dinámicamente mediante la API, manteniendo la información siempre actualizada sin necesidad de editar el código.
- **Parámetros de combate:** Rangos de CP de captura, CP potenciado por clima y lista de debilidades elementales.
- **Apariciones silvestres:** Frecuencia de aparición clasificada por nivel de señal y previsiones de rotación.
- **Filtros e interfaz reactiva:** Filtrado simultáneo por nombre de especie y tipos elementales, reconstruido de manera reactiva tras cada actualización de la API.
- **Ficha técnica Pokédex:** Modal interactivo con cálculo automático de efectividades, debilidades, resistencias y consulta asíncrona a la PokéAPI.

### 2. Centro de Noticias y Eventos (`noticias.html`)
- **Calendario oficial:** Programación de Días de la Comunidad, Horas Destacadas, Horas de Incursiones, Lunes Dinamax y eventos de temporada.
- **Cuentas regresivas en tiempo real:** Cronómetros de inicio y término ajustados a la zona horaria del dispositivo.
- **Filtros por estado y categoría:** Segmentación por eventos en curso, próximos 7 días o programación mensual.
- **Buscador instantáneo:** Búsqueda en vivo por nombre de evento o Pokémon protagonista.
- **Detalle de bonificaciones:** Desglose de multiplicadores de PX, Polvo Estelar, ratios de variocolor y ataques exclusivos.

### 3. Resumen Semanal (`semana.html`)
- **Visualización en formato agenda:** Distribución clara de eventos por día (Lunes a Domingo).
- **Destacados semanales:** Hora Destacada de los martes y Hora de Incursiones de los miércoles integrados automáticamente.

### 4. Inteligencia Operativa: Team GO Rocket (`rocket.html`)
- **Rastreo de Líderes:** Alineaciones confirmadas de Giovanni, Cliff, Sierra y Arlo organizadas por fases de combate.
- **Base de datos de Reclutas (Grunts):** Clasificación por frases, tipo elemental y lista de posibles Pokémon oscuros de encuentro.

### 5. Progressive Web App (PWA) & Optimización
- **Service Worker:** Estrategia de caché "Stale-While-Revalidate" para acceso rápido y offline.
- **Transiciones Nativas:** Implementación de la API de *View Transitions* para un cambio de página sin parpadeos y sin recargar el HUD.

---

## Estructura del Proyecto

```text
pokegoapi/
├── assets/
│   ├── css/
│   │   └── styles.css          # Estilos globales, variables y componentes
│   ├── img/
│   │   └── favicon.svg         # Favicon vectorial táctico
│   └── js/
│       ├── app.js              # Lógica del radar, cálculo de efectividades y PokéAPI
│       ├── noticias.js         # Sincronización de eventos, filtros y cuentas regresivas
│       ├── semana.js           # Agrupamiento de eventos por día de la semana
│       ├── rocket.js           # Base de datos de líderes y reclutas Rocket
│       └── location.js         # Transiciones de página y navegación
├── index.html                  # Panel principal del radar de incursiones
├── noticias.html               # Panel de eventos y calendario
├── semana.html                 # Vista agenda de eventos de los próximos 7 días
├── rocket.html                 # Alineaciones del Team GO Rocket
├── sw.js                       # Service Worker para PWA y caché
├── manifest.json               # Manifiesto de la aplicación web (PWA)
├── .gitignore                  # Exclusiones de control de versiones
└── README.md                   # Documentación del proyecto
```

---

## Tecnologías Utilizadas

- **HTML5 Semántico:** Estructura accesible con atributos ARIA y metadatos Open Graph / Twitter Cards.
- **CSS3:** Variables nativas, CSS Grid, Flexbox, backdrop-filter y compatibilidad con `prefers-reduced-motion`.
- **JavaScript Vanilla (ES6+):** Arquitectura modular basada en IIFE, promesas asíncronas y consumo de APIs sin dependencias externas.

---

## Ejecución Local

Dado que el proyecto está desarrollado en tecnologías web nativas, no requiere pasos de compilación.

### Opción 1: Servidor local con Python
```bash
python3 -m http.server 8000
```
Abrir en el navegador: `http://localhost:8000`

### Opción 2: Servidor local con Node.js / npx
```bash
npx serve .
```

### Opción 3: Extensión Live Server (VS Code / VSCodium)
Hacer clic derecho en `index.html` y seleccionar **Open with Live Server**.

---

## Fuentes de Información y APIs

- **[PokéAPI](https://pokeapi.co/):** Datos biológicos, estadísticas de especie y registros de Pokédex.
- **[Leek Duck](https://leekduck.com/):** Información comunitaria de rotaciones de incursión y calendario de eventos.
- **[Pokémon GO Hub](https://pokemongohub.net/):** Parámetros de incursiones y guías de eventos.
- **[ScrapedDuck](https://github.com/bigfoott/ScrapedDuck):** Feed estructurado de eventos en formato JSON.

---

## Aviso Legal

Este proyecto es una herramienta de referencia independiente desarrollada por la comunidad y no cuenta con afiliación oficial. Pokémon y los nombres de los personajes son marcas comerciales registradas de Nintendo, Creatures Inc., GAME FREAK Inc. y Niantic, Inc. Todos los derechos pertenecen a sus respectivos propietarios.
