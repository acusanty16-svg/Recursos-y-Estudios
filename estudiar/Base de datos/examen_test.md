# Examen de Base de Datos - Tipo Test

---

## 📝 Instrucciones

- Lee cada pregunta cuidadosamente
- Marca la opción correcta (A, B, C o D)
- Algunas preguntas pueden tener múltiples respuestas correctas
- Tiempo estimado: 45-60 minutos

---

## 🔷 Tema 1: Fundamentos de Base de Datos

### Pregunta 1.1
¿Qué es un dato?

A) Un conjunto de datos procesados con significado
B) Un hecho en bruto sin contexto
C) Un sistema de información
D) Una base de datos

### Pregunta 1.2
Un Sistema de Gestión de Base de Datos (SGBD) es:

A) Un tipo de dato
B) Software intermediario entre usuario y base de datos
C) Un lenguaje de programación
D) Un hardware

### Pregunta 1.3
Según la arquitectura ANSI/SPARC, ¿cuántos niveles tiene un SGBD?

A) 1
B) 2
C) 3
D) 4

### Pregunta 1.4
El nivel conceptual de la arquitectura ANSI/SPARC representa:

A) Cómo se almacenan los datos físicamente
B) La estructura lógica global de la base de datos
C) Las vistas personalizadas de cada usuario
D) Los índices de la base de datos

### Pregunta 1.5
¿Qué tipo de base de datos es MySQL?

A) NoSQL documental
B) Relacional (SQL)
C) De grafo
D) Orientada a objetos

### Pregunta 1.6
¿Cuál es una ventaja del modelo relacional?

A) Permite almacenar datos sin estructura
B) Garantiza integridad y consistencia
C) Elimina la necesidad de claves
D) No requiere normalización

### Pregunta 1.7
¿Cuál NO es un componente del modelo ACID?

A) Atomicidad
B) Consistencia
C) Isolation
D) Archivo

### Pregunta 1.8
MongoDB es un ejemplo de base de datos:

A) Relacional
B) NoSQL de documentos
C) Jerárquica
D) En red

---

## 🔷 Tema 2: Modelo Entidad-Relación

### Pregunta 2.1
En el modelo E-R, una ENTIDAD representa:

A) Una relación entre objetos
B) Un objeto del mundo real sobre el que se guarda información
C) Un atributo
D) Una clave primaria

### Pregunta 2.2
Un ATRIBUTO es:

A) Una conexión entre entidades
B) Una característica o propiedad de una entidad
C) Un tipo de dato
D) Una clave foránea

### Pregunta 2.3
En UML, una clase se representa como:

A) Círculo
B) Triángulo
C) Rectángulo
D) Rombo

### Pregunta 2.4
Una relación de cardinalidad 1:N significa:

A) Una entidad se relaciona con una de otra
B) Una entidad se relaciona con muchas de otra
C) Ninguna relación
D) Relación obligatoria

### Pregunta 2.5
La notación de "pata de gallo" representa:

A) Relaciones-optional
B) Cardinalidad "muchos"
C) Entidades débiles
D) Herencia

### Pregunta 2.6
En una relación N:M entre Alumno y Asignatura:

A) Un alumno puede cursar muchas asignaturas
B) Una asignatura puede tener muchos alumnos
C) Ambas cosas son ciertas
D) No hay relación

### Pregunta 2.7
La especialización en E-R significa:

A) Agrupar entidades en una general
B) Dividir una entidad en subclases específicas
C) Crear una relación nueva
D) Eliminar una entidad

### Pregunta 2.8
Cuando un atributo puede tener varios valores, se dice que es:

A) Simple
B) Compuesto
C) Multivalorado
D) Derivado

---

## 🔷 Tema 3: Diseño Lógico Relacional

### Pregunta 3.1
Una ENTIDAD en E-R se transforma en una:

A) Vista
B) Columna
C) Tabla
D) Base de datos

### Pregunta 3.2
El IDENTIFICADOR de una entidad se convierte en:

A) Clave foránea
B) Clave primaria
C) Índice
D) Restricción

