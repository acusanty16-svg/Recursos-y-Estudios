# Preguntas Incorrectas - Examen de Acceso a Datos

## Resultado: 15/30 correctas (50%) - Examen 1

---

## Examen 2: 23/30 correctas (77%)

---

---

## Pregunta 3 (Examen 2): Método convencional en DAO para incorporar nuevo registro

**Tu respuesta:** add()
**Respuesta correcta:** create()

**Explicación:**
create() es el nombre estándar en DAOs para insertar nuevos registros, alineado con la operación CRUD 'Create'. add() es más genérico; insert() es más SQL; save() es frecuente en algunos frameworks pero no es la convención DAO pura.

---

## Pregunta 6 (Examen 2): Colección Java que mantiene orden de inserción

**Tu respuesta:** HashMap
**Respuesta correcta:** ArrayList

**Explicación:**
ArrayList mantiene el orden de inserción de los elementos con acceso por índice. HashSet no garantiza orden. TreeSet ordena por comparación de elementos. HashMap almacena pares clave-valor sin garantizar orden. Solo ArrayList preserva el orden de inserción de forma predecible por índice.

---

## Pregunta 2: Patrón de Diseño para Acceso a Datos

**Tu respuesta:** MVC
**Respuesta correcta:** DAO

**Explicación:**
DAO (Data Access Object) es un patrón de diseño que encapsula el acceso a datos, proporcionando una interfaz entre la lógica de negocio y la capa de persistencia. MVC es un patrón de arquitectura, Factory y Singleton son patrones de creación, pero no definen acceso a datos.

---

## Pregunta 3: Método de ObjectMapper para convertir objeto Java a JSON

**Tu respuesta:** toJson()
**Respuesta correcta:** writeValueAsString()

**Explicación:**
writeValueAsString() serializa un objeto Java a formato JSON como cadena de texto. Este método es el inverso de readValue(). toJson() pertenece a Gson, readValueAsString() no existe, y serializeToJson() no es un método estándar de Jackson.

---

## Pregunta 9: Método de ObjectMapper para transformar JSON a objeto Java

**Tu respuesta:** toJson()
**Respuesta correcta:** readValue()

**Explicación:**
readValue() realiza la deserialización: convierte JSON (String, InputStream, etc.) en una instancia Java del tipo especificado. writeValueAsString() hace lo contrario. parse() es de otras librerías; deserialize() no es el nombre estándar en Jackson.

---

## Pregunta 11: Función de writeValueAsString()

**Tu respuesta:** Lee una cadena JSON y la valida
**Respuesta correcta:** Convierte un objeto Java en una cadena JSON

**Explicación:**
writeValueAsString() realiza la serialización: transforma un objeto Java en su representación en forma de cadena JSON. Es la operación inversa de readValue(). Este método es esencial para enviar datos JSON a APIs, guardar en ficheros o transmitir por red.

---

## Pregunta 12: Método de BufferedWriter para salto de línea

**Tu respuesta:** writeNewLine()
**Respuesta correcta:** newLine()

**Explicación:**
El método newLine() es específico de BufferedWriter y añade un salto de línea independiente de la plataforma. Esto es importante porque diferentes sistemas operativos utilizan distintos caracteres de salto de línea (\n en Unix, \r\n en Windows). newLine() maneja estas diferencias automáticamente.

---

## Pregunta 15: Método para desplazarse por registros en JDBC

**Tu respuesta:** move()
**Respuesta correcta:** next()

**Explicación:**
El método next() de ResultSet avanza el cursor a la siguiente fila de resultados. Devuelve true si hay una fila disponible, false si se ha alcanzado el final del conjunto. Debe llamarse antes de acceder a los datos de cada fila mediante getters como getInt(), getString(), etc.

---

---

## Pregunta 16 (Examen 2): Operación de readValue() de Jackson sobre JSON

**Tu respuesta:** Lee un archivo binario
**Respuesta correcta:** Deserializa JSON en un objeto Java

**Explicación:**
readValue() toma una cadena o stream JSON y lo convierte (deserializa) en un objeto Java del tipo especificado. writeValueAsString() hace la operación inversa (serialización). Los archivos binarios requieren otros métodos. La validación no es su función principal.

---

## Pregunta 17 (Examen 2): Procedimiento para preservar caracteres delimitadores en CSV

**Tu respuesta:** No respondida
**Respuesta correcta:** Envolver el campo completo entre comillas dobles

**Explicación:**
En formato CSV, cuando un campo contiene el carácter delimitador (coma), se debe encerrar todo el campo entre comillas dobles para que el parseador reconozca que la coma interna forma parte del dato, no un separador de campos. Esta es la norma RFC 4180 estándar para CSV.

---

## Pregunta 16: Clase para escribir texto en archivo eficientemente

**Tu respuesta:** FileWriter
**Respuesta correcta:** BufferedWriter

**Explicación:**
BufferedWriter es la clase diseñada para escribir texto de forma eficiente mediante un buffer interno que acumula datos antes de escribirlos en el fiche

ro. Aunque FileWriter escribe caracteres, BufferedWriter es más eficiente para escrituras frecuentes. PrintStream es para salida estándar, y OutputStreamWriter es de bajo nivel.

---

## Pregunta 19: Clase JDBC con protección contra inyección SQL

**Tu respuesta:** Statement
**Respuesta correcta:** PreparedStatement

**Explicación:**
PreparedStatement compila la consulta SQL una sola vez y permite establecer parámetros posteriormente mediante métodos como setString(), setInt(), etc. Esto proporciona protección contra inyección SQL al tratar los parámetros como datos, no como código SQL.

---

---

## Pregunta 20 (Examen 2): Qué hace readValue() de ObjectMapper

**Tu respuesta:** Convierte un objeto Java a una cadena JSON
**Respuesta correcta:** Lee datos JSON y los convierte en un objeto Java

**Explicación:**
readValue() realiza la deserialización: toma datos en formato JSON (desde cadena, fiche

ro o flujo) y los convierte en un objeto Java de la clase especificada. Es la operación inversa de writeValueAsString(). Este método es fundamental para procesar respuestas JSON en aplicaciones.

---

## Pregunta 21 (Examen 2): Método de Hibernate para almacenar nuevo objeto

**Tu respuesta:** insert()
**Respuesta correcta:** save()

**Explicación:**
En Hibernate, el método save() persiste un objeto nuevo en la base de datos. Aunque persist() también existe (con ligeras diferencias en el contexto de sesión), save() es el método tradicional y más común para guardar entidades.

---

## Pregunta 20: Propósito de writeValueAsString() en Jackson

**Tu respuesta:** Convertir JSON a XML
**Respuesta correcta:** Serializar un objeto Java a cadena JSON

**Explicación:**
writeValueAsString() convierte (serializa) un objeto Java a una cadena de texto en formato JSON. readValue() hace la operación inversa. La conversión a XML requiere otras herramientas. No elimina datos, los transforma.

---

## Pregunta 21: Operación CRUD para obtener información

**Tu respuesta:** Update
**Respuesta correcta:** Read

**Explicación:**
Read (Lectura) es la operación que recupera datos existentes. Create inserta nuevos registros. Update modifica registros existentes. Delete elimina registros. Son las cuatro operaciones básicas de gestión de datos, y Read es específicamente para consulta.

---

## Pregunta 23: Método de Hibernate para persistir nuevo objeto

**Tu respuesta:** add()
**Respuesta correcta:** persist()

**Explicación:**
En Hibernate, el método persist() (también save() en versiones anteriores) guarda un nuevo objeto en la sesión y lo registra en la base de datos. insert() es SQL puro. add() es de colecciones. store() no es estándar en Hibernate.

---

## Pregunta 24: Clase principal de Jackson para JSON

**Tu respuesta:** JSONObject
**Respuesta correcta:** ObjectMapper

**Explicación:**
ObjectMapper es la clase principal de Jackson que proporciona métodos para serializar objetos Java a JSON y deserializar JSON a objetos Java. Es el punto de entrada central para operaciones JSON en Jackson. JSONObject pertenece a otra librería, y JsonParser es una clase de nivel inferior.

---

## Pregunta 27: Valor devuelto por executeUpdate()

**Tu respuesta:** No respondida
**Respuesta correcta:** El número de filas afectadas por la operación

**Explicación:**
executeUpdate() devuelve un int que representa el número de filas insertadas, actualizadas o eliminadas. Este valor permite al desarrollador verificar si la operación tuvo el efecto esperado en la base de datos.

---

## Pregunta 28: Clase para leer archivo línea por línea

**Tu respuesta:** FileReader
**Respuesta correcta:** BufferedReader

**Explicación:**
BufferedReader es la clase estándar para lectura eficiente de archivos de texto línea a línea en Java. Implementa un búfer interno que mejora el rendimiento. FileReader lee carácter a carácter sin búfer. InputStreamReader es más genérico para conversiones de streams. LineReader no existe en la API estándar de Java.

---

## Pregunta 29: Mecanismo JDBC con protección contra inyección SQL

**Tu respuesta:** No respondida
**Respuesta correcta:** PreparedStatement con parámetros

**Explicación:**
PreparedStatement evita la inyección SQL al separar la estructura de la consulta de los datos. Los parámetros se envían de forma segura al servidor, donde se interpretan como valores, no como código SQL. Esto previene que entradas maliciosas puedan alterar la lógica de la consulta.

---

---

# Preguntas Correctas

## Pregunta 1: Clase principal para leer texto de un archivo línea a línea

**Tu respuesta:** BufferedReader

**Explicación:**
BufferedReader es la clase que proporciona lectura eficiente de texto línea a línea mediante un búfer interno. Aunque FileReader y InputStreamReader pueden leer archivos, no ofrecen métodos específicos como readLine(). Scanner también puede leer líneas, pero BufferedReader es la opción más eficiente y estándar para este propósito en acceso a datos.

---

## Pregunta 4: Función principal del método trim()

**Tu respuesta:** Suprime espacios en blanco al inicio y final

**Explicación:**
El método trim() devuelve una nueva cadena en la que se han eliminado los espacios en blanco (espacios, tabulaciones, saltos de línea) del principio y del final. Es especialmente útil al parsear archivos o datos de entrada donde puede haber espacios no deseados alrededor de los valores.

---

## Pregunta 5: Acción obligatoria después de usar un recurso de entrada

**Tu respuesta:** Cerrarlo para liberar recursos del sistema

**Explicación:**
Cerrar un flujo (stream) es esencial para liberar descriptores de archivo, memoria buffered y otros recursos del SO. Sin cierre puede haber pérdida de datos, corrupción de archivos o agotamiento de handles. Se recomienda usar try-with-resources para cierre automático.

---

## Pregunta 6: Relación que requiere tabla intermedia

**Tu respuesta:** Relación muchos a muchos (N:M)

**Explicación:**
Una relación N:M (muchos a muchos) requiere una tabla de unión o asociación que contenga claves foráneas a ambas tablas. Por ejemplo, estudiantes y cursos: un estudiante puede estar en múltiples cursos, y un curso puede tener múltiples estudiantes. Las relaciones 1:1 y 1:N se resuelven con claves foráneas en la misma tabla.

---

## Pregunta 7: Elemento que representa la asociación entre dos tablas

**Tu respuesta:** Una clave foránea

**Explicación:**
Una clave foránea (foreign key) es un atributo o conjunto de atributos en una tabla que referencia la clave primaria de otra tabla, estableciendo una relación entre ellas. Mantiene la integridad referencial, asegurando que los valores en la clave foránea correspondan a valores existentes en la tabla referenciada.

---

## Pregunta 8: Información en la primera fila de un CSV bien formado

**Tu respuesta:** El nombre de las columnas o encabezados

**Explicación:**
La primera fila de un CSV generalmente contiene los nombres de las columnas o encabezados (headers) que describen qué dato representa cada campo. Esto permite identificar la estructura del archivo y facilita el parsing automático de los datos. Los datos comienzan a partir de la segunda fila.

---

## Pregunta 10: Operación CRUD que corresponde a la lectura de datos

**Tu respuesta:** Read

**Explicación:**
En el acrónimo CRUD, Read (Leer) corresponde a la operación de lectura o recuperación de datos de la fuente de datos. Create inserta nuevos datos, Update modifica existentes y Delete elimina registros. Read es la operación fundamental para obtener información almacenada.

---

## Pregunta 13: Formato de archivo con filas y columnas separadas por delimitadores

**Tu respuesta:** CSV

