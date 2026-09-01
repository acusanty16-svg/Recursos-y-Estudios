# Tema 4: Normalización

## 📌 Resumen Rápido

La **normalización** es el proceso de organizar datos para minimizar la redundancia y evitar anomalías (inserción, borrado, modificación). Se alcanza mediante las **Formas Normales** (1FN → 2FN → 3FN → BCNF → 4FN → 5FN).

---

## 1. Introducción a la Normalización (Sesión 12)

### ¿Qué es la Normalización?

Proceso de organizar columnas y tablas para **minimizar la redundancia** y evitar anomalías.

### Las Tres Anomalías

| Anomalía | Descripción | Ejemplo |
|----------|-------------|---------|
| **Inserción** | No poder añadir dato porque falta otro | No registrar usuario sin tweet |
| **Borrado** | Perder datos al borrar otro | Borrar tweet y perder usuario |
| **Modificación** | Actualizar mismo dato en muchos lugares | Cambiar nombre en todos los tweets |

### Ejemplo: Twitter (caso real)

**Tabla problema**: `TWEETS(id_tweet, texto, id_usuario, nombre_usuario, avatar)`

**Anomalías**:
- Si cambias nombre_usuario, hay que actualizarlo en TODOS los tweets
- No puedo registrar usuario nuevo sin que escriba un tweet
- Si borro el único tweet, pierdo los datos del usuario

**Solución**: Separar en dos tablas

---

## 2. Primera y Segunda Formas Normales (Sesión 12)

### 1FN (Primera Forma Normal)

**Requisitos**:
1. Cada celda contiene un **valor único** (atómico)
2. No hay **grupos repetitivos**

**Ejemplos de violación**:
```sql
-- ❌ MALO (valor múltiples)
autores: "Juan, Pedro"
telefonos: "123456, 789012"

-- ✅ BUENO (valor atómico)
autor: "Juan"
telefono: "123456"
```

### 2FN (Segunda Forma Normal)

**Requisitos**:
1. Estar en **1FN**
2. **Clave primaria compuesta** (más de una columna)
3. Todos los atributos no clave dependen de la **clave completa**, no solo de una parte

> **Nota**: Si la PK es de una sola columna y está en 1FN, **ya está en 2FN**

### Ejemplo

**Tabla**: `PEDIDOS(id_pedido, id_producto, cantidad, nombre_producto, precio)`

**Problema**: `nombre_producto` y `precio` dependen solo de `id_producto`, no de la PK completa.

**Solución**:
```sql
PRODUCTOS(id_producto PK, nombre_producto, precio)
PEDIDOS(id_pedido PK, id_producto_fk, cantidad)
```

---

## 3. Tercera Forma Normal y Boyce-Codd (Sesión 13)

### 3FN (Tercera Forma Normal)

**Requisitos**:
1. Estar en **2FN**
2. **No tener dependencias transitivas**

### Dependencia Transitiva

Un atributo no clave depende de otro atributo no clave (en lugar de directamente de la PK).

```
PK → A → B (transitivo)
```

**Ejemplo**: `EMPLEADOS(id_empleado, id_departamento, nombre_departamento)`

- `nombre_departamento` depende de `id_departamento`
- `id_departamento` depende de `id_empleado`
- → Dependencia transitiva

**Solución**:
```sql
EMPLEADOS(id_empleado PK, id_departamento_fk)
DEPARTAMENTOS(id_departamento PK, nombre_departamento)
```

### Regla de Oro

> "Cada atributo no clave debe proporcionar información sobre la **clave**, **toda la clave** y **nada más que la clave**."

### BCNF (Forma Normal de Boyce-Codd)

Versión más estricta de 3FN. En la práctica, **3FN y BCNF son equivalentes** en >99% de los casos.

---

## 4. Formas Normales Superiores (Sesión 14)

### 4FN (Cuarta Forma Normal)

**Trata**: Dependencias multivaluadas

**Problema**: Dos hechos independientes almacenados en la misma tabla.