### Pregunta 3.3
Para una relación 1:N, la clave foránea se añade en:

A) La tabla del lado "1"
B) La tabla del lado "N"
C) Una nueva tabla
D) No se añade

### Pregunta 3.4
Una relación N:M se implementa mediante:

A) Una clave foránea simple
B) Una tabla intermedia con dos claves foráneas
C) No se puede implementar
D) Un trigger

### Pregunta 3.5
La integridad de ENTIDAD requiere que:

A) La clave foránea no pueda ser nula
B) La clave primaria no pueda ser nula
C) Los datos tengan formato correcto
D) Existan referencias

### Pregunta 3.6
Si borramos un registro padre y queremos borrar en cascada los hijos, usamos:

A) ON DELETE RESTRICT
B) ON DELETE CASCADE
C) ON DELETE SET NULL
D) ON DELETE NOTHING

### Pregunta 3.7
Un valor NULL representa:

A) Un cero
B) Un texto vacío
C) Un valor desconocido o ausente
D) Un error

### Pregunta 3.8
El comando para modificar una tabla es:

A) MODIFY TABLE
B) UPDATE TABLE
C) ALTER TABLE
D) CHANGE TABLE

---

## 🔷 Tema 4: Normalización

### Pregunta 4.1
La normalización tiene como objetivo principal:

A) Aumentar la redundancia
B) Minimizar la redundancia
C) Crear más tablas
D) Eliminar claves

### Pregunta 4.2
La 1FN (Primera Forma Normal) requiere:

A)Eliminar claves primarias
B) El dominio de cada columna sea atómico
C)No haber relaciones
D)Tener índices

### Pregunta 4.3
Una anomalía de BORRADO significa:

A)No poder insertar datos por depender de otros
B)Perder datos no deseados al borrar
C)Duplicar datos al actualizar
D)No poder modificar datos

### Pregunta 4.4
La 2FN aplica cuando:

A)La tabla tiene solo una columna
B)La tabla está en 1FN y tiene clave compuesta
C)No hay clave primaria
D)Hay redundancia

### Pregunta 4.5
Una dependencia TRANSITIVA ocurre cuando:

A)Un atributo no clave depende de la clave primaria
B)Un atributo no clave depende de otro atributo no clave
C)Dos claves dependen entre sí
D)No hay dependencias

### Pregunta 4.6
Para estar en 3FN, una tabla debe estar en:

A) 1FN
B) 2FN
C) 1FN y 2FN
D) Solo 1FN es suficiente

### Pregunta 4.7
El principio "cada atributo no clave debe depender de la clave, toda la clave y nada más que la clave" corresponde a:

A) 1FN
B) 2FN
C) 3FN
D) Forma Normal de Boyce-Codd

### Pregunta 4.8
La 4FN trata las dependencias:

A) Funcionales
B) Transitivas
C) Multivaluadas
D) De join

---

## 🔷 Tema 5: SQL (DDL y DML)

### Pregunta 5.1
¿Qué comando SQL se usa para crear una tabla?

A) CREATE TABLE
B) MAKE TABLE
C) NEW TABLE
D) ADD TABLE

### Pregunta 5.2
Para añadir datos a una tabla usamos:

A) INSERT
B) UPDATE
C) ADD
D) SET

### Pregunta 5.3
Para modificar datos usamos:

A) INSERT
B) UPDATE
C) MODIFY
D) CHANGE

### Pregunta 5.4
En SQL, ¿qué comando filtra resultados?

A) FILTER
B) WHERE
C) HAVING
D) Both B and C

### Pregunta 5.5
Para contar filas usamos la función:

A) SUM()
B) COUNT()
C) AVG()
D) MAX()

### Pregunta 5.6
Para combinar datos de dos tablas usamos:

A) UNION
B) JOIN
C) MERGE
D) COMBINE

### Pregunta 5.7
Un INNER JOIN devuelve:

A) Todas las filas de ambas tablas
B) Solo las que tienen coincidencia en ambas tablas
C) Solo las de la tabla izquierda
D) Solo las de la tabla derecha

### Pregunta 5.8
Para seleccionar columnas específicas usamos:

