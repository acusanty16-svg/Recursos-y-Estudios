# Tema 4: Optimización, Patrones y Buenas Prácticas

## 📌 Resumen Rápido

Los patrones de diseño son **soluciones reutilizables** a problemas comunes. Los principios SOLID guían cómo escribir código limpio, modular y mantenible. La meta es lograr alta cohesión y bajo acoplamiento.

---

## 1. Patrones de Diseño (Sesión 11)

### ¿Qué son los Patrones?

**Plantillas conceptuales** que orientan cómo estructurar componentes para lograr código más limpio, mantenible y escalable.

### Patrones Creacionales

Controlan **cómo se créent los objetos**.

| Patrón | Descripción | Ejemplo de uso |
|--------|------------|---------------|
| **Singleton** | Solo una única instancia | Conexión a base de datos |
| **Factory** | Crea objetos sin exponer lógica | Crear servicios según tipo |
| **Builder** | Construcción paso a paso | Crear objetos complejos |

### Patrones Estructurales

Definen **cómo se relacionan clases y objetos**.

| Patrón | Descripción | Ejemplo de uso |
|--------|------------|---------------|
| **Adapter** | Conecta clases incompatibles | Integrar APIs externas |
| **Composite** | Estructuras jerárquicas | Árbol de interfaz gráfica |
| **Decorator** | Añade funciones sin alterar clases | Añadir funcionalidades dinámicamente |

> **EJEMPLO REAL**: Netflix usa **Factory** para crear servicios de streaming sin acoplar código.

---

## 2. Patrones de Comportamiento (Sesión 12)

Definen **cómo los objetos interactúan** entre sí.

| Patrón | Descripción | Ejemplo de uso |
|--------|------------|---------------|
| **Observer** | Notifica automáticamente a otros objetos | Notificaciones, seguidores |
| **Strategy** | Cambia algoritmos en tiempo de ejecución | Algoritmos intercambiables |
| **Command** | Encapsula peticiones como objetos | Menús, deshacer/rehacer |
| **State** | Comportamiento según estado | Máquina de estados |

> **EJEMPLO REAL**: Instagram usa **Observer** → cuando publicas, todos tus seguidores reciben notificación automáticamente.

---

## 3. Principios SOLID (Sesión 13)

### ¿Qué es SOLID?

Guía de Robert C. Martin (Uncle Bob) para escribir código limpio y mantenible.

### Los 5 Principios

| Letra | Principio | Descripción |
|-------|----------|-------------|
| **S** | Single Responsibility | Una clase = una única responsabilidad |
| **O** | Open/Closed | Abierto a extensión, cerrado a modificación |
| **L** | Liskov Substitution | Clase hija puede sustituir a la padre |
| **I** | Interface Segregation | Interfaces pequeñas, específicas |
| **D** | Dependency Inversion | Depender de abstracciones, no de concreciones |

### Conceptos Clave

| Término | Definición |
|---------|----------|
| **Cohesión** | Una clase hace bien UNA cosa. Alta cohesión = bien diseñado |
| **Acoplamiento** | Cuánto depende del resto del código. Bajo acoplamiento = deseable |

> **CONSEJO**: Clases pequeñas + bien nombradas = código limpio

---

## 🧠 Conceptos Clave para Examen

1. **Patrón = solución reutilizable** a problemas comunes
2. **Creacionales**: cómo se crean objetos (Singleton, Factory, Builder)
3. **Estructurales**: cómo se relacionan (Adapter, Composite, Decorator)
4. **Comportamiento**: cómo interactúan (Observer, Strategy, Command, State)
5. **SOLID = 5 principios** de diseño limpio
6. **SRP**: una clase, una responsabilidad
7. **Alta cohesión + bajo acoplamiento** = buen diseño
8. **Adapter** = conecta clases incompatibles

---

## 4. Code Smells y Análisis Estático (Sesión 14)

### ¿Qué es un Code Smell?

**Señal de alerta** que indica que el código podría mejorarse. No es un error, pero sugiere un posible problema de diseño o mantenimiento.

### Code Smells Comunes

| Tipo | Descripción |
|------|-------------|
| **Código duplicado** | Mismo código en varios lugares |
| **Métodos largos** | Más de 20 líneas |
| **Nombres confusos** | Variables como "x", "temp" |
| **Clase "Dios"** | Demasiadas responsabilidades |
| **Variables sin usar** | Código muerto |

### Herramientas de Análisis Estático

Revisan el código **sin ejecutarlo**, detectando problemas automáticamente.

| Herramienta | Lenguaje |
|------------|----------|
| **SonarQube** | Java, C#, Kotlin, etc. |
| **ESLint** | JavaScript, TypeScript |
| **PMD / Checkstyle** | Análisis adicional |