**Ejemplo**: `PROVEEDOR_ALMACEN(id_producto, id_proveedor, id_almacen)`

- Un producto tiene múltiples proveedores Y múltiples almacenes (independientes)
- → Crear redundancia

**Solución**:
```sql
PRODUCTO_PROVEEDOR(id_producto, id_proveedor)
PRODUCTO_ALMACEN(id_producto, id_almacen)
```

### 5FN (Quinta Forma Normal)

**Trata**: Dependencias de join
- Caso muy raros (<1% de aplicaciones)
- De interés principalmente académico

> **CONSEJO**: En la práctica, **3FN es suficiente**

---

## 5. Práctica: Normalización Completa (Sesión 15)

### Ejemplo: Factura de Tienda

**Tabla original NO normalizada**:
```
FACTURA(num_factura, fecha, id_cliente, nombre_cliente, dir_cliente, 
        id_prod1, nom_prod1, cant1, precio1, id_prod2, nom_prod2, cant2, precio2)
```

### Paso 1: Aplicar 1FN

**Problema**: Columnas repetidas (id_prod1, id_prod2...)

**Solución**: Crear tabla de líneas
```sql
FACTURAS(num_factura PK, fecha, id_cliente, nombre_cliente, dir_cliente)
LINEAS_FACTURA(num_factura PK, id_producto PK, cantidad)
```

### Paso 2: Aplicar 2FN

**Problema**: `nombre_producto` depende solo de `id_producto` (no de PK compuesta)

**Solución**:
```sql
PRODUCTOS(id_producto PK, nombre_producto, precio)
```

### Paso 3: Aplicar 3FN

**Problema**: `nombre_cliente` y `dir_cliente` dependen de `id_cliente`, no de `num_factura`

**Solución**:
```sql
CLIENTES(id_cliente PK, nombre_cliente, dir_cliente)
```

### Resultado Final (3FN)

```sql
CLIENTES(id_cliente PK, nombre, direccion)
FACTURAS(num_factura PK, fecha, id_cliente_fk)
PRODUCTOS(id_producto PK, nombre, precio)
LINEAS_FACTURA(num_factura_fk, id_producto_fk, cantidad)
```

---

## 🧠 Conceptos Clave para Examen

1. **Normalización** = eliminar redundancia
2. **1FN** = valores atómicos, sin grupos repetitivos
3. **2FN** = dependencias de la clave completa (si PK compuesta)
4. **3FN** = sin dependencias transitivas
5. **Anomalías** = inserción, borrado, modificación
6. **Dependencia transitiva** = A → B → C
7. **4FN** = зависиcias multivaluadas
8. **5FN** = dependencias de join (raro)
9. **3FN es suficiente** en la práctica
10. **Desnormalización controlada** puede mejorar rendimiento

---

## ✅ Resumen Visual

```
Formas Normales
├── 1FN
│   └── Valores atómicos, sin repeticiones
├── 2FN
│   └── Dependencias de clave completa
├── 3FN
│   └── Sin dependencias transitivas
├── BCNF
│   └── Versión estricta de 3FN
├── 4FN
│   └── Dependencias multivaluadas
└── 5FN
    └── Dependencias de join

Proceso
1FN → 2FN → 3FN → (4FN) → (5FN)
```

---

## ⚠️ Errores Comunes a Evitar

| Error | Solución |
|-------|----------|
| No eliminar grupos repetitivos | Atomizar valores |
| Dependencias parciales | Crear tabla separada |
| Dependencias transitivas | Descomponer tablas |
| Claves naturales mal elegidas | Usar surrogate keys |

---

## ✅ Conclusión Fácil de Recordar

1. **Normalizar** = proceso paso a paso
2. **1FN** = un valor por celda
3. **2FN** = toda columna depende de la clave completa
4. **3FN** = no hay-dependent indirectas
5. **Twitter/PayPal ejemplo** = por qué normalizamos
6. **Más JOINs** = precio por datos correctos

---

> 📚 **Recursos**: "Database Design for Mere Mortals" - Hernandez, "SQL and Relational Theory" - C.J. Date