**Explicación:**
CSV (Comma-Separated Values) utiliza delimitadores para separar datos en estructura tabular. JSON usa pares clave-valor. XML emplea etiquetas. YAML es un formato de serialización pero no usa delimitadores tradicionales. CSV es el formato tabular estándar para datos delimitados.

---

## Pregunta 14: instrucción SQL para consultar información

**Tu respuesta:** SELECT

**Explicación:**
SELECT es la instrucción SQL para recuperar datos existentes de una o más tablas. Es de solo lectura y puede incluir cláusulas como WHERE, JOIN, ORDER BY para filtrar, combinar y ordenar resultados según necesidades específicas.

---

## Pregunta 17: Clase para escribir texto en archivo de forma eficiente

**Tu respuesta:** BufferedWriter

**Explicación:**
BufferedWriter es la clase diseñada para escribir texto de forma eficiente mediante un buffer interno que acumula datos antes de escribirlos en el archivo. Mejora el rendimiento significativamente en comparacion con escribir directamente con FileWriter.

---

## Pregunta 18: Información en la primera línea de un archivo CSV

**Tu respuesta:** Nombres de columnas

**Explicación:**
La primera fila de un CSV se conoce como encabezado o header y contiene los nombres de las columnas. Esto permite interpretar correctamente el significado de cada valor en las filas de datos posteriores. Esta es una convención estándar en el procesamiento de archivos CSV.

---

## Pregunta 22: Método típico en un DAO para remover un registro

**Tu respuesta:** delete()

**Explicación:**
delete() es el método estándar en DAOs para eliminar un registro específico, correspondiente a la operación CRUD Delete. remove() es más genérico (colecciones); erase() no es convencional; clear() elimina todos los elementos, no uno específico.

---

## Pregunta 25: Patrón fundamental para separar lógica de negocio del acceso a datos

**Tu respuesta:** Data Access Object (DAO)

**Explicación:**
El patrón DAO (Data Access Object) es el estándar para encapsular la lógica de acceso a datos. Proporciona una abstracción que permite cambiar la fuente de datos sin afectar la lógica de negocio. Singleton gestiona instancias únicas, Factory crea objetos, y Observer notifica cambios; ninguno de estos es el patrón principal de acceso a datos.

---

## Pregunta 26: Formato de archivo que usa delimitadores para separar valores

**Tu respuesta:** CSV

**Explicación:**
CSV (Comma-Separated Values) es un formato de texto plano que utiliza delimitadores, generalmente comas, para separar campos dentro de registros. XML usa etiquetas, JSON usa estructura de objetos con llaves, y Properties usa pares clave=valor. CSV es ampliamente usado para importar y exportar datos tabulares.

---

## Pregunta 30: Método para eliminar un registro en un DAO

**Tu respuesta:** delete()

**Explicación:**
delete() es el método convencional en un DAO para eliminar un registro. Suele recibir como parámetro el identificador del objeto a eliminar. remove() es más específico de colecciones, erase() no es estándar en DAO, y drop() es una operación SQL de base de datos.

---

## Preguntas Correctas Nuevas (Examen 2)

## Pregunta 5 (Examen 2): Excepción para operaciones de acceso a bases de datos

**Tu respuesta:** SQLException

**Explicación:**
SQLException es la excepción específica de Java para errores relacionados con operaciones de acceso a datos y bases de datos. IOException captura errores de entrada/salida generales del sistema de archivos, no errores específicos de conexiones o consultas SQL. SQLException proporciona información detallada sobre fallos en la conexión, sintaxis SQL, permisos de base de datos y otros errores específicos del acceso a datos.

---

## Pregunta 12 (Examen 2): Método de BufferedReader para leer línea completa

**Tu respuesta:** readLine()

**Explicación:**
readLine() es el método específico de BufferedReader que devuelve una String con una línea completa del archivo. Devuelve null cuando se alcanza el final del fichier. read() devuelve un carácter, readText() no existe en BufferedReader, y nextLine() pertenece a Scanner.

---

## Pregunta 15 (Examen 2): Propósito fundamental del patrón DAO

**Tu respuesta:** Crear una capa de abstracción que centralice el acceso y manipulación de datos

**Explicación:**
El patrón DAO (Data Access Object) aisla la lógica de persistencia del resto de la aplicación, permitiendo que los cambios en la fuente de datos no afecten el código de negocio. Proporciona una interfaz consistente para operaciones CRUD independientemente de la implementación subyacente.

---

## Pregunta 25 (Examen 2): Estructura de datos característica de JSON

**Tu respuesta:** Pares clave-valor encerrados entre llaves

**Explicación:**
JSON (JavaScript Object Notation) representa datos como objetos mediante pares clave-valor entre llaves curly braces {}. Esto permite una estructura jerárquica y flexible. CSV usa listas, XML usa etiquetas. La estructura de pares clave-valor permite acceso rápido a los datos y es fácil de parsear.

---

## Pregunta 27 (Examen 2): Estructura JSON en términos de objetos de programación

**Tu respuesta:** Un objeto con pares clave-valor anidables

**Explicación:**
JSON (JavaScript Object Notation) representa datos como objetos con pares clave-valor que pueden contener otros objetos o arrays anidados. Esta estructura jerárquica permite representar datos complejos de forma legible. Es más flexible que una lista simple, diferente a XML en sintaxis aunque ambos pueden anidar, y más estructurado que un fichier de configuración.

**Tu respuesta:** delete()

**Explicación:**
delete() es el método convencional en un DAO para eliminar un registro. Suele recibir como parámetro el identificador del objeto a eliminar. remove() es más específico de colecciones, erase() no es estándar en DAO, y drop() es una operación SQL de base de datos.

---

## Resumen de Temas a Repasar

1. **Patrones de diseño**: DAO vs MVC
2. **Jackson ObjectMapper**: writeValueAsString() y readValue()
3. **BufferedWriter**: newLine()
4. **JDBC**: PreparedStatement, ResultSet.next(), executeUpdate()
5. **Clases de lectura/escritura**: BufferedReader vs FileReader, BufferedWriter vs FileWriter
6. **Hibernate**: método persist() vs save()
7. **CRUD**: Create, Read, Update, Delete
8. **Excepciones**: SQLException
9. **Colecciones Java**: ArrayList vs HashMap (orden de inserción)
10. **CSV**: Headers, comillas para campos con delimitadores
11. **JSON**: Estructura clave-valor, objetos anidados

---

# Base de Datos

## Resultado: 26/30 correctas (87%)

---

## Preguntas Incorrectas

## Pregunta 4: Característica de la Forma Normal de Boyce-Codd (BCNF)

**Tu respuesta:** Que no existan atributos multivaluados
**Respuesta correcta:** Que cada determinante sea una clave candidata

**Explicación:**
BCNF es una forma normal más restrictiva que 3FN. Exige que en toda dependencia funcional X→Y, X sea una clave candidata (es decir, X pueda identificar filas de forma única). BCNF elimina anomalías que pueden persistir en 3FN cuando existen dependencias complejas. Es el nivel más fuerte de normalización en la mayoría de casos prácticos.

---

## Pregunta 9: Transformación de modelo E-R a modelo relacional

**Tu respuesta:** En una columna de una tabla más grande
**Respuesta correcta:** En una tabla con atributos como columnas

**Explicación:**
En el paso del modelo E-R al modelo relacional, cada entidad se transforma en una tabla. Los atributos de la entidad se convierten en columnas de la tabla, y la clave identificadora de la entidad se convierte en la clave primaria de la tabla. Las relaciones entre entidades se implementan mediante claves foráneas.

---

## Pregunta 16: Qué garantiza la integridad referencial

**Tu respuesta:** Que no existan valores duplicados en ninguna columna
**Respuesta correcta:** Que cada valor de clave foránea exista como clave primaria en la tabla relacionada

**Explicación:**
La integridad referencial asegura que las relaciones entre tablas sean válidas. Si una tabla contiene una clave foránea que referencia a otra tabla, cada valor de esa clave foránea debe existir como clave primaria en la tabla referenciada, o ser NULL si está permitido. Esto evita referencias a registros inexistentes y mantiene la consistencia de los datos.

---

## Pregunta 28: Dónde reside la clave foránea en relación 1:N

**Tu respuesta:** En la tabla Cliente
**Respuesta correcta:** En la tabla Pedido

**Explicación:**
La clave foránea se coloca en el lado N (muchos) de la relación. En este caso, Pedido es el lado N porque un cliente puede tener múltiples pedidos. La FK en Pedido referencia la clave primaria de Cliente, permitiendo que varios pedidos apunten al mismo cliente manteniendo la integridad referencial.

---

## Preguntas Correctas

## Pregunta 1: Atributo UNIQUE sin ser clave primaria

**Tu respuesta:** Porque pueden existir múltiples valores NULL en UNIQUE, mientras que PRIMARY KEY no permite NULL

**Explicación:**
Aunque ambas restricciones garantizan unicidad, existen diferencias clave: PRIMARY KEY no permite valores NULL y solo puede haber una por tabla; UNIQUE permite múltiples NULL (en la mayoría de SGBD) y pueden existir varias. Por tanto, 'email' puede ser UNIQUE sin ser la clave primaria principal. Esta distinción es fundamental para el diseño de integridad de datos.

---

## Pregunta 2: Resultado de LIKE 'M%'

**Tu respuesta:** Todos los valores que comienzan con la letra M

**Explicación:**
El operador LIKE utiliza caracteres comodín: % representa cero o más caracteres. En 'M%', el % está al final, lo que significa 'comienza con M seguido de cualquier cosa o nada'. Por ejemplo: 'María', 'Moto', 'M' coincidirían. Si fuera '%M%' buscaría M en cualquier posición, y '%M' buscaría valores que terminan con M.

---

## Pregunta 3: Tipo de JOIN que recupera todos los registros de la tabla izquierda

**Tu respuesta:** LEFT JOIN

**Explicación:**
El LEFT JOIN (o LEFT OUTER JOIN) devuelve todas las filas de la tabla izquierda con sus correspondientes datos de la tabla derecha cuando existen, y NULL cuando no hay coincidencia. Garantiza que ningún registro de la tabla izquierda se pierda.

---

## Pregunta 5: Representación de relación N:M en modelo relacional

**Tu respuesta:** Mediante una tabla intermedia (tabla de unión) que contiene claves foráneas a ambas tablas

**Explicación:**
Las relaciones N:M no pueden representarse directamente en el modelo relacional sin redundancia. Se crea una tabla intermedia (ej: Estudiante_Asignatura) con al menos dos claves foráneas, una por cada tabla origen. Esta tabla de unión permite consultar todas las combinaciones válidas sin pérdida de datos.

---

## Pregunta 6: Comando SQL para retirar permisos

**Tu respuesta:** REVOKE

**Explicación:**
REVOKE es el comando DDL (Data Definition Language) específicamente diseñado para revocar o eliminar permisos previamente otorgados a usuarios o roles. Se complementa con GRANT para administración de permisos en sistemas de control de acceso.

---

## Pregunta 7: Función principal de una clave primaria

**Tu respuesta:** Identificar de forma única cada fila y evitar duplicados

**Explicación:**
Una clave primaria (PRIMARY KEY) es un atributo o conjunto de atributos que identifica unívocamente cada registro en una tabla, garantizando que no existan duplicados. Impone restricciones de unicidad (NOT NULL y UNIQUE). Aunque puede mejorar el rendimiento mediante índices automáticos, su función principal es de integridad de entidad, no optimización.

---

## Pregunta 8: Qué sucede si una clave foránea referencia un valor inexistente

**Tu respuesta:** La operación se rechaza y se genera un error de integridad referencial

**Explicación:**
La integridad referencial es un mecanismo de control que impide insertar o actualizar registros con valores de clave foránea que no existan en la tabla padre, a menos que la FK sea NULL (si lo permite su definición). El SGBD rechaza la operación con un error de restricción. Esto previene datos huérfanos y mantiene consistencia de relaciones.

---

## Pregunta 10: Registros devueltos por LIKE '%C'

**Tu respuesta:** Los que terminan con la letra C

**Explicación:**
En SQL, LIKE utiliza comodines: el símbolo % representa cero o más caracteres. La sintaxis '%C' significa cero o más caracteres seguidos de C al final. Ejemplo: '%C' coincidiría con 'ABC', 'C', 'MÉDICO' pero no con 'CAS'.

---

## Pregunta 11: Diferencia entre clave primaria y UNIQUE

**Tu respuesta:** UNIQUE puede haber múltiples en una tabla, pero clave primaria solo una, y la primaria no acepta nulos

