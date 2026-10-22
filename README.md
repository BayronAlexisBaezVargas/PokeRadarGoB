# PokeRadarGoB · Pokémon GO

Aplicación web para consultar incursiones, eventos, alineaciones del Team GO Rocket y rankings de atacantes de Pokémon GO. Está pensada para usarse principalmente desde el celular y también adapta su diseño a escritorio.

**Versión:** 2.0.0

**Autor:** [BayronAlexisBaezVargas](https://github.com/BayronAlexisBaezVargas)

## Qué puedes hacer

### Radar de incursiones

En `index.html` puedes consultar los jefes de incursiones de 1★, 3★, 5★, Mega y Sombra, además de próximas rotaciones cuando la fuente publica sus datos.

- Los datos se consultan automáticamente al entrar a la página.
- Puedes buscar por nombre y combinar filtros de tipo y disponibilidad de variocolor. El botón **Limpiar filtros** restablece los tres.
- Las tarjetas muestran los PC de captura al 100 % IV y con clima, cuando están disponibles.
- La ficha de cada Pokémon reúne **Captura**, **Cómo vencerlo** y **Pokédex**, con debilidades, resistencias y datos de la especie.
- Desde la ficha puedes abrir los atacantes recomendados y volver al radar.
- Las formas, como Mega Charizard X e Y, se abren de manera independiente.

### Eventos: Lista y Semana

La sección **Eventos** reúne dos vistas que puedes alternar con los botones **Lista / Semana**:

- **Lista** (`assets/noticias.html`): búsqueda, filtros por categoría y estado, cuentas regresivas y detalles de cada evento. Las bonificaciones y otros datos se muestran según lo que publique la fuente.
- **Semana** (`assets/semana.html`): agenda de lunes a domingo, horarios locales, estados **En curso**, **Próximo** y **Finalizado**, día actual destacado y botón **Ir a hoy**. También puedes consultar semanas anteriores y siguientes.

Los horarios se ajustan a la zona horaria del dispositivo.

### Team GO Rocket

En `assets/rocket.html` puedes consultar a Giovanni, Cliff, Sierra, Arlo y los reclutas.

- Los equipos de los líderes se despliegan al seleccionarlos y se organizan en tres fases de combate.
- Cada líder muestra un resumen del Pokémon que puedes rescatar.
- Los reclutas se pueden buscar por frase o Pokémon y muestran los encuentros rescatables indicados por la fuente.
- Las fichas conservan las formas regionales y consultan sus tipos al abrirse.
- La página busca alineaciones nuevas al entrar, valida la respuesta y conserva un respaldo local.

### Atacantes PvE

En `assets/atacantes.html` puedes ver el top de atacantes por tipo, sus datos y las etiquetas de DPS publicadas en el ranking.

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
| Rankings de atacantes | `assets/scratch_atacantes.json`, generado a partir de Pokémon GO Hub | Archivo actualizado mediante el script y el workflow del repositorio. Si no carga, la página utiliza datos incluidos en el JavaScript. |

La información depende de lo que publiquen las fuentes y puede tardar en reflejar cambios del juego. El respaldo Rocket incluido en el proyecto es una captura local, no una fuente que se actualice por sí sola.

### Automatización del ranking de atacantes

El workflow `.github/workflows/update_atacantes.yml` está configurado para ejecutarse los domingos a las **04:00 UTC** y permite ejecución manual desde GitHub Actions. Ejecuta `scripts/update_atacantes.js` con Node.js 20 y está configurado para subir cambios del JSON a `main` cuando los hay. Su ejecución efectiva depende de la configuración y los permisos de Actions del repositorio.

Para regenerar el archivo manualmente, con Node.js 20 o superior instalado:

```bash
node scripts/update_atacantes.js
```

Este comando modifica el ranking local; no es necesario para iniciar la web. Si sirves la aplicación con Docker, reconstruye la imagen para incorporar el archivo actualizado.

## Caché y uso en celular

La web incluye un manifiesto PWA y un Service Worker. Guarda recursos y datos para acelerar las visitas posteriores; la disponibilidad sin conexión depende de lo que ya se haya almacenado. Las consultas nuevas necesitan conexión. El Service Worker requiere HTTPS o `localhost`; el acceso por HTTP a una IP de la red local permite usar la web, pero no ofrece las mismas funciones PWA.

## Estructura del proyecto

```text
PokeRadarGoB/
├── index.html                      # Radar de incursiones
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
│   └── js/                         # Lógica de páginas, navegación y Service Worker
├── scripts/update_atacantes.js      # Generador del ranking
└── .github/workflows/
    └── update_atacantes.yml         # Automatización del ranking
```

## Aviso legal

Proyecto independiente de la comunidad, sin afiliación oficial con Pokémon GO. Las marcas, nombres e imágenes pertenecen a sus respectivos titulares.
