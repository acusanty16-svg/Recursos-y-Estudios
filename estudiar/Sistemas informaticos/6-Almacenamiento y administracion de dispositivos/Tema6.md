# Tema 6: Almacenamiento, Virtualización y Contenedores

## 📌 Resumen Rápido

Este tema cubrealmacenamiento avanzado (**RAID**), **backups** y **virtualización** con **contenedores Docker**. Se explican los niveles de RAID (0, 1, 5, 10), estrategias de backup (regla 3-2-1), hipervisores (VMware, VirtualBox, Hyper-V, Proxmox) y contenedores Docker.

---

## 1. RAID: Niveles 0, 1, 5, 10 (Sesión 20)

### ¿Qué es RAID?

**RAID** (Redundant Array of Independent Disks) combina múltiples discos en una unidad lógica para mejorar rendimiento o redundancia.

### Niveles de RAID

| Nivel | Descripción | Mín. Discos | Rendimiento | Redundancia | Capacidad |
|-------|------------|--------------|------------|-------------|-----------|
| **RAID 0** | Striping (datos repartidos) | 2 | Muy alto | ❌ Ninguna | 100% |
| **RAID 1** | Mirroring (duplicación) | 2 | Medio | ✅ 1 disco | 50% |
| **RAID 5** | Striping + paridad | 3 | Medio-alto | ✅ 1 disco | (n-1) |
| **RAID 6** | Paridad dual | 4 | Medio-alto | ✅ 2 discos | (n-2) |
| **RAID 10** | RAID 1+0 (mirroring + striping) | 4 | Muy alto | ✅ 1 disco por grupo | 50% |

### Comparación Práctica

| Uso | RAID Recomendado |
|-----|-------------|
| Máximo rendimiento | RAID 0 |
| Máxima seguridad | RAID 1 o RAID 10 |
| Equilibrio rendimiento/seguridad | RAID 5 o RAID 10 |
| Servidor de archivos | RAID 5 o RAID 6 |

### RAID por Hardware vs Software

| Tipo | Descripción | Ventajas | Desventajas |
|------|-------------|---------|------------|
| **Hardware** | Tarjeta controladora dedicada | Mejor rendimiento | Más caro |
| **Software** | SO gestiona (mdadm, Storage Spaces) | Barato, flexible | Usa CPU del sistema |

### Tips Importantes

- **RAID no es backup**: Protege contra fallo de disco, no contra borrado accidental o virus
- **Monitoriza la salud**: Recibir alertas si un disco falla
- **Reconstruir asap**: Reemplazar disco fallido inmediatamente
- **RAID 5 con discos grandes**: Tiempo de reconstrucción largo = riesgo

### Caso Práctico: Capacidad

```
4 discos de 2 TB:
- RAID 0: 8 TB (sin redundancia)
- RAID 1: 2 TB (mirroring)
- RAID 5: 6 TB (1 disco para paridad)
- RAID 10: 4 TB (2 grupos de 2)
```

---

## 2. Backups: Locales y en la Nube (Sesión 21)

### Estrategia 3-2-1

| Regla | Descripción |
|-------|-------------|
| **3 copias** | De tus datos importantes |
| **2 medios diferentes** | Disco externo, NAS, USB, etc. |
| **1 copia fuera de sitio** | En la nube o ubicación diferente |

### Tipos de Backup

| Tipo | Descripción |
|------|-------------|
| **completo** | Copia completa de todos los datos |
| **Incremental** | Solo cambios desde último backup |
| **Diferencial** | Cambios desde backup completo |
| **Snapshots** | Instantánea del estado actual |

### Herramientas de Backup

| Herramienta | Plataforma | Uso |
|-------------|------------|-----|
| **rsync** | Linux | Backup incremental vía línea de comandos |
| **Veeam** | Windows/Linux | Backup de servidores y VMs |
| **Time Machine** | macOS | Backup automático de Mac |
| **OneDrive/Google Drive** | Multiplataforma | Sincronización de archivos |

### rsync en Linux

```bash
# Backup incremental (solo copia cambios)
rsync -avz / origen/ / destino/

# Con borrado (sincroniza origen y destino)
rsync -avz --delete / origen/ / destino/

# A través de SSH
rsync -avz -e ssh / origen/ usuario@servidor:/destino/
```

### Diferencia: Sincronización vs Backup

