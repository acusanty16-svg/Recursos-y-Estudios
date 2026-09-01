# Tema 3: Instalación y Configuración de SO

## 📌 Resumen Rápido

Antes de instalar un SO hay que verificar **requisitos de hardware** y **compatibilidad de software**. El proceso incluye acceder a **BIOS/UEFI**, crear **medios de instalación** (USB, PXE, cloud-init), realizar el **particionado** y **formateo**, y finalmente configurar **usuarios, red y actualizaciones**.

---

## 1. Requisitos y Compatibilidad Hardware/Software (Sesión 8)

### Verificación Previa a la Instalación

| Componente | Qué Verificar |
|------------|----------------|
| **CPU** | Velocidad, núcleos, arquitectura (x64/x86) |
| **RAM** | Mínima vs recomendada |
| **Espacio en disco** | Capacidad disponible |
| **Drivers** | Compatibilidad con el SO |

### Diferencia entre Requisitos

| Tipo | Descripción |
|------|-------------|
| **Mínimos** | El SO arranca, pero funciona lento |
| **Recomendados** | Rendimiento fluido |

### Compatibilidad de Software

- Aplicaciones críticas que necesitas usar
- Drivers disponibles para el hardware
- Herramientas de diagnóstico: "Can You RUN It"

### Tips

- **Live USB**: Arrancar Linux desde USB sin instalar para probar compatibilidad
- **WSL**: Si necesitas Linux pero debes usar Windows

> ⚠️ Los requisitos mínimos suelen ser insuficentes para uso fluido.

---

## 2. Preparación de Hardware: BIOS/UEFI (Sesión 9)

### ¿Qué es BIOS/UEFI?

| Término | Definición |
|---------|------------|
| **BIOS** | Firmware básico, antiguo |
| **UEFI** | Sucesor moderno de BIOS |

### Diferencias BIOS vs UEFI

| Característica | BIOS | UEFI |
|-----------------|------|------|
| Interfaz | Texto | Gráfica |
| Soporte discos >2TB | No | Sí |
| Arranque rápido | No | Sí |
| Secure Boot | No | Sí |

### Configuración en BIOS/UEFI

1. **Orden de arranque** (Boot Order): Definir desde dónde inicia
2. **Secure Boot**: Protege contra malware de bajo nivel
3. **Virtualización**: Habilitar si se necesita
4. **Perfiles de energía**: Ajustar rendimiento

### Acceso a BIOS/UEFI

- **Teclas comunes**: F2, F10, F12, Supr (Del)
- DuringArrancar desde USB: pulsar la tecla durante el POST

### Secure Boot

- Estándar de industria, no es solo de Microsoft
- Las distribuciones Linux modernas lo soportan
- Algunos sistemas pueden requerir desactivarlo

---

## 3. Creación de Medios de Instalación (Sesión 10)

### Métodos de Instalación

| Método | Uso | Herramientas |
|--------|-----|---------------|
| **USB de arranque** | Individual | Rufus, Ventoy, Etcher |
| **PXE** | Red empresarial | Servidor PXE |
| **cloud-init** | Nube/virtualización | Scripts automatizados |

### Herramientas para USB

| Herramienta | Características |
|-------------|-------------------|
| **Rufus** | Simple, rápida, una sola ISO |
| **Ventoy** | Múltiples ISO en un USB |

### Proceso Crear USB Bootable

1. Descargar imagen ISO del SO
2. Verificar checksum (MD5/SHA256)
3. Conectar USB
4. Ejecutar Rufus/Ventoy
5. Seleccionar ISO y USB
6. Esperar a que termine

### PXE (Preboot Execution Environment)

- Permite arrancar por red
- Usado en empresas para instalaciones masivas
- Necesita servidor DHCP + TFTP

### cloud-init

- Automatiza configuración de VMs en la nube
- Configura usuarios, red, paquetes
- Se ejecuta en primer arranque

---

## 4. Particionado, Sistemas de Archivos y Configuración Inicial (Sesión 11)

### Particionado del Disco

| Concepto | Definición |
|----------|------------|
| **Partición** | División lógica de un disco |
| **Sistema de archivos** | Estructura para organizar archivos |

### Sistemas de Archivos

| SO | Sistema de Archivos |
|----|---------------------|
| Windows | NTFS |
| Linux | EXT4, Btrfs, XFS |
| macOS | APFS |

### Particiones en Linux (Práctica Recomendada)

| Partición | Punto de Montaje | Propósito |
|-----------|------------------|-----------|
| Raíz | `/` | Sistema operativo |
| Home | `/home` | Datos de usuario |
| Swap | - | Memoria virtual |

### Proceso de Instalación