A) ALL
B) SOME
C) SELECT columnas
D) GET columnas

### Pregunta 5.9
El comodín % en LIKE representa:

A) Un solo carácter
B) Cero o más caracteres
C) Ningún carácter
D) Una letra

### Pregunta 5.10
GROUP BY se usa con:

A) Funciones de agregación
B) WHERE
C) INSERT
D) DELETE

---

## 🔷 Tema 6: Administración

### Pregunta 6.1
Para dar permisos a un usuario usamos:

A) GIVE
B) GRANT
C) ALLOW
D) PERMIT

### Pregunta 6.2
Un ROL es:

A) Un usuario
B) Un conjunto de privilegios
C) Una tabla
D) Un índice

### Pregunta 6.3
Para confirmar una transacción usamos:

A) SAVE
B) KEEP
C) COMMIT
D) END

### Pregunta 6.4
Si queremos deshacer una transacción usamos:

A) UNDO
B) ROLLBACK
C) CANCEL
D) BACK

### Pregunta 6.5
Un backup DIFERENCIAL copia:

A) Toda la base de datos
B) Solo los cambios desde el último backup completo
C) Solo los cambios desde el último backup de cualquier tipo
D) Los datos borrados

### Pregunta 6.6
RPO (Recovery Point Objective) mide:

A) Cuánto tiempo tardo en recuperar
B) Cuánta pérdida de datos puedo tolerar
C) Cuántos backups hacer
D) Cuántos errores puedo tener

### Pregunta 6.7
La encriptación en REPOSO protege los datos:

A) Durante la transmisión
B) Almacenados en disco
C) En memoria
D) En la red

### Pregunta 6.8
El principio de MÍNIMO PRIVILEGIO significa:

A) Dar todos los permisos al administrador
B) Dar solo los permisos necesarios
C) No dar permisos a nadie
D) Eliminar todos los permisos

---

## 🎯 Fin del Examen

**Total de preguntas: 64**

**Tiempo estimado: 45-60 minutos**

---

## 📋 Hoja de Respuestas

| Pregunta | A | B | C | D |
|---------|---|---|---|---|
| 1.1 |   |   |   |   |
| 1.2 |   |   |   |   |
| ... |   |   |   |   |

---

### Distribución por tema:

- Tema 1: Preguntas 1.1 - 1.8
- Tema 2: Preguntas 2.1 - 2.8
- Tema 3: Preguntas 3.1 - 3.8
- Tema 4: Preguntas 4.1 - 4.8
- Tema 5: Preguntas 5.1 - 5.10
- Tema 6: Preguntas 6.1 - 6.8

---

## 🧾 Explicaciones (preguntas solicitadas)

### Pregunta 1.7 — ¿Cuál NO es un componente del modelo ACID?

- Respuesta correcta: D) Archivo

Explicación breve:
- ACID es un acrónimo que representa cuatro propiedades que garantizan el comportamiento fiable de las transacciones en bases de datos:
  - Atomicidad: una transacción se ejecuta por completo o no se ejecuta (todo o nada). Si algo falla, se hace rollback y no quedan efectos parciales.
  - Consistencia: las transacciones llevan a la base de datos de un estado válido a otro estado válido; se mantienen las restricciones e integridad de los datos.
  - Isolation (Aislamiento): las transacciones concurrentes no deben interferir entre sí; el resultado debe ser igual al de ejecutar las transacciones en algún orden serial.
  - Durability (Durabilidad): una vez que una transacción se confirma (COMMIT), sus efectos persisten incluso ante fallos del sistema.

"Archivo" no forma parte de ACID — es una palabra fuera de este conjunto y por eso es la opción incorrecta.

Ejemplo práctico (transferencia bancaria simplificada):
BEGIN TRANSACTION;
  UPDATE cuentas SET saldo = saldo - 100 WHERE id = 1; -- quitar del emisor
  UPDATE cuentas SET saldo = saldo + 100 WHERE id = 2; -- sumar al receptor
  -- si todo OK
COMMIT;
-- si hay error en alguno de los pasos: ROLLBACK;