| Aspecto | Sincronización | Backup real |
|---------|----------------|-------------|
| Archivo borrado | Se borra en la nube | Se mantiene histórico |
| Ransomware | Se sincroniza malware | Versiones protegidas |
| Versiones | No | Sí (histórico) |

### Cloud Storage

| Servicio | Tipo | Mejor uso |
|----------|------|----------|
| **OneDrive** | Sincronización | Integración Microsoft |
| **Google Drive** | Sincronización | Archivos collaborate |
| **Dropbox** | Sincronización | Compartición fácil |
| **AWS S3** | Almacenamiento | Backup empresarial |

### Mitos y Realidades

| Mito | Realidad |
|------|----------|
| "Sincronización = backup" | Falso. Si borras, se borra en la nube |
| "Snapshots son backups" | Falso. Dependen del disco base |
| "RAID evita backups" | Falso. No protege contra todo |

---

## 3. Virtualización: VMware, VirtualBox, Hyper-V, Proxmox (Sesión 22)

### ¿Qué es la Virtualización?

Crea versiones virtuales de recursos de hardware (CPU, RAM, disco, red).

### Tipos de Hipervisor

| Tipo | Descripción | Ejemplos |安装 |
|------|-------------|---------|-------|
| **Tipo 2 (alojado)** | Ejecuta sobre un SO | VirtualBox, VMware Workstation | SO existente |
| **Tipo 1 (bare-metal)** | Se instala en hardware | VMware ESXi, Hyper-V, Proxmox | Directo en disco |

### Comparación de Hipervisores

| Hipervisor | Tipo | Licencia | Mejor para |
|-----------|------|---------|-----------|
| **VirtualBox** | Tipo 2 | Gratis (GPL) | Laboratorio, pruebas |
| **VMware Workstation** | Tipo 2 | Pago | Desarrollo profesional |
| **Hyper-V** | Tipo 1 | Windows Pro | Entornos Windows |
| **VMware ESXi** | Tipo 1 | Gratuito (free) | Producción |
| **Proxmox VE** | Tipo 1 | Gratis (código abierto) | NAS/virtualización casera |

### Máquina Virtual (VM)

| Componente | Descripción |
|------------|-------------|
| **vCPU** | Núcleos virtuales asignados |
| **vRAM** | Memoria virtual |
| **vDisco** | Archivo imagen (.vmdk, .vhd) |
| **vRed** | Tarjeta de red virtual |

### Configuración Recomendada para VMs

| Uso | RAM | vCPU | Disco |
|-----|-----|------|-------|
| **Linux básico** | 2 GB | 2 | 20-30 GB |
| **Servidor web** | 4 GB | 2-4 | 50 GB |
| **Desktop** | 8+ GB | 4+ | 100+ GB |

### Herramientas de Integración

| Herramienta | Función |
|-------------|---------|
| **Guest Additions** (VirtualBox) | Rendimiento, portapapeles, pantalla automática |
| **VMware Tools** | Rendimiento, drivers, integración |

### Activar Virtualización

En BIOS/UEFI:
- **Intel VT-x** (Intel)
- **AMD-V** (AMD)

### Mitos y Realidades

| Mito | Realidad |
|------|----------|
| "VMs son muy lentas" | Falso. Con VT-x/AMD-V, penalización <5% |
| "Virus en VM infecta anfitrión" | Falso. Aislamiento fuerte |

---

## 4. Contenedores con Docker (Sesión 23)

### ¿Qué es Docker?

Plataforma para crear, desplegar y ejecutar **contenedores** (virtualización a nivel de SO).

### Containers vs VMs

| Aspecto | Máquina Virtual | Contenedor |
|---------|---------------|-----------|
| **Kernel** | Propio (completo) | Comparte kernel del anfitrión |
| **Tamaño** | Gigabytes | Megabytes |
| **Inicio** | Segundos-minutos | Milisegundos |
| **Aislamiento** | Fuerte (propio kernel) | Más débil (comparte kernel) |

### Conceptos Clave

| Término | Descripción |
|---------|-------------|
| **Dockerfile** | Receta para crear una imagen |
| **Imagen** | Plantilla inmutable |
| **Contenedor** | Instancia en ejecución de una imagen |
| **Registro** | Repositorio de imágenes (Docker Hub) |

