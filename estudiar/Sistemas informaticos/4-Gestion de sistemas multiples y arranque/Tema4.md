# Tema 4: Gestión de Sistemas Múltiples - Arranque Dual/Múltiple

## 📌 Resumen Rápido

El **arranque dual** permite tener 2 sistemas operativos en el mismo PC, mientras que el **arranque múltiple** permite tener más de 2. Los requisitos principales son espacio en disco suficiente y una buena planificación de particiones. Se debe usar **MBR** (antiguo, 4 particiones máx.) o **GPT** (moderno, 128 particiones). **GRUB** es el gestor de arranque de Linux que permite elegir entre sistemas.

---

## 1. Arranque Dual vs Múltiple (Sesión 13)

### Definiciones

| Tipo | Descripción |
|------|-------------|
| **Arranque dual** | 2 sistemas operativos en el mismo PC |
| **Arranque múltiple** | Más de 2 sistemas operativos |

### Usos Comunes

- Desarrolladores que necesitan Windows y Linux
- Diseñadores que usan apps nativas de diferentes SO
- Entusiastas que quieren probar diferentes distribuciones
- Profesionales que necesitan entornos específicos

### Requisitos de Hardware

| Requisito | Descripción |
|-----------|-------------|
| **Espacio en disco** | Suficiente para todos los SO y sus aplicaciones |
| **Planificación de particiones** | Definir tamaño y ubicación de cada partición |
| **Gestor de arranque** | Software que permite elegir SO al iniciar |

### Tips Importantes

1. **Instalar Windows primero**: El instalador de Windows sobrescribe el gestor de arranque. Linux detecta Windows automáticamente.

2. **Desactivar Fast Startup en Windows**: Esta función puede causar problemas al acceder a particiones Windows desde Linux.

3. **Hacer backup antes**: El particionado siempre tiene riesgo, hacer copia de seguridad.

### Compartir Archivos entre SO

| SO origen | Acceso a otro SO |
|----------|----------------|
| Linux → Windows | Puede leer/escribir en NTFS sin problemas |
| Windows → Linux | Requiere herramientas como ext2fsd para EXT4 |

### Mitos y Realidades

| Mito | Realidad |
|------|---------|
| "El arranque dual ralentiza el PC" | Falso. Cada SO funciona independientemente |
| "No se pueden compartir archivos" | Falso. Linux lee NTFS perfectamente |

---

## 2. Particionamiento MBR y GPT (Sesión 14)

### Comparación MBR vs GPT

| Característica | MBR | GPT |
|---------------|-----|-----|
| **Nombre completo** | Master Boot Record | GUID Partition Table |
| **Estándar** | Antiguo | Moderno |
| **Firmware asociado** | BIOS | UEFI |
| **Particiones máx.** | 4 primarias (o 3 + extendida) | 128 |
| **Tamaño disco máx.** | 2 TB | Prácticamente ilimitado |
| **Soporte actual** | Legacy | Recomendado |

### Cuándo Usar Cada Uno

| Situación | Recomendado |
|----------|-------------|
| Hardware moderno (>10 años) | GPT |
| Hardware antiguo | MBR |
| Discos >2 TB | GPT obligatorio |
| Compatibilidad legacy | MBR |

### Planificación de particiones

#### En Windows (típico)

| Partición | Tamaño | Propósito |
|-----------|---------|-----------|
| Sistema (C:) | 100-200 GB | SO y programas |
| Datos (D:) | Resto | Archivos personales |

#### En Linux (práctica recomendada)

| Partición | Punto de Montaje | Tamaño | Propósito |
|-----------|-----------------|--------|-----------|
| EFI | /boot/efi | 500 MB | Archivos de arranque |
| Raíz | / | 20-30 GB | SO |
| Home | /home | Resto | Datos de usuario |
| Swap | - | 4-8 GB | Memoria virtual |

### Herramientas de Particionado

| Herramienta | Descripción |
|-------------|-------------|
| **GParted** | GUI Linux más popular |
| **fdisk** | Linea de comandos Linux |
| **gdisk** | Particionado GPT en Linux |
| **Administración de discos** | Windows |

### Conversión MBR ↔ GPT

- **Linux**: gdisk
- **Windows**: mbr2gpt.exe
- ⚠️ Siempre hacer backup antes de convertir

---

## 3. Configuración Avanzada de GRUB (Sesión 15)

### ¿Qué es GRUB?

**GRUB** (GRand Unified Bootloader) es el gestor de arranque más usado en Linux. Es el menú que aparece al iniciar el PC para elegir sistema operativo.

### Funciones de GRUB

1. Presentar menú de sistemas operativos
2. Cargar el sistema seleccionado
3. Passar parámetros al kernel

### Archivo de Configuración

| Archivo | Ubicación | Función |
|---------|-----------|---------|
| `/etc/default/grub` | Principal configuración |
| `/etc/grub.d/` | Scripts modulares |

### Opciones Configurables

| Opción | Descripción |
|--------|-------------|
| `GRUB_DEFAULT` | Sistema por defecto |
| `GRUB_TIMEOUT` | Tiempo de espera (segundos) |
| `GRUB_THEME` | Apariencia visual |
| `GRUB_CMDLINE_LINUX` | Parámetros del kernel |

