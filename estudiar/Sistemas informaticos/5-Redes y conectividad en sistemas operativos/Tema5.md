# Tema 5: Redes y Conectividad - Almacenamiento

## 📌 Resumen Rápido

Este tema cubre dos áreas fundamentales: **seguridad en redes** (WPA2/WPA3, VPN, firewalls) y **almacenamiento** (HDD, SSD, NVMe, Cloud). También se explicam los **sistemas de archivos** (NTFS, EXT4, APFS, ZFS, Btrfs) y herramientas avanzadas como **LVM** para gestionar almacenamiento de forma flexible.

---

## 1. Seguridad en Redes (Sesión 16)

### Estándares WiFi

| Estándar | Descripción | Seguridad |
|----------|-------------|-----------|
| **WPA** | Primer estándar | Básico |
| **WPA2** | Estándar durante años | Fuerte |
| **WPA3** | Más moderno y seguro | Muy fuerte |

### VPN (Virtual Private Network)

**¿Qué es?** Creates an encrypted tunnel through internet to protect your traffic.

**Usos:**
- Proteger privacidad en WiFi públicas
- Acceder a recursos de red corporativa
- Evitar restricciones geográficas

### Firewall

| Tipo | Descripción |
|------|-------------|
| **Hardware** | Dispositivo físico |
| **Software** | Programa en el SO |

**Funciones:**
- Monitorizar tráfico de red
- Bloquear conexiones no autorizadas
- Filtrar según reglas

### Herramientas en Linux

```bash
# Activar UFW (Uncomplicated Firewall)
sudo ufw enable

# Permitir SSH
sudo ufw allow ssh

# Ver estado
sudo ufw status

# Denegar todo por defecto
sudo ufw default deny
```

### Tips de Seguridad

1. **Usar WPA3** si está disponible
2. **VPN de confianza** con política no-logs
3. **Denegar por defecto** en firewalls
4. **No usar WiFi público** sin VPN

### Mitos y Realidades

| Mito | Realidad |
|-------|---------|
| "WiFi pública con HTTPS es segura" | Una VPN protege TODO el tráfico |
| "Firewall solo para empresas" | Todos los SO tienen firewall |

---

## 2. Tipos de Almacenamiento (Sesión 17)

### Comparación de Discos

| Tipo | Tecnología | Velocidad | Uso Principal |
|------|-------------|-----------|---------------|
| **HDD** | Mecánico | Lenta (100-150 MB/s) | Almacenamiento masivo |
| **SSD** | Flash NAND | Rápida (500-550 MB/s) | SO y aplicaciones |
| **NVMe** | Flash PCIe | Muy rápida (3-7 GB/s) | Rendimiento máximo |

### HDD (Hard Disk Drive)

- Platos magnéticos giratorios
- Cabezal de lectura/escritura
- Precio bajo por GB
- Más frágil a golpes

### SSD (Solid-State Drive)

- Memoria flash NAND
- Sin partes móviles
- Más rápido y duradero
- Precio más alto

### NVMe (Non-Volatile Memory Express)

- Conecta directamente a PCIe
- Mucho más rápido que SSD SATA
- Latencia muy baja
- Ideal para gaming, edición video

### Cloud Storage

| Servicio | Descripción |
|----------|-------------|
| Google Drive | Almacenamiento en línea |
| Dropbox | Sincronización archivos |
| OneDrive | Integración Microsoft |
| AWS S3 | Almacenamiento empresarial |

### Combinación Recomendada

```
SSD NVMe → Sistema operativo y programas
HDD grande → Archivos grandes (películas, juegos)
Cloud → Backup y acceso remoto
```

### Tips

- **No desfragmentar SSD**: Innecesario y reduce vida útil
- **Regla 3-2-1 de backup**: 3 copias, 2 medios, 1 fuera de sitio
- **CrystalDiskInfo**: Para verificar salud del disco

### Mitos y Realidades

| Mito | Realidad |
|------|----------|
| "SSD寿命短" | Duran muchos años con wear leveling |
| "Cloud es 100% seguro" | Siempre hacer backups locales |

---

## 3. Sistemas de Archivos (Sesión 18)

### Por Sistema Operativo

| SO | Sistema de Archivos |
|----|---------------------|
| Windows | NTFS |
| Linux | EXT4, Btrfs |
| macOS | APFS |

### Sistemas de Archivos Principales

| Sistema | Características |
|---------|-----------------|
| **NTFS** | Permisos, compresión, journaling |
| **EXT4** | Estable, fiable, estándar Linux |
| **APFS** | Optimizado para SSD, snapshots |
| **exFAT** | Compatible entre SO |

### Sistemas Avanzados

| Sistema | Características |
|---------|-----------------|
| **ZFS** | Integridad datos, snapshots, RAID nativo |
| **Btrfs** | Copy-on-Write, snapshots, raid Linux |

### ZFS vs Btrfs

| Característica | ZFS | Btrfs |
|-----------------|-----|------|
| Desarrollo | Sun Microsystems/OpenZFS | Kernel Linux |
| maduración | Más maduro | Más integrado en Linux |
| RAM uso | Alto | Menor |

### Conceptos Clave

- **Journaling**: Registro previo de operaciones
- **Copy-on-Write**: Escribir nuevos datos antes de borrar
- **Snapshots**: Instantáneas del sistema de archivos
- **Bit rot**: Corrupción gradual de datos

### Herramientas

```bash
# Ver sistemas de archivos
df -T

# Crear EXT4
mkfs.ext4 /dev/sdb1

# Crear Btrfs
mkfs.btrfs /dev/sdb1
```