### Flujo de Trabajo Docker

```
Dockerfile → docker build → Imagen → docker run → Contenedor
```

### Comandos Docker

```bash
# Hello world (verificar instalación)
docker run hello-world

# Ejecutar contenedor Ubuntu interactivo
docker run -it ubuntu bash

# Ver contenedores en ejecución
docker ps

# Ver todos los contenedores
docker ps -a

# Detener contenedor
docker stop contenedor_id

# Eliminar contenedor
docker rm contenedor_id

# Eliminar imagen
docker rmi imagen_id
```

### Docker Hub

Registro público con miles de imágenes oficiales:
- ubuntu, debian, alpine
- nginx, apache
- mysql, postgresql, mongodb
- node, python, java

### Docker Compose

Archivo YAML para aplicaciones multi-contenedor:

```yaml
version: '3'
services:
  web:
    image: nginx
    ports:
      - "80:80"
  db:
    image: mysql
    environment:
      MYSQL_ROOT_PASSWORD: password
```

### Mitos y Realidades

| Mito | Realidad |
|------|----------|
| "Docker es solo para Linux" | Falso. Ejecuta en Windows/macOS con VM Linux ringan |
| "Contenedores = VMs" | Falso. Comparten kernel, menos aislamiento |
| "Contenedores no necesitan seguridad" | Falso. VulnerabilidadesPueden afectar al anfitrión |

---

## 🧠 Conceptos Clave para Examen

1. **RAID 0**: Rendimiento, sin redundancia
2. **RAID 1**: Mirroring, redundancia
3. **RAID 5**: Equilibrio rendimiento/seguridad
4. **RAID 10**: Mejores rendimiento y redundancia
5. **RAID no es backup**: No protege contra todo
6. **Regla 3-2-1**: 3 copias, 2 medios, 1 fuera
7. **rsync**: Backup incremental en Linux
8. **Sincronización ≠ backup**: Diferencias importantes
9. **Hipervisor Tipo 2**: Sobre SO (VirtualBox)
10. **Hipervisor Tipo 1**: Bare-metal (ESXi, Proxmox)
11. **VT-x/AMD-V**: Virtualización en CPU
12. **Contenedor**: Comparte kernel del SO
13. **Docker**: Plataforma de contenedores más popular
14. **Imagen Docker**: Plantilla inmutable
15. **Dockerfile**: Receta para construir imagen

---

## ✅ Resumen Visual

```
RAID
│
├── Rendimiento puro → RAID 0
├── Seguridad pura → RAID 1
├── Equilibrio → RAID 5
└── Lo mejor de ambos → RAID 10


BACKUP
│
├── Estrategia: 3-2-1
├── Local: rsync, disco externo
├── Nube: OneDrive, Google Drive, AWS S3
└── Verificación: Probar backups regularmente


VIRTUALIZACIÓN
│
├── Tipo 2: VirtualBox, VMware Workstation
├── Tipo 1: ESXi, Hyper-V, Proxmox
└── VMs aíslan sistemas completamente


DOCKER
│
├── Contenedor vs VM: compartir kernel
├── Flujo: Dockerfile → Imagen → Contenedor
├── Docker Hub: repositorio de imágenes
└── Docker Compose: multi-contenedor
```

---

## ⚠️ Errores Comunes

| Error | Realidad |
|-------|----------|
| "RAID = backup" | RAID solo protege contra fallo de disco |
| "Sincronización = backup" | Si borras, se sincroniza |
| "VMs son lentas" | Con virtualización HW, muy rápidas |
| "Virus salta de VM" | Aislamiento fuerte |
| "Contenedores son VMs" | Comparten kernel |

---

## ✅ Conclusión Fácil de Recordar

1. **RAID 0** = velocidad, **RAID 1** = seguridad
2. **RAID 5/10** = compromiso ideal
3. **3-2-1** = estrategia de backup
4. **rsync** = backup incremental Linux
5. **Tipo 1** = bare-metal, **Tipo 2** = alojado
6. **VT-x/AMD-V** = virtualización CPU
7. **Contenedor** = ligero, compartir kernel
8. **Docker** = plataforma contenedores
9. **Imagen** = plantilla inmutable
10. **Dockerfile** = receta para imagen

---

> 📚 **Recursos**: Docker Docs, Proxmox Wiki, Synology Knowledge Base