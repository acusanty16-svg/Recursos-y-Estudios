# Diseño de Santi’s Versicles

> Documento vivo. Explica las decisiones visuales, de interacción y de arquitectura que sostienen la app.

## 1. Principio rector

**La Escritura primero, la interfaz después.** Cada pantalla compite con el texto bíblico, así que la interfaz debe desaparecer cuando no se necesita. De ahí salen tres reglas:

1. **Una sola cosa importante por pantalla.** En el lector, el texto. En Inicio, el próximo paso.
2. **Las acciones se revelan, no se acumulan.** La barra fija muestra lo esencial; lo secundario vive en menús, cajones o diálogos.
3. **El estado siempre es visible.** La referencia, el versículo actual y el progreso de lectura están anclados arriba para que nunca te pierdas.

## 2. Identidad visual

### Tipografía

| Uso | Fuente | Razón |
| --- | --- | --- |
| Texto bíblico y títulos | **Literata** | Serif diseñada para lectura prolongada en pantalla, con eje óptico y buen ritmo horizontal. |
| Interfaz | **Inter** | Sans neutra, excelente legibilidad en tamaños pequeños y en tablas/controles. |

- El texto sagrado usa `1.0625rem × 1.125` (≈19 px) con `line-height: 1.78`, `max-width: 68ch` y `text-wrap: pretty`.
- El usuario puede ajustar el tamaño con `--sv-font-scale` desde Ajustes.
- Los títulos usan Literata; los controles, Inter. No se mezclan dentro de un mismo bloque.

### Color

La base es el **azul profundo** de la marca. El acento dejó de ser dorado y pasó a **ember**, un rojo profundo con variantes claras para fondos oscuros.

| Rol | Token | Uso |
| --- | --- | --- |
| Base | `navy-900/950` | Fondo oscuro, sidebar, texto principal en claro. |
| Acento | `ember-500/600` | Pestaña activa, botón primario, versículo activo, foco. |
| Comparación | `sky-500/600` | Panel de la traducción secundaria y selector “Comparar”. |
| Subrayados | `gold`, `sage`, `sky`, `rose` | Colores funcionales del resaltador; no son el acento de la interfaz. |
| Superficies | `parchment-50/100` | Fondo claro y tarjetas. |

- Modo oscuro por defecto; modo claro manual.
- El fondo tiene un degradado radial muy sutil de ember para dar profundidad sin distraer.
- Contraste objetivo: AA en texto normal y en controles.

## 3. Arquitectura de información

```
Inicio ── Lector ── Mis notas
  │         │
  │         ├─ Referencia (libro/capítulo)
  │         ├─ Versículo actual + selector
  │         ├─ Comparación opcional
  │         └─ Notas del capítulo (cajón)
  ├─ Importar
  ├─ API Explorer
  └─ Ajustes
```

- **Inicio** responde “¿qué leo hoy?”: racha, versículo del día, continuar lectura, estadísticas y logros.
- **Lector** responde “¿dónde estoy y qué dice?”: barra fija, texto, comparación, notas.
- **Mis notas** responde “¿qué me ha dicho?”: búsqueda, etiquetas, exportación.
- **Importar** y **API** son herramientas de datos, no pantallas de lectura.
- **Ajustes** concentra apariencia, idioma, tamaño, recordatorios y datos.

## 4. El lector, en detalle

### 4.1 Barra fija

Sustituye la antigua tarjeta lateral de libro/capítulo. Contiene:

- Marca compacta en móvil (la barra es también la cabecera del lector).
- Referencia actual (`Juan 1`) que abre el **diálogo de referencia**.
- Capítulo anterior / siguiente.
- **Versículo actual** (`v. 12`) que abre una cuadrícula para saltar a cualquier versículo.
- Selector de traducción activa.
- Selector de comparación (`Comparar`).
- Notas del capítulo (cajón) y modo enfoque.
- Barra fina de progreso de lectura en el borde inferior.

La barra es `sticky top-0`, con fondo sólido y borde inferior. No usa transparencia para que el texto que pasa por debajo no “sangre” en la lectura.

### 4.2 Referencia

Un solo diálogo con búsqueda:

- Escribe `Juan 3:16`, `Sal 23` o el nombre de un libro.
- Si la entrada es una referencia válida, aparece “Ir directo”.
- Si no, se filtran los 66 libros por nombre, abreviatura o identificador.
- Al elegir un libro se muestran sus capítulos en una cuadrícula.
- Al elegir un capítulo, el lector navega y el versículo pendiente se desplaza y se marca como activo.

### 4.3 Comparación

- Una traducción activa + una comparación opcional.
- En escritorio, dos columnas con cabecera (`RV1960` / `NTV`) y un panel azul tenue para la comparación.
- En móvil, la comparación se apila debajo del versículo con una etiqueta visible.
- El panel usa `sky` para diferenciarse del acento rojo sin introducir un tercer color de marca.
- La comparación se carga aparte y no bloquea el texto principal; si falla, se muestra un aviso y se ocultan las columnas.

### 4.4 Notas