Notas sobre confusiones comunes:
- "Consistencia" en ACID no significa "consistencia eventual" (término de sistemas distribuidos), sino el mantenimiento de reglas e integridad al terminar la transacción.
- "Isolation" frecuentemente se confunde con "consistencia"; piensa en "isolation" como control de efectos observables entre transacciones concurrentes (niveles de aislamiento: READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE).

Si quieres, puedo añadir más explicaciones (por ejemplo, ejemplos de niveles de aislamiento con anomalías: dirty read, non-repeatable read, phantom read) aquí en el archivo.

### Pregunta 1.8 — MongoDB

- Respuesta correcta: B) NoSQL de documentos

Explicación breve:
- MongoDB es una base de datos NoSQL orientada a documentos. Almacena datos en documentos BSON (similar a JSON) dentro de colecciones. Cada documento puede tener una estructura distinta (esquema flexible), lo que facilita almacenar datos semiestructurados o en evolución.

Características clave:
- Documentos y colecciones: en lugar de tablas y filas, tienes colecciones que contienen documentos (objetos con pares clave-valor, arrays y documentos anidados).
- Esquema flexible: no es necesario definir columnas fijas; los documentos pueden variar entre sí.
- Consultas y operadores: se usan métodos como find(), aggregate() y operadores tipo $gt, $in, $push, etc.
- Indexación y rendimiento: permite índices sobre campos, índices compuestos, índices en arrays y texto.
- Escalabilidad horizontal: soporta sharding (particionado) y replica sets para alta disponibilidad.

Ejemplo sencillo (MongoDB shell):
```
db.usuarios.insertOne({ nombre: "Ana", edad: 30, direccion: { ciudad: "Madrid", cp: 28001 }, habilidades: ["SQL","MongoDB"] })
db.usuarios.find({ edad: { $gt: 25 } })
```

Por qué las otras opciones son incorrectas:
- A) Relacional: MySQL, PostgreSQL son ejemplos de bases de datos relacionales; MongoDB no sigue el modelo relacional clásico.
- C) Jerárquica: modelo en árbol (ej.: IMS), no es el modelo principal de MongoDB.
- D) En red: modelo de red (conjunto/punteros entre registros) — tampoco es el caso de MongoDB.

Si quieres, puedo mostrar ejemplos comparativos (cómo modelar una relación N:M en SQL vs MongoDB) o preguntarte de nuevo la misma pregunta para comprobar que ha quedado clara.

### Pregunta 4.6 — ¿Qué se requiere para estar en 3FN?

- Respuesta correcta: C) 1FN y 2FN

Explicación clara:
- La Tercera Forma Normal (3FN) exige que una tabla esté correctamente normalizada hasta 2FN y además que no existan dependencias transitivas entre atributos no clave. En términos prácticos:
  - Primero debes estar en 1FN: celdas atómicas (sin listas) y formato tabular.
  - Luego en 2FN: si existe una clave primaria compuesta, ningún atributo no clave puede depender solo de una parte de esa clave (no hay dependencias parciales).
  - Finalmente 3FN: ningún atributo no clave debe depender de otro atributo no clave (es decir, eliminar las dependencias transitivas).

Por qué la respuesta B sola no es suficiente (matiz importante):
- En teoría estricta 2FN ya requiere haber pasado por 1FN (porque las formas normales son acumulativas), por eso algunos autores dicen "para estar en 3FN basta con estar en 2FN y además eliminar dependencias transitivas". Sin embargo la opción C es la más completa y explícita: 3FN requiere que la tabla cumpla 1FN y 2FN y además la condición adicional de 3FN.

Ejemplo práctico (dependencia transitiva):
- Tabla inicial: Empleado(emp_id PK, emp_nombre, dept_id, dept_nombre)
  - Aquí emp_id → dept_id (FK) y dept_id → dept_nombre. Por transitividad emp_id → dept_nombre. dept_nombre depende de un atributo no clave (dept_id), por lo que NO está en 3FN.

