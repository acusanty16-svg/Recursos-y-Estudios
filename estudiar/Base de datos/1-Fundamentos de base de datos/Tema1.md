# Tema 1: Fundamentos de Base de Datos

## 📌 Resumen Rápido

Una **base de datos** es un conjunto organizado de datos. Un **SGBD** (Sistema de Gestión de Base de Datos) es el software que gestiona esa base de datos. La arquitectura ANSI/SPARC define tres niveles para organizar los datos: interno, conceptual y externo.

---

## 1. Datos, Información y Sistemas de Información (Sesión 1)

### Datos vs Información

| Concepto | Definición | Ejemplo |
|----------|------------|--------|
| **Dato** | Hecho en bruto, sin contexto | "1984", "Orwell" |
| **Información** | Datos procesados con significado | "El libro 1984 fue escrito por George Orwell" |
| **Sistema de Información** | Componentes para gestionar información | Hardware, software, personas, procesos |

### Flujo de Valor

```
Dato → Procesamiento → Información → Sistema de Información
```

> **CONSEJO**: Calidad > Cantidad. Datos irrelevantes solo generan decisiones erróneas (GIGO: Garbage In, Garbage Out)

---

## 2. Evolución de los Sistemas de Gestión de Datos (Sesión 2)

### Sistema de Archivos (Antes)

Problemas:
- **Redundancia**: mismos datos repetidos en múltiples archivos
- **Inconsistencia**: actualizar en un lugar pero no en otro
- **Dificultad de acceso**: cada consulta requiere nuevo programa

### SGBD (Solución)

Software intermediario entre usuario/aplicación y base de datos.

**Ventajas del SGBD:**

| Ventaja | Descripción |
|--------|-------------|
| Elimina redundancia | Datos centralizados |
| Consistencia | Un solo origen de la verdad |
| Independización | Datos separados de aplicaciones |
| Seguridad | Control de acceso |
| Integridad | Restricciones automáticamente |

### Ejemplo: Netflix

- Antes: Oracle (monolítico) → cuello de botella
- Después: Apache Cassandra (NoSQL distribuido) → escalabilidad

> **CONSEJO**: SQLite es un SGBD ligero ideal para aprender (en un solo archivo)

---

## 3. Arquitectura ANSI/SPARC (Sesión 3)

### Los Tres Niveles

```
┌─────────────────────────────────────────────┐
│         NIVEL EXTERNO (Vistas)          │
│   /usuario1 / Usuario2 / Usuario3       │
├─────────────────────────────────────────────┤
│       NIVEL CONCEPTUAL (Lógico)          │
│      Esquema lógico global            │
├─────────────────────────────────────────────┤
│         NIVEL INTERNO (Físico)       │
│        Almacenamiento real          │
└─────────────────────────────────────────────┘
```

| Nivel | Descripción |
|-------|-------------|
| **Interno** | Cómo se almacenan físicamente los datos |
| **Conceptual** | Estructura lógica global (modelo de datos) |
| **Externo** | Vistas personalizadas por usuario |

### Independencias

- **Físico-lógica**: Cambios en nivel físico no afectan al conceptual
- **Lógico-externa**: Cambios en conceptual no afectan a las vistas

> **EJEMPLO del banco**: La app móvil (vista externa) no se entera si migramos servidores (nivel interno)

---

## 4. Modelos de Datos y Tipos de SGBD

### Modelos de Datos

| Modelo | Descripción |
|--------|-------------|
| **Relacional** | Tablas con filas y columnas (MySQL, PostgreSQL) |
| **Oriento a objetos** | Objetos con propiedades (ObjectDB) |
| **NoSQL** | Diversos para datos no estructurados |

### Tipos de Bases de Datos

| Tipo | Ejemplos | Uso común |
|------|---------|----------|
| **Relacional (SQL)** | MySQL, PostgreSQL, Oracle | Datos estructurados, consistencia |
| **Documento** | MongoDB | JSON, perfiles usuario |
| **Clave-Valor** | Redis | Caché, sesiones |
| **Columna** | Cassandra | Grandes volúmenes |
| **Grafo** | Neo4j | Redes sociales |

### SQL vs NoSQL

| SQL (Relacional) | NoSQL |
|-----------------|------|
| Estructura fija (tablas) | Flexible (documentos) |
| Consistencia primero | Escalabilidad primero |
| Datos estructurados | Datos no estructurados |

> **CLAVE**: No es mejor o peor, es elegir la herramienta adecuada

---

## 🧠 Conceptos Clave para Examen

1. **Dato = hecho en bruto, información = dato con significado**
2. **SGBD = intermediario que gestiona la base de datos**
3. **Ventajas SGBD**: elimina redundancia, consistencia, seguridad
4. **Arquitectura ANSI/SPARC**: 3 niveles (externo, conceptual, interno)
5. **Independencia físico-lógica**: cambios físicos no afectan lógicos
6. **Modelo relacional**: tablas con filas y columnas
7. **NoSQL**: para escalar, no para consistencia total
8. **SQL vs NoSQL**: elegir según la necesidad

---

## ✅ Resumen Visual

```
Evolución
├── Archivos (problemas)
│   ├── Redundancia
│   ├── Inconsistencia
│   └── Dificultad acceso
└── SGBD (solución)
    ├── Datos centralizados
    ├── Consistencia
    └── Seguridad

Arquitectura ANSI/SPARC
├── Externo → Vistas usuario
├── Conceptual → Lógico global
└── Interno → Almacenamiento

Tipos de SGBD
├── SQL (relacional)
└── NoSQL
    ├── Documento
    ├── Clave-valor
    ├── Columna
    └── Grafo
```

---

## 💻 Herramientas Útiles

| Herramienta | Uso |
|------------|-----|
| **MySQL** | SGBD relacional popular |
| **PostgreSQL** | SGBD relacional avanzado |
| **SQLite** | Aprendizaje (archivo único) |
| **MongoDB** | Base de datos documento |
| **Redis** | Clave-valor en memoria |
| **DBeaver** | Cliente universal |

---

## ✅ Conclusión Fácil de Recordar

1. **Dato ≠ Información** → dato necesita contexto
2. **SGBD解决 archivos** → centraliza y controla
3. **3 niveles ANSI** → externo, conceptual, interno
4. **Independencia** → cambia uno sin afectar otros
5. **Relacional = tablas**, NoSQL = flexible
6. **Elegir herramienta** según el problema

---

> 📚 **Recursos**: "Fundamentals of Database Systems" - Elmasri y Navathe, "Database Design for Mere Mortals" - Hernandez, SQLZoo.net