# Tema 2: Linux - Fundamentos y Comandos Básicos

## 📌 Resumen Rápido

**Linux** es un kernel (núcleo) sobre el cual se construyen distribuciones. Su estructura es modular: Hardware → Kernel → Shell → Aplicaciones. Los comandos básicos permiten **navegar**, **manipular archivos** y **gestionar procesos** desde la terminal.

---

## 1. Kernel y Estructura de Linux (Sesión 4)

### ¿Qué es el Kernel?

El **kernel** es el núcleo del sistema operativo que gestiona los recursos del hardware y permite la comunicación entre software y hardware.

### Estructura de Linux

```
┌─────────────────────────────────────────┐
│         Aplicaciones / Entorno Gráfico   │
├─────────────────────────────────────────┤
│              Shell (Bash, Zsh)           │
├─────────────────────────────────────────┤
│              Kernel (Linux)              │
├─────────────────────────────────────────┤
│              Hardware                    │
└─────────────────────────────────────────┘
```

### Componentes

| Componente | Descripción |
|------------|-------------|
| **Hardware** | Componentes físicos del equipo |
| **Kernel** | Núcleo que gestiona recursos |
| **Shell** | Intérprete de comandos (Bash, Zsh) |
| **Aplicaciones** | Programas y entorno gráfico |

### Diferencias con Windows

| Aspecto | Linux | Windows |
|---------|-------|----------|
| **Tipo** | Libre y modular | Propietario y cerrado |
| **Estructura** | Kernel + herramientas + shell | Integrado |
| **Personalización** | Muy alta | Limitada |
| **Actualizaciones** | Usuario controla | Centralizadas |

### Distribuciones (Distros)

| Distribución | Descripción |
|--------------|-------------|
| **Ubuntu** | Popular, fácil de usar |
| **Debian** | Estable, base de muchas otras |
| **Fedora** | Moderna, comunidad Red Hat |
| **Red Hat Enterprise** | Empresarial, soporte comercial |

> **DATO**: Linux = kernel. Hay cientos de distribuciones que lo incluyen.

---

## 2. Comandos de Navegación (Sesión 5)

### Comandos Esenciales

| Comando | Función | Ejemplo |
|---------|---------|---------|
| **pwd** | Muestra ruta actual | `pwd` |
| **ls** | Lista archivos | `ls`, `ls -l`, `ls -a` |
| **cd** | Cambia directorio | `cd /home/usuario` |
| **cat** | Muestra contenido archivo | `cat archivo.txt` |
| **less** | Muestra por páginas | `less archivo.txt` |

### Opciones Útiles de ls

| Opción | Función |
|--------|---------|
| `-l` | Lista detallada |
| `-a` | Muestra archivos ocultos |
| `-h` | Tamaños legibles (KB, MB) |
| `-lh` | Combinación útil |

### Ejemplos Prácticos

```bash
# Ver dónde estás
pwd

# Ver contenido actual
ls

# Ver contenido detallado
ls -lh

# Entrar en carpeta
cd Documentos

# Volver al directorio anterior
cd ..

# Ver contenido de archivo
cat notas.txt

# Ver archivo largo por páginas
less syslog
```

---

## 3. Manipulación de Archivos (Sesión 6)

### Comandos de Gestión

| Comando | Función | Ejemplo |
|---------|---------|---------|
| **cp** | Copiar | `cp archivo.txt copia.txt` |
| **mv** | Mover/Renombrar | `mv viejo.txt nuevo.txt` |
| **rm** | Eliminar | `rm archivo.txt` |
| **mkdir** | Crear directorio | `mkdir carpeta` |
| **tar** | Comprimir/Extraer | `tar -cvf backup.tar carpeta/` |

### Opciones Importantes

| Comando | Opción | Función |
|---------|---------|---------|
| `cp` | `-r` | Copia recursiva (carpetas) |
| `cp` | `-i` | Pide confirmación |
| `mv` | `-i` | Pide confirmación |
| `rm` | `-r` | Elimina recursivo |
| `rm` | `-i` | Pide confirmación |
| `tar` | `-x` | Extraer |
| `tar` | `-v` | Verbose (muestra qué hace) |

### Ejemplos Prácticos

