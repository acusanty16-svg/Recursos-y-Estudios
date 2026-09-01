# Temas a Estudiar - Base de Datos

## Resultado del examen: 26/30 (87%)

---

## Temas con Fallos (Repasar)

### 1. Formas Normales (BCNF)
- **Concepto**: BCNF (Forma Normal de Boyce-Codd) exige que cada determinante sea una clave candidata
- **Diferencia con 3FN**: BCNF es más restrictiva, elimina anomalías que pueden persistir en 3FN
- **No es**: "Que no existan atributos multivaluados"

### 2. Transformación E-R a Modelo Relacional
- **Regla**: Cada entidad se convierte en una tabla
- **Atributos** → Columnas de la tabla
- **Clave identificadora** → Clave primaria de la tabla
- **Relaciones** → Claves foráneas
- **No es**: "En una columna de una tabla más grande"

### 3. Integridad Referencial
- **Definición**: Garantiza que cada valor de clave foránea exista como clave primaria en la tabla relacionada
- **Evita**: Referencias a registros inexistentes (datos huérfanos)
- **No es**: "Que no existan valores duplicados en ninguna columna"

### 4. Clave Foránea en Relaciones 1:N
- **Regla**: La clave foránea se coloca en el lado N (muchos)
- **Ejemplo**: Cliente (1) → Pedido (N) → FK en Pedido
- **No es**: "En la tabla Cliente"

---

## Temas dominados (Revisar de todas formas)

- **Claves**: PRIMARY KEY vs UNIQUE (PK no permite NULL, solo una por tabla; UNIQUE permite varios y NULLs)
- **LIKE**: comodines % y _ ('M%' = comienza con M, '%M' = termina con M, '%M%' = contiene M)
- **JOINs**: INNER JOIN (solo coincidencias), LEFT JOIN (todos de izquierda)
- **1FN**: Atributos atómicos, sin grupos repetitivos
- **DDL vs DML**: DDL (CREATE, ALTER, DROP) → estructura; DML (SELECT, INSERT, UPDATE, DELETE) → datos
- **GRANT/REVOKE**: Conceder y revocar permisos
- **DELETE vs DROP**: DELETE elimina datos, estructura queda; DROP elimina todo
- **BETWEEN**: Rango inclusivo (equivale a >= AND <=)
- **Relaciones**: 1:N (FK en lado N), N:M (tabla intermedia)
- **Transformación E-R**: Entidad → Tabla, Atributo → Columna

---

## Comandos SQL esenciales

- SELECT, INSERT, UPDATE, DELETE
- CREATE TABLE, ALTER TABLE, DROP TABLE
- GRANT, REVOKE
- JOIN (INNER, LEFT, RIGHT)
- WHERE con LIKE, BETWEEN, IN

---

## Notas del Examen

- Tuviste 4 fallos: BCNF, transformación E-R, integridad referencial, clave foránea en 1:N
- Puntuación: 87% (bien!)
- Falta reforzar: normalización avanzada y modelado E-R