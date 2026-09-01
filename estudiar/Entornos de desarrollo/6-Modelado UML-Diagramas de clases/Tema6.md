# Tema 6: Modelado UML - Diagramas de Clases

## 📌 Resumen Rápido

UML (Lenguaje Unificado de Modelado) es el estándar para representar visualmente la estructura de un sistema. El diagrama de clases muestra las clases, sus atributos, métodos y las relaciones entre ellas.

---

## 1. Introducción a los Diagramas de Clases (Sesión 22)

### ¿Qué es UML?

**Lenguaje Unificado de Modelado** - estándar para representar estructura y comportamiento de sistemas software.

### Elementos Básicos de una Clase

Una clase se representa como un rectángulo con **tres secciones**:

```
┌─────────────────────┐
│       Nombre        │
├─────────────────────┤
│    Atributos        │
├─────────────────────┤
│     Métodos         │
└─────────────────────┘
```

| Elemento | Descripción |
|---------|-------------|
| **Clase** | Plantilla de objetos (rectángulo) |
| **Atributo** | Propiedad o variable de la clase |
| **Método** | Función o comportamiento |

### Visibilidad de Miembros

| Símbolo | Accceso |
|---------|--------|
| **+** | Público (public) |
| **-** | Privado (private) |
| **#** | Protegido (protected) |
| **~** | Paquete (package) |

**Ejemplo**:
```
┌─────────────────────────┐
│       Usuario           │
├─────────────────────────┤
│ - nombre: String       │
│ - email: String         │
│ - edad: int             │
├─────────────────────────┤
│ + registrar(): void    │
│ + login(): boolean     │
│ # validarEmail(): bool │
└─────────────────────────┘
```

---

## 2. Relaciones entre Clases

### Asociación

Conexión general entre clases. Indicates que dos clases se relacionan.

```
Usuario ──────── Pedido
```

**Notación**: Línea continua entre clases

### Herencia (Generalización)

Relación "es un". Una clase hija extiende a una clase padre.

```
     Persona
        ▲
        │ extends
        │
    ┌───┴───┐
    │       │
Usuario  Empleado
```

**Notación**: Flecha con triángulo vacío apuntando a la clase padre

### Agregación

Relación "tiene un" - **débil**. El objeto contenido puede existir sin el contenedor.

```
  Empresa ◇─────── Empleado
```

**Notación**: Rombo vacío

### Composición

Relación "contiene un" - **fuerte**. El objeto contenido NO puede existir sin el contenedor.

```
  Cliente ●─────── Cuenta
```

**Notación**: Rombo relleno

### Comparación de Relaciones

| Relación | Tipo | Ejemplo | Símbolo |
|----------|------|--------|----------|
| **Asociación** | Débil | Usuario → Pedido | ─────── |
| **Herencia** | "es un" | Empleado extends Persona | ────▶ |
| **Agregación** | "tiene un" (puede existir solo) | Empresa ◇─── Empleado | ◇─── |
| **Composición** | "contiene" (fuertes) | Cliente ●─── Cuenta | ●─── |

---

## 3. Modelo Multiplicidad

Indica cuántos objetos participan en la relación.

| Notación | Significado |
|----------|-------------|
| `1` | Exactamente uno |
| `0..1` | Cero o uno |
| `*` | Cero o muchos |
| `1..*` | uno o muchos |
| `0..*` | cero o muchos |

**Ejemplo**: Un usuario puede hacer cero o muchos pedidos

```
Usuario 1 ────── * Pedido
```

---

## 4. Ejemplo Práctico: Biblioteca Digital

### Diagrama de Clases

```
┌──────────────┐         ┌──────────────┐
│    Usuario   │         │    Libro    │
├──────────────┤         ├──────────────┤
│ - nombre    │         │ - titulo    │
│ - email     │         │ - autor     │
│ - password │         │ - isbn     │
├──────────────┤◀──────▶├──────────────┤
│ + login()   │ 0..*  1 │ + prestar() │
│ + register()│        │ + devolver()│
└──────────────┘         └──────────────┘
```

**Relaciones**:
- Usuario 1 ──── * Pedido (un usuario puede hacer muchos préstamos)
- Libro 1 ──── 0..1 Usuario (un libro puede estar prestado a un usuario o ninguno)

---

## 5. Herramientas UML (Sesión 23)

### Herramientas Recomendadas

| Herramienta | Tipo | Características |
|------------|------|------------------|
| **Draw.io / diagrams.net** | Gratis/web | Muy accesible |
| **Lucidchart** | Freemium/web | Colaborativo |
| **StarUML** | De pago | Potente, genera código |
| **Visual Paradigm** | De pago | Ingeniería directa/inversa |
| **Enterprise Architect** | De pago | Profesional |

### Ingeniería Directa e Inversa

| Tipo | Descripción |
|------|-------------|
| **Ingeniería Directa** | Generar código desde el diagrama |
| **Ingeniería Inversa** | Generar diagrama desde código |

### Buenas Prácticas

- **Máximo 10-12 clases** por diagrama
- **Nombres significativos**
- **Colores para estereotipos** (modelo, controlador, vista)
- **Validar coherencia** antes de generar código
- **Mantener diagrama actualizado**

---

## 🧠 Conceptos Clave para Examen

1. **UML = lenguaje estándar de modelado**
2. **Diagrama de clases = estructura del sistema**
3. **Clase = rectángulo** con nombre, atributos, métodos
4. **Herencia = extends**, relación "es un"
5. **Agregación = tiene un** (débil), ☐
6. **Composición = contiene** (fuerte), ⬛
7. **Asociación = conexión general**
8. **Multiplicidad = cuántos objetos**
9. **Visibilidad**: + público, - privado, # protegido
10. **Herramientas**: StarUML, Draw.io, Lucidchart

---

## ✅ Resumen Visual

```
Elementos de UML
├── Clase
│   ├── Nombre
│   ├── Atributos
│   └── Métodos
└── Relaciones
    ├── Asociación ───────
    ├── Herencia ────▶
    ├── Agregación ◇───
    └── Composición ●──

Visibilidad
├── + público
├── - privado
├── # protegido
└── ~ paquete

Multiplicidad
├── 1     → uno
├── 0..1   → cero o uno
├── *      → muchos
└── 1..*  → uno o muchos
```

---

## 💻 Ejercicio Práctico

Diseña el diagrama de clases para un sistema de gestión escolar:

1. **Alumno** (nombre, DNI, email)
2. **Profesor** (nombre, departamento)
3. **Asignatura** (nombre, código)
4. **Evaluación** (nota, fecha)

**Relaciones**:
- Un profesor imparte varias asignaturas
- Una asignatura tiene varios alumnos
- Los alumnos tienen evaluaciones en asignaturas

---

## ✅ Conclusión Fácil de Recordar

1. **UML = lenguaje visual** para diseñar antes de programar
2. **Clase =(rectángulo) con 3 partes** → nombre, atributos, métodos
3. **Herencia = triangle vacío** → "es un"
4. **Agregación = rombo vacío** → "tiene un" (débil)
5. **Composición = rombo lleno** → "contiene" (fuerte)
6. **UML ayuda a detectar errores** antes de escribir código

---

> 📚 **Recursos**: "UML Distilled" - Martin Fowler, "The Unified Modeling Language User Guide" - Booch, Rumbaugh & Jacobson