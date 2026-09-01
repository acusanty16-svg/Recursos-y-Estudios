# Temas a Estudiar - Sistemas Informáticos

## Resultado del examen: 17/30 (57%)

---

## Temas con Fallos (Repasar)

### 1. Abreviación de IPv6
- **Regla 1**: Eliminar ceros a la izquierda en cada grupo (0db8 → db8)
- **Regla 2**: Reemplazar una secuencia contigua de grupos de ceros por `::`
- **Ejemplo**: 2001:0db8:85a3:0000:0000:8a2e:0370:7334 → 2001:db8:85a3::8a2e:370:7334
- **No es**: "2001:db8:85a3:0:0:8a2e:370:7334" (falta ::)

### 2. Windows 11 - Requisitos de instalación
- **Obligatorio**: UEFI (firmware) + GPT (tabla de particiones)
- **No es**: "BIOS Legacy con tabla de particiones GPT"
- **Razón**: Mayor seguridad, mejor manejo de discos grandes, Secure Boot

### 3. Tabla de particiones para disco > 2 TB
- **Correcta**: GPT (GUID Partition Table)
- **MBR**: Limitado a 2 TB máximo
- **No es**: "FAT32" (es sistema de archivos, no tabla de particiones)

### 4. Linux - Eliminar directorio con contenido
- **Comando correcto**: `rm -r` (recursive)
- **Conforce**: `rm -rf` (peligroso!)
- **rmdir**: Solo elimina directorios vacíos
- **No es**: "rmdir -all"

### 5. Windows - Crear archivo vacío
- **Comando correcto**: `type nul > archivo.txt`
- **No es**: "touch archivo.txt" (comando Linux)
- **Echo**: `echo. > archivo` (crea con salto de línea)

### 6. Sistema de archivos para archivos > 4 GB
- **Correcto**: NTFS (soporta hasta 16 TB por archivo)
- **FAT32**: Limitado a 4 GB por archivo
- **No es**: "ext3" (sistema Linux)

### 7. Característica del software libre
- **Definición**: Código fuente disponible públicamente, permite modificación y redistribución
- **No es**: "Garantía de soporte técnico oficial" ni "no requiere conocimientos técnicos"
- **Nota**: Puede ser de pago (licencias)

### 8. Linux - Manual de comandos
- **Comando correcto**: `man comando`
- **Otros**: `help`, `info`
- **No es**: "help comando" (help es para comandos shell integrados)

### 9. Linux - Eliminar directorio completo
- **Comando correcto**: `rm -rf` (recursive + force)
- **rmdir**: Solo directorios vacíos
- **No es**: "rm -d"

### 10. Permisos octal en Linux
- **Lectura (r)**: 4
- **Escritura (w)**: 2
- **Ejecución (x)**: 1
- **Ejemplo**: chmod 755 → rwxr-xr-x (7=4+2+1, 5=4+1, 5=4+1)
- **No es**: "1" para lectura

### 11. Ver espacio en particiones (Linux)
- **Comando correcto**: `df -h` (disk free, formato legible)
- **Otros**:
  - `ls -la /mnt`: lista contenido
  - `mount`: lista sistemas montados
  - `du`: uso de directorios
- **No es**: "ls -la /mnt"

### 12. Broadcast de subred 192.168.50.12/30
- **Máscara /30**: 4 direcciones por subred
- **Cálculo**:
  - 12 → dirección de red
  - 13, 14 → hosts utilizables
  - 15 → broadcast
- **No es**: "192.168.50.12"

### 13. Windows - Ver contenido de archivo
- **Comando correcto**: `type archivo.txt`
- **Equivalente Linux**: `cat`
- **No es**: "cat" (es Linux), "show", "display"

---

## Temas dominados

- **Virtualización**: Requiere más recursos del sistema anfitrión
- **Máscara de red**: Separa porción de red de porción de host
- **Máquinas virtuales**: Ejecutar múltiples SO en un mismo hardware
- **Software libre vs código abierto**: No son necesariamente gratuitos
- **Comandos Windows**: rmdir /s, cd, type
- **Comandos Linux**: whoami, rm, ls -a, fsck, cd
- **Permisos**: chmod 755 → rwxr-xr-x
- **Subred /27**: 30 direcciones de host utilizables
- **RAID 5**: Capacidad útil = (n-1) × disco
- **Loopback**: 127.0.0.1

---

## Comandos Clave

### Linux
| Comando | Función |
|---------|---------|
| whoami | Usuario actual |
| ls -a | Lista archivos (incluye ocultos) |
| rm -r | Elimina directorio con contenido |
| rm -rf | Elimina sin confirmación (peligroso) |
| man | Manual de comandos |
| fsck | Verificar/reparar sistema de archivos |
| df -h | Espacio en particiones |
| chmod | Permisos |

### Windows
| Comando | Función |
|---------|---------|
| cd | Cambiar directorio |
| type | Ver contenido archivo |
| rmdir /s | Eliminar directorio completo |
| type nul > | Crear archivo vacío |

### Permisos Octal
- 4 = Lectura (r)
- 2 = Escritura (w)
- 1 = Ejecución (x)
- 7 = rwx, 5 = r-x, 4 = r--

---

## Conceptos Clave

### IPv6
- Forma abreviada: eliminar ceros izquierda, :: para secuencia de ceros

### Windows 11
- Requiere: UEFI + GPT (no Legacy + MBR)

### Discos > 2 TB
- GPT obligatorio (MBR limitado a 2 TB)

### Archivos > 4 GB
- NTFS obligatorio (FAT32 limitado a 4 GB)

### Subredes
- /27 → 32 direcciones, 30 usable → broadcast en dirección 31

### RAID 5
- Capacidad = (n-1) × disco
- 4 discos de 2 TB = 6 TB útiles

---

## Errores Comunes

| Concepto | Correcto | Incorrecto |
|----------|----------|------------|
| IPv6 abreviado | :: para secuencia ceros | 0:0 |
| Windows 11 | UEFI + GPT | BIOS Legacy + GPT |
| Disco >2TB | GPT | FAT32 |
| Linux eliminar dir | rm -r | rmdir -all |
| Windows crear vacío | type nul > | touch |
| Archivo >4GB | NTFS | ext3 |
| Software libre | Código disponible | Garantía soporte |
| Manual Linux | man | help |
| Eliminar dir Linux | rm -rf | rm -d |
| Lectura permisos | 4 | 1 |
| Ver espacio | df -h | ls -la /mnt |
| Broadcast /30 | .15 | .12 |
| Windows ver archivo | type | cat |

---

## Notas del Examen

- Tuviste 13 fallos (57%) - Repasar muchos comandos y conceptos de sistemas
- Temas críticos: Linux/Windows CLI, permisos, redes (IPv6, subredes), particiones
- Repasar: Comandos esenciales de ambos sistemas operativos