Solución (normalizar a 3FN):
- Separar en dos tablas:
  - Departamento(dept_id PK, dept_nombre)
  - Empleado(emp_id PK, emp_nombre, dept_id FK → Departamento.dept_id)

SQL ejemplo:
```
CREATE TABLE Departamento (dept_id INT PRIMARY KEY, dept_nombre VARCHAR(100));
CREATE TABLE Empleado (emp_id INT PRIMARY KEY, emp_nombre VARCHAR(100), dept_id INT,
  FOREIGN KEY (dept_id) REFERENCES Departamento(dept_id)
);
```

Si quieres, puedo añadir este ejemplo (con el antes/después) al archivo como un mini-diagrama o dejarlo como texto. ¿Lo añado y avanzamos a la siguiente pregunta (4.7) cuando digas "listo"? Si algo no queda claro, dime qué parte y lo explico con más ejemplos.
### Pregunta 4.1 — ¿Qué es la normalización?

- Respuesta correcta: B) Minimizar la redundancia

Explicación clara y práctica:
- Objetivo principal: La normalización es el proceso de organizar los datos en una base de datos relacional para reducir la redundancia (datos duplicados) y evitar las anomalías de inserción, actualización y borrado.

Por qué importa (problemas que evita):
- Anomalía de actualización: si un mismo dato aparece repetido en varias filas, tienes que actualizarlo en todas; si olvidas alguna, hay inconsistencias.
- Anomalía de inserción: no puedes insertar cierta información sin proporcionar otros datos innecesarios.
- Anomalía de borrado: al borrar una fila puede perderse información que debería conservarse.

Formas normales (resumen práctico):
- 1FN (Primera Forma Normal): cada celda debe contener un único valor atómico (no listas ni conjuntos). Ej.: evitar una columna "telefonos" con varios números separados; en su lugar, separar en filas o tabla relacionada.
- 2FN (Segunda Forma Normal): estar en 1FN y eliminar dependencias parciales; es decir, que ningún atributo no clave dependa solo de parte de una clave primaria compuesta. Si tienes clave compuesta (A,B) y un atributo depende solo de A, muévelo a otra tabla.
- 3FN (Tercera Forma Normal): estar en 2FN y eliminar dependencias transitivas; ningún atributo no clave debe depender de otro atributo no clave. Si X depende de Y y Y de la PK, mover Y a otra tabla.
- BCNF (Boyce-Codd): variante más estricta de 3FN para ciertos casos de dependencias funcionales.

Ejemplo práctico (denormalizado → normalizado):
- Tabla denormalizada: VentasRaw( id_venta, fecha, cliente_nombre, cliente_dni, producto_nombre, producto_precio, tienda_nombre, cantidad )
  - Problemas: si el producto cambia de precio hay que actualizar muchas filas; si borramos la única venta de una tienda perdemos el nombre de la tienda.

- Normalizado (esquema simplificado):
  - clientes(id_cliente PK, nombre, dni)
  - productos(id_producto PK, nombre, precio)
  - tienda(id_tienda PK, nombre)
  - ventas(id_ventas PK, id_cliente FK, id_tienda FK, fecha, total)
  - detalle_venta(id_detalle PK, id_venta FK, id_producto FK, cantidad, precio_unitario)

SQL (ejemplo de creación - solo estructura y claves):
```
CREATE TABLE clientes (id_cliente INT PRIMARY KEY, nombre VARCHAR(100), dni VARCHAR(20));
CREATE TABLE productos (id_producto INT PRIMARY KEY, nombre VARCHAR(100), precio DECIMAL(10,2));
CREATE TABLE tienda (id_tienda INT PRIMARY KEY, nombre VARCHAR(100));
CREATE TABLE ventas (id_ventas INT PRIMARY KEY, id_cliente INT, id_tienda INT, fecha DATETIME, total DECIMAL(10,2),
  FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
  FOREIGN KEY (id_tienda) REFERENCES tienda(id_tienda)
);
CREATE TABLE detalle_venta (id_detalle INT PRIMARY KEY, id_venta INT, id_producto INT, cantidad INT, precio_unitario DECIMAL(10,2),
  FOREIGN KEY (id_venta) REFERENCES ventas(id_ventas),
  FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);
```

