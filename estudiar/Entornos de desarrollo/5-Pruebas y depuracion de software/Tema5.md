# Tema 5: Pruebas y Depuración de Software

## 📌 Resumen Rápido

Las pruebas (testing) detectan fallos antes de que lleguen al usuario. Existen múltiples tipos: unitarias, integración, sistema, aceptación. La depuración permite ejecutar el código paso a paso para encontrar errores.

---

## 1. Introducción a las Pruebas (Sesión 16)

### ¿Qué es el Testing?

Conjunto de actividades para garantizar que el programa funcione correctamente y cumpla los requisitos.

**Objetivo**: Detectar fallos antes del usuario final.

> **IMPORTANTE**: No demostrar que el software "no tiene errores", sino detectar los fallos.

### Verificación vs. Validación

| Concepto | Definición | Pregunta clave |
|---------|------------|---------------|
| **Verificación** | Se construye correctamente (cumple especificaciones técnicas) | "¿Se hace bien?" |
| **Validación** | Se construye el software correcto (cumple necesidades del usuario) | "¿Se hace lo correcto?" |

### Tipos de Pruebas

| Tipo | Descripción |
|------|------------|
| **Unitarias** | Prueban funciones/métodos individuales |
| **Integración** | Prueban cómo colaboran los módulos |
| **Sistema** | Prueban el sistema completo |
| **Aceptación** | El usuario valida que cumple sus necesidades |

> **CONSEJO**: Aplica pruebas desde el inicio, no al final

---

## 2. Técnicas de Prueba: Caja Negra y Caja Blanca (Sesión 17)

### Caja Negra

Se centra en **entradas y salidas**, sin conocer la lógica interna.

- **Preguntas**: "¿Hace lo que debe hacer?"
- **Técnicas**: Equivalencia de clases, valores límite
- **Ideal para**: QA y pruebas funcionales

### Caja Blanca

Examina la **estructura interna** del código y las rutas posibles.

- **Preguntas**: "¿Cómo lo hace internamente?"
- **Técnicas**: Cobertura de sentencias, cobertura de caminos
- **Ideal para**: Desarrolladores y depuración

### Comparación

| Caja Negra | Caja Blanca |
|-----------|------------|
| Entradas/Salidas | Lógica interna |
| No ve el código | Ve el código |
| QA/Testers | Desarrolladores |

> **AMBAS deben combinarse** para una cobertura completa

---

## 3. Pruebas Avanzadas (Sesión 18)

### Pruebas de Integración

Verifican que los **módulos colaboran correctamente**.
- APIs, bases de datos, servicios externos

### Pruebas de Regresión

Garantizan que una **nueva versión no rompe funcionalidades previas**.
- Se ejecutan tras cada cambio

### Pruebas No Funcionales

| Tipo | Descripción |
|------|------------|
| **Rendimiento** | Velocidad, carga (JMeter, K6) |
| **Seguridad** | Vulnerabilidades (OWASP ZAP) |
| **Usabilidad** | Experiencia de usuario |
| **Compatibilidad** | Diferentes dispositivos/navegadores |

> **CONSEJO**: Automatiza las pruebas de regresión

---

## 4. Métricas de Calidad (Sesión 19)

### Complejidad Ciclomática

Mide el **número de caminos lógicos** posibles en un método.

**Fórmula**: Número de decisiones (if, for, while, etc.) + 1

| Valor | Interpretación |
|-------|-----------------|
| **< 10** | Código simple, fácil de mantener |
| **10-20** | Moderado, tener precaución |
| **> 20** | Código complejo, alto riesgo |

### CRAP Score (Change Risk Anti-Patterns)

Combina **complejidad + cobertura de pruebas**.

**Fórmula**: CC² × (1 - coverage)³ + CC

| Valor CRAP | Interpretación |
|------------|---------------|
| **< 30** | Código seguro |
| **> 30** | Código riesgoso ("CRAP code") |

> **EJEMPLO REAL**: Complejidad 45 + coverage 10% = refactorizar urgentemente