```
1. Arrancar desde USB/DVD
2. Seleccionar idioma
3. Particionar disco
4. Formatear particiones
5. Instalar SO
6. Configuración inicial
```

### Configuración Inicial

- Crear usuario y contraseña
- Definir idioma
- Configurar zona horaria
- Ajustar teclado

### Tips

- Particiones separadas: Permite reinstalar sin perder datos
- GParted: Herramienta gráfica para gestionar particiones
- Formateo rápido vs seguro: El rápido solo borra índice

---

## 5. Configuración de Usuarios, Red y Actualizaciones (Sesión 12)

### Gestión de Usuarios

| Tipo de Cuenta | Privilegios |
|----------------|--------------|
| **Administrador** | Control total del sistema |
| **Estándar** | Uso diario, requiere elevación |

### Principio de Mínimo Privilegio

- Usar cuenta estándar para tareas diarias
- Elevar privilegios solo cuando sea necesario
- En Linux: `sudo`
- En Windows: UAC

### Configuración de Red

- **Ethernet**: Conexión por cable
- **WiFi**: Conexión inalámbrica
- **DNS**: Servidores de nombres
- **IP**: Dirección lógica

### Actualizaciones

| SO | Comando |
|----|---------|
| Ubuntu/Debian | `sudo apt update && sudo apt upgrade` |
| Fedora | `sudo dnf upgrade` |
| Windows | Windows Update |

### Importancia de Actualizar

- **Seguridad**: Parchea vulnerabilidades
- **Estabilidad**: Corrige errores
- **Rendimiento**: Mejoras generales

### Herramientas Útiles

- **Ninite** (Windows): Instalar/actualizar varias apps automáticamente

### Tips de Seguridad

- No usar administrador para uso diario
- Contraseñas seguras y diferentes
- Actualizar regularmente

---

## 🧠 Conceptos Clave para Examen

1. **Requisitos mínimos vs recomendados**: Siempre optar por recomendados
2. **BIOS/UEFI**: Firmware que se ejecuta al encender
3. **Secure Boot**: Proteção contra malware de bajo nivel
4. **USB bootable**: Medio de instalación más común
5. **Rufus/Ventoy**: Herramientas para crear USB bootable
6. **Partición**: División lógica de un disco
7. **NTFS**: Sistema de archivos de Windows
8. **EXT4**: Sistema de archivos de Linux
9. **Separación /home**: Buena práctica en Linux
10. **Usuario estándar**: Para uso diario por seguridad
11. **sudo**: Elevar privilegios en Linux
12. **UAC**: Control de cuentas en Windows
13. **Actualizaciones**: Críticas para seguridad

---

## ✅ Resumen Visual

```
PROCESO DE INSTALACIÓN
│
├── 1. Verificar requisitos
│   ├── Hardware (CPU, RAM, disco)
│   └── Compatibilidad software
│
├── 2. BIOS/UEFI
│   ├── Orden de arranque
│   ├── Secure Boot
│   └── Configuración
│
├── 3. Medios de instalación
│   ├── USB bootable (Rufus/Ventoy)
│   ├── PXE (red)
│   └── cloud-init (nube)
│
├── 4. Particionado
│   ├── Crear particiones
│   ├── Formatear (NTFS/EXT4)
│   └── Punto de montaje
│
└── 5. Configuración post-instalación
    ├── Usuarios (estándar)
    ├── Red (Ethernet/WiFi)
    └── Actualizaciones
```

---

## ⚠️ Errores Comunes

| Error | Realidad |
|-------|----------|
| "Cumplo requisitos mínimos, funcionará bien" | Necesitas requisitos recomendados |
| "BIOS y UEFI son lo mismo" | UEFI es el sucesor moderno |
| "Secure Boot bloquea Linux" | La mayoría de distros lo soportan |
| "Crear USB es copiar ISO" | Requiere herramienta especial |
| "No necesito swap con mucha RAM" | Sirve para hibernación |
| "Actualizaciones rompen cosas" | Son críticas para seguridad |
| "Uso administrador por comodidad" | Riesgo de seguridad |

---

## ✅ Conclusión Fácil de Recordar

1. **Verificar antes de instalar**: HW y software
2. **BIOS/UEFI**: Configurar arranque y seguridad
3. **USB bootable**: Con Rufus o Ventoy
4. **Particiones**: Separar /, /home, swap en Linux
5. **Usuario estándar**: Por seguridad
6. **Actualizar siempre**: Parches de seguridad
7. **Mínimo privilegio**: Cuenta diaria sin admin

---

> 📚 **Recursos**: Rufus.io, Ventoy.io, Wiki Arch Linux, Canonical Documentation