```bash
# Copiar archivo
cp documento.txt /home/usuario/Documentos/

# Copiar carpeta
cp -r carpeta/ destino/

# Mover archivo
mv archivo.txt /home/usuario/Escritorio/

# Renombrar archivo
mv viejo.txt nuevo.txt

# Crear carpeta
mkdir proyectos

# Eliminar archivo
rm archivo.txt

# Eliminar carpeta
rm -r carpeta/

# Comprimir carpeta
tar -cvf backup.tar proyectos/

# Extraer archivo tar
tar -xvf backup.tar
```

> **⚠️ ATENCIÓN**: `rm` no tiene papelera. Usar con cuidado.

---

## 4. Procesos y Monitorización (Sesión 7)

### ¿Qué es un Proceso?

Programa en ejecución que usa CPU, memoria y recursos.

### Comandos de Procesos

| Comando | Función |
|---------|---------|
| **ps** | Lista procesos estática |
| **top** | Monitor en tiempo real |
| **htop** | Versión mejorada de top (visual) |
| **pstree** | Árbol jerárquico de procesos |

### Ejemplos de Uso

```bash
# Ver todos los procesos
ps aux

# Ver procesos en tiempo real
top

# Instalar y usar htop (más visual)
sudo apt install htop
htop

# Ver árbol de procesos
pstree

# Ver procesos de un usuario
top -u nombre_usuario

# Buscar proceso específico
ps aux | grep apache

# Terminar proceso (por PID)
kill 3245

# Terminar todos los procesos de un nombre
killall nombre_proceso
```

### Guía Rápida de top/htop

| Tecla/Función | Acción |
|---------------|--------|
| `q` | Salir |
| `k` | Matar proceso |
| `F` | Ordenar por campo |
| `u` | Filtrar por usuario |

---

## 🧠 Conceptos Clave para Examen

1. **Kernel** = núcleo de Linux
2. **Shell** = intérprete de comandos
3. **Distribuciones** = Ubuntu, Debian, Fedora, Red Hat
4. **pwd** = mostrar directorio actual
5. **ls** = listar archivos
6. **cd** = cambiar directorio
7. **cp** = copiar (-r para carpetas)
8. **mv** = mover o renombrar
9. **rm** = eliminar (sin papelera)
10. **mkdir** = crear carpeta
11. **tar** = comprimir/agrupar archivos
12. **ps** = lista de procesos
13. **top** = monitor en tiempo real
14. **htop** = top visual e interactivo
15. **pstree** = árbol de procesos

---

## ✅ Resumen Visual

```
Estructura Linux
├── Hardware
├── Kernel (núcleo)
├── Shell (Bash)
└── Aplicaciones

Comandos Navegación
├── pwd (dónde estoy)
├── ls (qué hay)
├── cd (ir a)
├── cat (ver contenido)
└── less (ver por páginas)

Manipulación Archivos
├── cp (copiar)
├── mv (mover/renombrar)
├── rm (eliminar)
├── mkdir (crear carpeta)
└── tar (comprimir)

Procesos
├── ps (lista estática)
├── top (tiempo real)
├── htop (visual)
└── pstree (árbol)
```

---

## ⚠️ Errores Comunes

| Error | Realidad |
|-------|----------|
| "Linux no tiene interfaz" | Tiene entornos gráficos (GNOME, KDE) |
| "rm tiene papelera" | No hay recuperación fácil |
| "Solo para expertos" | Comandos básicos son fáciles |

---

## ✅ Conclusión Fácil de Recordar

1. **Linux = kernel + herramientas + shell**
2. **pwd/ls/cd** = navegar
3. **cp/mv/rm** = copiar/mover/eliminar
4. **tar** = comprimir archivos
5. **ps/top/htop** = monitorizar procesos
6. **kill** = terminar proceso
7. **Terminal = poder y velocidad**

---

> 📚 **Recursos**: "The Linux Command Line" - William Shotts, DistroWatch

---

## 📋 Guía Completa de Comandos Linux

### Comandos de Navegación y Archivos

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `ls` | Lista archivos y carpetas | `ls`, `ls -l`, `ls -lh`, `ls -a` |
| `pwd` | Muestra la ruta actual | `pwd` |
| `cd` | Cambia de directorio | `cd /home/usuario`, `cd ..`, `cd -` |
| `cat` | Muestra contenido de un archivo | `cat archivo.txt` |
| `less` | Visualiza archivos por páginas | `less archivo.log` |
| `touch` | Crea archivos vacíos o actualiza fechas | `touch nuevo.txt` |
| `head` | Muestra las primeras líneas de un archivo | `head -n 10 archivo.txt` |
| `tail` | Muestra las últimas líneas (útil para logs) | `tail -f /var/log/syslog` |

