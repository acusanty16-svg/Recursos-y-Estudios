# Tema 7: Comparación VMs vs Contenedores, Monitorización y Seguridad

## 📌 Resumen Rápido

Este tema compara **máquinas virtuales** vs **contenedores**, y cubremonitorización y seguridad del sistema. Las VMs ofrecen aislamiento completo (kernel propio); los contenedores son ligeros y rápidos (kernel compartido). La monitorización vigila la salud del sistema, y la seguridad incluye análisis de logs, hardening y actualizaciones.

---

## 1. Comparación: Máquinas Virtuales vs Contenedores (Sesión 24)

### Diferencias Fundamentales

| Característica | Máquina Virtual | Contenedor |
|---------------|----------------|------------|
| **Kernel** | Propio (completo) | Comparte kernel del anfitrión |
| **Tamaño** | Gigabytes | Megabytes |
| **Tiempo de arranque** | Segundos-minutos | Milisegundos |
| **Aislamiento** | Fuerte | Ligero |
| **SO Guest** | Cualquier SO | Compatible con kernel anfitrión |

### Cuándo Usar VMs

| Caso de Uso | Descripción |
|-------------|-------------|
| **Seguridad alta** | Aislar sistemas completos |
| **Diferente SO** | Ejecutar Windows en Linux o viceversa |
| **Análisis de malware** | Entorno seguro y aislado |
| **Pruebas de SO** | Testear diferentes sistemas |
| **Compliance** | Requisitos de aislamiento regulado |

### Cuándo Usar Contenedores

| Caso de Uso | Descripción |
|-------------|-------------|
| **Microservicios** | Aplicaciones pequeñas y modulares |
| **Desarrollo** | Entornos reproducibles |
| **Despliegue rápido** | Arrancar y parar rápido |
| **Escalabilidad** | Múltplicas instancias |
| **Optimización recursos** | Maximizar uso del servidor |

### Tecnologías Complementarias

> No son competidores, sino tecnologías complementarias.

```
┌─────────────────────────────────────┐
│           Hardware                    │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │     Máquina Virtual       │   │
│  │  ┌───────────────────┐   │   │
│  │  │   Contenedor 1   │   │   │
│  │  ├───────────────────┤   │   │
│  │  │   Contenedor 2   │   │   │
│  │  └───────────────────┘   │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Kubernetes (K8s)

Plataforma de orquestación de contenedores:
- Gestiona miles de contenedores
- Despliegue automático
- Escalado
- Balanceo de carga
- Alta disponibilidad

### Alternativas a Docker

| Herramienta | Descripción |
|-------------|-------------|
| **Podman** | Sin demonio central, sin root |
| **containerd** | Runtime de contenedores |
| **cri-o** | Kubernetes container runtime |
| **nerdctl** | CLI compatible con Docker |

### K3s

Versión ligera de Kubernetes:
- Fácil instalación
- Bajo consumo de recursos
- Ideal para aprendizaje

---

## 2. Monitorización y Seguridad del Sistema (Sesión 25)

### Monitorización

| Aspecto | Descripción |
|--------|-------------|
| **CPU** | Uso de procesador |
| **RAM** | Uso de memoria |
| **Disco** | Espacio y I/O |
| **Red** | Ancho de banda |
| **Servicios** | Estado de aplicaciones |

### Herramientas de Monitorización

| Herramienta | Tipo | Descripción |
|-------------|------|-------------|
| **Nagios** | Open Source | Monitorización de infraestructura |
| **Zabbix** | Enterprise | Monitorización completa |
| **Prometheus** | Open Source | Métricas y alertas |
| **Grafana** | Visualización | Dashboard para métricas |
| **htop** | Linux | Monitor en tiempo real |

### Comandos de Monitorización Linux

```bash
# Ver procesos y uso de recursos
top
htop

# Ver uso de disco
df -h

# Ver uso de memoria
free -h

# Ver carga del sistema
uptime

# Ver servicios
systemctl status servicio
```

### Seguridad del Sistema

### Análisis de Logs

| Archivo | Descripción |
|---------|-------------|
| `/var/log/syslog` | Sistema (Linux) |
| `/var/log/auth.log` | Autenticación |
| `/var/log/kern.log` | Kernel |
| **Event Viewer** | Windows |

```bash
# Ver logs en tiempo real
tail -f /var/log/syslog

# Buscar errores
grep -i error /var/log/syslog

