# Tema 5: Lenguaje SQL - DDL y DML

## 📌 Resumen Rápido

**SQL (Structured Query Language)** es el lenguaje estándar para comunicarte con bases de datos relacionales. Se divide en:
- **DDL**: Estructura de la base de datos (CREATE, ALTER, DROP)
- **DML**: Manipulación de datos (INSERT, UPDATE, DELETE, SELECT)

---

## 1. Introducción a SQL (Sesión 16)

### ¿Qué es SQL?

Lenguaje **declarativo**: le dices al SGBD **qué datos quieres**, no cómo conseguirlos.

### Sublenguajes SQL

| Sublenguaje | Descripción | Comandos |
|-------------|------------|----------|
| **DDL** | Define la estructura | CREATE, ALTER, DROP |
| **DML** | Manipula los datos | INSERT, UPDATE, DELETE, SELECT |
| **DCL** | Control de permisos | GRANT, REVOKE |
| **TCL** | Transacciones | COMMIT, ROLLBACK |

### DDL vs DML

```
DDL (Definición)          → DML (Manipulación)
─────────────────        ─────────────────
CREATE TABLE            → INSERT (añadir)
ALTER TABLE            → UPDATE (cambiar)
DROP TABLE             → DELETE (borrar)
→ Estructura            → Datos
```

---

## 2. DDL: Creación de Bases de Datos y Tablas (Sesión 17)

### Comandos Básicos

```sql
-- Crear base de datos
CREATE DATABASE mi_empresa;

-- Usar base de datos
USE mi_empresa;

-- Crear tabla
CREATE TABLE clientes (
    id_cliente INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    fecha_registro DATE DEFAULT CURRENT_DATE,
    presupuesto DECIMAL(10,2) CHECK (presupuesto >= 0),
    activo BOOLEAN DEFAULT TRUE
);
```

### Tipos de Datos Principales

| Tipo | Uso | Ejemplo |
|------|-----|---------|
| **INT/INTEGER** | Números enteros | edad, cantidad |
| **DECIMAL(p,s)** | Números exactos | precio (10,2) |
| **FLOAT/REAL** | Números aproximados | temperatura |
| **VARCHAR(n)** | Texto variable | nombre (100) |
| **CHAR(n)** | Texto fijo | código postal (5) |
| **TEXT** | Texto largo | descripción |
| **DATE** | Fecha | fecha_nacimiento |
| **DATETIME** | Fecha y hora | created_at |
| **BOOLEAN** | TRUE/FALSE | activo |

### Restricciones (Constraints)

```sql
-- En tabla existente
ALTER TABLE clientes
ADD COLUMN telefono VARCHAR(20);

-- Eliminar tabla (CUIDADO: irreversible)
DROP TABLE clientes;
```

---

## 3. DML: Inserción, Modificación y Borrado (Sesión 18)

### INSERT - Añadir Datos

```sql
-- Insertar una fila
INSERT INTO clientes (id_cliente, nombre, email)
VALUES (1, 'Juan', 'juan@email.com');

-- Insertar múltiples filas
INSERT INTO productos (nombre, precio)
VALUES ('Teclado', 50), ('Ratón', 25), ('Pantalla', 150);
```

### UPDATE - Modificar Datos

```sql
-- Modificar datos (siempre con WHERE!)
UPDATE clientes
SET email = 'nuevo@email.com'
WHERE id_cliente = 1;

-- Si omites WHERE, cambia TODOS los registros
UPDATE clientes SET activo = FALSE;
```

### DELETE - Borrar Datos

```sql
-- Borrar filas específicas
DELETE FROM clientes
WHERE id_cliente = 1;

-- OJO: Sin WHERE, borra TODOS los datos
DELETE FROM clientes;
```

> ⚠️ **IMPORTANTE**: Sempre usa WHERE en UPDATE y DELETE

---

## 4. Consultas Simples con SELECT (Sesión 19)

### Estructura Básica

```sql
SELECT columna1, columna2
FROM nombre_tabla
WHERE condicion
ORDER BY columna1 ASC/DESC;
```

### Operadores de Comparación

| Operador | Descripción |
|----------|-------------|
| `=` | Igual |
| `!=` o `<>` | Distinto |
| `<` | Menor que |
| `>` | Mayor que |
| `<=` | Menor o igual |
| `>=` | Mayor o igual |

### Operadores Lógicos

```sql
-- AND: las dos condiciones true
SELECT * FROM productos WHERE precio > 50 AND stock > 0;

-- OR: alguna condición true
SELECT * FROM productos WHERE categoria = 'Ratón' OR categoria = 'Teclado';

-- NOT: niega condición
SELECT * FROM productos WHERE NOT activo;
```

### LIKE - Búsqueda de Patrones

```sql
-- % = cero o más caracteres
SELECT * FROM productos WHERE nombre LIKE 'Port%';       -- Empieza por Port
SELECT * FROM productos WHERE nombre LIKE '%Pro%';     -- Contiene Pro
SELECT * FROM productos WHERE nombre LIKE '%2019';  -- Termina en 2019

-- _ = un solo carácter
SELECT * FROM productos WHERE codigo LIKE 'A___';  -- 4 caracteres, empieza en A
```

### BETWEEN e IN

```sql
-- Entre valores (rango)
SELECT * FROM productos WHERE precio BETWEEN 100 AND 500;

-- En lista de valores
SELECT * FROM clientes WHERE pais IN ('España', 'Francia', 'Italia');
```

### ORDER BY - Ordenación

```sql
-- Ascendente (por defecto)
SELECT * FROM productos ORDER BY precio;

-- Descendente
SELECT * FROM productos ORDER BY precio DESC;

-- Múltiples columnas
SELECT * FROM productos ORDER BY categoria, precio DESC;
```