### Comandos de Manipulación

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `cp` | Copia archivos o carpetas | `cp origen destino`, `cp -r carpeta/` |
| `mv` | Mueve o renombra archivos | `mv viejo.txt nuevo.txt` |
| `rm` | Elimina archivos o carpetas | `rm archivo.txt`, `rm -r carpeta/` |
| `mkdir` | Crea un directorio nuevo | `mkdir carpeta` |
| `rmdir` | Elimina un directorio vacío | `rmdir carpeta` |
| `tar` | Comprime o descomprime archivos | `tar -czvf archivo.tar.gz carpeta/` |

### Comandos de Procesos y Sistema

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `ps` | Muestra procesos activos | `ps aux` |
| `top` | Monitorea recursos en tiempo real | `top` |
| `htop` | Versión visual de top (más intuitiva) | `htop` |
| `pstree` | Muestra procesos en forma de árbol | `pstree` |
| `kill` | Termina un proceso por PID | `kill 3245` |
| `killall` | Termina todos los procesos de un nombre | `killall chrome` |

### Comandos de Búsqueda

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `find` | Busca archivos y carpetas | `find /home -name "*.txt"` |
| `grep` | Busca texto dentro de archivos | `grep "error" log.txt` |
| `locate` | Busca archivos en base de datos | `locate archivo.txt` |

### Comandos de Permisos

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `chmod` | Cambia permisos de archivos | `chmod 755 script.sh` |
| `chown` | Cambia propietario de archivos | `chown usuario:grupo archivo` |

### Comandos de Información del Sistema

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `df` | Muestra espacio libre en discos | `df -h` |
| `du` | Muestra el tamaño de archivos o carpetas | `du -sh carpeta/` |
| `free` | Muestra memoria RAM disponible | `free -h` |
| `uname` | Muestra información del sistema | `uname -a` |
| `whoami` | Muestra el usuario actual | `whoami` |
| `man` | Muestra el manual de un comando | `man ls` |

### Comandos de Paquetes (Debian/Ubuntu)

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `apt-get` | Gestor de paquetes | `sudo apt-get install htop` |
| `apt update` | Actualiza lista de paquetes | `sudo apt update` |
| `apt upgrade` | Instala actualizaciones | `sudo apt upgrade` |
| `apt install` | Instala un paquete | `sudo apt install htop` |
| `apt remove` | Elimina un paquete | `sudo apt remove htop` |

### Comandos Varios

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `sudo` | Ejecuta comandos con privilegios de administrador | `sudo apt update` |
| `history` | Muestra el historial de comandos | `history` |
| `clear` | Limpia la pantalla de la terminal | `clear` |
| `echo` | Imprime texto o variables | `echo "Hola Mundo"` |
| `date` | Muestra la fecha y hora actual | `date` |
| `cal` | Muestra un calendario | `cal` |
| `exit` | Cierra la terminal | `exit` |
| `pwd` | Muestra el directorio actual | `pwd` |

---

## 🔑 Comandos Esenciales por Categoría

### navigation: Navegación
- `pwd` → Mostrar ruta actual
- `ls` → Listar archivos
- `cd` → Cambiar directorio

### files: Archivos
- `touch` → Crear archivo
- `cat` / `less` → Ver contenido
- `cp` → Copiar
- `mv` → Mover/Renombrar
- `rm` → Eliminar

### directories: Directorios
- `mkdir` → Crear
- `rmdir` → Eliminar vacío

### permissions: Permisos
- `chmod` → Cambiar permisos
- `chown` → Cambiar propietario

### processes: Procesos
- `ps` → Ver procesos
- `top` / `htop` → Monitor en tiempo real
- `kill` → Terminar proceso

### search: Búsqueda
- `find` → Buscar archivos
- `grep` → Buscar texto
- `locate` → Búsqueda rápida

### system: Sistema
- `df` → Espacio en disco
- `du` → Tamaño de carpetas
- `free` → Memoria RAM
- `uname` → Info del sistema

### packages: Paquetes
- `apt update` → Actualizar lista
- `apt upgrade` → Actualizar sistema
- `apt install` → Instalar programa