### Mitos y Realidades

| Mito | Realidad |
|------|----------|
| "Todos los FS son iguales" | ZFS tiene protección que otros no tienen |
| "Windows no lee EXT4" | Se puede con ext2fsd o WSL |

---

## 4. Particiones y LVM (Sesión 19)

### Montaje en Linux

En Linux, los sistemas de archivos se **montan en directorios**, no tienen letras de unidad.

```
/ (raíz)
/home (datos de usuario)
/boot (archivos de arranque)
/mnt (montaje temporal)
```

### Concepto de Montaje

```bash
# Montar manualmente
sudo mount /dev/sdb1 /mnt

# Desmontar
sudo umount /mnt
```

### /etc/fstab

Archivo que define qué sistemas de archivos se montan al arrancar.

```
# Formato: dispositivo puntoMontaje tipo opciones dump pass
/dev/sda1 / ext4 defaults 0 1
/dev/sda2 /home ext4 defaults 0 2
```

### LVM (Logical Volume Manager)

**¿Qué es?** Capa de abstracción que permite gestionar almacenamiento de forma flexible.

### Estructura LVM

```
Disco Físico(s)
    ↓
Physical Volume (PV)
    ↓
Volume Group (VG)
    ↓
Logical Volume (LV)
    ↓
Sistema de archivos
```

### Comandos LVM

```bash
# Crear Physical Volume
sudo pvcreate /dev/sdb1

# Crear Volume Group
sudo vgcreate miGrupo /dev/sdb1

# Crear Logical Volume
sudo lvcreate -L 10G -n miVolume miGrupo

# Extender Logical Volume
sudo lvextend -L +5G /dev/miGrupo/miVolume

# Redimensionar sistema de archivos
sudo resize2fs /dev/miGrupo/miVolume
```

### Ventajas de LVM

1. **Redimensionar** volúmenes en caliente
2. **Agrupar** varios discos
3. **Snapshots** de volúmenes
4. **Flexibilidad** sin reinstalar

### Tips

- Usar `/etc/fstab` para montajes automáticos
- LVM tiene impacto mínimo en rendimiento
- Añadir discos sin reinstalar es posible

### Mitos y Realidades

| Mito | Realidad |
|------|----------|
| "LVM ralentiza el disco" | Impacto insignificante |
| "Añadir disco requiere reinstalar" | LVM permite ampliar en caliente |

---

## 🧠 Conceptos Clave para Examen

1. **WPA3**: Estándar WiFi más seguro actual
2. **VPN**: Tunel encriptado para privacidad
3. **Firewall**: Control de tráfico de red
4. **UFW**: Herramienta sencilla para firewall en Linux
5. **HDD**: Mecánico, lento, gran capacidad
6. **SSD**: Flash, rápido, estándar actual
7. **NVMe**: PCIe, muito rápido
8. **NTFS**: Sistema de archivos Windows
9. **EXT4**: Sistema de archivos Linux más común
10. **ZFS**: Sistema avanzado con protección de datos
11. **Btrfs**: Alternativa Linux a ZFS
12. **exFAT**: Compatibilidad entre SO
13. **Montaje**: Acceso a sistema de archivos vía directorio
14. **LVM**: Gestión flexible de volúmenes
15. **/etc/fstab**: Montajes automáticos al iniciar
16. **Snapshot**: Instantánea del sistema de archivos
17. **Copy-on-Write**: Técnica de escritura segura

---

## ✅ Resumen Visual

```
SEGURIDAD EN REDES
│
├── WiFi
│   ├── WPA2 (estándar años)
│   └── WPA3 (más moderno)
│
├── VPN
│   └── Tunel encriptado
│
└── Firewall
    └── Control de tráfico


TIPOS DE ALMACENAMIENTO
│
├── Local
│   ├── HDD (mecánico, lento)
│   ├── SSD (flash, rápido)
│   └── NVMe ( PCIe, muy rápido)
│
└── Remoto
    └── Cloud (Google Drive, Dropbox)


SISTEMAS DE ARCHIVOS
│
├── Windows → NTFS
├── Linux → EXT4, Btrfs
├── macOS → APFS
├── Compartido → exFAT
└── Avanzados → ZFS, Btrfs


LVM
│
├── Physical Volume (PV)
├── Volume Group (VG)
├── Logical Volume (LV)
└── Flexible y redimensionable
```

---

## ⚠️ Errores Comunes

| Error | Realidad |
|-------|----------|
| "WiFi pública con HTTPS es segura" | Una VPN protege TODO |
| "SSD寿命 muy corta" | Duran años gracias a wear leveling |
| "No necesito backup en cloud" | Siempre hacer备份 local |
| "Todos los FS iguales" | ZFS tiene protección única |
| "Windows no lee Linux" | Se puede con herramientas |
| "LVM ralentiza" | Impacto mínimo |
| "Añadir disco = reinstalar" | LVM permite ampliar |

---

## ✅ Conclusión Fácil de Recordar

1. **WPA3** > WPA2 para WiFi
2. **VPN** essential en WiFi público
3. **UFW** = firewall fácil en Linux
4. **SSD** > HDD para velocidad
5. **NVMe** = lo más rápido
6. **NTFS** = Windows, **EXT4** = Linux
7. **ZFS/Btrfs** = protección avanzada
8. **LVM** = almacenamiento flexible
9. **Montaje** = acceder vía directorio
10. **/etc/fstab** = montajes automáticos
11. **Regla 3-2-1** = backup seguro

---

> 📚 **Recursos**: Wiki Arch Linux, Documentación ZFS, UFW Docs