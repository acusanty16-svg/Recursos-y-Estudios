# Tema 1: Fundamentos de los Sistemas Operativos

## 📌 Resumen Rápido

Un **Sistema Operativo (SO)** es el software fundamental que gestiona hardware y software, actuando como intermediario entre usuario y máquina. Se clasifica por **licencia** (libre/propietario) y por **uso** (escritorio, servidor, móvil). La elección depende de las necesidades específicas.

---

## 1. Concepto de Sistema Operativo (Sesión 1)

### ¿Qué es un SO?

Software fundamental que gestiona:

- **Hardware**: CPU, memoria, almacenamiento, periféricos
- **Software**: aplicaciones y procesos
- **Usuario**: interfaz para interactuar con el ordenador

Sin SO, un ordenador es **inútil**.

### Funciones del SO

| Función | Descripción |
|---------|-------------|
| **Gestión de recursos** | Asigna CPU, memoria, disco |
| **Interfaz de usuario** | Permite interacción (gráfica/texto) |
| **Gestión de archivos** | Organiza datos en sistema de archivos |
| **Seguridad** | Controla acceso y protege datos |

---

## 2. Tipos de Sistemas Operativos (Sesión 1)

### Por Licencia

| Tipo | Descripción | Ejemplos |
|------|-------------|----------|
| **Libre** | Código abierto, puede modificarse | Linux, Ubuntu |
| **Propietario** | Código cerrado, restricciones | Windows, macOS |

### Por Uso

| Tipo | Descripción | Ejemplos |
|------|-------------|----------|
| **Escritorio** | Uso personal, interfaz gráfica completa | Windows 11, macOS |
| **Servidor** | Gestión de redes y servicios | Windows Server, Ubuntu Server |
| **Móvil** | Smartphones y tablets | Android, iOS |

---

## 3. Licencias de Software (Sesión 2)

### Tipos de Licencias

```
LICENCIAS
├── Libre (GPL)
│   └── Libertad: usar, estudiar, modificar, compartir
│
└── Propietario
    ├── OEM (ligada al hardware, preinstalada)
    └── Retail (comprada por separado, transferible)
```

### GPL (General Public License)

- Garantiza **4 libertades**:
  - Usar el programa
  - Estudiar el código fuente
  - Modificarlo
  - Distribuir copias

### Licencia OEM

- Preinstalada en ordenador nuevo
- **Ligada al hardware** - muere si cambias主板
- No transferible

### Licencia Retail

- Comprada independientemente
- **Transferible** a otro ordenador
- Más cara pero más flexible

---

## 4. Elección del SO según Uso (Sesión 3)

### Por Contexto

| Contexto | Prioridad | SO Recomendado |
|----------|-----------|---------------|
| **Personal** | Facilidad, multimedia, juegos | Windows, macOS |
| **Empresarial** | Seguridad, gestión, soporte | Windows Enterprise, Linux |
| **Servidor** | Estabilidad, eficiencia, CLI | Linux Server |

### Ejemplos por Sector

| Uso | SO Ideal | Reasons |
|-----|-----------|---------|
| Desarrollo | Linux/Ubuntu | Terminal, servidores |
| Diseño gráfico | macOS | Color gestión |
| Gaming | Windows | Compatibilidad |
| Servidor web | Linux | Estabilidad, bajo coste |

---

## 📚 Case Study

### Red Hat

- RHEL (Red Hat Enterprise Linux) basado en Linux (libre)
- Modelo de negocio: suscripción por soporte
- Ejemplo de Software libre con modelo comercial exitoso

### Canonical (Ubuntu)

- Distribuidor bajo GPL
- Gana dinero con soporte profesional y servicios cloud

---

## 🧠 Conceptos Clave para Examen

1. **SO = gestor de hardware y software**
2. **Libre vs Propietario** = código abierto vs cerrado
3. **Linux** = núcleo libre, cientos de distribuciones
4. **GPL** = garantiza 4 libertades
5. **OEM** = preinstalada, ligada al hardware
6. **Retail** = comprada, transferible
7. **Escritorio** = uso personal
8. **Servidor** = estabilidad, CLI
9. **Móvil** = Android, iOS
10. **Elección depende del uso**

---

## ✅ Resumen Visual

```
Sistemas Operativos
├── Por Licencia
│   ├── Libre (GPL)
│   │   └── Linux, Ubuntu, Fedora
│   └── Propietario
│       ├── OEM (ligada hardware)
│       └── Retail (transferible)
│
└── Por Uso
    ├── Escritorio (Windows, macOS)
    ├── Servidor (Linux Server, Windows Server)
    └── Móvil (Android, iOS)

Elección según contexto
├── Personal → Facilidad, multimedia
├── Empresarial → Seguridad, gestión
└── Servidor → Estabilidad, eficiencia
```

---

## ⚠️ Errores Comunes

| Error | Realidad |
|-------|----------|
| "Linux no es profesional" | 90% servidores web usan Linux |
| "Solo hay un Linux" | Hay cientos de distribuciones |
| "OEM = Retail" | OEM no es transferible |
| "Software libre = gratis" | Libre ≠ gratis (libertad) |

---

## ✅ Conclusión Fácil de Recordar

1. **SO = intermediario usuario-máquina**
2. **Linux = libre y profesional**
3. **GPL = freedoms (usar, estudiar, modificar, compartir)**
4. **OEM =-barata pero tied al hardware**
5. **Retail = cara pero transferible**
6. **Elegir según necesidades** - no hay "el mejor"
7. **Servidores = Linux dominate**
8. **TCO = coste total**, no solo licencia

---

> 📚 **Recursos**: "Sistemas Operativos Modernos" - Tanenbaum, DistroWatch, VirtualBox