**Explicación:**
Una tabla puede tener solo una clave primaria, que identifica unívocamente cada fila y no admite valores nulos ni duplicados. En cambio, se pueden definir múltiples restricciones UNIQUE, y aunque también impiden duplicados, sí pueden contener valores nulos (típicamente en atributos como email o número de documento secundario). Ambas crean índices para optimizar búsquedas.

---

## Pregunta 12: Sentencia SQL para conceder permisos

**Tu respuesta:** GRANT

**Explicación:**
GRANT es la sentencia DCL (Data Control Language) que otorga privilegios a usuarios sobre objetos de la base de datos. Sintaxis: GRANT tipo_privilegio ON objeto TO usuario.

---

## Pregunta 13: Permiso mínimo para consultar sin modificar

**Tu respuesta:** SELECT

**Explicación:**
El permiso SELECT permite leer y recuperar datos sin modificarlos. INSERT, UPDATE y DELETE permiten escribir, modificar y eliminar respectivamente. Para una consulta de solo lectura, SELECT es el único permiso requerido, respetando el principio de menor privilegio en seguridad.

---

## Pregunta 14: Diferencia entre integridad de entidad e integridad referencial

**Tu respuesta:** La integridad de entidad protege claves primarias; la referencial protege relaciones entre tablas

**Explicación:**
Integridad de entidad: garantiza que la clave primaria no sea nula y sea única (identifica unívocamente cada registro). Integridad referencial: garantiza que los valores de claves foráneas correspondan a valores existentes en la tabla padre o sean nulos. Una protege la identidad del registro, la otra protege las relaciones.

---

## Pregunta 15: Operador LIKE 'M%'

**Tu respuesta:** Registros cuyo valor comience con 'M', seguido de cualquier número de caracteres

**Explicación:**
En SQL, LIKE 'M%' utiliza el comodín '%' que representa cero o más caracteres. El patrón coincide con cualquier cadena que inicie con 'M': 'María', 'Moto', 'M' mismo.

---

## Pregunta 17: Propósito de implementar una clave foránea

**Tu respuesta:** Crear un vínculo lógico entre dos tablas diferentes

**Explicación:**
La clave foránea (FK) es un atributo o conjunto de atributos que referencia la clave primaria de otra tabla, estableciendo relaciones entre tablas. Garantiza integridad referencial: no se pueden insertar valores en la FK que no existan como PK en la tabla referenciada.

---

## Pregunta 18: Información extraída por la consulta

**Tu respuesta:** Los apellidos de los estudiantes cuya calificación es 7.0 o superior

**Explicación:**
Esta consulta realiza una proyección de la columna apellido y aplica un filtro de selección mediante WHERE. El operador >= indica que solo se incluyen filas donde la calificación es mayor o igual a 7.0.

---

## Pregunta 19: Qué exige la Primera Forma Normal (1FN)

**Tu respuesta:** Que todos los atributos sean atómicos (no divisibles) y no existan grupos repetitivos

**Explicación:**
La 1FN es el nivel básico de normalización. Requiere que cada atributo contenga un único valor indivisible (atómico) y que no haya atributos multivaluados ni grupos repetitivos.

---

## Pregunta 20: Patrón LIKE '%abc%'

**Tu respuesta:** Valores que contienen 'abc' en cualquier posición

**Explicación:**
El comodín '%' en SQL representa cero o más caracteres. El patrón '%abc%' coloca el comodín antes y después de 'abc', lo que significa cualquier cantidad de caracteres + 'abc' + cualquier cantidad de caracteres. Coincide con 'abc', 'fabcx', 'xyzabcdef', etc.

---

## Pregunta 21: Comando SQL para cambiar estructura de una tabla

**Tu respuesta:** ALTER TABLE

**Explicación:**
ALTER TABLE es el comando DDL (Data Definition Language) que permite modificar la estructura de tablas. Con él se pueden agregar columnas (ADD COLUMN), eliminarlas (DROP COLUMN), modificar tipos de datos, agregar restricciones o renombrar tablas.

---

## Pregunta 22: Por qué INNER JOIN puede 'ocultar' datos comparado con LEFT JOIN

**Tu respuesta:** Porque solo devuelve filas donde existe correspondencia en ambas tablas, descartando no coincidencias

**Explicación:**
INNER JOIN retorna solo las filas donde hay coincidencia de clave en ambas tablas. Si un registro de la tabla izquierda no tiene correspondencia en la derecha, se descarta. LEFT JOIN incluiría eso con NULLs.

---

## Pregunta 23: Qué sucede con DELETE sin WHERE

**Tu respuesta:** Se suprimen todos los registros de la tabla uno a uno

**Explicación:**
DELETE sin cláusula WHERE elimina toda la información contenida en la tabla, pero mantiene su estructura (columnas y restricciones). Esto es diferente a DROP TABLE que elimina la tabla completa.

---

## Pregunta 24: Principal ventaja de SGBD frente a sistemas de archivos

**Tu respuesta:** Organización centralizada de datos con control unificado

**Explicación:**
Los sistemas de archivos dispersaban los datos sin control centralizado, causando redundancia y inconsistencia. Los SGBD centralizan el almacenamiento, proporcionan mecanismos de control de acceso, integridad de datos, recuperación ante fallos y gestión eficiente de múltiples usuarios simultáneamente.

---

## Pregunta 25: Diferencia fundamental entre DDL y DML

**Tu respuesta:** DDL gestiona la estructura de la base de datos, DML gestiona los datos

**Explicación:**
DDL (Data Definition Language) incluye sentencias como CREATE, ALTER, DROP para definir y modificar estructuras. DML (Data Manipulation Language) incluye SELECT, INSERT, UPDATE, DELETE para manipular datos existentes.

---

## Pregunta 26: Qué ocurre al ejecutar DROP TABLE

**Tu respuesta:** Se elimina permanentemente la estructura y los datos de la tabla

**Explicación:**
DROP TABLE es un comando DDL que elimina completamente la definición de la tabla y todos los registros almacenados, sin posibilidad de reversión mediante ROLLBACK en la mayoría de SGBD. Es irreversible sin un respaldo previo.

---

## Pregunta 27: En qué se convierte cada entidad en la transformación E-R a relacional

**Tu respuesta:** En una tabla con atributos como columnas

**Explicación:**
La normalización E-R a modelo relacional sigue la regla: cada entidad del diagrama E-R se convierte en una relación (tabla) donde los atributos de la entidad se transforman en columnas.

---

## Pregunta 29: Valores que coinciden con LIKE '%abc%'

**Tu respuesta:** Aquellos que contienen 'abc' en cualquier posición dentro del valor

**Explicación:**
El patrón '%abc%' utiliza el comodín % al inicio y al final, lo que permite que 'abc' aparezca en cualquier parte del valor. Coincidiría con 'xyzabc', 'abcxyz', 'xabcy' o incluso 'abc'.

---

## Pregunta 30: Utilidad del operador BETWEEN

**Tu respuesta:** Selecciona registros cuyos valores están dentro de un intervalo inclusivo

**Explicación:**
BETWEEN es un operador lógico que filtra datos dentro de un rango de valores específico (inclusive en ambos extremos). Es equivalente a usar AND pero con sintaxis más compacta.

---

## Resumen de Temas - Base de Datos

1. **Claves**: PRIMARY KEY vs UNIQUE vs FOREIGN KEY
2. **Formas Normales**: 1FN, BCNF
3. **JOINs**: INNER JOIN, LEFT JOIN
4. **LIKE**: comodines % y _
5. **Integridad**: entidad vs referencial
6. **DDL vs DML**: CREATE/ALTER/DROP vs SELECT/INSERT/UPDATE/DELETE
7. **Permisos**: GRANT, REVOKE
8. **Transformación E-R a Relacional**: entidad → tabla
9. **Relaciones**: 1:N, N:M (tabla intermedia)
10. **DELETE vs DROP TABLE**
11. **BETWEEN**: rango inclusivo

---

# Entornos de Desarrollo

## Resultado: 25/30 correctas (83%)

---

## Preguntas Incorrectas

## Pregunta 3: Elemento que conecta dos estados en diagrama de estados

**Tu respuesta:** Una relación de herencia entre clases
**Respuesta correcta:** Una transición disparada por un evento específico

**Explicación:**
En un diagrama de estados, las transiciones son flechas que conectan estados e indican cambios de estado. Cada transición se dispara por un evento (como un mensaje recibido o una condición cumplida) y puede incluir acciones asociadas. Las transiciones son el mecanismo que modela cómo el objeto evoluciona a lo largo de su ciclo de vida.

---

## Pregunta 4: Objetivo principal de completar un sprint en Scrum

**Tu respuesta:** Documentar exhaustivamente toda la arquitectura del sistema
**Respuesta correcta:** Producir un incremento potencialmente entregable del producto

**Explicación:**
Un sprint en Scrum es una iteración de tiempo fijo (típicamente 2-4 semanas) cuyo objetivo es entregar un incremento funcional del producto. Al final de cada sprint, el equipo debe haber completado tareas del backlog que resulten en software testeable y potencialmente shippable, permitiendo entrega incremental y feedback continuo del cliente.

---

## Pregunta 9: Objetivo principal de las pruebas de integración

**Tu respuesta:** Verificar que cada función individual funciona correctamente de manera aislada
**Respuesta correcta:** Validar la comunicación y compatibilidad entre diferentes módulos del sistema

**Explicación:**
Las pruebas de integración verifican cómo interactúan y se comunican los diferentes módulos o componentes del sistema entre sí. A diferencia de las unitarias (que prueban componentes aislados), las de integración aseguran que cuando estos módulos trabajan juntos, los datos fluyen correctamente y no hay incompatibilidades.

---

## Pregunta 17: Estados inicial y final en diagrama de estados UML

**Tu respuesta:** Ningún estado inicial obligatorio, pero al menos un estado final
**Respuesta correcta:** Un único estado inicial, pero cero o más estados finales

**Explicación:**
Según la notación estándar UML, un diagrama de estados debe tener exactamente un estado inicial (representado por un círculo relleno) que indica por dónde comienza el ciclo de vida del objeto. Puede tener uno o varios estados finales (representados por un círculo relleno dentro de otro círculo), o ninguno si el objeto nunca termina su ciclo de vida.

---

## Pregunta 26: Responsabilidades principales del Product Owner en Scrum

**Tu respuesta:** Desarrollo directo del código y supervisión técnica de las implementaciones
**Respuesta correcta:** Definición de prioridades del producto y optimización del valor entregado

**Explicación:**
El Product Owner representa los intereses del cliente y es responsable de mantener y priorizar el backlog del producto, asegurando que los esfuerzos del equipo se dediquen a las características que generan mayor valor. Actúa como puente entre el cliente y el equipo de desarrollo, tomando decisiones sobre qué se construirá y en qué orden.

---

## Preguntas Correctas

## Pregunta 1: Para qué se utiliza un diagrama de actividad

**Tu respuesta:** Para modelar el flujo de trabajo, procesos y toma de decisiones dentro del sistema

**Explicación:**
El diagrama de actividad es una herramienta de UML que representa procesos mediante actividades, decisiones (rombos), sincronización y flujos paralelos. Permite visualizar cómo se ejecutan tareas secuencialmente, qué caminos alternativos existen según condiciones, y en qué puntos hay concurrencia.

---

## Pregunta 2: Qué realiza el comando git pull

**Tu respuesta:** Descarga los cambios más recientes del repositorio remoto e integra automáticamente esos cambios en la rama local

**Explicación:**
git pull es una combinación de git fetch y git merge. Obtiene los cambios del repositorio remoto e integra esos cambios en la rama local actual. En trabajo en equipo es esencial para mantener sincronizado el código local con el del servidor.

---

## Pregunta 5: Principal ventaja del patrón Singleton

**Tu respuesta:** Garantiza que una clase tenga una única instancia global en toda la aplicación, controlando acceso centralizado a esa instancia

**Explicación:**
El patrón Singleton asegura que una clase solo pueda tener una instancia durante toda la vida de la aplicación. Es útil para recursos que deben ser únicos, como conexiones a bases de datos, configuraciones globales o loggers.

---

## Pregunta 6: Actividades en la fase de análisis de requisitos

**Tu respuesta:** Se identifican, documentan y validan las necesidades del cliente y los requisitos funcionales y no funcionales del sistema

**Explicación:**
El análisis de requisitos es la primera fase crítica del ciclo de vida del software. En esta fase, el equipo de desarrollo trabaja directamente con el cliente para entender y documentar exactamente qué debe hacer el sistema.

