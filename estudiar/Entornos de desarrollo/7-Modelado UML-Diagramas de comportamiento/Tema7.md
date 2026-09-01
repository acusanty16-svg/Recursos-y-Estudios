# Tema 7: Modelado UML - Diagramas de Comportamiento

## 📌 Resumen Rápido

Los diagramas de comportamiento UML describen **cómo funciona el sistema**: interacciones usuario-sistema, flujo de mensajes, decisiones y cambios de estado. Se complementan con los diagramas de clases (estructura).

---

## 1. Casos de Uso (Sesión 24)

### ¿Qué es un Caso de Uso?

Describe las **interacciones entre actores** (usuarios o sistemas externos) y el sistema.

### Elementos

| Elemento | Símbolo | Descripción |
|---------|---------|-------------|
| **Sistema** | Rectángulo grande | El sistema completo |
| **Actor** | Círculo o "palito" | Usuario o sistema externo |
| **Caso de uso** | Elipse | Funcionalidad del sistema |
| **Líneas** | - - - - | Comunicación actor-caso |

### Ejemplo: Sistema de Reserva de Hotel

```
        ┌─────────────────────────────┐
        │   Sistema de Reservas      │
        │                           │
   ┌────┤  ┌──────────────┐        │
   │    │  │ Buscar hab.  │        │
   │ C  │  ├──────────────┤        │
   │ L  │  │ Reservar    │        │
   │ I  │  ├──────────────┤        │
   │ E  │  │ Pagar       │        │
   │ N  │  ├──────────────┤        │
   │ T  │  │ Cancelar    │        │
   │ E  │  └──────────────┘        │
   └────┤         ▲               │
        └─────────┴───────────────┘
            Cliente (actor)
```

### Relaciones en Casos de Uso

| Relación | Descripción |
|----------|-------------|
| **Include** | Include → funcionalidad obligatoria |
| **Extend** | Extend → funcionalidad opcional |
| **Herencia** | Un actor hereda de otro |

> **CONSEJO**: Usa casos de uso para el análisis inicial con el cliente

---

## 2. Diagrama de Secuencia

### ¿Qué es?

Representa el **orden temporal de mensajes** entre objetos. Muestra cómo fluye la información.

### Elementos

| Elemento | Descripción |
|---------|-------------|
| **Objeto** | Rectángulo con nombre |
| **Línea de vida (lifeline)** | Línea vertical punteada |
| **Mensaje** | Flecha horizontal |
| **Activación** | Rectángulo estrecho (cuando el objeto actúa) |

### Ejemplo: Reserva de Habitación

```
┌─────────┐    ┌─────────┐    ┌──────────────┐    ┌─────────┐
│ Cliente │    │Sistema │    │ Base Datos  │    │ Hotel  │
└────┬────┘    └───┬────┘    └──────┬─────┘    └───┬────┘
     │             │             │              │
     │ 1. buscar() │             │              │
     │────────────>│             │              │
     │             │ 2. consulta│              │
     │             │───────────>│              │
     │             │<───────────│              │
     │             │             │              │
     │ 3. mostrar │             │              │
     │<───────────│             │              │
     │             │             │              │
     │ 4. reservar│             │              │
     │────────────>│             │              │
     │             ��� 5. guardar│              │
     │             │───────────>│              │
     │             │<───────────│              │
     │             │             │              │
     │ 6. confirmar             │              │
     │<───────────│             │              │
```

### Tipos de Mensajes

| Tipo | Descripción |
|------|-------------|
| **Síncrono** | Flecha sólidos → espera respuesta |
| **Asíncrono** | Flecha semicircular → no espera |
| **Return** | Flecha discontinua → retorna valor |

> **CONSEJO**: Perfecto para planificar APIs o flujos de comunicación

---

## 3. Diagrama de Actividad

### ¿Qué es?

Muestra el **flujo de control o de tareas** (como un diagrama de flujo).

### Elementos

| Elemento | Símbolo | Descripción |
|---------|---------|-------------|
| **Inicio** | Círculo sólido | Punto de partida |
| **Fin** | Círculo con borde | Punto final |
| **Actividad** | Rectángulo redondeado | Tarea o acción |
| **Decisión** | Rombo | Condition/branch |
| **Fork** | Barra horizontal | Procesos paralelos |
| **Join** | Barra horizontal | Sincronización |

### Ejemplo: Proceso de Pago

