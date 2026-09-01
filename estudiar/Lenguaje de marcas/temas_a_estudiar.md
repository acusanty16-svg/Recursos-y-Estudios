# Temas a Estudiar - Lenguaje de Marcas

## Resultado del examen: 22/30 (73%)

---

## Temas con Fallos (Repasar)

### 1. Etiqueta HTML para hipervínculos
- **Etiqueta correcta**: `<a>` (anchor)
- **Atributo**: `href` especifica la URL de destino
- **No es**: `<link>` (para CSS), `<url>` (no existe), `href` (es atributo, no etiqueta)

### 2. Significado de XML
- **正确**: eXtensible Markup Language
- **Significado clave**: "Extensible" = permite definir etiquetas propias
- **No es**: "Extended Markup Language"

### 3. Propiedad CSS para interlineado
- **Correcta**: `line-height`
- **Controla**: Espacio vertical entre líneas de texto
- **No es**: `text-spacing` (no existe)

### 4. Propiedad Flexbox para eje principal
- **Correcta**: `justify-content`
- **Alinea**: Elementos a lo largo del eje principal (horizontal por defecto)
- **No es**: `align-content` (para múltiples líneas), `align-items` (eje transversal)

### 5. Comportamiento de overflow:auto
- **Definición**: Añade barras de desplazamiento SOLO cuando es necesario
- **Diferencias**:
  - `hidden`: recorta contenido
  - `scroll`: siempre muestra barras
  - `visible`: deja desbordar
- **No es**: "Ajusta automáticamente el tamaño del contenedor"

### 6. Atributo HTML para URL de hipervínculo
- **Atributo correcto**: `href` (Hypertext Reference)
- **Etiqueta**: `<a href="url">`
- **No es**: `link`, `url`, `destination`

### 7. Función CSS para cambiar dimensiones
- **Función correcta**: `scale()` dentro de `transform`
- **Sintaxis**: `scale(1.5)` (uniforme) o `scale(1.5, 0.8)` (por ejes)
- **No es**: `grow()`, `resize()`, `zoom()`

### 8. Unidad CSS relativa al tamaño de fuente del elemento raíz
- **Unidad correcta**: `rem` (root em)
- **Relativa a**: Tamaño de fuente del elemento `<html>`
- **Diferencias**:
  - `em`: relativa al elemento padre
  - `px`: absoluta
  - `%`: relativa al contenedor padre

---

## Temas dominados

- **HTML**: etiquetas `<td>`, atributos `required`, `id`
- **CSS Grid**: `display: grid`, `place-items` (centrar contenido)
- **CSS Flexbox**: `flex-wrap` (múltiples líneas), `flex-grow` (crecer), `justify-content`, `align-items`
- **Propiedades CSS**: `border`, `padding`, `margin`, `border-radius`, `box-shadow`, `overflow: hidden`
- **Selectores CSS**: clase (`.clase`), ID (`#id`)
- **Texto**: `font-family`, `text-decoration: none`
- **Formularios**: atributo `required` para campos obligatorios

---

## Comandos y sintaxis

### Selectores CSS
```
.clase          → Selector de clase
#id             → Selector de ID
elemento        → Selector de etiqueta
```

### Display
- `block`: ocupa línea completa
- `inline`: fluye en línea, no permite ancho/alto
- `inline-block`: flujo línea + dimensiones definibles
- `grid`: activa Grid
- `flex`: activa Flexbox

### Propiedades esenciales
| Propiedad | Función |
|-----------|---------|
| padding | Espacio interior (contenido → borde) |
| margin | Espacio exterior (borde → otros elementos) |
| border | Borde del elemento |
| border-radius | Esquinas redondeadas |
| box-shadow | Sombras |
| overflow | Control de contenido excedente |

### Flexbox
- `flex-wrap: wrap` → elementos a siguiente línea
- `justify-content` → alineación eje principal
- `align-items` → alineación eje transversal
- `flex-grow` → crecer para ocupar espacio

### Grid
- `display: grid` → activar grid
- `place-items: center` → centrar contenido

---

## Diferencias Clave

| Concepto | Correcto | Incorrecto |
|----------|----------|------------|
| Enlace HTML | `<a href="...">` | `<link>` |
| XML | eXtensible | Extended |
| Interlineado | line-height | text-spacing |
| Flexbox eje principal | justify-content | align-content |
| overflow:auto | barras si es necesario | ajusta tamaño |
| URL enlace | href | link, url |
| Dimensiones | scale() | grow(), resize() |
| Unidad raíz | rem | px |

---

## Notas del Examen

- Tuviste 8 fallos (73%)
- Falta reforzar: etiquetas HTML, propiedades Flexbox/Grid, unidades CSS
- Buen nivel general en CSS básico

## Cosas del Examen que ha dicho José
- 1. la primera pregunta es la propiedad **color**. pero podria tener una variante, que propiedad se usa para cambiar el tipo de letra? **font-family**
- 2.  la respuesta es **body** y la variante es: que etiqueta HTML contiene los metadatos **head**
- 3. la tercera es **flex-wrap**. 
- 4. la cuarta es **inline**
- 5. la respuesta es **color**. y su variante es que propiedad de CSS controla el color de fondo: **background-color**
- 6. la respuesta es **img**.
    - si hubiese otra pregunta que fuera: que propiedad CSS permite crear enlaces, debemos poner: **a**
- 7. la septima es: **grid-template-rows** y su variante es que propiedad CSS define columnas: **grid-template-colums**
- 8. la octava es: **padding** y su variante es que propiedad CSS controla es espacio interior de un elemento: **margin**
- 9. la novena es: **#id** y su variante es que selector CSS selecciona una clase: **.**
- 10. la respuesta es: **text-decoration** y variante es que propiedad elimina el subrayado a un texto: **text-decoration:none**
- 11. la respuesta es: **src** 
- 12. la doceava pregunta es: **align-items** pero ha dicho que **justify-content** es para los ejes principales
- 13. la respuesta es: **font-size** e interlineado es **line-height**
- 14. la catorceava respuesta es: **ol** y las desordenadas son **ul**
- 15. la respuesta es: **em** y su variante seria que unidad depende del tamaño de fuente del elemento HTML y su respuesta es: **rem**
- 16. la diesiceisava respuesta es: **display:flex** 
- 17. la respuesta es: **visibility:hidden** mientras que el **display:none** elimina y oculta el espacio tambien y el **overflow:hidden** oculta contenido sobrante
- 18. la respuesta es: **text-shadow** y su variante es que porpiedad CSS aplica sombras a un contenedor y su respuesta es: **box-shadow**
- 19. la respuesta es: **height:auto** 
- 20. la respuesta es: **border-radius**
- 21. la respuesta es: **transition**
- 22. la respuesta es: **@keyframes**
- 23. la respuesta es: **translate()**
- 24. la respuesta es: **li**
- 25. la respuesta es: **margin:auto**
- 26. la respuesta es: **HyperText Markup Language** y su variante es que significaria XML y su respuesta es: **Extensible Markup language** 
- 27. la respuesta es: **Elemento raiz unico**
- 28. la respuesta es: **identificador unico**
- 29. la respuesta es: **flex-grow**
- 30. la respuesta es: **repeat()**