### Comandos Importantes

```bash
# Aplicar cambios después de editar configuración
sudo update-grub

# Ver configuración actual
sudo grub-mkconfig -o /boot/grub/grub.cfg

# Reparar GRUB automáticamente
sudo boot-repair
```

### Herramientas de Personalización

| Herramienta | Descripción |
|-------------|-------------|
| **GRUB Customizer** | Interfaz gráfica para configurar GRUB |
| **Boot-Repair** | tool de rescate automática |
| **Temas** | Personalización visual |

### Resolución de Conflictos

#### Problema Común: Windows Sobrescribe GRUB

**Síntoma**: Después de instalar Windows, Linux no aparece en el menú de arranque.

**Solución**:

1. Arrancar desde Live USB de Linux
2. Executar Boot-Repair
3. O manualmente:
   ```bash
   sudo mount /dev/sdaX /mnt
   sudo chroot /mnt
   sudo grub-install /dev/sda
   sudo update-grub
   ```

#### Solución con Boot-Repair

1. Descargar ISO de Boot-Repair
2. Arrancar desde USB
3. Ejecutar Boot-Repair
4. Seleccionar "Repair recommended"
5. listo

### Orden de Instalación Recomendado

```
1. Windows primero (si se usa)
2. Linux después
3. GRUB detecta Windows automáticamente
```

### Mitos y Realidades

| Mito | Realidad |
|------|---------|
| "Instalar Windows después de Linux borra todo" | Falso. Solo sobrescribe GRUB. Datos intactos |
| "Configurar GRUB es difícil" | Con GRUB Customizer es fácil |

---

## 🧠 Conceptos Clave para Examen

1. **Arranque dual**: 2 SO en el mismo PC
2. **Arranque múltiple**: Más de 2 SO
3. **Windows siempre primero**: Para evitar que sobrescriba GRUB
4. **Fast Startup**: Desactivar en Windows para compatibilidad con Linux
5. **MBR**: 4 particiones máx., disco hasta 2 TB
6. **GPT**: 128 particiones máx., disco >2 TB
7. **GPT + UEFI**: Combinación estándar moderna
8. **GRUB**: Gestor de arranque de Linux
9. **update-grub**: Comando para aplicar cambios en GRUB
10. **Boot-Repair**: Herramienta para reparar GRUB automáticamente
11. **Partición EFI**: Necesaria en discos GPT para archivos de arranque
12. **Linux lee NTFS**: Sin problemas de compatibilidad
13. **swap**: Necesaria para hibernación

---

## ✅ Resumen Visual

```
ARRANQUE DUAL/MÚLTIPLE
│
├── Tipos
│   ├── Dual → 2 sistemas
│   └── Múltiple → más de 2
│
├── Requisitos
│   ├── Espacio en disco suficiente
│   ├── Particiones planificadas
│   └── Gestor de arranque (GRUB)
│
└── Pasos para instalación
    ├── 1. Instalar Windows primero (si aplica)
    ├── 2. Crear particiones
    ├── 3. Instalar Linux
    └── 4. GRUB detecta ambos


ESTILOS DE PARTICIONADO
│
├── MBR (Master Boot Record)
│   ├── Viejo, BIOS
│   ├── 4 particiones máx.
│   └── Hasta 2 TB
│
└── GPT (GUID Partition Table)
    ├── Moderno, UEFI
    ├── 128 particiones máx.
    └── Más de 2 TB


GRUB
│
├── Función: Menú de selección de SO
│
├── Configuración
│   ├── /etc/default/grub
│   └── sudo update-grub
│
├── Herramientas
│   ├── GRUB Customizer (GUI)
│   └── Boot-Repair (reparación)
│
└── Resolución de problemas
    └── Boot-Repair o reinstalar GRUB
```

---

## ⚠️ Errores Comunes

| Error | Realidad |
|-------|----------|
| "Instalo Linux primero y después Windows" | Windows sobrescribe GRUB |
| "El arranque dual lentiza el PC" | Cada SO funciona independientemente |
| "No se comparten archivos" | Linux lee NTFS perfectamente |
| "MBR es más compatible" | Todos los SO modernos soportan GPT |
| "No puedo tener más de 4 particiones en MBR" | Se puede con partición extendida |
| "Linux borra Windows" | Solo sobrescribe GRUB, datos intactos |

---

## ✅ Conclusión Fácil de Recordar

1. **Dual boot** = 2 SO, Multiple boot = más de 2
2. **Windows primero**: Regla de oro
3. **Desactivar Fast Startup**: Antes de instalar Linux
4. **MBR** = velho, 4 particiones, 2 TB max
5. **GPT** = moderno, 128 particiones, >2 TB
6. **GRUB** = gestor de arranque Linux
7. **sudo update-grub**: Aplicar cambios
8. **Boot-Repair**: Reparar problemas fácilmente
9. **Linux lee NTFS**: Sin problemas

---

> 📚 **Recursos**: Documentación oficial de GRUB, Wiki Arch Linux, Comunidades r/buildapc