---

## Pregunta 7: Beneficio principal que proporciona UML

**Tu respuesta:** Facilita la comunicación visual y el entendimiento común de la arquitectura del sistema

**Explicación:**
UML proporciona un lenguaje visual estandarizado que permite a los miembros del equipo comunicar ideas de forma clara y unificada. Los modelos visuales facilitan la identificación de problemas de diseño antes de la implementación.

---

## Pregunta 8: Operación de git clone

**Tu respuesta:** Descarga todo el historial y contenido del repositorio remoto en una copia local completa.

**Explicación:**
'git clone' es el comando utilizado para obtener una copia completa de un repositorio remoto, incluyendo todo su historial de cambios, ramas y archivos.

---

## Pregunta 10: Propósito del diagrama de casos de uso

**Tu respuesta:** Para documentar las funcionalidades que el sistema debe proporcionar desde la perspectiva del usuario

**Explicación:**
El diagrama de casos de uso es una herramienta fundamental en la fase de recopilación y análisis de requisitos. Permite capturar qué debe hacer el sistema desde el punto de vista de quién lo usa.

---

## Pregunta 11: Característica de lenguajes de alto nivel

**Tu respuesta:** Su abstracción del hardware y facilidad de comprensión por desarrolladores

**Explicación:**
Los lenguajes de alto nivel proporcionan abstracciones que permiten escribir código más legible y cercano al pensamiento humano, sin preocuparse por detalles del hardware.

---

## Pregunta 12: Problema que resuelve el patrón Builder

**Tu respuesta:** Simplificar la creación de objetos complejos con muchos atributos opcionales sin constructores sobrecargados.

**Explicación:**
El patrón Builder soluciona el problema de crear objetos con muchos parámetros opcionales. Proporciona una clase interna (builder) que permite construir el objeto paso a paso.

---

## Pregunta 13: Operación exacta de git clone

**Tu respuesta:** Descarga una copia completa del repositorio remoto, incluyendo todo el historial de cambios y ramas, en un directorio local

**Explicación:**
El comando 'git clone' realiza una descarga inicial de un repositorio remoto completo. Copia no solo los archivos actuales, sino también todo el historial de commits y ramas.

---

## Pregunta 14: Qué ocurre con git commit -m

**Tu respuesta:** Se registra una instantánea de los cambios preparados en el histórico local con un mensaje descriptivo.

**Explicación:**
'git commit' confirma y registra los cambios que están en el área de preparación ('staging area') en el historial local del repositorio.

---

## Pregunta 15: Función principal del diagrama de clases en UML

**Tu respuesta:** Ilustrar la arquitectura estática y las relaciones entre entidades del sistema

**Explicación:**
Un diagrama de clases en UML es una representación estática que muestra la estructura del sistema: las clases, sus atributos, métodos y las relaciones entre ellas.

---

## Pregunta 16: Qué indican los code smells

**Tu respuesta:** Que existen indicios de problemas potenciales en el diseño o estructura del código

**Explicación:**
Los code smells son señales de alerta que sugieren deficiencias de diseño: métodos muy largos, duplicación de código, clases con demasiadas responsabilidades.

---

## Pregunta 18: Objetivo fundamental de la refactorización

**Tu respuesta:** Mejorar la calidad interna y mantenibilidad del código sin cambiar su comportamiento observable

**Explicación:**
La refactorización es un proceso disciplinado de reestructuración del código que mejora su diseño interno sin alterar su comportamiento funcional externo.

---

## Pregunta 19: Diferencia entre diagrama de clases y diagrama de secuencia

**Tu respuesta:** El diagrama de clases modela la estructura estática mientras que el de secuencia expone cómo interactúan los objetos en el tiempo

**Explicación:**
El diagrama de clases pertenece a la vista estática del sistema. El diagrama de secuencia es dinámico e ilustra el comportamiento del sistema a través del intercambio de mensajes entre objetos.

---

## Pregunta 20: Objetivo principal de las pruebas de aceptación

**Tu respuesta:** Validar que el software cumple con los requisitos del cliente y es aceptable para su uso en producción

**Explicación:**
Las pruebas de aceptación verifican que el producto final satisface los requisitos funcionales y no funcionales acordados con el cliente. Son realizadas por usuarios finales.

---

## Pregunta 21: Etapa del ciclo de vida para recopilar funcionalidades

**Tu respuesta:** Análisis de requisitos

**Explicación:**
El análisis de requisitos es la fase inicial donde se identifican, especifican y documentan las necesidades funcionales y no funcionales del sistema.

---

## Pregunta 22: Qué realiza git clone

**Tu respuesta:** Descarga completa de un repositorio remoto, incluyendo su historial completo, hacia la máquina local

**Explicación:**
El comando git clone crea una copia local completa de un repositorio remoto, incluyendo todos los archivos, ramas y el historial de commits.

---

## Pregunta 23: Responsabilidad principal del Product Owner

**Tu respuesta:** Gestionar el product backlog, establecer prioridades, definir requisitos y actuar como enlace entre el cliente y el equipo de desarrollo

**Explicación:**
El Product Owner es responsable de maximizar el valor del producto entregado. Gestiona la lista de requisitos, establece el orden de prioridad y comunica con el cliente.

---

## Pregunta 24: Diagrama UML para mostrar interacción usuario-sistema

**Tu respuesta:** Diagrama de casos de uso

**Explicación:**
El diagrama de casos de uso es una herramienta de análisis que muestra actores (usuarios) y cómo interactúan con el sistema a través de casos de uso.

---

## Pregunta 25: Beneficio principal del patrón Singleton

**Tu respuesta:** Asegurar que existe una única instancia de una clase durante la ejecución del sistema

**Explicación:**
El patrón Singleton garantiza que una clase tenga una sola instancia y proporciona un punto de acceso global a ella. Es útil para recursos compartidos.

---

## Pregunta 27: Qué se evalúa en las pruebas de integración

**Tu respuesta:** La interacción correcta entre diferentes módulos y componentes del sistema integrados.

**Explicación:**
Las pruebas de integración verifican que los diferentes módulos y componentes del sistema funcionen correctamente cuando se integran entre sí.

---

## Pregunta 28: Característica que define al patrón Singleton

**Tu respuesta:** Garantiza que una clase tenga una única instancia accesible globalmente

**Explicación:**
El patrón Singleton restringe la instanciación de una clase a un único objeto. Se implementa mediante un constructor privado y un método estático que devuelve la instancia única.

---

## Pregunta 29: Comando Git para transferir cambios al repositorio remoto

**Tu respuesta:** git push

**Explicación:**
El comando 'git push' envía los commits realizados en el repositorio local hacia la rama correspondiente en el repositorio remoto.

---

## Pregunta 30: Función fundamental del software sobre el hardware

**Tu respuesta:** Proporcionar instrucciones que el hardware interpreta y ejecuta

**Explicación:**
El software es el conjunto de instrucciones que dirige el funcionamiento del hardware. Sin software, el hardware es inerte.

---

## Resumen de Temas - Entornos de Desarrollo

1. **UML**: Diagramas de actividad, estados, clases, secuencia, casos de uso
2. **Git**: clone, pull, push, commit
3. **Patrones de diseño**: Singleton, Builder
4. **Scrum**: sprint, Product Owner, backlog
5. **Pruebas**: unitarias, integración, aceptación
6. **Refactorización**: mejorar código sin cambiar comportamiento
7. **Code smells**: señales de problemas en diseño
8. **Análisis de requisitos**
9. **Ciclo de vida del software**
10. **Lenguajes de alto nivel vs bajo nivel**

---

# Itinerario Personal para la Empleabilidad

## Resultado: 14/30 correctas (47%)

---

## Preguntas Incorrectas

## Pregunta 5: Incapacidad temporal - día 35

**Tu respuesta:** 50% a cargo de Seguridad Social.
**Respuesta correcta:** 75% a cargo de la Seguridad Social o mutua.

**Explicación:**
Cuando la incapacidad temporal excede el período inicial (pagado por la empresa al 60%), la Seguridad Social o la mutua asume el pago al 75% de la base reguladora. Esto aplica tanto a contingencias profesionales como a contingencias comunes tras el período de empresa.

---

## Pregunta 6: Principio incorrecto en prevención de riesgos laborales

**Tu respuesta:** Evaluar los riesgos que no puedan evitarse y planificar su prevención.
**Respuesta correcta:** Priorizar la adopción de medidas correctoras sobre las preventivas.

**Explicación:**
El principio fundamental de prevención establece la jerarquía: evitar riesgos, evaluar los que no puedan evitarse, aplicar medidas preventivas (ingeniería y organización) y solo después medidas correctoras o de protección individual. Priorizar correcciones sobre prevención viola esta jerarquía establecida en la LPRL.

---

## Pregunta 7: Significado de tarjeta negra en triaje

**Tu respuesta:** Accidentado con lesiones graves que requiere evacuación inmediata de prioridad máxima.
**Respuesta correcta:** Accidentado fallecido o con pronóstico de supervivencia mínima, que será atendido en último lugar.

**Explicación:**
El sistema de triaje utiliza colores para priorizar la evacuación: verde (leve), amarillo (moderado), rojo (grave/urgente) y negro (fallecido o sin viabilidad). La tarjeta negra indica que los recursos se destinan a víctimas con mayor probabilidad de supervivencia.

---

## Pregunta 9: Frecuencia de compresiones torácicas en RCP adulto

**Tu respuesta:** 40 a 60 compresiones por minuto
**Respuesta correcta:** 100 a 120 compresiones por minuto

**Explicación:**
Las guías internacionales de reanimación cardiopulmonar establecen que las compresiones torácicas en adultos deben realizarse a una frecuencia de 100 a 120 compresiones por minuto. Esta cadencia asegura una perfusión cerebral y coronaria adecuada, siendo crítica para la supervivencia del paciente en parada cardiorrespiratoria.

---

## Pregunta 10: Significado de PAS en primeros auxilios

**Tu respuesta:** Parada, Auxiliar, Soporte.
**Respuesta correcta:** Proteger, Alertar y Socorrer.

**Explicación:**
El protocolo PAS constituye la secuencia inicial ante una emergencia: Proteger (asegurar la zona y protegerse a sí mismo), Alertar (llamar a los servicios de emergencia) y Socorrer (proporcionar los primeros auxilios). Este orden es fundamental para garantizar la seguridad del rescatador y la víctima.

---

## Pregunta 11: Permiso por matrimonio

**Tu respuesta:** 1 día de permiso retribuido
**Respuesta correcta:** 2 días de permiso retribuido

**Explicación:**
La Ley del Estatuto de los Trabajadores reconoce como causa de ausencia justificada el matrimonio del trabajador, con derecho a un mínimo de 2 días de permiso retribuido. Este derecho es independiente de la modalidad de la ceremonia (civil o religiosa).

---

## Pregunta 12: Instrumento que establece salario y condiciones de remuneración

**Tu respuesta:** La nómina mensual
**Respuesta correcta:** El contrato de trabajo

**Explicación:**
El contrato de trabajo es el acuerdo escrito entre empleador y trabajador que especifica todas las condiciones laborales, incluida la cuantía y forma de pago de salarios. La nómina solo documenta el pago realizado en un período específico.

---

## Pregunta 13: Consecuencia de despido nulo judicialmente

**Tu respuesta:** La empresa elige entre readmisión o indemnización.
**Respuesta correcta:** El trabajador debe ser reincorporado obligatoriamente a su puesto.

**Explicación:**
En caso de despido nulo, la reincorporación del trabajador a su puesto anterior es automática y obligatoria. No existe opción de indemnización como alternativa, a diferencia del despido improcedente.

---

## Pregunta 14: Principio interpretativo de norma más favorable

**Tu respuesta:** Principio de aplicación estricta de la ley
**Respuesta correcta:** Principio de norma más favorable

**Explicación:**
El principio de norma más favorable es un criterio de resolución de conflictos normativos en el ámbito laboral que determina que, ante la aplicabilidad simultánea de varias normas, debe aplicarse aquella que resulte más beneficiosa para el trabajador.

---

## Pregunta 16: Compensación por despido sin causa justificada

**Tu respuesta:** 15 días por año trabajado, máximo 12 mensualidades.
**Respuesta correcta:** 33 días por año trabajado, máximo 24 mensualidades.

**Explicación:**
El despido improcedente genera una indemnización de 33 días de salario por cada año trabajado, con un límite máximo de 24 mensualidades de salario.