---

## 5. Funciones de Agregación (Sesión 20)

### Funciones Principales

| Función | Descripción |
|---------|-------------|
| **COUNT()** | Cuenta filas |
| **SUM()** | Suma valores |
| **AVG()** | Calcula media |
| **MAX()** | Valor máximo |
| **MIN()** | Valor mínimo |

### GROUP BY - Agrupación

```sql
-- Contar pedidos por cliente
SELECT id_cliente, COUNT(*) AS num_pedidos
FROM pedidos
GROUP BY id_cliente;

-- Importe total por cliente
SELECT id_cliente, SUM(importe) AS total_gastado
FROM pedidos
GROUP BY id_cliente;
```

### HAVING - Filtrar Grupos

```sql
-- Clientes que han gastado más de 1000€
SELECT id_cliente, SUM(importe) AS total
FROM pedidos
GROUP BY id_cliente
HAVING SUM(importe) > 1000;
```

### WHERE vs HAVING

| WHERE | HAVING |
|--------|-------|
| Filtra **filas** antes de agrupar | Filtra **grupos** después de agrupar |
| No puede usar funciones de agregación | Puede usar funciones de agregación |

### Alias con AS

```sql
SELECT nombre AS 'Nombre del Cliente', 
       COUNT(*) AS 'Total Pedidos'
FROM clientes
GROUP BY nombre;
```

---

## 6. JOINs y Subconsultas (Sesión 21)

### INNER JOIN

```sql
-- Combinar clientes con sus pedidos
SELECT c.nombre, p.fecha, p.importe
FROM clientes c
INNER JOIN pedidos p ON c.id_cliente = p.id_cliente;
```

### LEFT JOIN

```sql
-- Todos los clientes, aunque no tengan pedidos
SELECT c.nombre, p.fecha
FROM clientes c
LEFT JOIN pedidos p ON c.id_cliente = p.id_cliente;
```

### Tipos de JOIN

| JOIN | Descripción |
|------|-------------|
| **INNER** | Solo los que tienen correspondencia |
| **LEFT** | Todos de la izquierda + correspondencia |
| **RIGHT** | Todos de la derecha + correspondencia |
| **FULL** | Todos de ambas tablas |

### Subconsultas

```sql
-- Clientes con pedidos (con subconsulta)
SELECT nombre
FROM clientes
WHERE id_cliente IN (SELECT id_cliente FROM pedidos);

-- Productos más caros que la media
SELECT nombre, precio
FROM productos
WHERE precio > (SELECT AVG(precio) FROM productos);
```

---

## 7. Optimización de Consultas (Sesión 22)

### Índices

```sql
-- Crear índice
CREATE INDEX idx_productos_categoria ON productos(categoria);

-- Índice compuesto
CREATE INDEX idx_pedidos_fecha ON pedidos(fecha);

-- Ver índice
SHOW INDEX FROM productos;
```

### EXPLAIN - Analizar Consulta

```sql
EXPLAIN SELECT * FROM productos WHERE categoria = 'Teclado';
```

### Buenas Prácticas

| Práctica | Descripción |
|---------|-------------|
| **SELECT *** | ❌ Especifica columnas |
| **WHERE** | Usa índices en columnas filtradas |
| **JOIN** | vs Preferible subconsultas cuando hay muchos datos |
| **LIMIT** | Usa para paginaci��n |

### Mejora de Rendimiento

```
Sin índice        → Full Table Scan (lento)
Con índice       → Index Scan (rápido)

CREATE INDEX idx_columna ON tabla(columna);
```

---

## 🧠 Conceptos Clave para Examen

1. **SQL** = lenguaje declarativo para BD relacionales
2. **DDL** = estructura (CREATE, ALTER, DROP)
3. **DML** = datos (INSERT, UPDATE, DELETE, SELECT)
4. **SELECT** = consultar datos
5. **WHERE** = filtrar filas
6. **GROUP BY** = agrupar
7. **HAVING** = filtrar grupos
8. **JOIN** = combinar tablas
9. **Índice** = acelera búsquedas
10. **EXPLAIN** = ver plan de ejecución

---

## ✅ Resumen Visual

```
Comandos SQL
├── DDL
│   ├── CREATE DATABASE/TABLE
│   ├── ALTER TABLE
│   └── DROP TABLE
└── DML
    ├── INSERT INTO
    ├── UPDATE
    ├── DELETE FROM
    └── SELECT

 SELECT
 ├── WHERE (filas)
 ├── GROUP BY (grupos)
 ├── HAVING (grupos filtrados)
 ├── ORDER BY (orden)
 └── JOIN (combinar tablas)

 Índices
 ├── PRIMARY KEY (automático)
 ├── INDEX (manual)
 └── CREATE INDEX
```

---

## ⚠️ Errores Comunes

| Error | Solución |
|-------|----------|
| UPDATE sin WHERE | Sempre usa WHERE |
| DELETE sin WHERE | CUIDADO: borra todo |
| SELECT * | Especifica columnas |
| Clave foránea sin índice | Crea índice manually |

---

## ✅ Conclusión Fácil de Recordar

1. **SQL** = lenguaje estándar universally
2. **SELECT** = más importante y used
3. **WHERE** = filtrar, **ORDER BY** = ordenar
4. **JOIN** = combinar tablas normalizadas
5. **INDEX** = accelerate búsquedas
6. **EXPLAIN** = ver plan de ejecución

---

> 📚 **Recursos**: "Learning SQL" - Alan Beaulieu, "SQL in a Nutshell"