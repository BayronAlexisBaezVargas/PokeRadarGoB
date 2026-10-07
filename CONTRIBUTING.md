# Guía de Contribución

¡Gracias por tu interés en contribuir a **Radar de Campo (PokeRadarGoB)**! Nos emociona que quieras ayudar a mejorar esta herramienta para toda la comunidad de Pokémon GO.

Tanto si quieres corregir un error, añadir información sobre nuevos Pokémon Oscuros, proponer mejoras en la interfaz o arreglar errores de código, todas las contribuciones son bienvenidas.

## ¿Cómo contribuir?

### 1. Reportando Errores o Sugiriendo Mejoras
Si no sabes programar pero encontraste un error (por ejemplo, una alineación del Team GO Rocket que ha cambiado o un estilo visual que se rompe en tu móvil), por favor:
- Ve a la pestaña **Issues** en GitHub.
- Busca si alguien más ya ha reportado el problema.
- Si no es así, abre un nuevo *Issue* describiendo claramente el error, el dispositivo que utilizaste y los pasos para reproducirlo.

### 2. Aportando Código (Pull Requests)
Si deseas realizar cambios en el código (HTML, CSS, JavaScript Vanilla):

1. **Haz un Fork** del repositorio a tu propia cuenta de GitHub.
2. **Clona** tu repositorio localmente:
   ```bash
   git clone https://github.com/TU_USUARIO/PokeRadarGoB.git
   ```
3. **Crea una nueva rama** para tu funcionalidad o corrección:
   ```bash
   git checkout -b feature/mi-nueva-funcionalidad
   ```
   *Usa nombres descriptivos para las ramas (ej: `fix/alineacion-cliff`, `feature/modo-oscuro`).*
4. **Realiza los cambios** y pruébalos localmente abriendo los archivos en tu navegador o utilizando el Dockerfile proporcionado.
5. **Haz Commit** de tus cambios usando mensajes claros y descriptivos:
   ```bash
   git commit -m "Actualizadas las frases de los reclutas del tipo Fuego"
   ```
6. **Sube (Push)** tus cambios a tu repositorio remoto:
   ```bash
   git push origin feature/mi-nueva-funcionalidad
   ```
7. Dirígete al repositorio original y abre un **Pull Request (PR)**. Asegúrate de describir detalladamente qué cambios hiciste y por qué.

## Arquitectura y Estilo de Código
Dado que el proyecto está diseñado para ser ligero, rápido y no depender de entornos de compilación modernos (Node.js, Webpack, etc.):
- **No uses frameworks externos** (React, Vue, Tailwind). Nos mantenemos en Vanilla JS y CSS nativo.
- Evita el uso de librerías externas pesadas (como jQuery o Moment.js).
- Si modificas estilos, utiliza las variables CSS definidas en el `:root` del archivo `styles.css` para mantener la coherencia (ej: `var(--signal)`, `var(--panel)`).
- Todo el código JavaScript sigue el patrón IIFE (Expresiones de Función Ejecutadas Inmediatamente) para evitar ensuciar el scope global. ¡Mantén esta práctica!

## Código de Conducta
Al participar en este proyecto, estás de acuerdo en acatar nuestro [Código de Conducta](CODE_OF_CONDUCT.md). Por favor, sé respetuoso y amable con otros contribuyentes.

¡Muchísimas gracias por ayudar a mantener este radar funcional para toda la comunidad!