### Métricas que Analizan

- **Complejidad ciclomática** - cuántas ramas de decisión tiene el código
- **Duplicación de código** - porcentaje repetido
- **Violaciones de estilo** - naming, formato

> **CONSEJO**: Integra análisis estático en CI/CD (GitHub Actions, Jenkins)

---

## 5. Refactorización y Documentación (Sesión 15)

### ¿Qué es Refactorizar?

Mejorar el código **sin cambiar su funcionalidad**. Es reestructurar para hacerlo más claro y fácil de mantener.

### Técnicas de Refactorización

| Técnica | Descripción |
|---------|-------------|
| **Extraer método/clase** | Dividir código largo |
| **Renombrar variables** | Nombres claros |
| **Eliminar duplicados** | DRY (Don't Repeat Yourself) |
| **Simplificar condicionales** | Lógica más clara |

### Javadoc (Documentación en Java)

Genera documentación **HTML automáticamente** a partir de comentarios en el código.

```java
/**
 * Calcula el área de un rectángulo.
 * @param base La base del rectángulo
 * @param altura La altura del rectángulo
 * @return El área calculada
 * @author Nombre del autor
 */
public int calcularArea(int base, int altura) {
    return base * altura;
}
```

### Etiquetas Javadoc

| Etiqueta | Uso |
|----------|-----|
| `@param` | Parámetro de método |
| `@return` | Valor que retorna |
| `@author` | Autor del código |
| `@version` | Versión |

### Generar Documentación

```bash
javadoc -d ./docs *.java
```

> **CONSEJO**: Documenta cada clase y método público

---

## 🧠 Conceptos Clave para Examen (Actualizado)

1. **Code smells = señales de código mejorable**
2. **Análisis estático = revisión sin ejecutar**
3. **SonarQube/ESLint = detectan errores automáticamente**
4. **Refactorizar = mejorar sin cambiar comportamiento**
5. **Javadoc = genera documentación HTML**
6. **DRY = Don't Repeat Yourself**
7. **Complejidad ciclomática alta = código difícil de mantener**
8. **Refactoriza después de cada sprint**

---

## ✅ Resumen Visual

```
Code Smells
├── Código duplicado
├── Métodos largos (>20 líneas)
├── Nombres confusos
└── Clase "Dios"

Análisis Estático
├── SonarQube → Java/C#
├── ESLint → JS/TS
└── Métricas → complejidad, duplicado

Refactorización
├── Extraer métodos
├── Renombrar
├── Eliminar duplicados
└── Simplificar lógica

Javadoc
├── /** ... */
├── @param, @return, @author
└── javadoc -d ./docs *.java
```

---

## ✅ Resumen Visual

```
Patrones de Diseño
├── Creacionales (crear objetos)
│   ├── Singleton → 1 instancia
│   ├── Factory → crea sin exponer
│   └── Builder → paso a paso
├── Estructurales (relacionar)
│   ├── Adapter → conecta incompatibles
│   ├── Composite → jerarquía
│   └── Decorator → añadir funciones
└── Comportamiento (interactúan)
    ├── Observer → notificación
    ├── Strategy → cambio algoritmos
    ├── Command → acciones como objetos
    └── State → según estado

SOLID
├── S → Single Responsibility
├── O → Open/Closed
├── L → Liskov Substitution
├── I → Interface Segregation
└── D → Dependency Inversion

Code Smells
├── Código duplicado
├── Métodos largos (>20 líneas)
├── Nombres confusos
└── Clase "Dios"

Análisis Estático
├── SonarQube → Java/C#
├── ESLint → JS/TS
└── Métricas → complejidad, duplicado

Refactorización
├── Extraer métodos
├── Renombrar
├── Eliminar duplicados
└── Simplificar lógica

Javadoc
├── /** ... */
├── @param, @return, @author
└── javadoc -d ./docs *.java
```

---

## ✅ Conclusión Fácil de Recordar

1. **Patrones = soluciones probadas** a problemas conocidos
2. **Factory** = crea objetos, **Adapter** = conecta
3. **Observer** = notifica a muchos
4. **SOLID** = código mantenible
5. **Alta cohesión, bajo acoplamiento** = buen diseño
6. **Code smells = alertas de código mejorable**
7. **ESLint/SonarQube = análisis automático**
8. **Refactorizar = mejorar SIN cambiar comportamiento**
9. **Javadoc = documentación automática**
10. **DRY = Don't Repeat Yourself**

---

> 📚 **Recursos**: Refactoring.Guru, "Clean Architecture" - Robert C. Martin, "Head First Design Patterns", "Clean Code", "Refactoring" - Martin Fowler