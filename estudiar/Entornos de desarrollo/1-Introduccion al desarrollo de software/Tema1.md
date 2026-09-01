# Tema 1: Introducción al Desarrollo de Software

## 📌 Resumen Rápido

El software es el conjunto de programas que hacen funcionar el hardware. Su desarrollo sigue un ciclo de vida con fases definidas y puede realizarse mediante metodologías en cascada o iterativas (ágiles).

---

## 1. ¿Qué es el Software?

### Definición
Conjunto de programas, instrucciones y datos que hacen que un ordenador funcione. Es intangible (no físico) pero imprescindible: sin él, un ordenador sería solo una carcasa vacía.

### Tipos de Software

| Tipo | Descripción | Ejemplos |
|------|-------------|----------|
| **Sistema** | Permite que el hardware funcione | Windows, Linux, macOS, drivers |
| **Aplicación** | Programas que usamos directamente | Navegadores, WhatsApp, Spotify |
| **Desarrollo** | Herramientas para crear programas | IDEs, compiladores, librerías |

---

## 2. Lenguajes de Programación

### Clasificación por Nivel

- **Bajo nivel**: Cercanos al hardware (Ensamblador) - difíciles de aprender, control directo
- **Alto nivel**: Cercanos al lenguaje humano (Python, Java, C#) - los más usados

### Clasificación por Paradigma

- **Imperativo**: Instrucciones paso a paso (C, Java)
- **Declarativo**: Se centra en el "qué" no en el "cómo" (SQL, HTML)
- **Funcional**: Basado en funciones matemáticas (Haskell, Scala)
- **Orientado a objetos**: Modela el mundo con clases y objetos (Java, C++, C#)

### Clasificación por Aplicación

- **Generales**: Múltiples áreas (Python, Java, C++)
- **Especificos de dominio**: Uso concreto (SQL para bases de datos, R para estadística)

> **DATO IMPORTANTE**: En proyectos reales se usan VARIOS lenguajes combinados (ej: web con HTML/CSS/JS + Python backend + SQL para datos)

---

## 3. Proceso de Ejecución

### ¿Por qué es necesario?
El ordenador solo entiende **lenguaje máquina (binario)**. Nosotros escribimos en lenguajes de alto nivel.

### Tres Modelos Principales

| Modelo | Cómo funciona | Ventajas | Inconvenientes | Ejemplos |
|--------|---------------|----------|-----------------|----------|
| **Compilación** | Traduce todo el código antes de ejecutar | Rápido | Menos flexible | C, C++ |
| **Interpretación** | Ejecuta línea por línea | Flexible | Más lento | Python, JavaScript |
| **Bytecode + VM** | Código intermedio + máquina virtual | Portabilidad | Rendimiento medio | Java, C# |

> **CONSEJO**: Muchos lenguajes modernos combinan enfoques (ej: Python puede compilar a bytecode para mejorar rendimiento)

---

## 4. Ciclo de Vida del Software

### Fases del Ciclo de Vida

```
1. Análisis de requisitos    → ¿Qué se necesita?
2. Diseño                 → Plan técnico (arquitectura, modelos)
3. Implementación          → Escribir el código
4. Pruebas               → Validar que funciona
5. Despliegue            → Poner en producción
6. Mantenimiento         → Resolver errores, actualizar
```

---

## 5. Metodologías de Desarrollo

### Modelo en Cascada (Waterfall)

- **_secuencial**: Cada fase termina antes de empezar la siguiente
- **Ventajas**: Claridad, orden, control
- **Inconvenientes**: Rígido, difícil adaptar cambios
- **Uso ideal**: Proyectos con requisitos estables (aeroespacial, medicina, banca)

### Modelos Iterativos/Ágiles

- **Ciclos cortos**: Análisis → Diseño → Implementación → Pruebas en cada iteración
- **Ejemplos**: Scrum, Kanban, XP
- **Ventajas**: Adaptabilidad, feedback continuo
- **Inconvenientes**: Requiere disciplina y comunicación
- **Uso ideal**: Startups, productos digitales, entornos cambiantes

### Comparación Clave

| Cascada | Iterativos/Ágiles |
|--------|------------------|
| Producto completo al final | Versiones funcionales desde el inicio |
| Poco flexible a cambios | Se adapta a necesidades reales |
| Requiere requisitos estables | Acepta cambios con flexibilidad |

---

## 🧠 Conceptos Clave para Examen

1. **Software = programas + instrucciones + datos**
2. **Tres tipos**: Sistema, Aplicación, Desarrollo
3. **Desarrollo = análisis + diseño + programación + pruebas + mantenimiento**
4. **Lenguajes se clasifican por**: nivel, paradigma, aplicación
5. **Ejecución**: compilación (C++), interpretación (Python), bytecode (Java)
6. **Cascada = secuencial**, **Ágil = iterativo con ciclos cortos**
7. **Elegir metodología según el proyecto**: cascada si requisitos estables, ágil si cambiantes

---

## 💻 Comandos Básicos para Practicar

```bash
# Compilar en C++
g++ hola.cpp -o hola

# Ejecutar en Python
python hola.py

# Compilar a bytecode en Java
javac Hola.java
java Hola
```

---

## ✅ Conclusión Fácil de Recordar

1. **Sin software, el hardware no sirve** → el software es la "inteligencia"
2. **Lenguajes hay muchos** → elige el adecuado según el proyecto
3. **El código pasa por un proceso** → se traduce a lenguaje máquina
4. **El desarrollo sigue un ciclo** → no es solo "escribir código"
5. **No hay metodología perfecta** → depende del contexto y requisitos

---

> 📚 **Recursos recomendados**: The Pragmatic Programmer, CS50 (Harvard), Canal Fireship (YouTube)