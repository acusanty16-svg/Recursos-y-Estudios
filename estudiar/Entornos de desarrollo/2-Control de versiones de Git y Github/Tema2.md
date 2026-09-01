# Tema 2: Control de Versiones con Git y GitHub

## 📌 Resumen Rápido

Git es un sistema de control de versiones **distribuido** que permite gestionar cambios en el código y trabajar en equipo sin depender de un servidor central. Cada desarrollador tiene una copia completa del repositorio.

---

## 1. Conceptos Básicos de Git

### ¿Qué es Git?

Sistema de control de versiones **distribuido**:
- Cada programador tiene una copia completa del repositorio (archivos + historial)
- Se puede trabajar SIN conexión a internet
- Garantiza trazabilidad total de cambios

### Repositorio (Repo)

Espacio donde se almacena todo el proyecto y su historial.

| Tipo | Descripción |
|------|-------------|
| **Local** | Guardado en tu equipo (carpeta del proyecto) |
| **Remoto** | Servidores en la nube (GitHub, GitLab, Bitbucket) |

### Commit

Confirmación de cambios = "fotografía" del código en un momento específico.
- Guarda el estado exacto del código
- Incluye un mensaje descriptivo
- Ejemplo: "Añadir función de login" o "Corrige error en validación"

### Historial

Secuencia de todos los commits del proyecto:
- Muestra **quién** hizo el cambio
- Muestra **cuándo**
- Muestra **por qué** (mensaje del commit)

> **IMPORTANTE**: Permite revisar, comparar o restaurar estados anteriores

---

## 2. Comandos Esenciales de Git

### Flujo Básico de Trabajo

```
git init          → Crear/iniciar un repositorio
git add          → Añadir archivos al área de preparación (staging)
git commit       → Confirmar cambios (guardar versión)
git push         → Enviar cambios al repositorio remoto
git pull         → Descargar cambios del repositorio remoto
```

### Comandos en Orden

| Comando | Función | Ejemplo |
|---------|---------|--------|
| `git init` | Inicializa un repositorio nuevo | `git init` |
| `git add <archivo>` | Prepara un archivo específico | `git add index.html` |
| `git add .` | Prepara todos los archivos | `git add .` |
| `git commit -m "mensaje"` | Confirma cambios con mensaje | `git commit -m "Añade función suma"` |
| `git push origin main` | Sube al remoto | `git push origin main` |
| `git pull origin main` | Descarga del remoto | `git pull origin main` |

### Comandos Útiles Adicionales

| Comando | Función |
|---------|--------|
| `git status` | Ver qué archivos han cambiado |
| `git log` | Ver historial de commits |
| `git log --oneline` | Historial breve (una línea por commit) |
| `git diff` | Ver diferencias entre archivos |
| `.gitignore` | Archivo para ignorar archivos (node_modules, logs, etc.) |

> **CONSEJO**: Siempre usa `git status` antes de hacer commit para ver qué ha cambiado

---

## 3. Ramas (Branches)

### ¿Qué es una Rama?

Una **rama** es una línea de desarrollo independiente que permite:
- Desarrollar nuevas funcionalidades sin afectar la versión principal
- Corregir errores sin romper el código funcional
- Trabajar en paralelo en diferentes características

### Comandos de Ramas

| Comando | Función |
|---------|--------|
| `git branch` | Listar ramas existentes |
| `git checkout -b nombre-rama` | Crear y cambiar a una nueva rama |
| `git checkout nombre-rama` | Cambiar a una rama existente |
| `git merge nombre-rama` | Fusionar una rama con la actual |

### Estrategias de Ramas

#### GitHub Flow
1. Crear rama para cada funcionalidad
2. Trabajar en la rama
3. Hacer pull request
4. Revisar código
5. Fusionar con main

#### Ramas de Emergencia (Hotfix)
- Para arreglos urgentes en producción
- Se crea desde main
- Se fusiona inmediatamente después de resolver

---

## 4. Resolución de Conflictos

### ¿Cuándo ocurre un conflicto?

Cuando dos personas modifican las **mismas líneas** de un archivo y Git no puede fusionar automáticamente.

### Cómo identificar conflictos

Git marca el conflicto así:
```
<<<<<<< HEAD
 Código de la rama actual
=======
 Código de la otra rama
>>>>>>> nombre-rama
```

### Pasos para resolver

1. **Identificar** los archivos en conflicto
2. **Editar** eliminando las marcas y dejando el código correcto
3. **Guardar** el archivo
4. **Hacer commit** de la resolución

> **CONSEJO**: Usa herramientas visuales como VS Code o GitKraken para resolver conflictos más fácil

---

## 🧠 Conceptos Clave para Examen

1. **Git = sistema de control de versiones distribuido**
2. **Repositorio = espacio del proyecto + historial**
3. **Commit = fotografía del código en un momento**
4. **Flujo**: `git init` → `git add` → `git commit` → `git push`
5. **Ramas = líneas de desarrollo independientes**
6. **Merge = fusionar ramas**
7. **Conflictos = misma línea modificada por dos personas**
8. **.gitignore = archivos que Git debe ignorar**

---

## 💻 Comandos Prácticos Resumen

```bash
# Iniciar repositorio
git init

# Ver estado
git status

# Añadir todos los archivos
git add .

# Confirmar cambios
git commit -m "Mensaje claro"

# Subir al remoto
git push origin main

# Descargar cambios
git pull origin main

# Crear rama y cambiar
git checkout -b feature/nueva-funcionalidad

# Fusionar rama
git merge nombre-rama
```

---

## ✅ Conclusión Fácil de Recordar

1. **Git permite trabajar en equipo** sin overwrite accidental
2. **Commit = "guardar partida"** del proyecto
3. **Ramas = aislar trabajo** para no romper main
4. **Conflictos son normales** → se resuelven editando
5. **GitHub = repositorio remoto** para cooperar online

---

> 📚 **Recursos recomendados**: Pro Git (libro gratuito), Learn Git in a Month of Lunches