```
              ┌─────────┐
              │ INICIO  │
              └────┬────┘
                   │
             ┌────▼────┐
             │Introducir│
             │ datos   │
             └────┬────┘
                   │
             ┌────▼────┐
             │ Validar │
             │ datos   │
             └────┬────┘
                   │
            ┌──────┴──────┐
            │ ¿válidos?   │
            └──────┬──────┘
           Sí      │       No
      ┌────────────▼────────────┐
      │                         │
┌─────▼──────┐         ┌──────▼──────┐
│Pago       │         │Mostrar error│
│aceptado   │         │   de datos   │
└─────┬──────┘         └──────┬──────┘
      │                       │
      │              ┌────────┴────────┐
      │              │   Mostrar menú  │
      │              │  anterior      │
      │              └────────┬────────┘
      │                       │
 ┌────▼────┐                │
 │Confirmar│                │
 │reserva  │                │
 └───┬────┘                │
     │                ┌─────▼─────┐
     │         ┌──────┴──────────┐
     └────────▶│     FIN         │
               └────────────────┘
```

### Características Principales

- **Flujo de izquierda a derecha** o de arriba abajo
- **Decisiones** con condiciones claras
- **Swimlanes** (carriles) para mostrar quién hace cada tarea

> **IDEAL para**: procesos de negocio, flujos de usuario

---

## 4. Diagrama de Estados

### ¿Qué es?

Describe los **diferentes estados de un objeto** y las transiciones entre ellos.

### Elementos

| Elemento | Símbolo | Descripción |
|---------|---------|-------------|
| **Estado** | Rectángulo redondeado | Condición del objeto |
| **Transición** | Flecha | Cambio de estado |
| **Evento** | Texto en flecha | Qué origina el cambio |
| **Estado inicial** | Círculo negro | Estado inicial |
| **Estado final** | Círculo con borde | Estado final |

### Ejemplo: states of a Reserva

```
         ┌─────────────────┐
         │   Pendiente     │
         └────────┬────────┘
                  │ crear()
                  ▼
         ┌─────────────────┐
         │Confirmada       │◀────────────┐
         └────────┬────────┘             │
                  │ confirmar()         │
                  ▼                     │
         ┌─────────────────┐           │
         │   Procesando    │             │
         └────────┬────────┘             │
                  │ pagar()             │
                  ▼                     │
         ┌─────────────────┐     cancelar()
         │    Pagada       │───────────────┘
         └────────┬────────┘
                  │ enviar()
                  ▼
         ┌─────────────────┐
         │   Enviada        │
         └────────┬────────┘
                  │ entregar()
                  ▼
         ┌─────────────────┐
         │   Entregada     │
         └─────────────────┘
```

### Events y Guardas

- **Evento**: Acción que dispara el cambio (ej: "pagar()", "cancelar()")
- **Condición**: Condición necesaria (ej: [pago confirmado])

---

## 🧠 Conceptos Clave para Examen

1. **Casos de uso** = interacción usuario-sistema
2. **Secuencia** = mensajes en orden temporal
3. **Actividad** = flujo de tareas/decisiones
4. **Estado** = cambios de un objeto en el tiempo
5. **Actor** = usuario o sistema externo
6. **Lifeline** = línea de vida de un objeto
7. **Include** = funcionalidad obligatoria
8. **Extend** = funcionalidad opcional
9. **Swimlanes** = carriles por actor
10. **Transición** = cambio de estado

---

## ✅ Resumen Visual

```
Diagramas de Comportamiento
├── Casos de uso
│   ├── Actor (palito)
│   ├── Elipse (funcionalidad)
│   └── Include / Extend
│
├── Secuencia
│   ├── Objetos
│   ├── Lifelines
│   └── Mensajes (síncronos, asíncronos)
│
├── Actividad
│   ├── Inicio/Fin (círculos)
│   ├── Decisiones (rombos)
│   └── Fork/Join (barras)
│
└── Estado
    ├── Estados (rectángulos)
    ├── Transiciones (flechas)
    └── Eventos
```

---

## 💻 Ejercicio Práctico Integrado

Modela una **tienda online** con UML:

### 1. Casos de uso
- Cliente: Registrarse, buscar producto, añadir al carrito, comprar, cancelar
- Administrador: Gestionar inventario, procesar pedidos

### 2. Diagrama de Secuencia (flujo de compra)
- Cliente → Sistema → Base de datos → Sistema → Cliente

### 3. Diagrama de Actividad
- Buscar producto → Añadir al carrito → Proceder pago → Decisión: ¿pago exitoso? → Confirmar / Error

### 4. Diagrama de Estados (Pedido)
- Pendiente → Procesando → Pagado → Enviado → Entregado

---

## ✅ Conclusión Fácil de Recordar

1. **Casos de uso = qué puede hacer el usuario**
2. **Secuencia = orden de mensajes paso a paso**
3. **Actividad = flujo de decisiones como diagrama de flujo**
4. **Estado = ciclos de vida de un objeto**
5. **UML integral = todas las vistas juntas**
6. **Diagramas se complementan** → clases (estructura) + comportamiento (función)

---

> 📚 **Recursos**: "UML Distilled" - Martin Fowler, "The Unified Modeling Language User Guide" - Booch, Rumbaugh & Jacobson