- Las notas **no ocupan espacio permanente**.
- El botón “Ver notas” abre un cajón lateral con las notas del capítulo.
- Al añadir o editar una nota se abre un diálogo; la nota guardada aparece en línea bajo el versículo.
- El cajón se cierra al abrir el editor para evitar dos modales compitiendo por el foco.

### 4.5 Versículo activo

- `useReadingPosition` mide la posición de los versículos y cachea sus `top` para no leer el layout en cada frame.
- El versículo cuyo inicio cruza la línea de lectura (180 px desde arriba) se marca como activo.
- El fondo y la barra izquierda cambian con una transición de 300 ms.
- Al saltar a un versículo, se usa `scrollIntoView({ block: 'start' })` y `scroll-mt-44` para dejarlo justo debajo de la barra.

## 5. Movimiento

El movimiento debe orientar, no decorar.

| Elemento | Animación |
| --- | --- |
| Cambio de ruta | Fundido de 320 ms (`sv-page-enter`). Sin `transform` para no romper `position: fixed`. |
| Cajón de notas | Deslizamiento desde la derecha, 320 ms. |
| Diálogos | Entrada con escala y desplazamiento suave, 280 ms. |
| Popover del versículo | Aparición con escala desde la esquina, 180 ms. |
| Versículo activo | Transición de fondo y barra, 300 ms. |
| Progreso | `transform: scaleX()` con transición lineal de 140 ms. |
| Esqueleto de carga | Pulso suave. |
| Botones | Cambio de color y `active:scale(0.98)`. |

Todo respeta `prefers-reduced-motion` mediante la regla global que reduce las animaciones a 0.01 ms.

## 6. Estado y datos

```
UI (React)
  └─ useAppStore() ── useSyncExternalStore
       └─ controller/
            ├─ app.controller.ts      navegación, carga, racha
            ├─ bible.service.ts       bolls.life + Zod + caché
            ├─ notes.controller.ts    notas, subrayados, favoritos
            ├─ import.controller.ts   File System Access API
            ├─ preferences.controller localStorage
            └─ idb.ts                 IndexedDB
```

- No hay librería de estado externa. El store es explícito y testeable.
- El texto bíblico se normaliza (entidades HTML, `<br>`) antes de guardarse.
- Los capítulos se cachean en IndexedDB y el service worker aplica stale-while-revalidate.
- Los JSON de `/rsc` se validan con Zod en runtime.
- El lector memoiza `ChapterReader` y cuantiza el progreso al 1 % para evitar re-renderizar 176 versículos en cada frame.

## 7. Accesibilidad

- Foco visible con anillo ember.
- Áreas táctiles mínimas de 44 px en controles principales.
- Diálogos con `role="dialog"`, `aria-modal`, cierre con Escape y bloqueo de scroll.
- `aria-current` en el versículo activo y en el capítulo actual.
- Texto alternativo en iconos decorativos (`aria-hidden`).
- Navegación por teclado en la barra, el selector de versículo y el diálogo de referencia.
- Contraste AA en texto y controles.

## 8. Rendimiento

- Swagger UI se carga con `lazy()` y solo al entrar en `/api`.
- El texto bíblico se pide por capítulo y se cachea.
- `ChapterReader` usa `memo` y mapas `useMemo` para notas, subrayados y favoritos.
- `useReadingPosition` cachea posiciones y solo actualiza cuando cambia el versículo o el progreso en 1 %.
- La barra fija usa fondo sólido, sin `backdrop-filter`, para evitar coste de composición en móvil.

## 9. Trade-offs

- **Sin backend:** el Swagger “Try it out” funciona con Blob URLs locales; no hay autenticación ni datos remotos.
- **bolls.life:** no requiere clave y tiene CORS abierto, pero depende de un servicio externo. La caché mitiga la falta de red.
- **Texto bíblico con derechos:** la app es de uso personal; se muestra un aviso de licencias.
- **Sin editor Markdown en vivo:** las notas se guardan como texto plano y se exportan a Markdown. Es suficiente para el uso devocional y evita dependencias.
- **Una sola traducción activa + una comparación:** mantiene la lectura enfocada; para comparar tres versiones se cambia la activa.

## 10. Mapa de archivos

```
src/
  model/          canon, tipos, referencias, errores
  controller/     store, IndexedDB, API, preferencias, importación
  seguimiento/    racha, estadísticas, logros
  rsc/            JSON mock + esquemas Zod
  i18n/           diccionarios ES/EN
  ui/
    components/   Brand, Dialog, PageHeader, Toast, iconos
    layout/       AppShell, Sidebar, MobileNav
    reader/       ChapterReader, ReaderToolbar, VerseRow,
                  ReferenceDialog, NotesDrawer, NoteDialog
    pages/        Dashboard, Reader, Notes, Import, API, Settings
    hooks/        useI18n, useReadingPosition
public/
  openapi.yaml    contrato OpenAPI 3
  icon*.svg       PWA
scripts/
  smoke*.mjs      pruebas de rutas e interacciones con Playwright
```