Consejos prácticos para normalizar un diseño:
- Empieza detectando repeticiones de grupos de datos (listas en una columna, valores repetidos fila tras fila).
- Identifica claves naturales o compuestas y revisa si hay atributos que dependen sólo de parte de la clave.
- Separa entidades (cosas que tienen identidad propia) en tablas independientes y usa FKs para relacionarlas.
- No sobrenormalices: en casos de rendimiento controlado puede ser lógico desnormalizar algunas partes, pero con intención y documentando la decisión.

Si quieres, añado al archivo un ejemplo adicional aplicado a tu esquema techmanage.sql (por ejemplo: por qué ventas + detalle_venta están separados y qué anomalías evitaría si se hubieran dejado en una sola tabla). ¿Lo quieres? Si no, dime si continuamos con la pregunta 4.2.

### Pregunta 3.1 — ¿Una ENTIDAD en E-R se transforma en una...?

- Respuesta correcta: C) Tabla

Explicación breve:
- En el paso de diseño lógico relacional, cada ENTIDAD del modelo Entidad-Relación (E-R) se convierte en una TABLA en el modelo relacional. Los atributos de la entidad pasan a ser columnas de la tabla y el identificador de la entidad se convierte en la clave primaria.

Ejemplo práctico:
- Entidad E-R: Alumno { id, nombre, fecha_nac }
- SQL resultante:
  CREATE TABLE Alumno (
    id INT PRIMARY KEY,
    nombre VARCHAR(100),
    fecha_nac DATE
  );

Notas rápidas:
- No confundir "columna" con "tabla": una entidad no se transforma en una sola columna; sus atributos son las columnas.
- Una "vista" puede basarse en tablas, pero no es la transformación directa de una entidad, sino una representación externa/derivada.

Si quieres, puedo añadir ejemplos de cómo transformar relaciones 1:N (clave foránea) y N:M (tabla intermedia). Dime si lo quieres detallado o si ya lo tienes claro y pasamos a la siguiente pregunta.

### Pregunta 5.5 — ¿Para contar filas usamos...?

- Respuesta correcta: B) COUNT()

Diferencia clave entre funciones de agregación:
- COUNT() → cuenta filas. COUNT(*) cuenta todas las filas existentes; COUNT(columna) cuenta filas donde columna no es NULL.
- SUM() → suma los valores numéricos de una columna (ej.: SUM(cantidad) = suma total de unidades vendidas).
- AVG() → calcula la media de los valores numéricos de una columna (ej.: AVG(precio) = precio medio).
- MAX() → devuelve el valor máximo de una columna (ej.: MAX(fecha) = fecha más reciente).

Ejemplo SQL:
```sql
SELECT COUNT(*) AS total_pedidos FROM ventas;
SELECT SUM(cantidad) AS total_unidades FROM detalle_venta;
SELECT AVG(precio_venta) AS precio_medio FROM productos;
SELECT MAX(fecha_venta) AS ultima_venta FROM ventas;
```

Respuesta incorrecta (A): SUM() suma valores numéricos, no cuenta filas.

---

## 📊 1er Intento

| Tema | Preguntas | Acertadas | Falladas | Explicaciones añadidas |
|------|-----------|-----------|---------|----------------------|
| 1 — Fundamentos | 1.1–1.8 | 7 | 1 | 1.7 (ACID), 1.8 (MongoDB) |
| 2 — Modelo E-R | 2.1–2.8 | 8 | 0 | — |
| 3 — Diseño Lógico | 3.1–3.8 | 7 | 1 | 3.1 (ENTIDAD→Tabla) |
| 4 — Normalización | 4.1–4.8 | 7 | 1 | 4.1 (normalización), 4.6 (3FN) |
| 5 — SQL (DDL/DML) | 5.1–5.10 | 9 | 1 | 5.5 (COUNT vs SUM) |
| 6 — Administración | 6.1–6.8 | 8 | 0 | — |

**Total: 56/64 correctas (87,5%) — 8 preguntas con explicación guardada para repasar.**
