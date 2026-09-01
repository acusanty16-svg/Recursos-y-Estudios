# Tema 3: Diseño Lógico Relacional

## 📌 Resumen Rápido

El **modelo relacional** representa los datos en tablas. La **transformación** convierte el diagrama E-R a un esquema relacional (tablas, claves primarias y foráneas). Las **restricciones de integridad** garantizan que los datos sean correctos y consistentes.

---

## 1. Transformación E-R → Modelo Relacional (Sesión 9)

### ¿Qué es el Modelo Relacional?

Propuesto por **Edgar Codd**, representa los datos en **tablas** (relaciones) con filas (tuplas) y columnas (atributos).

### Reglas de Transformación

| Elemento E-R | Se convierte en |
|---------------|-----------------|
| **Entidad** | Tabla |
| **Atributo simple** | Columna |
| **Identificador** | Clave Primaria (PK) |
| **Relación** | Clave Foránea (FK) |

### Reglas por Cardinalidad

```
1:1  → PK de una tabla va como FK única en la otra
1:N  → PK del lado "1" va como FK en la tabla del lado "N"
N:M  → Crear tabla intermedia con ambas FK (PK = combinación de FK)
```

### Ejemplo: Instagram

**E-R**: Usuario (1:N) → Publica → Foto

**Transformación**:
```sql
USUARIOS(id_usuario PK, nombre, email)
FOTOS(id_foto PK, url, fecha, id_usuario_fk FK → USUARIOS)
```

---

## 2. Claves: Primaria y Foránea

### Clave Primaria (Primary Key - PK)

Identifica cada fila de forma única.

| Característica | Descripción |
|---------------|------------|
| **Única** | No hay dos filas con el mismo valor |
| **No nula** | No puede estar vacía |
| **Inmutable** | No debería cambiar |

### Clave Foránea (Foreign Key - FK)

Columna que apunta a la PK de otra tabla.

```sql
FOTOS(id_foto PK, id_usuario_fk FK → USUARIOS(id_usuario))
```

> **CONSEJO**: Nombre las FK como `id_tabla_fk` o `nombretabla_fk`

### Tipos de Claves

| Tipo | Descripción | Ejemplo |
|------|-------------|--------|
| **Surrogate** | Generada automáticamente | id_auto_increment |
| **Natural** | Ya existe en el dominio | DNI, ISBN, email |

---

## 3. Restricciones de Integridad (Sesión 10)

### ¿Qué son?

Reglas que el SGBD aplica automáticamente para mantener datos correctos.

### Tipos de Integridad

```
┌─────────────────────────────────────┐
│   RESTRICCIONES DE INTEGRIDAD        │
├─────────────────────────────────────┤
│ 1. Dominio → Valores válidos        │
│ 2. Entidad → PK no nula          │
│ 3. Referencial → FK válida       │
└─────────────────────────────────────┘
```

### 1. Integridad de Dominio

El valor debe ser del **tipo correcto** y estar en el **rango permitido**.

**Ejemplos**:
```sql
edad INT CHECK (edad >= 0 AND edad <= 120)
precio DECIMAL(10,2) CHECK (precio > 0)
provincia VARCHAR(50) NOT NULL
```

### 2. Integridad de Entidad

La **PK no puede ser nula**. Es el identificador único.

```sql
id_cliente INT PRIMARY KEY  -- No puede ser NULL
```

### 3. Integridad Referencial

La **FK debe apuntar a una PK existente** o ser nula.

**Opciones al borrar/actualizar PK**:

| Opción | Comportamiento |
|--------|---------------|
| **RESTRICT** | Prohibe borrar (por defecto, más seguro) |
| **CASCADE** | Borra/actualiza en cascada |
| **SET NULL** | Pone la FK a NULL |

```sql
FOREIGN KEY (id_cliente_fk) REFERENCES clientes(id_cliente)
  ON DELETE RESTRICT
  ON UPDATE CASCADE
```

### Ejemplo: PayPal

- FK de transacción debe apuntar a usuario existente
- No se puede eliminar usuario con transacciones

---

## 4. Práctica: Paso Completo E-R → Logical (Sesión 11)

### Ejemplo: Blog (Medium)

**Requisitos**:
1. Autores escriben artículos
2. Artículos tienen título, contenido, fecha
3. Un autor → muchos artículos
4. Artículos pueden tener varias etiquetas
5. Relación N:M entre Artículo y Etiqueta

**Paso 1: Modelo E-R**
```
AUTOR (1:N) → ARTÍCULO ← (N:M) ETIQUETA
```

**Paso 2: Esquema Relacional**
```sql
AUTORES(
    id_autor INT PK,
    nombre VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL
)

ARTICULOS(
    id_articulo INT PK,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT,
    fecha_publicacion DATE,
    id_autor_fk INT FK → AUTORES(id_autor)
)

ETIQUETAS(
    id_etiqueta INT PK,
    nombre_etiqueta VARCHAR(50) NOT NULL
)

ARTICULO_ETIQUETA(      -- Tabla intermedia
    id_articulo_fk INT FK → ARTICULOS(id_articulo),
    id_etiqueta_fk INT FK → ETIQUETAS(id_etiqueta),
    PRIMARY KEY (id_articulo_fk, id_etiqueta_fk)
)
```

**Paso 3: Restricciones**
```sql
-- Integridad de dominio
titulo NOT NULL
precio DECIMAL(10,2) CHECK (precio > 0)

-- Integridad de entidad
PRIMARY KEY en todas las tablas

-- Integridad referencial
ON DELETE RESTRICT en todas las FK
```

---

## 🧠 Conceptos Clave para Examen

1. **Modelo relacional** = datos en tablas
2. **Transformación** = E-R → esquema relacional
3. **Entidad → Tabla**, **Atributo → Columna**
4. **PK** = identificador único
5. **FK** = clave que apunta a otra tabla
6. **1:N**: PK del "1" como FK en "N"
7. **N:M**: tabla intermedia con dos FK
8. **Integridad de dominio** = tipo y rango válidos
9. **Integridad de entidad** = PK no nula
10. **Integridad referencial** = FK válida
11. **ON DELETE RESTRICT** = más seguro
12. **Tabla intermedia** = solución para N:M

---

## ✅ Resumen Visual

```
Transformación E-R → Relacional
├── Entidad → Tabla
├── Atributo → Columna
├── Identificador → PK
└── Relación → FK

Cardinalidades
├── 1:1  → FK única
├── 1:N  → FK en tabla N
└── N:M  → Tabla intermedia

Integridad
├── Dominio    → CHECK, NOT NULL, tipo
├── Entidad   → PK no nula
└── Referencial → FK → PK existente
```

---

## 💻 Tipos de Datos en SQL

| Tipo | Uso | Ejemplo |
|------|-----|---------|
| **INT/INTEGER** | Números enteros | edad, cantidad |
| **DECIMAL(p,s)** | Números exactos | precio (10,2) |
| **VARCHAR(n)** | Texto variable | nombre (100) |
| **TEXT** | Texto largo | contenido |
| **DATE** | Fecha | fecha_nacimiento |
| **DATETIME** | Fecha y hora | created_at |
| **BOOLEAN** | true/false | activo |

---

## ✅ Conclusión Fácil de Recordar

1. **Transformar** = seguir reglas fijas
2. **PK = identificación**, FK = conexión
3. **N:M siempre necesita** tabla intermedia
4. **Integridad = datos correctos**
5. **RESTRICT = más seguro** que CASCADE
6. **Documentar** el diseño final

---

> 📚 **Recursos**: "SQL and Relational Theory" - C.J. Date, "Database Systems" - Connolly y Begg