---

## Pregunta 18: Indemnización por despido improcedento según legislación

**Tu respuesta:** Una cantidad equivalente a 20 días de salario por año de antigüedad, con máximo de 6 meses.
**Respuesta correcta:** Una cantidad equivalente a 33 días de salario por año de antigüedad, con máximo de 24 mensualidades.

**Explicación:**
Desde la reforma laboral del Real Decreto-ley 3/2012, la indemnización por despido improcedente es de 33 días de salario por año de servicio, con un máximo de 24 mensualidades.

---

## Pregunta 20: Tarjeta de color NEGRO en triaje

**Tu respuesta:** Traumatismos graves con sangrado activo; evacuación urgente.
**Respuesta correcta:** Víctimas sin signos vitales o con traumatismo incompatible con la vida; evacuación de menor prioridad.

**Explicación:**
El sistema de triage colorido clasifica: rojo (críticos), amarillo (graves), verde (leves) y negro (fallecidos o sin esperanza de supervivencia). La tarjeta negra indica que la víctima ha fallecido o presenta lesiones letales.

---

## Pregunta 21: Significado de PAS en primeros auxilios

**Tu respuesta:** Proceder, Atender y Salvaguardar la integridad física.
**Respuesta correcta:** Proteger, Avisar y Socorrer.

**Explicación:**
PAS es el acrónimo: Proteger (el lugar del accidente y a la víctima), Avisar (a los servicios de emergencia), y Socorrer (proporcionar atención inmediata).

---

## Pregunta 24: Vacaciones con cierre empresarial de 15 días

**Tu respuesta:** Ambas partes deben negociar cómo se distribuyen sin norma legal aplicable
**Respuesta correcta:** Se computan los 15 días de cierre dentro de los 30 días totales

**Explicación:**
Los días que la empresa cierra por razones empresariales se cuentan dentro del derecho a vacaciones del trabajador. No son días adicionales. El trabajador tendría derecho a elegir cuándo disfrutar los 15 días restantes.

---

## Pregunta 25: Principio de prevención que NO se alinea con normativa española

**Tu respuesta:** Adaptar el trabajo a las características personales del trabajador.
**Respuesta correcta:** Intervenir sobre los riesgos únicamente después de que causen daño a los trabajadores.

**Explicación:**
La prevención de riesgos laborales se fundamenta en el principio de actuación preventiva, es decir, evitar los riesgos antes de que se materialicen en daño. Intervenir únicamente después de que se produce el daño vulnera los principios básicos de la LPRL.

---

## Pregunta 28: Límite máximo de retribuciones en especie

**Tu respuesta:** No existe límite establecido por ley
**Respuesta correcta:** El 30% del salario total

**Explicación:**
La legislación laboral española limita las retribuciones en especie al 30% del salario total del trabajador. Este límite protege al trabajador garantizando que reciba una parte significativa de su remuneración en dinero efectivo.

---

## Preguntas Correctas

## Pregunta 1: Definición técnica de enfermedad laboral

**Tu respuesta:** La alteración de la salud producida por la exposición a factores de riesgo inherentes al trabajo o derivadas del mismo.

**Explicación:**
La enfermedad laboral se caracteriza por ser una alteración de la salud causada por la exposición a factores de riesgo específicos del trabajo, de forma lenta y progresiva, diferenciándose del accidente laboral que es un evento puntual.

---

## Pregunta 2: Autoridad que impone sanciones por seguridad y salud laboral

**Tu respuesta:** Inspección de Trabajo y de la Seguridad Social

**Explicación:**
La Inspección de Trabajo y de la Seguridad Social es el órgano de control e inspección estatal con potestad sancionadora en materia de cumplimiento de la LPRL y normativa laboral.

---

## Pregunta 3: Prestación que exige cotizaciones previas

**Tu respuesta:** Prestación contributiva de desempleo

**Explicación:**
Las prestaciones contributivas requieren un período mínimo de cotización previo. La prestación por desempleo exige una aportación de cotizaciones suficiente.

---

## Pregunta 4: Característica NO legal del contrato de trabajo

**Tu respuesta:** El trabajador puede elegir libremente los horarios sin límites establecidos.

**Explicación:**
El contrato de trabajo se caracteriza por la existencia de subordinación, voluntariedad, contraprestación y ajeneidad. Los horarios no son de libre elección del trabajador.

---

## Pregunta 8: Característica esencial NO propia de relación laboral

**Tu respuesta:** La voluntariedad en la aceptación de cualquier condición laboral durante el contrato.

**Explicación:**
Las características esenciales de la relación laboral son: ajenidad, personalidad y dependencia. La voluntariedad es un requisito en la celebración del contrato, pero una vez celebrado, el trabajador está sujeto a las condiciones pactadas.

---

## Pregunta 15: Característica NO propia de contratos de trabajo

**Tu respuesta:** Ausencia total de retribución económica

**Explicación:**
El contrato de trabajo requiere obligatoriamente una retribución económica o en especie por los servicios prestados. Los elementos esenciales son: consentimiento, prestación personal, subordinación y retribución.

---

## Pregunta 17: Característica de movilidad funcional dentro del mismo grupo profesional

**Tu respuesta:** La asignación temporal de funciones compatibles con la categoría y formación del trabajador

**Explicación:**
La movilidad funcional dentro del mismo grupo permite al empleador reasignar al trabajador a tareas distintas pero coherentes con su nivel de formación y categoría laboral.

---

## Pregunta 19: Situación que constituye enfermedad laboral

**Tu respuesta:** La silicosis desarrollada por exposición prolongada a polvo de sílice en el trabajo

**Explicación:**
La enfermedad laboral es aquella contraída como consecuencia del trabajo, resultado de la exposición a factores de riesgo inherentes al proceso productivo. La silicosis es una enfermedad profesional clásica.

---

## Pregunta 22: Regulación aplicable con conflicto entre acuerdo sectorial y norma estatal

**Tu respuesta:** La regulación más favorable al trabajador contenida en el convenio colectivo.

**Explicación:**
Según el principio de norma más favorable, cuando una norma de rango inferior (convenio colectivo) establece condiciones más beneficiosas que la ley, prevalece la más ventajosa para el trabajador.

---

## Pregunta 23: Acción prioritaria con múltiples víctimas y servicios de rescate presentes

**Tu respuesta:** Mantener informados a los servicios de emergencia y asistir bajo su coordinación

**Explicación:**
Cuando los servicios profesionales de rescate están presentes, el papel del primo auxiliista es complementario y coordinada. Debe facilitar el acceso y asistir bajo su dirección.

---

## Pregunta 26: Descanso mínimo diario para trabajador menor de 18 años

**Tu respuesta:** 12 horas consecutivas.

**Explicación:**
La ley establece que los trabajadores menores de 18 años tienen derecho a un descanso mínimo de 12 horas consecutivas entre jornadas de trabajo.

---

## Pregunta 27: Proceso de selección para función pública

**Tu respuesta:** Concurso-Oposición

**Explicación:**
El concurso-oposición es un sistema mixto que evalúa tanto capacidad técnica (mediante pruebas objetivas) como trayectoria y formación (mediante valoración de méritos).

---

## Pregunta 29: Derecho por horas extraordinarias sin acuerdo

**Tu respuesta:** Derecho a descanso compensatorio en los cuatro meses posteriores.

**Explicación:**
Cuando no existe acuerdo específico sobre retribución de horas extraordinarias, la ley establece que deben compensarse con descanso durante los cuatro meses siguientes.

---

## Pregunta 30: Responsabilidad del socorrista con servicios de emergencia presentes

**Tu respuesta:** Colaborar bajo las indicaciones del personal de emergencia y no interferir en sus operaciones.

**Explicación:**
Cuando el personal de emergencia ya está presente, el socorrista debe actuar como colaborador bajo sus indicaciones. Los profesionales tienen la responsabilidad de coordinar la respuesta.

---

## Resumen de Temas - Itinerario Personal para la Empleabilidad

1. **Enfermedad laboral**: definición, ejemplos (silicosis)
2. **Seguridad y salud laboral**: LPRL, inspección de trabajo
3. **Contrato de trabajo**: características, salario, condiciones
4. **Despido**: nulo (readmisión obligatoria), improcedente (33 días/año, máximo 24 mensualidades)
5. **Incapacidad temporal**: 60% empresa, 75% SS/mutua
6. **Prevención de riesgos**: principios, medidas preventivas vs correctoras
7. **Primeros auxilios**: PAS, RCP (100-120 compresiones), triaje (colores)
8. **Permisos laborales**: matrimonio (2 días), vacaciones
9. **Retribuciones**: especie máximo 30%
10. **Horas extraordinarias**: descanso compensatorio 4 meses
11. **Movilidad funcional**: mismo grupo profesional
12. **Función pública**: concurso-oposición
13. **Menores de edad**: descanso 12 horas

---

# Lenguaje de Marcas

## Resultado: 22/30 correctas (73%)

---

## Preguntas Incorrectas

## Pregunta 2: Etiqueta HTML para crear hipervínculos

**Tu respuesta:** <link>
**Respuesta correcta:** <a>

**Explicación:**
La etiqueta <a> (anchor) crea enlaces navegables en HTML, utilizando el atributo href para especificar la URL de destino. <link> sirve para enlazar recursos externos como estilos CSS, <url> no es una etiqueta HTML, y href es un atributo, no una etiqueta.

---

## Pregunta 6: Significado completo de XML

**Tu respuesta:** Extended Markup Language
**Respuesta correcta:** eXtensible Markup Language

**Explicación:**
XML significa eXtensible Markup Language (Lenguaje de Marcas Extensible). El término 'extensible' es clave, indicando que los usuarios pueden definir sus propias etiquetas. Las alternativas usan palabras similares pero técnicamente incorrectas (extra, extreme, extended).

---

## Pregunta 12: Propiedad CSS para interlineado

**Tu respuesta:** text-spacing
**Respuesta correcta:** line-height

**Explicación:**
La propiedad line-height define el espacio vertical entre líneas de texto. Puede usarse con valores numéricos, porcentajes o unidades. Las demás propiedades no existen en CSS para este propósito.

---

## Pregunta 18: Propiedad Flexbox para alinear eje principal

**Tu respuesta:** align-content
**Respuesta correcta:** justify-content

**Explicación:**
La propiedad justify-content alinea los elementos flexibles a lo largo del eje principal (horizontal por defecto). align-items alinea en el eje transversal, align-content agrupa líneas múltiples, y flex-align no es una propiedad válida.

---

## Pregunta 25: Comportamiento de overflow:auto

**Tu respuesta:** Ajusta automáticamente el tamaño del contenedor
**Respuesta correcta:** Añade barras de desplazamiento solo cuando es necesario

**Explicación:**
La propiedad 'overflow:auto' muestra barras de desplazamiento (scroll) únicamente cuando el contenido supera los límites del contenedor; si el contenido cabe, no hay barras visibles. Diferencias: 'overflow:hidden' recorta el contenido, 'overflow:scroll' siempre muestra barras, 'overflow:visible' deja que el contenido desborde.

---

## Pregunta 26: Atributo HTML para URL destino en hipervínculo

**Tu respuesta:** link
**Respuesta correcta:** href

**Explicación:**
El atributo href (Hypertext Reference) en la etiqueta <a> especifica la URL de destino del enlace. Ejemplo: <a href='https://ejemplo.com'>Enlace</a>. Los atributos url, link y destination no existen en HTML5.

---

## Pregunta 28: Función CSS para cambiar dimensiones

**Tu respuesta:** grow()
**Respuesta correcta:** scale()

**Explicación:**
La función 'scale()' dentro de la propiedad 'transform' multiplica las dimensiones de un elemento. Puede usarse con un valor (escala uniforme: 'scale(1.5)') o dos (escala por ejes: 'scale(1.5, 0.8)'). 'resize()' y 'zoom()' no son funciones de transform válidas; 'grow()' no existe en CSS estándar.

---

## Pregunta 29: Unidad CSS relativa al tamaño de fuente del elemento raíz

**Tu respuesta:** px
**Respuesta correcta:** rem

**Explicación:**
La unidad 'rem' (root em) es relativa al tamaño de fuente definido en el elemento html. 'em' es relativa al elemento padre, 'px' es absoluta y '%' es relativa al contenedor padre.

---

## Preguntas Correctas

## Pregunta 1: Propiedad CSS que activa Grid

**Tu respuesta:** display: grid

