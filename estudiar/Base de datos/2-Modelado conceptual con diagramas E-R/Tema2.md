# Tema 2: Modelado Conceptual con Diagramas E-R

## 📌 Resumen Rápido

El **Modelo Entidad-Relación (E-R)** es el lenguaje universal para diseñar bases de datos a nivel conceptual. Se basa en tres pilares: **entidades** (objetos), **atributos** (propiedades) y **relaciones** (asociaciones).

---

## 1. Entidades, Atributos y Relaciones (Sesión 4)

### Entidad

Objeto del mundo real sobre el que queremos guardar información y que se puede distinguir de los demás.

**Ejemplos**: Alumno, Coche, Producto, Cliente

### Atributo

Característica o propiedad de una entidad.

| Tipo | Descripción | Ejemplo |
|------|-------------|--------|
| **Simple** | No se puede dividir | edad, dni |
| **Compuesto** | Se divide en partes | dirección (calle, ciudad, cp) |
| **Multivalorado** | Varios valores | teléfono (puede tener varios) |

### Relación

Asociación entre dos o más entidades.

**Ejemplo**: Un Alumno se matricula en una Asignatura

### Notación Gráfica

```
┌─────────────┐         ┌───────────────┐
│  ENTIDAD   │         │  ENTIDAD 2  │
├─────────────┤         ├─────────────┤
│ atributo1 │         │ atributoA  │
│ atributo2 │         │ atributoB  │
└─────────────┘         └─────────────┘
        │                    │
        └────────┬───────────┘
               ◇
           RELACIÓN
```

> **CONSEJO**: Para identificar entidades = buscar **sustantivos**. Para identificar relaciones = buscar **verbos**.

---

## 2. Cardinalidad y Tipos de Relaciones (Sesión 5)

### ¿Qué es la Cardinalidad?

La regla que indica **cuántas instancias** de una entidad pueden asociarse con otra.

### Tipos de Cardinalidad

| Tipo | Símbolo | Ejemplo |
|------|---------|---------|
| **Uno a Uno (1:1)** | 1:1 | Un Ciudadano tiene un DNI |
| **Uno a Muchos (1:N)** | 1:N | Una Madre tiene muchos Hijos |
| **Muchos a Muchos (N:M)** | N:M | Alumno ↔ Asignatura |

### Notación de Pata de Gallo (Crow's Foot)

```
│ = uno
〉◇ = muchos
```

### Ejemplos Prácticos

| Relación | Entidades | Cardinalidad |
|---------|----------|------------|
| Cliente - Pedido | Un cliente hace muchos pedidos | 1:N |
| Alumno - Asignatura | Un aluno pode matricularse en muchas asignaturas | N:M |
| Empleado - Departamento | Un empleado pertenece a un departamento | 1:N |

> **IMPORTANTE**: Las relaciones N:M requieren una **tabla intermedia** en implementarse.

---

## 3. Jerarquías: Generalización y Especialización (Sesión 6)

### Generalización

Proceso **bottom-up** (ascendente): agrupar entidades con atributos comunes en una superclase.

```
Coche ─┐
Moto ──┼──▶ Vehículo (superclase)
Bici ──┘
```

### Especialización

Proceso **top-down** (descendente): dividir una entidad general en subclases más específicas.

```
Empleado (superclase)
   │
   ├───── Empleado (subclase)
   ├───── Instructor (subclase)
   └───── Administrativo (subclase)
```

### Notación "ISA"

El triángulo "is a" (es un) conecta las subclases con la superclase.

| Concepto | Descripción |
|----------|-------------|
| **Superclase** | Entidad general con atributos comunes |
| **Subclase** | Entidad específica que hereda y añade atributos |
| **Hereda** | Las subclases heredan atributos de la superclase |

### Ejemplo: Airbnb

```
Usuario (superclase)
├── Huesped
└── Anfitrión
```

