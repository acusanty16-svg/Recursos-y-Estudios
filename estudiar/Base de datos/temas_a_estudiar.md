# Temas a Estudiar - Acceso a Datos

## Resultados de los exámenes
- Examen 1: 15/30 (50%)
- Examen 2: 23/30 (77%)

---

## Temas con Fallos (Repasar)

### 1. Patrones de Diseño - DAO vs MVC
- **DAO** (Data Access Object): Patrón que encapsula el acceso a datos
- **MVC**: Patrón de arquitectura (no de acceso a datos)
- **Diferencia**: DAO define la estrategia para acceder y manipular datos

### 2. Jackson ObjectMapper
- **Serialización** (Java → JSON): `writeValueAsString()`
- **Deserialización** (JSON → Java): `readValue()`
- **Clase principal**: `ObjectMapper` (no JSONObject)
- **Errores comunes**: `toJson()` es de Gson, no de Jackson

### 3. BufferedWriter
- **Método para salto de línea**: `newLine()`
- **No es**: `writeNewLine()`
- **Garantiza**: Compatibilidad entre sistemas operativos

### 4. JDBC - ResultSet
- **Navegación**: `next()` avanza a la siguiente fila
- **No es**: `move()`
- **Debe llamarse**: Antes de acceder a datos de cada fila

### 5. Clases de lectura/escritura
- **Lectura eficiente**: `BufferedReader` (no FileReader)
- **Escritura eficiente**: `BufferedWriter` (no FileWriter)
- **Diferencia**: Buffer interno que mejora rendimiento

### 6. JDBC - PreparedStatement
- **Protección**: Contra inyección SQL
- **Parámetros**: Se indican con `?` y se establecen con `setString()`, `setInt()`, etc.
- **No es**: Statement (no tiene parámetros)

### 7. CRUD
- **Create**: Insertar
- **Read**: Leer (recuperar datos)
- **Update**: Modificar
- **Delete**: Eliminar

### 8. Hibernate
- **Método para persistir**: `save()` o `persist()`
- **No es**: `add()`, `insert()`

### 9. executeUpdate()
- **Retorna**: Número de filas afectadas (int)
- **Para**: INSERT, UPDATE, DELETE

---

## Temas dominados

- **BufferedReader**: readLine() para leer línea completa
- **Cierre de recursos**: try-with-resources
- **trim()**: Elimina espacios al inicio y final
- **CSV**: Primera fila = nombres de columnas (headers)
- **Relaciones**: N:M requiere tabla intermedia
- **Clave foránea**: Establece relación entre tablas
- **DAO**: Patrón para separar lógica de negocio del acceso a datos
- **SELECT**: Sentencia SQL para consultar

---

## Conceptos Clave

### Ficheros en Java
| Clase | Uso | Método clave |
|-------|-----|--------------|
| BufferedReader | Lectura eficiente línea a línea | readLine() |
| BufferedWriter | Escritura eficiente | write(), newLine() |
| FileReader | Lectura básica | read() |
| FileWriter | Escritura básica | write() |

### Jackson ObjectMapper
```java
// Serialización (Java → JSON)
String json = objectMapper.writeValueAsString(objeto);

// Deserialización (JSON → Java)
Objeto obj = objectMapper.readValue(jsonString, Objeto.class);
```

### JDBC
```java
// PreparedStatement con parámetros
PreparedStatement ps = con.prepareStatement("SELECT * FROM tabla WHERE id = ?");
ps.setInt(1, valor);  // Índice comienza en 1
ResultSet rs = ps.executeQuery();

// executeUpdate retorna filas afectadas
int filas = ps.executeUpdate();
```

### DAO
- **Propósito**: Crear capa de abstracción para acceso a datos
- **Métodos típicos**: create(), read(), update(), delete()

---

## Errores Comunes

| Concepto | Correcto | Incorrecto |
|----------|----------|------------|
| Patrón acceso datos | DAO | MVC |
| Java → JSON | writeValueAsString() | toJson() |
| JSON → Java | readValue() | toJson() |
| BufferWriter línea | newLine() | writeNewLine() |
| ResultSet navegación | next() | move() |
| Escritura eficiente | BufferedWriter | FileWriter |
| Lectura eficiente | BufferedReader | FileReader |
| Inyección SQL | PreparedStatement | Statement |
| Hibernate persist | save()/persist() | add() |
| executeUpdate return | Filas afectadas | - |

---

## Resumen General

### Examen 1 (50%) - Fallos principales:
- Patrones DAO vs MVC
- Jackson: toJson() vs writeValueAsString()
- BufferedWriter: newLine()
- JDBC: move(), Statement
- Hibernate: add()
- CRUD: confusiones

### Examen 2 (77%) - Fallos principales:
- DAO: create() vs add()
- Colecciones: ArrayList vs HashMap (orden)
- readValue(): deserializa JSON
- CSV: comillas para campos con delimitadores
- Hibernate: save() vs insert()

---

## Notas del Examen

- Segundo examen (77%) mejoró significativamente
- Repasar: Jackson, JDBC, clases de archivos, patrones DAO
- Conceptos más difíciles: serialización JSON, PreparedStatement