**Explicación:**
Para activar CSS Grid, se utiliza 'display: grid'. Las otras opciones no son sintaxis válidas de CSS.

---

## Pregunta 3: Unidad CSS relativa al tamaño de fuente del elemento raíz

**Tu respuesta:** rem

**Explicación:**
La unidad rem (root em) es relativa al tamaño de fuente del elemento raíz <html>. Em es relativa al tamaño de fuente del elemento actual.

---

## Pregunta 4: Función del atributo ID en XML

**Tu respuesta:** Proporcionar una etiqueta única para identificar un elemento

**Explicación:**
El atributo ID en XML proporciona un identificador único para cada elemento, permitiendo su referencia y manipulación posterior.

---

## Pregunta 5: Propiedad CSS para tipo y grosor de borde

**Tu respuesta:** border

**Explicación:**
La propiedad 'border' define el borde de un elemento especificando ancho, estilo y color.

---

## Pregunta 7: Propiedad CSS que redondea esquinas

**Tu respuesta:** border-radius

**Explicación:**
La propiedad 'border-radius' redondea las esquinas de un elemento mediante la especificación de un radio.

---

## Pregunta 8: Propiedad CSS que oculta contenido excedente

**Tu respuesta:** overflow:hidden

**Explicación:**
overflow:hidden es la propiedad que controla cómo se comporta el contenido que supera los límites del contenedor.

---

## Pregunta 9: Atributo HTML para URL de enlace

**Tu respuesta:** href

**Explicación:**
El atributo href (hypertext reference) especifica la URL de destino en un enlace <a>.

---

## Pregunta 10: Sintaxis para seleccionar por clase en CSS

**Tu respuesta:** .clase

**Explicación:**
El selector de clase en CSS utiliza un punto (.) seguido del nombre de la clase.

---

## Pregunta 11: Valor de display para elemento con ancho/alto definibles en flujo línea

**Tu respuesta:** inline-block

**Explicación:**
inline-block combina características de inline (mantiene el flujo de línea) con la capacidad de establecer ancho y altura.

---

## Pregunta 13: Propiedad CSS para espacio interno (entre contenido y borde)

**Tu respuesta:** padding

**Explicación:**
padding genera espacio interior (dentro del elemento) entre el contenido y el borde.

---

## Pregunta 14: Propiedad CSS para espacio exterior de un elemento

**Tu respuesta:** margin

**Explicación:**
La propiedad margin controla el espacio exterior de un elemento, generando separación entre su borde y otros elementos.

---

## Pregunta 15: Propiedad CSS que elimina subrayado en enlaces

**Tu respuesta:** text-decoration: none

**Explicación:**
La propiedad text-decoration: none elimina el subrayado predeterminado de los enlaces.

---

## Pregunta 16: Valor de margin para centrar elemento

**Tu respuesta:** margin:auto

**Explicación:**
margin:auto distribuye automáticamente el espacio disponible de forma equitativa, centrándolo horizontalmente.

---

## Pregunta 17: Propiedad Flexbox para distribuir en múltiples líneas

**Tu respuesta:** flex-wrap

**Explicación:**
La propiedad flex-wrap controla si los elementos flex se ajustan a una nueva línea cuando no caben en el contenedor.

---

## Pregunta 19: Elemento que representa celda de datos en tabla HTML

**Tu respuesta:** td

**Explicación:**
El elemento <td> (table data) define una celda de datos dentro de una fila de tabla.

---

## Pregunta 20: Propiedad CSS para aplicar sombras a elementos

**Tu respuesta:** box-shadow

**Explicación:**
La propiedad box-shadow crea sombras alrededor de un elemento. Acepta parámetros como desplazamiento horizontal y vertical, desenfoque y color.

---

## Pregunta 21: Atributo HTML para campo obligatorio en formulario

**Tu respuesta:** required

**Explicación:**
El atributo required en HTML5 establece que un campo es obligatorio. Si el formulario se envía sin completarlo, el navegador lo rechaza.

---

## Pregunta 22: Efecto de flex-grow en Flexbox

**Tu respuesta:** Permite que un elemento crezca ocupando espacio disponible

**Explicación:**
flex-grow define cuánto espacio disponible debe ocupar un elemento flexible en relación a otros.

---

## Pregunta 23: Propiedad CSS para cambiar tipografía

**Tu respuesta:** font-family

**Explicación:**
La propiedad font-family es la que controla qué tipo de letra se aplica a un elemento.

---

## Pregunta 24: Propiedad CSS para habilitar Grid

**Tu respuesta:** display:grid

**Explicación:**
La propiedad display:grid es el mecanismo CSS estándar para activar el sistema de maquetación Grid en un elemento contenedor.

---

## Pregunta 27: Propiedad CSS para elementos flexibles en siguiente línea

**Tu respuesta:** flex-wrap

**Explicación:**
'flex-wrap' controla si los elementos flexibles se envuelven en múltiples líneas.

---

## Pregunta 30: Propiedad CSS que centra contenido vertical y horizontalmente en Grid

**Tu respuesta:** place-items

**Explicación:**
La propiedad 'place-items' es un atajo que combina 'align-items' y 'justify-items' en un contenedor Grid. Con valor 'center', centra todo el contenido en ambas dimensiones.

---

## Resumen de Temas - Lenguaje de Marcas

