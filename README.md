# PokeRadarGoB · Pokémon GO

Aplicación web para consultar incursiones, eventos, alineaciones del Team GO Rocket y rankings de atacantes de Pokémon GO. Está pensada para usarse principalmente desde el celular y también adapta su diseño a escritorio.

**Versión:** 2.0.0

**Autor:** [BayronAlexisBaezVargas](https://github.com/BayronAlexisBaezVargas)

## Qué puedes hacer

### Radar de incursiones

En `index.html` puedes consultar los jefes de incursiones de 1★, 3★, 5★, Mega y Sombra, además de próximas rotaciones cuando la fuente publica sus datos.

- Los datos se consultan automáticamente al entrar a la página.
- Puedes buscar por nombre y combinar filtros de tipo y disponibilidad de variocolor. El botón **Limpiar filtros** restablece los tres.
- Al regresar desde los atacantes recomendados se recuperan los filtros y la posición de la tarjeta que estabas consultando.
- Las tarjetas muestran los PC de captura al 100 % IV y con clima, cuando están disponibles.
- La ficha de cada Pokémon reúne **Captura**, **Cómo vencerlo** y **Pokédex**, con debilidades, resistencias y datos de la especie.
- Desde la ficha puedes abrir los atacantes recomendados y volver al radar.
- Las formas, como Mega Charizard X e Y, se abren de manera independiente.

### Eventos: Lista y Semana

La sección **Eventos** reúne dos vistas que puedes alternar con los botones **Lista / Semana**:

- **Lista** (`assets/noticias.html`): búsqueda, filtros por estado y un desplegable de categorías con contador de selección, cuentas regresivas y detalles de cada evento. Las bonificaciones y otros datos se muestran según lo que publique la fuente.
- **Semana** (`assets/semana.html`): agenda de lunes a domingo, horarios locales, estados **En curso**, **Próximo** y **Finalizado**, día actual destacado y botón **Ir a hoy**. También puedes consultar semanas anteriores y siguientes.

Los horarios se ajustan a la zona horaria del dispositivo. Al alternar entre Lista y Semana se conserva el contexto de cada vista: búsqueda, categoría, estado, semana seleccionada y posición de lectura. Estos datos se guardan por pestaña durante la sesión; no requieren una cuenta.

Desde la ficha de un evento en Lista o Semana puedes pulsar **Añadir al calendario (.ics)**. El archivo incluye el nombre, el inicio, el fin y el enlace a la fuente. Ábrelo o impórtalo con tu aplicación de calendario para confirmar su incorporación. La opción aparece cuando ambas fechas son válidas; es una copia del evento, sin sincronización posterior.

### Team GO Rocket

En `assets/rocket.html` puedes consultar a Giovanni, Cliff, Sierra, Arlo y los reclutas.

- Los equipos de los líderes se despliegan al seleccionarlos y se organizan en tres fases de combate.
- Cada líder muestra un resumen del Pokémon que puedes rescatar.
- Los reclutas se pueden buscar por frase o Pokémon y muestran los encuentros rescatables indicados por la fuente.
- Las fichas conservan las formas regionales y consultan sus tipos al abrirse.
- La página busca alineaciones nuevas al entrar, valida la respuesta y conserva un respaldo local.

### Atacantes PvE

En `assets/atacantes.html` puedes consultar los 18 rankings por tipo de [Pokémon GO Hub](https://db.pokemongohub.net/es/pokemon-list/best-per-type/fire), ordenados por **eDPS** (daño efectivo por segundo, que contempla el tiempo de caer y volver al combate).

- Búsqueda por nombre, filtro de tipo y versiones **Normales**, **Mega / Primigenios** y **Oscuros**. Normales incluye fusiones y otras formas que no son Mega ni oscuras.
- Hasta diez alternativas por versión y tipo, según la disponibilidad de la fuente. Cada lista comienza con cinco y permite desplegar el resto.
- El puesto conserva la posición general de la fuente al filtrar; no se reordena por DPS.
- Cada ficha muestra los ataques rápido y cargado recomendados, eDPS, DPS y TDO. El asterisco identifica movimientos exclusivos que pueden requerir MT élite o un evento.
- La explicación desplegable indica la configuración del ranking, la fecha de consulta y el enlace a la fuente. Los equipos, movimientos y ajustes de la simulación influyen en el resultado.

El filtro de tipos es desplegable. Si llegas desde un jefe de incursión, la página muestra los tipos eficaces contra él y un acceso para volver. Las recomendaciones usan el ranking general por tipo; no simulan un combate contra los movimientos concretos del jefe.

## Iniciar con Docker

Necesitas Git, Docker instalado y el motor de Docker en ejecución. Si ya tienes este proyecto descargado, abre una terminal en su carpeta y empieza en el paso 2.

### 1. Descargar el proyecto

```bash
git clone https://github.com/BayronAlexisBaezVargas/PokeRadarGoB.git
cd PokeRadarGoB
```

### 2. Construir la imagen

Ejecuta el comando desde la carpeta que contiene el `Dockerfile`:

```bash
docker build -t pokeradargob:2.0.0 .
```

La imagen usa Nginx sin privilegios de root para servir los archivos estáticos. No necesitas instalar Node.js, Python ni dependencias de la aplicación para usar esta opción.

### 3. Iniciar la aplicación

```bash
docker run -d --name pokeradargob -p 8000:8080 pokeradargob:2.0.0
```

Abre **http://localhost:8000**. El puerto `8000` corresponde a tu equipo y el `8080` al servidor dentro del contenedor.

Si el puerto 8000 está ocupado, utiliza otro, por ejemplo `-p 8001:8080`, y abre `http://localhost:8001`.

### Administrar el contenedor

```bash
# Consultar los registros
docker logs -f pokeradargob

# Detener la aplicación
docker stop pokeradargob

# Volver a iniciarla
docker start pokeradargob

# Eliminar el contenedor detenido
docker rm pokeradargob
```

### Aplicar cambios del proyecto

La imagen contiene una copia de los archivos del momento en que se construyó. Después de modificar o descargar cambios del código o del ranking local, reconstruye la imagen y recrea el contenedor:

```bash
docker build -t pokeradargob:2.0.0 .
docker stop pokeradargob
docker rm pokeradargob
docker run -d --name pokeradargob -p 8000:8080 pokeradargob:2.0.0
```

Las consultas a las fuentes externas las hace el navegador. El contenedor sirve la web; no ejecuta los procesos de actualización del ranking.

## Desarrollo sin Docker

La aplicación usa HTML, CSS y JavaScript sin framework ni pasos de compilación. Puedes servirla desde la raíz del proyecto con Python:

```bash
python3 -m http.server 8000
```

Abre **http://localhost:8000**. También puedes usar una extensión como Live Server. Sirve los archivos por HTTP para que funcionen las consultas de datos locales.

## Datos y actualizaciones

| Información | Origen que utiliza la aplicación | Cómo se actualiza |
| --- | --- | --- |
| Incursiones y eventos | JSON de ScrapedDuck, basado en Leek Duck | Consulta automática al abrir la página y caché en el navegador. |
| Team GO Rocket | `https://pokelitee.github.io/leak-duck/rocket_lineups.json` | Consulta al abrir Rocket. Si falla, utiliza la última respuesta válida o `assets/data/rocket.json`. |
| Datos de Pokédex y formas | PokéAPI | Consulta al abrir las fichas. |
| Rankings de atacantes | `assets/scratch_atacantes.json`, generado a partir de Pokémon GO Hub | Archivo actualizado mediante el script y el workflow del repositorio. Si no carga, se utiliza la última respuesta válida guardada en el navegador; sin respaldo, se muestra un mensaje en la sección. |

Las etiquetas **Shiny**, los estados de los eventos y los botones secundarios comparten un diseño. Las fichas permiten desplazarse en pantallas pequeñas manteniendo accesible el botón de cierre. Si falta la imagen de un Pokémon, aparece un marcador neutro para evitar confundir una forma con otra.

Durante la primera carga aparecen indicadores dentro del contenido. Una respuesta vacía se distingue de un fallo de conexión y de una búsqueda sin coincidencias. Si falla la consulta, se conserva la última respuesta válida disponible; si no hay datos guardados, se muestra un mensaje breve en esa sección. Eventos ya no utiliza un calendario histórico incluido en el código como sustituto de los datos actuales.

La información depende de lo que publiquen las fuentes y puede tardar en reflejar cambios del juego. El respaldo Rocket incluido en el proyecto es una captura local, no una fuente que se actualice por sí sola.

### Automatización del ranking de atacantes

El workflow `.github/workflows/update_atacantes.yml` está configurado para ejecutarse los domingos a las **04:00 UTC** y permite ejecución manual desde GitHub Actions. Ejecuta `scripts/update_atacantes.js` con Node.js 20 y está configurado para subir cambios del JSON a `main` cuando los hay. Su ejecución efectiva depende de la configuración y los permisos de Actions del repositorio.

Para regenerar el archivo manualmente, con Node.js 20 o superior instalado:

```bash
node scripts/update_atacantes.js
```

El extractor resuelve las referencias de movimientos compartidos de la fuente, conserva su orden por eDPS y comprueba que su configuración excluya Pokémon no disponibles. Solo reemplaza el JSON cuando obtiene y valida los 18 tipos; un fallo de red o de formato conserva el archivo anterior.

Para ejecutar las pruebas del extractor sin acceder a internet:

```bash
node --test tests/update_atacantes.test.js
```

Este comando de regeneración modifica el ranking local; no es necesario para iniciar la web. Si sirves la aplicación con Docker, reconstruye la imagen para incorporar el archivo actualizado.

## Caché y uso en celular

La web incluye un manifiesto PWA y un Service Worker en `sw.js`, en la raíz del proyecto. Su alcance cubre las cinco páginas, tanto en un dominio propio como en una subcarpeta. Al completar la instalación guarda las páginas, los recursos locales, el respaldo Rocket y el ranking de atacantes. Las consultas realizadas también pueden reutilizar datos almacenados en el navegador.

Después de una visita con conexión, puedes abrir las páginas sin red. Las imágenes externas y los datos que nunca se hayan descargado pueden no estar disponibles. La aplicación consulta las fuentes nuevamente al entrar; si no consigue una respuesta, utiliza la información guardada que tenga.

El Service Worker requiere HTTPS o `localhost`. El acceso por HTTP a una IP de la red local permite usar la web, pero no ofrece las mismas funciones PWA.

La versión pública sigue siendo **2.0.0**. Los recursos llevan además una revisión interna `build` que coincide con `BUILD` en `sw.js`. Al publicar cambios de código, actualiza ambas referencias juntas para renovar la caché. La migración retira el registro antiguo de `assets/js/sw.js`; la limpieza se limita a las cachés de la aplicación. En Docker, `sw.js` se copia junto a `index.html`.

## Estructura del proyecto

```text
PokeRadarGoB/
├── index.html                      # Radar de incursiones
├── sw.js                           # Caché PWA con alcance de toda la aplicación
├── Dockerfile                      # Servidor Nginx, puerto interno 8080
├── .dockerignore                   # Archivos excluidos de la imagen
├── assets/
│   ├── noticias.html               # Eventos: Lista
│   ├── semana.html                 # Eventos: Semana
│   ├── rocket.html                 # Líderes y reclutas Rocket
│   ├── atacantes.html              # Rankings PvE por tipo
│   ├── scratch_atacantes.json       # Ranking generado
│   ├── manifest.json               # Configuración PWA
│   ├── css/                        # Estilos compartidos, por página y móviles
│   ├── data/rocket.json             # Respaldo local de alineaciones
│   ├── img/                        # Recursos gráficos locales
│   └── js/                         # Páginas, datos, estado de vistas y registro PWA
├── scripts/update_atacantes.js      # Generador del ranking
└── .github/workflows/
    └── update_atacantes.yml         # Automatización del ranking
```

## Aviso legal

Proyecto independiente de la comunidad, sin afiliación oficial con Pokémon GO. Las marcas, nombres e imágenes pertenecen a sus respectivos titulares.