---

## 5. Depuración y JUnit (Sesión 20)

### ¿Qué es Depurar (Debugging)?

Proceso de **identificar, aislar y corregir errores**.

### Herramientas de Depuración

| Herramienta | Función |
|------------|----------|
| **Breakpoints** | Pausar ejecución en un punto |
| **Inspección de variables** | Ver valores en tiempo real |
| **Ejecución paso a paso** | Seguir el flujo del código |

### JUnit - Framework de Pruebas

**Anotaciones principales**:

```java
@Test              // Método de prueba
assertEquals(a, b)// Compara dos valores
assertTrue(cond)  // Verifica condición verdadera
assertFalse(cond) // Verifica condición falsa
```

**Ejemplo básico**:

```java
@Test
public void testSumar() {
    int resultado = calculadora.sumar(2, 3);
    assertEquals(5, resultado);
}
```

### Integración en CI/CD

```bash
mvn test    # Maven
pytest     # Python
```

---

## 6. TDD, ATDD y BDD (Sesión 21)

### TDD (Test-Driven Development)

Desarrollo guiado por pruebas.

**Ciclo Red-Green-Refactor**:

```
1. Red     → Escribir prueba que FALLA
2. Green   → Escribir código mínimo para pasar
3. Refactor → Mejorar código manteniendo prueba verde
```

### ATDD (Acceptance TDD)

Pruebas de aceptación definidas **junto al cliente** antes de programar.

### BDD (Behavior-Driven Development)

Lenguaje natural para definir comportamiento.

**Estructura Given-When-Then**:

```gherkin
Given el usuario está registrado
When inicia sesión correctamente
Then accede a su panel de control
```

### Herramientas

| Enfoque | Herramienta |
|--------|------------|
| TDD | JUnit, PyTest |
| BDD | Cucumber, Behave |

---

## 🧠 Conceptos Clave para Examen

1. **Testing = detectar fallos** antes de producción
2. **Verificación** = se construye correctamente
3. **Validación** = se construye lo correcto
4. **Caja negra** = prueba entradas/salidas
5. **Caja blanca** = analiza lógica interna
6. **Regresión** = no romper funcionalidades previas
7. **Complejidad ciclomática** < 10
8. **CRAP** > 30 = código riesgoso
9. **TDD**: Red → Green → Refactor
10. **BDD**: Given-When-Then

---

## ✅ Resumen Visual

```
Tipos de Pruebas
├── Unitarias
├── Integración
├── Sistema
└── Aceptación

Técnicas
├── Caja negra → entradas/salidas
└── Caja blanca → lógica interna

Métricas
├── Complejidad ciclomática < 10
└── CRAP < 30

TDD
├── Red → Fallan
├── Green → Pasan
└── Refactor → Mejoran

BDD
├── Given
├── When
└── Then
```

---

## 💻 Herramientas Útiles

| Tipo | Herramienta |
|------|-------------|
| **Pruebas Java** | JUnit, Mockito |
| **Pruebas Python** | PyTest, unittest |
| **APIs** | Postman, Newman |
| **Rendimiento** | JMeter, K6 |
| **Seguridad** | OWASP ZAP |
| **Cobertura** | JaCoCo, Coverage.py |
| **Calidad** | SonarQube, CodeClimate |
| **BDD** | Cucumber, Behave |

---

## ✅ Conclusión Fácil de Recordar

1. **Testing = prevención**, no solo detección
2. **Verificación = especificaciones**, Validación = usuario
3. **Caja negra + blanca = combinado perfecto**
4. **Complejidad alta = código difícil de mantener**
5. **Depurar = ejecutar paso a paso**
6. **JUnit = pruebas automatizadas estándar**
7. **TDD = pruebas primero, código después**
8. **BDD = lenguaje natural para todos**

---

> 📚 **Recursos**: "Foundations of Software Testing" - Rex Black, "Test Driven Development" - Kent Beck, "Code Complete" - Steve McConnell