**Atributos comunes**: id, nombre, email, password
**Atributos de Huesped**: preferencias_viaje
**Atributos de Anfitrión**: numero_cuenta, superhost

> **VENTAJA**: Evita redundancia y facilita mantenimiento

---

## 4. Taller: Modelo E-R Completo (Sesión 7)

### Proceso Paso a Paso

```
Requisitos → Entidades → Atributos → Relaciones → Cardinalidad → Jerarquías → Diagrama
```

### Ejemplo: Sistema de Cursos Online

**Entidades**:
- Empleado
- Curso
- Lección
- Valoración
- Instructor

**Relaciones y Cardinalidad**:
| Relación | Cardinalidad |
|---------|--------------|
| Empleado → Inscripción en Curso | N:M |
| Curso → Lección | 1:N |
| Instructor → Crea Curso | 1:N |
| Empleado → Valoración en Curso | N:M |

**Jerarquía**: Instructor "es un" Empleado (especialización)

---

## 5. Caso Aplicado: E-commerce (Sesión 8)

### Entidades Principales

| Entidad | Atributos |
|---------|------------|
| **Cliente** | id, nombre, email, password |
| **Producto** | id, nombre, precio, stock, descripción |
| **Categoría** | id, nombre |
| **Pedido** | id, fecha, estado, total |
| **Dirección** | id, calle, ciudad, cp |
| **LíneaPedido** (asociativa) | cantidad, precio_unitario |

### Diseño Clave

La relación N:M entre **Pedido** y **Producto** requiere entidad asociativa **LíneaPedido**:

```
Pedido 1 ──◇── N LíneaPedido N ──◇── 1 Producto
```

**¿Por qué?**: Porque necesitamos guardar la **cantidad** y el **precio_unitario** en el momento de la compra.

### Decisiones de Diseño

| Decisión | Razón |
|----------|-------|
| Entidad asociativa | Guarda atributos de la relación |
| Categoría separada | Permite reutilizar categorías |
| Dirección separado de Cliente (1:N) | Un cliente puede tener varias direcciones |

---

## 🧠 Conceptos Clave para Examen

1. **Entidad** = objeto distinguible (sustantivo)
2. **Atributo** = propiedad de una entidad
3. **Relación** = conexión entre entidades (verbo)
4. **Cardinalidad** = cuántos se relacionan (1:1, 1:N, N:M)
5. **Notación Crow's Foot** = representación visual de cardinalidad
6. **Generalización** = ascender a superclase
7. **Especialización** = descender a subclases
8. **Entidad asociativa** = solución para N:M
9. **Jerarquía ISA** = "es un"
10. **Atributos de relación** = datos que pertenecen a la relación

---

## ✅ Resumen Visual

```
Modelo E-R
├── Entidades (rectángulos)
│   └── Atributos (óvalos)
└── Relaciones (rombos)
    └── Cardinalidad (1:1, 1:N, N:M)

Jerarquía
├── Superclase
└── Subclases (heredan)
    └── ISA (triángulo)

Diseño E-commerce
├── Cliente 1──N──◇──N── Pedido N ──◇──N── Producto (vía LíneaPedido)
└── Categoría 1──N──◇──N── Producto
```

---

## 💻 Herramientas Recomendadas

| Herramienta | Tipo |
|------------|------|
| **Lucidchart** | Online, gratuito |
| **Draw.io** | Online, gratuito |
| **MySQL Workbench** | SGBD con modelado |
| **Visual Paradigm** | Profesional |

---

## ✅ Conclusión Fácil de Recordar

1. **E-R = plano conceptual** antes de construir
2. **Entidades = sustantivos**, **relaciones = verbos**
3. **Cardinalidad = cuántos se relacionan**
4. **N:M siempre necesita tabla intermedia**
5. **Jerarquía = "es un" para evitar redundancia**
6. **El diagrama es documento de comunicación**

---

> 📚 **Recursos**: "Database Design for Mere Mortals" - Hernandez, "Data Modeling Essentials" - Simsion