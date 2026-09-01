# Temas a Estudiar - Programación

## Resultado del examen: 18/30 (60%)

---

## Temas con Fallos (Repasar)

### 1. Modificador static
- **Efecto**: Variable compartida por todas las instancias de la clase
- **Acceso**: `NombreClase.variableStatic` (sin necesidad de instanciar)
- **No es**: "Restringir el acceso solo al paquete actual"

### 2. HashMap - Método values()
- **Retorna**: Una Collection de los valores
- **No es**: "Un List ordenado de los valores"
- **Nota**: Es una vista, refleja cambios en el HashMap

### 3. Objeto en POO
- **Definición**: Una instancia específica creada a partir de una clase
- **Clase**: Plantilla abstracta
- **Objeto**: Entidad concreta materializada
- **No es**: "Una categoría o plantilla"

### 4. Método equals()
- **Propósito**: Comparar contenido o valor de dos objetos
- **Por defecto**: Compara referencias (como ==)
- **Puede**: Sobrescribirse para自定义 criterios de igualdad
- **No es**: "Determinar si son instancias de la misma clase"

### 5. JDBC - Ejecutar SELECT
- **Método correcto**: `executeQuery()`
- **Retorna**: ResultSet con los datos
- **Para INSERT/UPDATE/DELETE**: `executeUpdate()`
- **No es**: `executeSelect()`

### 6. JavaFX - Componentes en columna vertical
- **Contenedor correcto**: VBox (Vertical Box)
- **HBox**: Horizontal
- **GridPane**: Sistema de rejilla
- **FlowPane**: Envolvimiento dinámico
- **No es**: "FlowPane"

### 7. ArrayList - Tamaño
- **Método correcto**: `size()`
- **No es**: `length()` (eso es para arrays)
- **Diferencia**: Array tiene tamaño fijo, ArrayList dinámico

### 8. LinkedList vs ArrayList - Inserciones intermedias
- **Mejor**: LinkedList (estructura de nodos)
- **Razón**: Solo actualiza referencias (O(1))
- **ArrayList**: Debe desplazar elementos (O(n))
- **No es**: "ArrayList por acceso directo"

### 9. HashMap - get() con clave inexistente
- **Retorna**: null
- **Recomendación**: Verificar con `containsKey()` o usar `getOrDefault()`
- **No es**: "Lanza excepción KeyNotFoundException"

### 10. PreparedStatement - Parámetros
- **Índices**: Comienzan en 1 (no en 0)
- **Sintaxis**: `setInt(1, valor)`, `setInt(2, valor)`
- **No es**: "Por nombre de columna entre comillas"

### 11. JDBC - Control de transacciones
- **Método correcto**: `setAutoCommit(false)`
- **Para confirmar**: `commit()`
- **Para revertir**: `rollback()`
- **No es**: `autoCommit(true)`

### 12. ResultSet - TYPE_SCROLL_INSENSITIVE
- **Navegación**: Bidireccional (adelante y atrás)
- **Métodos**: next(), previous(), first(), last(), absolute(int)
- **No es**: "Solo desplazamiento hacia adelante"

---

## Temas dominados

- **Bucles**: while, for, continue (salta iteración), break (sale del bucle)
- **Arrays**: sintaxis `int[] numeros = new int[8]`
- **ArrayList**: add(), get(), size()
- **HashMap**: put(), get(), containsKey(), keySet(), values()
- **Variables**: local (dentro método) vs instancia (en clase)
- **Herencia**: `extends` (una clase), `implements` (múltiples interfaces)
- **Switch**: tipos válidos (int, String, enum)
- **void**: método sin retorno

---

## Comandos y Sintaxis

### Crear objeto
```java
Persona p = new Persona();
```

### Array
```java
int[] numeros = new int[8];
```

### ArrayList
```java
ArrayList<String> lista = new ArrayList<>();
lista.add("Elemento");
lista.get(0);  // Primer elemento
lista.size();  // Tamaño
```

### HashMap
```java
HashMap<String, Integer> precios = new HashMap<>();
precios.put("pan", 1.50);
precios.get("pan");        // Obtener valor
precios.containsKey("pan"); // Verificar clave
precios.keySet();          // Todas las claves
precios.values();          // Todos los valores
```

### Herencia
```java
class Clase extends Superclase implements Interfaz1, Interfaz2
```

### JDBC
```java
PreparedStatement ps = con.prepareStatement("SELECT * FROM tabla WHERE id = ?");
ps.setInt(1, valor);  // Índice comienza en 1
ResultSet rs = ps.executeQuery();
```

---

## Errores Comunes

| Concepto | Correcto | Incorrecto |
|----------|----------|------------|
| Variable static | Compartida por todas las instancias | Restringir acceso |
| HashMap values() | Collection | List ordenado |
| Objeto | Instancia de clase | Plantilla |
| equals() | Compara contenido | Compara clase |
| SELECT JDBC | executeQuery() | executeSelect() |
| JavaFX columna | VBox | FlowPane |
| ArrayList tamaño | size() | length() |
| Inserción intermedia | LinkedList | ArrayList |
| get() no existe | null | Excepción |
| PreparedStatement índice | 1, 2, 3... | Por nombre |
| autoCommit para control | false | true |
| ResultSet bidireccional | TYPE_SCROLL_INSENSITIVE | Solo forward |

---

## Diferencia Arrays vs ArrayList

| Característica | Array | ArrayList |
|----------------|-------|-----------|
| Tamaño | Fijo | Dinámico |
| Acceso | índices [] | get(index) |
| Tamaño | length | size() |
| Métodos | Limitados | rich API |

---

## Notas del Examen

- Tuviste 12 fallos (60%) - Repasar más!
- Temas críticos: HashMap, JDBC, JavaFX, Colecciones
- Repasar: Arrays, ArrayList vs LinkedList, Herencia