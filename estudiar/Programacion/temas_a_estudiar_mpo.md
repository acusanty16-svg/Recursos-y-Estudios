# Temas a Estudiar - MPO (Ampliación de Programación)

## Resultado del examen: 23/30 (77%)

---

## Temas con Fallos (Repasar)

### 1. Condición en estructura if
- **Tipo requerido**: Expresión booleana (true o false)
- **Java**: No permite conversión automática de otros tipos a boolean
- **No es**: "Cualquier objeto que implemente Comparable"

### 2. Garbage Collector en Java
- **Condición**: Cuando no hay referencias activas apuntando al objeto
- **Desencadenante**: El objeto no es accesible desde el código
- **No es**: "Cuando se ejecuta explícitamente System.gc()"
- **Nota**: System.gc() solo sugiere, no garantiza ejecución

### 3. Polimorfismo
- **Definición**: Invocación de métodos diferentes según el objeto concreto en memoria
- **Mecanismo**: Dynamic dispatch - Java busca implementación en la clase real del objeto
- **No es**: "El cambio dinámico del tipo de datos"

### 4. Bucle for-each
- **Requiere**: Cualquier colección que implemente la interfaz Iterable
- **Incluye**: ArrayList, LinkedList, HashSet, arrays, etc.
- **No es**: "Solo listas de tipo ArrayList"

### 5. Streams - Sintaxis correcta para filtrar
- **Sintaxis correcta**:
  ```java
  lista.stream().filter(x -> x > 5).collect(Collectors.toList())
  ```
- **Errores comunes**:
  - Olvidar `.stream()`
  - Usar `.toList()` sin collect
  - No importar `Collectors`
- **No es**: `list.filter(x -> x > 5).toList()` (falta stream y collect)

### 6. Código Limpio - Funciones bien diseñadas
- **Principio**: Funciones pequeñas y con una única responsabilidad
- **Ideal**: Menos de 20 líneas
- **No es**: "Tener múltiples responsabilidades para aprovechar eficiencia"

---

## Temas dominados

- **this**: Referencia al objeto instancia actual
- **Constructores**: Inicializan atributos del objeto
- **Objetos**: Instancias de clase en memoria
- **Maven**: pom.xml, gestión de dependencias
- **Enums**: Ventajas sobre constantes (type-safety, detección de casos faltantes)
- **Autoboxing**: Conversión automática primitivo ↔ wrapper
- **Excepciones checked**: Requieren try-catch o throws
- **Excepciones unchecked**: RuntimeException y derivadas (no obligatorias)
- **Bloque finally**: Se ejecuta siempre (incluso con return/excepciones)
- **ArrayList**: add(), get(), size()
- **Streams**: filter(), collect(), findFirst(), count()
- **Comparación**: == (dirección memoria) vs equals() (contenido)
- **JSON**: Formato de intercambio de datos

---

## Conceptos Clave

### POO
- **Clase**: Plantilla/definición
- **Objeto**: Instancia concreta de una clase
- **this**: Referencia al objeto actual
- **Constructor**: Inicializa el objeto
- **Polimorfismo**: Diferentes comportamientos según tipo real del objeto

### Java
- **if**: Evalúa boolean, no otros tipos
- **Garbage Collector**: Libera objetos sin referencias
- **Autoboxing**: int ↔ Integer, etc.
- **Comparación**:
  - `==`: misma referencia en memoria
  - `equals()`: comparación de contenido (puede sobrescribirse)

### Excepciones
- **Checked** (hereda de Exception, no de Runtime): Obligatorio capturar o declarar con throws
- **Unchecked** (RuntimeException): No obligatorio capturar

### Streams
```java
// Filtrar y collecting
lista.stream()
     .filter(x -> condición)
     .collect(Collectors.toList())

// Obtener primer elemento
lista.stream().findFirst().get()

// Contar elementos
lista.stream().count()
```

### Clean Code
- Funciones pequeñas (< 20 líneas)
- Una única responsabilidad
- Nombres descriptivos
- Código legible y mantenible

---

## Errors Comunes

| Concepto | Correcto | Incorrecto |
|----------|----------|------------|
| Condición if | boolean | objetos Comparable |
| Garbage Collector | Sin referencias | System.gc() |
| Polimorfismo | Método según objeto | Cambio de tipo |
| for-each | Iterable | Solo ArrayList |
| Streams filter | stream().filter().collect() | filter().toList() |
| Funciones Clean Code | Responsabilidad única | Múltiples responsabilidades |

---

## Notas del Examen

- Tuviste 7 fallos (77%)
- Repasar especialmente: sintaxis de streams, conceptos de Java básico, principios de Clean Code