# Ver últimas líneas
tail -n 100 /var/log/syslog
```

### Hardening (Reforzamiento)

| Práctica | Descripción |
|----------|-------------|
| **Mínimos servicios** | Desactivar servicios innecesarios |
| **Permisos** | Principle of least privilege |
| **Firewall** | Configurar reglas |
| **Cifrado** | TLS/SSL para tráfico |
| **Contraseñas** | Fuertes y diferentes |
| **Actualizaciones** | Parches de seguridad |

### Herramientas de Hardening

| Herramienta | Descripción |
|-------------|-------------|
| **Lynis** | Auditoría de seguridad Linux |
| **OpenVAS** | Escáner de vulnerabilidades |
| **ClamAV** | Antivirus |
| **fail2ban** | Prevenir ataques brute force |
| **ansible** | Automatización de configuración |

### Actualizaciones

| SO | Comando |
|-----|---------|
| Ubuntu/Debian | `sudo apt update && sudo apt upgrade` |
| Fedora | `sudo dnf upgrade` |
| Windows | Windows Update |

### SLA (Service Level Agreement)

Acuerdo de nivel de servicio:
- Tiempo de actividad (uptime)
- Tiempo de respuesta
- Disponibilidad (%)

### Cultura DevOps

Une desarrollo (Dev) y operaciones (Ops):

| Práctica | Descripción |
|----------|-------------|
| **CI/CD** | Integración y despliegue continuo |
| **IaC** | Infraestructura como código |
| **Automatización** | Eliminar tareas manuales |
| **Feedback** | Iteración rápida |
| **Observabilidad** | Logs, métricas, trazas |

### Herramientas DevOps

| Categoría | Herramientas |
|-----------|-------------|
| **CI/CD** | GitLab CI, GitHub Actions, Jenkins |
| **IaC** | Ansible, Terraform, Puppet |
| **Contenedores** | Docker, Kubernetes |
| **Monitorización** | Prometheus, Grafana, ELK Stack |

---

## 🧠 Conceptos Clave para Examen

1. **VM**: Aislamiento fuerte, kernel propio
2. **Contenedor**: Aislamiento ligero, kernel compartido
3. **VMs vs Contenedores**: No son competidores, complementarios
4. **Kubernetes**: Orquestación de contenedores
5. **K3s**: Kubernetes ligero
6. **Podman**: Alternativa a Docker sin demonio
7. **Monitorización**: Vigilar salud del sistema
8. **Nagios/Zabbix**: Herramientas de monitorización
9. **Logs**: Registros de eventos del sistema
10. **Hardening**: Reforzamiento de seguridad
11. **Lynis**: Herramienta de auditoría
12. **DevOps**: Cultura Dev-Ops
13. **CI/CD**: Integración y despliegue continuo
14. **IaC**: Infraestructura como código
15. **Actualizaciones**: Críticas para seguridad

---

## ✅ Resumen Visual

```
COMPARACIÓN VMs vs CONTENEDORES
│
├── VM
│   ├── Kernel propio
│   ├── Aislamiento fuerte
│   ├── Tamaño grande
│   └── Para: seguridad, SO diferentes
│
└── Contenedor
    ├── Kernel compartido
    ├── Aislamiento ligero
    ├── Tamaño pequeño
    └── Para: microservicios, eficiencia


MONITORIZACIÓN Y SEGURIDAD
│
├── Monitorización
│   ├── CPU, RAM, disco, red
│   ├── Nagios, Zabbix, Prometheus
│   └── Alertas proactivas
│
├── Seguridad
│   ├── Análisis de logs
│   ├── Hardening
│   ├── Actualizaciones
│   └── Herramientas: Lynis, fail2ban
│
└── DevOps
    ├── Automatización
    ├── CI/CD
    └── IaC: Ansible, Terraform
```

---

## ⚠️ Errores Comunes

| Error | Realidad |
|-------|----------|
| "Contenedores reemplazan VMs" | Son complementarios |
| "Sin monitorización = todo bien" | Problemas no detectados |
| "Sistema funciona = no hay problemas" | Monitorización es proactiva |
| "DevOps solo para grandes" | Para cualquier escala |
| "Contenedores no necesitan seguridad" | Vulnerabilidades posibles |

---

## ✅ Conclusión Fácil de Recordar

1. **VM** = aislamiento fuerte, kernel propio
2. **Contenedor** = ligero, kernel compartido
3. **K8s** = orquestar contenedores
4. **Monitorizar** = detectar problemas antes
5. **Logs** = información de eventos
6. **Hardening** = reducir superficie de ataque
7. **Actualizar** = parches de seguridad
8. **DevOps** = automating operations

---

> 📚 **Recursos**: Kubernetes Docs, Nagios Docs, Lynis, The DevOps Handbook