1. **HTML**: etiquetas <a>, <td>, atributos href, required, ID
2. **XML**: significado de XML (eXtensible), ID
3. **CSS Grid**: display: grid, place-items
4. **CSS Flexbox**: flex-wrap, justify-content, align-items, flex-grow
5. **CSS general**: border, padding, margin, border-radius, box-shadow, overflow
6. **Unidades CSS**: rem (vs em, px, %)
7. **Texto**: line-height, font-family, text-decoration
8. **Selectores CSS**: clase (.), ID (#)
9. **Formularios**: required

---

# MPO (Ampliación de Programación)

## Resultado: 23/30 correctas (77%)

---

## Preguntas Incorrectas

## Pregunta 2: Tipo de valor que evalúa if en Java

**Tu respuesta:** Cualquier objeto que implemente Comparable
**Respuesta correcta:** Un valor booleano (true o false)

**Explicación:**
La estructura if evalúa una expresión que debe resultar en un valor booleano. Solo true permite ejecutar el bloque; false lo omite. Java no permite convertir automáticamente otros tipos (como números o strings) a booleanos, como sí ocurre en algunos lenguajes como C.

---

## Pregunta 4: Condición para que Garbage Collector libere memoria

**Tu respuesta:** Cuando se ejecuta explícitamente System.gc()
**Respuesta correcta:** Cuando no hay referencias activas apuntando al objeto

**Explicación:**
El Garbage Collector (GC) de Java es responsable de liberar la memoria de objetos que ya no son accesibles desde el código en ejecución. Cuando un objeto no tiene ninguna referencia apuntando a él, se considera elegible para ser recolectado. El GC se ejecuta automáticamente en momentos que determina la JVM; aunque System.gc() puede sugerirle que ejecute, no garantiza ejecución inmediata ni es recomendable llamarlo explícitamente.

---

## Pregunta 5: Capacidad del polimorfismo

**Tu respuesta:** El cambio dinámico del tipo de datos en tiempo de ejecución
**Respuesta correcta:** La invocación de métodos diferentes según el objeto concreto en memoria

**Explicación:**
El polimorfismo en tiempo de ejecución (dynamic dispatch) permite que una referencia de tipo base pueda apuntar a objetos de diferentes tipos derivados. Cuando se invoca un método, Java busca la implementación en la clase real del objeto, no en el tipo de la referencia. Esto permite escribir código genérico que funciona con jerarquías de tipos.

---

## Pregunta 11: Estructuras de datos que recorre for-each

**Tu respuesta:** Solo listas de tipo ArrayList independientemente de otros tipos
**Respuesta correcta:** Cualquier colección que implemente la interfaz Iterable

**Explicación:**
El bucle for-each funciona con cualquier objeto que implemente la interfaz Iterable, que proporciona el método iterator(). Esto incluye ArrayList, LinkedList, HashSet, arrays y otras colecciones.

---

## Pregunta 16: Sintaxis correcta para filtro con streams y obtener lista

**Tu respuesta:** list.filter(s -> s.length() > 3).toList()
**Respuesta correcta:** list.stream().filter(s -> s.length() > 3).collect(Collectors.toList())

**Explicación:**
Stream.filter() retorna un Stream, no una colección. Para convertir el resultado en ArrayList se necesita .collect(Collectors.toList()). Sin collect() tendrías un Stream sin materializar.

---

## Pregunta 24: Sintaxis correcta para filtrar elementos en streams

**Tu respuesta:** lista.filter(x -> x > 5).toList()
**Respuesta correcta:** lista.stream().filter(x -> x > 5).collect(Collectors.toList())

**Explicación:**
La operación de filtrado con streams utiliza el método filter() con una expresión lambda que devuelve un booleano. El método collect() recoge los resultados. Las alternativas utilizan métodos que no existen en la API de streams de Java.

---

## Pregunta 29: Características de funciones bien diseñadas según código limpio

**Tu respuesta:** Tener múltiples responsabilidades para aprovechar eficiencia
**Respuesta correcta:** Ser concisas y enfocadas en una única responsabilidad

**Explicación:**
Clean Code enfatiza que las funciones deben ser pequeñas (idealmente menos de 20 líneas), con un propósito claro y una única razón para cambiar (responsabilidad única). Funciones monolíticas y multipropósito son difíciles de comprender, probar y reutilizar.

---

## Preguntas Correctas

## Pregunta 1: Referencia de 'this' en una clase

**Tu respuesta:** Al objeto instancia actual en el cual se está ejecutando el método

**Explicación:**
'this' es una referencia implícita que apunta al objeto sobre el cual se invocó el método. Permite acceder a los atributos y métodos de la instancia actual. Es especialmente útil en constructores y setters para distinguir parámetros de atributos con el mismo nombre.

---

## Pregunta 3: Denominación técnica de instancia de clase en memoria

**Tu respuesta:** Un objeto instantiado que existe en memoria durante el tiempo de ejecución

**Explicación:**
Un objeto es una instancia concreta de una clase que existe en la memoria RAM mientras el programa se ejecuta. Tiene estado (atributos) y comportamiento (métodos).

---

## Pregunta 6: Distinción entre proyecto Java convencional y Maven

**Tu respuesta:** Maven automatiza la gestión de dependencias, estructura del proyecto y construcción mediante archivo de configuración, evitando configuración manual

**Explicación:**
Maven define un ciclo de vida estándar (clean, compile, test, package, deploy) y utiliza el archivo pom.xml para declarar dependencias, versiones y plugins.

---

## Pregunta 7: Ventaja de enums frente a constantes numéricas en switch

**Tu respuesta:** Proporcionan validación de tipos en compilación y detección de casos faltantes

**Explicación:**
Los enums ofrecen type-safety: el compilador verifica que solo se usen valores válidos, el IDE proporciona autocompletado, y se detectan fácilmente casos switch no cubiertos.

---

## Pregunta 8: Qué es un enum en Java

**Tu respuesta:** Definir constantes cerradas sin permitir extensiones posteriores

**Explicación:**
Los enums son tipos especiales que agrupan un conjunto fijo de constantes nombradas. No permiten crear nuevas instancias desde el código externo, garantizando un conjunto controlado y cerrado de valores.

---

## Pregunta 9: Qué demandan las excepciones checked

**Tu respuesta:** Las capture con try-catch o las declare en la firma con throws

**Explicación:**
Las checked exceptions heredan de Exception (excepto RuntimeException) y representan situaciones recuperables que el compilador verifica obligatoriamente.

---

## Pregunta 10: Sintaxis correcta para obtener primer elemento con streams

**Tu respuesta:** lista.stream().findFirst().get()

**Explicación:**
El método findFirst() devuelve un Optional que contiene el primer elemento del stream. Para obtener el valor, se invoca get().

---

## Pregunta 12: Principal ventaja de enums frente a constantes enteras

**Tu respuesta:** Proporcionan seguridad de tipo y hacen el código más legible y mantenible

**Explicación:**
Los enums ofrecen seguridad de tipo en tiempo de compilación y el código es más legible porque los valores tienen nombres significativos.

---

## Pregunta 13: Diferencia fundamental entre variables primitivas y complejas

**Tu respuesta:** Las primitivas almacenan valores directamente; las complejas almacenan referencias a objetos en memoria

**Explicación:**
Las variables primitivas (int, double, boolean, etc.) almacenan el valor real en el stack. Las variables complejas almacenan una referencia (dirección de memoria) que apunta al objeto en el heap.

---

## Pregunta 14: Tipo de expresión en estructura if

**Tu respuesta:** Una expresión que resulte en un valor booleano true o false

**Explicación:**
Java es un lenguaje fuertemente tipado y no convierte automáticamente otros tipos a booleanos.

---

## Pregunta 15: Responsabilidad principal del constructor

**Tu respuesta:** Asignar valores iniciales a los atributos del objeto recién creado

**Explicación:**
El constructor es invocado automáticamente en el momento de crear una instancia y su propósito es inicializar el estado del objeto.

---

## Pregunta 17: Proceso de autoboxing en Java

**Tu respuesta:** Conversión automática de tipos primitivos a sus clases envoltorio (wrapper) correspondientes

**Explicación:**
El autoboxing convierte automáticamente valores primitivos (int, double, boolean, etc.) a sus equivalentes objetos envoltorio (Integer, Double, Boolean, etc.).

---

## Pregunta 18: Excepción al dividir por cero con enteros

**Tu respuesta:** ArithmeticException

**Explicación:**
Cuando se intenta dividir un número entero primitivo por cero, Java lanza una ArithmeticException. En cambio, la división por cero con tipos flotantes retorna Infinity o NaN.

---

## Pregunta 19: Contenido esencial del archivo pom.xml

**Tu respuesta:** Configuración de construcción, dependencias y propiedades del proyecto

**Explicación:**
El archivo pom.xml (Project Object Model) es el archivo de configuración central de Maven que declara las dependencias externas, plugins y configuraciones de compilación.

---

## Pregunta 20: Categoría de excepciones que NO requieren captura obligatoria

**Tu respuesta:** Las subclases de RuntimeException y sus derivadas

**Explicación:**
Las RuntimeException como NullPointerException, ArrayIndexOutOfBoundsException no requieren captura obligatoria porque generalmente indican errores de programación.

---

## Pregunta 21: Cuándo se ejecuta un bloque finally

**Tu respuesta:** Invariablemente, incluso si hay return o lanzamiento de excepciones

**Explicación:**
El bloque finally está diseñado para código que debe ejecutarse siempre, garantizando así la limpieza de recursos. Se ejecuta después de try o catch, incluso si hay return o se lanza una excepción.

---

## Pregunta 22: Método correcto de ArrayList para insertar al final

**Tu respuesta:** add() que añade secuencialmente al final

**Explicación:**
El método add() de ArrayList añade elementos al final de la colección incrementando su tamaño.

---

## Pregunta 23: Sintaxis correcta para printf en Java

**Tu respuesta:** System.out.printf("%s %d", "Texto", 42)

**Explicación:**
El método printf permite especificar formato mediante patrones. %s representa una cadena, %d un entero.

---

## Pregunta 25: Excepción al dividir por cero con enteros

**Tu respuesta:** ArithmeticException

**Explicación:**
Cuando se divide un entero primitivo por cero, Java lanza una ArithmeticException. Con valores flotantes, el resultado es Infinity o NaN.

---

## Pregunta 26: Herramientas mínimas para desarrollar Java

**Tu respuesta:** El JDK que proporciona compilador, JVM y herramientas de desarrollo

**Explicación:**
El JDK (Java Development Kit) es el conjunto completo necesario que incluye: javac (compilador), java (máquina virtual), javadoc y utilidades.

---

## Pregunta 27: Operación adecuada para obtener cantidad de elementos en streams

**Tu respuesta:** list.stream().count()

**Explicación:**
El método count() del API Stream retorna un long con la cantidad de elementos del stream.

---

## Pregunta 28: Para qué está diseñado JSON

**Tu respuesta:** Representar e intercambiar datos de forma legible y estructurada

**Explicación:**
JSON (JavaScript Object Notation) es un formato de texto ligero basado en pares clave-valor y arrays, ampliamente utilizado en APIs REST.

---

## Pregunta 30: Diferencia entre '==' y equals() en Java

**Tu respuesta:** El operador '==' compara direcciones de memoria, mientras que equals() compara el contenido lógico

**Explicación:**
El operador '==' comprueba si dos referencias apuntan al mismo objeto en memoria. El método equals() compara el contenido actual del objeto.

---

## Resumen de Temas - MPO

1. **POO**: this, constructores, objetos, polimorfismo
2. **Java**: if evalúa boolean, Garbage Collector, autoboxing
3. **Arrays/Collections**: ArrayList, for-each con Iterable
4. **Streams**: filter, collect, findFirst, count
5. **Excepciones**: checked vs unchecked, try-catch-finally, ArithmeticException
6. **Enums**: ventajas sobre constantes, seguridad de tipos
7. **Maven**: pom.xml, gestión de dependencias
8. **Comparación**: == vs equals()
9. **Clean Code**: funciones pequeñas, responsabilidad única
10. **JSON**: formato de intercambio de datos

---

# Programación

## Resultado: 18/30 correctas (60%)

---

## Preguntas Incorrectas

## Pregunta 5: Propósito del modificador 'static' en variable de clase

**Tu respuesta:** Restringir el acceso solo al paquete actual
**Respuesta correcta:** Hacer que la variable sea compartida por todas las instancias de la clase

**Explicación:**
El modificador 'static' asocia una variable a la clase, no a objetos individuales. Existe una única copia compartida en memoria independientemente de cuántas instancias se creen.

---

## Pregunta 6: Tipo de objeto que devuelve values() en HashMap

**Tu respuesta:** Un List ordenado de los valores
**Respuesta correcta:** Una Collection de los valores

**Explicación:**
El método values() de HashMap retorna una vista tipo Collection que contiene todos los valores almacenados en el mapa.

---

## Pregunta 7: Definición correcta de objeto en POO

**Tu respuesta:** Una categoría o plantilla que define propiedades y comportamientos
**Respuesta correcta:** Una instancia específica creada a partir de una clase

**Explicación:**
Un objeto es la materialización concreta de una clase. Mientras que la clase es la definición o plantilla abstracta, el objeto es la entidad individual resultante de instanciar esa clase.

---

## Pregunta 11: Propósito del método equals() en Java

**Tu respuesta:** Determinar si dos objetos son instancias de la misma clase
**Respuesta correcta:** Comparar el contenido o el valor de dos objetos

**Explicación:**
El método equals() compara la igualdad semántica o de contenido entre objetos. Por defecto compara referencias (como ==), pero puede ser sobrescrito.

---

## Pregunta 15: Método para ejecutar consultas SELECT en JDBC

**Tu respuesta:** executeSelect()
**Respuesta correcta:** executeQuery()

**Explicación:**
executeQuery() retorna un ResultSet con los datos resultantes de la consulta SELECT. executeUpdate() se usa para INSERT, UPDATE y DELETE.

---

## Pregunta 16: Disposición que organiza componentes en columna vertical en JavaFX

**Tu respuesta:** FlowPane
**Respuesta correcta:** VBox

**Explicación:**
VBox (Vertical Box) organiza sus nodos hijos en una sola columna vertical. HBox dispone horizontalmente. GridPane ofrece un sistema de rejilla.

---

## Pregunta 18: Método para obtener tamaño de ArrayList

**Tu respuesta:** length()
**Respuesta correcta:** size()

**Explicación:**
El método size() retorna la cantidad actual de elementos en un ArrayList. Los arrays estáticos usan la propiedad length.

---

## Pregunta 19: Rendimiento al insertar en posiciones intermedias

**Tu respuesta:** ArrayList por su acceso directo mediante índice
**Respuesta correcta:** LinkedList por su estructura de nodos enlazados

**Explicación:**
LinkedList utiliza una estructura de nodos con referencias. Para insertar en posición intermedia, solo requiere actualizar referencias (O(1)). ArrayList necesita desplazar todos los elementos posteriores (O(n)).

---

## Pregunta 20: Qué retorna get(clave) de HashMap cuando no existe

**Tu respuesta:** Lanza una excepción de tipo KeyNotFoundException
**Respuesta correcta:** Retorna null

**Explicación:**
Si una clave no existe en un HashMap, el método get(clave) retorna null. Es recomendable verificar con containsKey() o usar getOrDefault().

---

## Pregunta 23: Cómo se especifica posición de parámetros en PreparedStatement

**Tu respuesta:** Mediante el nombre de la columna entre comillas
**Respuesta correcta:** Mediante índice numérico comenzando en 1

**Explicación:**
PreparedStatement utiliza índices numéricos comenzando en 1 (no en 0) para identificar los signos de interrogación en la consulta SQL.

---

## Pregunta 24: Método para controlar manualmente el commit en JDBC

**Tu respuesta:** autoCommit(true)
**Respuesta correcta:** autoCommit(false)

**Explicación:**
Invocar setAutoCommit(false) desactiva el commit automático, permitiendo controlar explícitamente cuándo se confirman las transacciones mediante commit().

---

## Pregunta 26: Navegación con TYPE_SCROLL_INSENSITIVE en ResultSet

**Tu respuesta:** Solo desplazamiento hacia adelante en los registros
**Respuesta correcta:** Navegación bidireccional (adelante y atrás) en los registros

**Explicación:**
TYPE_SCROLL_INSENSITIVE permite usar métodos como next(), previous(), first(), last() y absolute(int) para moverse en ambas direcciones.

---

## Preguntas Correctas

## Pregunta 1: Efecto de 'continue' en bucle while anidado

**Tu respuesta:** Salta a la siguiente iteración del bucle interior

**Explicación:**
La sentencia 'continue' dentro de un bucle causa que se salte el resto del bloque actual y se proceda a la siguiente iteración del mismo bucle.

---

## Pregunta 2: Sintaxis correcta para crear instancia de Persona

**Tu respuesta:** Persona p = new Persona();

**Explicación:**
La sintaxis correcta en Java requiere la palabra clave 'new' seguida del nombre de la clase y paréntesis para invocar el constructor.

---

## Pregunta 3: Efecto de continue en un bucle

**Tu respuesta:** Salta a la siguiente iteración del bucle

**Explicación:**
La sentencia continue salta el código restante en la iteración actual y transfiere el control a la evaluación de la condición para la siguiente iteración.

---

## Pregunta 4: Palabra clave para interrumpir un bucle while

**Tu respuesta:** break

**Explicación:**
La instrucción 'break' detiene la ejecución del bucle y transfiere el control a la primera sentencia después del bucle.

---

## Pregunta 8: Efecto de 'static' en variable de clase

**Tu respuesta:** La variable es compartida por todas las instancias de la clase

**Explicación:**
Una variable estática (static) pertenece a la clase misma, no a las instancias. Existe una única copia compartida por todas las instancias.

---

## Pregunta 9: Método para obtener elemento en posición 0 de ArrayList

**Tu respuesta:** lista.get(0);

**Explicación:**
El método 'get(int index)' de ArrayList devuelve el elemento ubicado en la posición especificada.

---

## Pregunta 10: Sintaxis para declarar array de 8 enteros

**Tu respuesta:** int[] numeros = new int[8];

**Explicación:**
La sintaxis correcta requiere el tipo, corchetes [], el operador new, el tipo nuevamente y el tamaño entre corchetes.

---

## Pregunta 12: Definición de Node en JavaFX

**Tu respuesta:** Como la unidad fundamental de la interfaz de usuario que puede contener otros nodos

**Explicación:**
Un Node es el elemento base en la jerarquía de escena de JavaFX. Todos los componentes visuales heredan de Node.

---

## Pregunta 13: Método para verificar si existe clave en HashMap

**Tu respuesta:** precios.containsKey("pan")

**Explicación:**
El método containsKey(Object key) retorna un booleano indicando si la clave existe en el mapa.

---

## Pregunta 14: Tipos de datos permitidos en switch

**Tu respuesta:** Tipos enteros, String y tipos enumerados (enum)

**Explicación:**
A partir de Java 7, switch acepta int, byte, short, long, String y enum. No acepta tipos de punto flotante ni booleanos.

---

## Pregunta 17: Diferencia principal entre array y ArrayList

**Tu respuesta:** Array tiene tamaño fijo, ArrayList puede crecer dinámicamente

**Explicación:**
Los arrays tienen una capacidad fija establecida en el momento de su creación, mientras que ArrayList se redimensiona automáticamente.

---

## Pregunta 21: Diferencia entre variable local y variable de instancia

**Tu respuesta:** Las variables locales se declaran dentro de métodos y existen solo mientras se ejecuta ese método; las variables de instancia se declaran en la clase y existen mientras existe el objeto

**Explicación:**
Las variables locales tienen un alcance limitado al método o bloque donde se definen. Las variables de instancia pertenecen al objeto y persisten mientras el objeto exista.

---

## Pregunta 22: Sintaxis para heredar e implementar interfaces

**Tu respuesta:** class Clase extends Superclase implements Interfaz1, Interfaz2

**Explicación:**
La sintaxis correcta requiere extends para la herencia de clase (singular) e implements para las interfaces (múltiples, separadas por comas).

---

## Pregunta 25: Característica correcta sobre herencia en Java

**Tu respuesta:** Una clase padre puede ser extendida por varias clases hija

**Explicación:**
En Java, una clase puede ser superclase de múltiples subclases sin restricción. Sin embargo, una clase solo puede heredar directamente de una única clase padre (herencia simple).

---

## Pregunta 27: Palabra clave que indica que un método no produce valor de retorno

**Tu respuesta:** void

**Explicación:**
El tipo de retorno 'void' especifica que un método realiza acciones pero no devuelve datos al llamador.

---

## Pregunta 28: Método que devuelve elemento en índice 0 de ArrayList

**Tu respuesta:** numeros.get(0)

**Explicación:**
El método get(int index) de ArrayList devuelve el elemento almacenado en la posición especificada.

---

## Pregunta 29: Qué imprime int[] numeros = new int[3]; System.out.println(numeros[0]);

**Tu respuesta:** Imprime 0

**Explicación:**
Los arrays de tipos primitivos en Java se inicializan automáticamente con sus valores por defecto. Para el tipo int, el valor por defecto es 0.

---

## Pregunta 30: Propósito del método keySet() en HashMap

**Tu respuesta:** Retorna una colección de todas las claves del mapa

**Explicación:**
El método keySet() retorna un Set con todas las claves almacenadas en el HashMap.

---

## Resumen de Temas - Programación

1. **Bucles**: while, for, continue, break
2. **Arrays**: sintaxis, tamaño fijo, inicialización
3. **ArrayList**: add(), get(), size(), vs arrays
4. **LinkedList**: inserciones intermedias
5. **HashMap**: put(), get(), containsKey(), keySet(), values()
6. **JDBC**: executeQuery(), PreparedStatement, setInt(), autoCommit()
7. **JavaFX**: VBox, HBox, GridPane, Node
8. **Variables**: local vs instancia, static
9. **Clases**: herencia (extends), interfaces (implements)
10. **Objetos**: creación con new, equals()
11. **Switch**: tipos permitidos (int, String, enum)
12. **void**: método sin retorno

---

# Sistemas Informáticos

## Resultado: 17/30 correctas (57%)

---

## Preguntas Incorrectas

## Pregunta 1: Representación abreviada de IPv6

**Tu respuesta:** 2001:db8:85a3:0:0:8a2e:370:7334
**Respuesta correcta:** 2001:db8:85a3::8a2e:370:7334

**Explicación:**
La abreviación de IPv6 permite eliminar ceros a la izquierda en cada grupo y reemplazar una secuencia contigua de grupos de ceros por :: (una sola vez). Los dos grupos 0000:0000 se reemplazan por ::.

---

## Pregunta 8: Combinación obligatoria para Windows 11

**Tu respuesta:** BIOS Legacy con tabla de particiones GPT
**Respuesta correcta:** UEFI con tabla de particiones GPT

**Explicación:**
Windows 11 requiere obligatoriamente UEFI como sistema de firmware y GPT como esquema de particiones. Esta combinación proporciona mayor seguridad y mejor manejo de discos grandes.

---

## Pregunta 10: Tabla de particiones para disco mayor de 2 TB

**Tu respuesta:** FAT32
**Respuesta correcta:** GPT (GUID Partition Table)

**Explicación:**
GPT es el estándar moderno que permite discos mayores de 2 TB, mientras que MBR está limitado a un máximo de 2 TB. FAT32 y EXT4 son sistemas de archivos, no tablas de particiones.

---

## Pregunta 12: Comando en Linux para eliminar directorio con contenido

**Tu respuesta:** rmdir -all
**Respuesta correcta:** rm -r

**Explicación:**
El comando 'rm' con la opción '-r' (recursive) elimina directorios y todo su contenido de forma recursiva. 'rmdir' solo elimina directorios vacíos.

---

## Pregunta 13: Sintaxis en Windows para crear archivo de texto vacío

**Tu respuesta:** touch documento.txt
**Respuesta correcta:** type nul > documento.txt

**Explicación:**
type nul > archivo.txt redirige la salida a un nuevo archivo, creándolo vacío. touch es comando Linux/Unix.

---

## Pregunta 14: Sistema de archivos para archivos mayores de 4 GB

**Tu respuesta:** ext3
**Respuesta correcta:** NTFS

**Explicación:**
FAT32 tiene una limitación de 4 GB por archivo. NTFS soporta archivos de hasta 16 TB teóricamente, lo que lo hace adecuado para contenido multimedia.

---

## Pregunta 15: Característica del software libre

**Tu respuesta:** Tiene garantía de soporte técnico oficial y no requiere conocimientos técnicos para su uso
**Respuesta correcta:** Su código fuente está disponible públicamente y permite su modificación y redistribución

**Explicación:**
El software libre se caracteriza por la disponibilidad del código fuente y las libertades de uso, estudio, modificación y redistribución.

---

## Pregunta 20: Comando de Linux para acceder al manual de ayuda

**Tu respuesta:** help comando
**Respuesta correcta:** man comando

**Explicación:**
El comando 'man' (manual) es la herramienta estándar en Linux para acceder a la documentación integrada de cualquier comando.

---

## Pregunta 21: Comando para eliminar directorio completo en Linux

**Tu respuesta:** rm -d
**Respuesta correcta:** rm -rf

**Explicación:**
'rm -rf' (remove recursive force) elimina directorios y archivos recursivamente sin pedir confirmación. Es peligroso y requiere cuidado.

---

## Pregunta 25: Dígito que representa lectura en permisos octal

**Tu respuesta:** 1
**Respuesta correcta:** 4

**Explicación:**
El sistema de permisos en Linux utiliza: lectura = 4, escritura = 2, ejecución = 1. Estos valores se suman para cada categoría.

---

## Pregunta 26: Herramienta para visualizar estado de sistemas de archivos

**Tu respuesta:** ls -la /mnt
**Respuesta correcta:** df -h

**Explicación:**
'df -h' (disk free) muestra el espacio disponible en cada partición montada en formato legible.

---

## Pregunta 29: Dirección de broadcast de subred 192.168.50.12/30

**Tu respuesta:** 192.168.50.12
**Respuesta correcta:** 192.168.50.15

**Explicación:**
Con máscara /30, se asignan 4 direcciones por subred. Para 192.168.50.12: 12 es red, 13 y 14 son host usables, 15 es broadcast.

---

## Pregunta 30: Comando en Windows para visualizar contenido de archivo

**Tu respuesta:** cat
**Respuesta correcta:** type

**Explicación:**
El comando type en Windows permite visualizar el contenido de un archivo de texto directamente en la consola. Es el equivalente a cat en Linux.

---

## Preguntas Correctas

## Pregunta 2: Limitación importante de la virtualización

**Tu respuesta:** Requiere una mayor sobrecarga de recursos del sistema anfitrión

**Explicación:**
La virtualización implica una sobrecarga de recursos porque el hipervisor y las máquinas virtuales consumen CPU, memoria y recursos de disco del sistema anfitrión.

---

## Pregunta 3: Función principal de una máscara de red

**Tu respuesta:** Separar la porción de red de la porción de host en una dirección IP

**Explicación:**
La máscara de red utiliza bits con valor 1 para identificar la red y bits con valor 0 para identificar el host dentro de esa red.

---

## Pregunta 4: Ventaja principal de máquinas virtuales en desarrollo

**Tu respuesta:** Permiten ejecutar múltiples sistemas operativos en un único hardware

**Explicación:**
Las máquinas virtuales permiten crear instancias aisladas de sistemas operativos sobre un mismo hardware físico.

---

## Pregunta 5: Qué es una máquina virtual

**Tu respuesta:** Una emulación software de un ordenador físico que ejecuta su propio sistema operativo

**Explicación:**
Una máquina virtual es una abstracción software que simula un ordenador completo, permitiendo ejecutar un sistema operativo y aplicaciones.

---

## Pregunta 6: Afirmación sobre software de código abierto

**Tu respuesta:** Incorrecta, aunque el código sea abierto puede tener licencia de pago

**Explicación:**
El software libre se refiere a la libertad de uso, modificación y distribución, pero no necesariamente implica que sea gratuito.

---

## Pregunta 7: Comando en Windows para eliminar directorio completo

**Tu respuesta:** rmdir /s

**Explicación:**
rmdir con parámetro /s elimina el directorio especificado y todo su contenido recursivamente.

---

## Pregunta 9: Permisos en notación simbólica de chmod 755

**Tu respuesta:** rwxr-xr-x

**Explicación:**
755 en octal significa: 7 (propietario: rwx), 5 (grupo: r-x), 5 (otros: r-x). Así, los permisos son rwxr-xr-x.

---

## Pregunta 11: Comando en Linux para visualizar usuario actual

**Tu respuesta:** whoami

**Explicación:**
El comando 'whoami' muestra el nombre del usuario actualmente autenticado en la sesión.

---

## Pregunta 16: Comando de Linux para eliminar permanentemente un archivo

**Tu respuesta:** rm para eliminar archivos

**Explicación:**
El comando 'rm' (remove) elimina archivos de forma permanente en Linux. Por seguridad, se recomienda usar 'rm -i'.

---

## Pregunta 17: Comando de Windows para cambiar directorio

**Tu respuesta:** cd

**Explicación:**
El comando cd (change directory) en Windows permite navegar hacia cualquier directorio especificando su ruta.

---

## Pregunta 18: Comando de Linux para verificar y reparar sistema de archivos

**Tu respuesta:** fsck

**Explicación:**
El comando 'fsck' (filesystem check) verifica y repara sistemas de archivos en Linux. Debe ejecutarse sobre particiones desmontadas.

---

## Pregunta 19: Comando de Linux para listar archivos incluyendo ocultos

**Tu respuesta:** ls -a

**Explicación:**
El comando 'ls -a' (all) lista todos los archivos y directorios, incluyendo aquellos que comienzan con punto.

---

## Pregunta 22: Direcciones de host utilizables en subred /27

**Tu respuesta:** 30 direcciones

**Explicación:**
Una máscara /27 utiliza 5 bits para hosts (2^5=32 direcciones). Restando red y broadcast: 32-2=30 direcciones utilizables.

---

## Pregunta 23: Capacidad útil de RAID 5 con 4 discos de 2 TB

**Tu respuesta:** 6 TB

**Explicación:**
En RAID 5, la capacidad útil es el total de discos menos uno (paridad). Con 4 discos de 2 TB: 3 × 2 TB = 6 TB.

---

## Pregunta 24: Comando de Linux para visualizar espacio en particiones

**Tu respuesta:** df -h

**Explicación:**
'df' (disk free) muestra el espacio disponible en cada partición montada. La opción '-h' presenta los valores en formato legible.

---

## Pregunta 27: Dirección IPv4 de loopback

**Tu respuesta:** 127.0.0.1

**Explicación:**
La dirección 127.0.0.1 es la dirección de loopback estándar que representa el propio equipo (localhost). Se utiliza para pruebas locales.

---

## Pregunta 28: Opción de ls para visualizar archivos ocultos

**Tu respuesta:** ls -a

**Explicación:**
La opción '-a' (all) muestra todos los archivos, incluyendo los denominados 'ocultos' cuya nomenclatura comienza con punto.

---

## Resumen de Temas - Sistemas Informáticos

1. **IPv6**: abreviación con ::
2. **Virtualización**: sobrecarga de recursos
3. **Máscara de red**: porción red vs host
4. **Windows 11**: requiere UEFI + GPT
5. **Tablas de particiones**: MBR vs GPT
6. **Sistemas de archivos**: NTFS (vs FAT32)
7. **Software libre**: código fuente disponible
8. **Linux**: comandos (rm, ls, cd, whoami, fsck, df, man)
9. **Windows**: comandos (type, cd, rmdir)
10. **Permisos**: octal (r=4, w=2, x=1)
11. **Subredes**: /27 = 30 hosts, broadcast
12. **RAID 5**: capacidad útil = (n-1) × disco
13. **Loopback**: 127.0.0.1