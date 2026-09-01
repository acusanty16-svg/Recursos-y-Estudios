# Tema 6: Administración de Base de Datos

## 📌 Resumen Rápido

La administración de bases de datos incluye **gestión de usuarios y privilegios**, **transacciones** para garantizar la consistencia de los datos, y **medidas de seguridad avanzada** como auditoría, backups y encriptación.

---

## 1. Usuarios, Roles y Privilegios (Sesión 23)

### Conceptos de Seguridad

| Concepto | Descripción |
|----------|-------------|
| **Usuario** | Cuenta para conectarse al SGBD |
| **Privilegio** | Permiso para realizar una acción |
| **Rol** | Conjunto de privilegios con nombre |

### Comandos GRANT y REVOKE

```sql
-- Crear usuario
CREATE USER 'juan'@'localhost' IDENTIFIED BY 'password123';

-- Otorgar privilegios
GRANT SELECT, INSERT ON mi_tabla TO 'juan'@'localhost';

-- Otorgar privilegios a rol
GRANT SELECT ON mi_tabla TO rol_desarrollador;

-- Asignar rol a usuario
GRANT rol_desarrollador TO 'juan'@'localhost';

-- Revocar privilegios
REVOKE INSERT ON mi_tabla FROM 'juan'@'localhost';
```

### Niveles de Privilegios

| Privilegio | Ámbito |
|------------|--------|
| **SELECT** | Consultar datos |
| **INSERT** | Añadir datos |
| **UPDATE** | Modificar datos |
| **DELETE** | Borrar datos |
| **CREATE** | Crear objetos |
| **DROP** | Eliminar objetos |
| **ALL** | Todos los privilegios |

### Principio de Mínimo Privilegio

> Cada usuario debe tener **solo los permisos estrictamente necesarios** para hacer su trabajo.

**Ejemplo: Banco Santander**

| Rol | Privilegios |
|-----|-----------|
| **Cajero** | SELECT clientes, ejecutar procedimientos de ingreso/reintegro |
| **Analista Marketing** | SELECT en vistas anonimizadas |
| **DBA** | Privilegios casi totales (auditado) |

---

## 2. Transacciones (Sesión 24)

### ¿Qué es una Transacción?

Unidad de trabajo **atómica**: o se hacen todos los cambios, o no se hace ninguno.

### Propiedades ACID

| Propiedad | Descripción |
|-----------|------------|
| **Atomicidad** | O todo o nada |
| **Consistencia** | Pasa de estado válido a válido |
| **Isolation** | Transacciones concurrentes no se interferiren |
| **Durability** | Una vez confirmado, persiste |

### Comandos de Transacción

```sql
-- Iniciar transacción
START TRANSACTION;

-- Hacer cambios
UPDATE cuentas SET saldo = saldo - 100 WHERE id = 1;
UPDATE cuentas SET saldo = saldo + 100 WHERE id = 2;

-- Confirmar cambios
COMMIT;

-- Opcional: si hay error, deshacer todo
ROLLBACK;
```

### Ejemplo: Transferencia Bancaria

```
START TRANSACTION
    UPDATE cuenta_origen SET saldo = saldo - 1000
    UPDATE cuenta_destino SET saldo = saldo + 1000
IF todo_ok:
    COMMIT
ELSE:
    ROLLBACK
```

### Niveles de Aislamiento

| Nivel | Descripción | Lectura Sucia | Lectura No Repetible | Lectura Fantasma |
|-------|-------------|---------------|---------------------|----------------|
| **READ UNCOMMITTED** | Permite todo | ✅ | ✅ | ✅ |
| **READ COMMITTED** | Solo leer confirmadas | ❌ | ✅ | ✅ |
| **REPEATABLE READ** | Mismo resultado | ❌ | ❌ | ✅ |
| **SERIALIZABLE** | Totalmente aislados | ❌ | ❌ | ❌ |

> **Nota**: Mayor aislamiento = menor concurrencia

### Problemas de Concurrencia

| Problema | Descripción |
|---------|------------|
| **Lectura sucia** | Leer datos sin confirmar |
| **Lectura no repetible** | Diferentes resultados |
| **Lectura fantasma** | Nuevas filas aparecen |

---

## 3. Seguridad Avanzada (Sesión 25)

### Auditoría

Registrar quién hizo qué, cuándo y desde dónde.

```sql
-- Habilitar auditoría (ejemplo MySQL)
AUDIT TABLE Empleados;
```

### Tipos de Backup

| Tipo | Descripción | Ventaja | Desventaja |
|------|-------------|---------|------------|
| **Completo** | Copia toda la BD | Simple | Lento |
| **Diferencial** | Cambios desde el último completo | Más rápido | Requiere backup completo |
| **Incremental** | Cambios desde último backup | Muy rápido | Complejo |

### Estrategia de Backup

```
RPO (Recovery Point Objective): ¿cuánta pérdida de datos puedo tolerar?
RTO (Recovery Time Objective): ¿cuánto tiempo tardo en recuperar?

Ejemplo:
- RPO: 1 hora → backup incremental cada hora
- RTO: 30 minutos → pruebas regulares
```

### Restauración

```sql
-- Restaurar desde backup (ejemplo MySQL)
mysql -u root -p basedatos < backupCompleto.sql

-- Point-in-time recovery
RESTORE TO '2024-01-15 10:00:00';
```

### Encriptación

| Tipo | Descripción |
|------|-------------|
| **En reposo** | Datos en disco (TDE) |
| **En tránsito** | Comunicación red (TLS/SSL) |

### Anonimización

Proteger datos sensibles en entornos de desarrollo/pruebas.

```sql
-- Ejemplo: Enmascarar datos sensibles
UPDATE clientes 
SET email = CONCAT('user_', id, '@example.com'),
    telefono = 'XXX-XXX-XXXX';
```

---

## 🧠 Conceptos Clave para Examen

1. **GRANT** = otorgar privilegios
2. **REVOKE** = revocar privilegios
3. **Rol** = conjunto de privilegios
4. **Transacción** = unidad atómica (START/COMMIT/ROLLBACK)
5. **ACID** = Atomicidad, Consistencia, Isolation, Durability
6. **Auditoría** = registrar acciones
7. **Backup** = copia de seguridad
8. **RPO/RTO** = métricas de recuperación
9. **Encriptación** = protección datos
10. **Anonimización** = ocultar datos sensibles

---

## ✅ Resumen Visual

```
Administración de BD
├── Seguridad
│   ├── Usuarios y privilegios
│   ├── Roles
│   ├── GRANT/REVOKE
│   └── Principio mínimo privilegio
│
├── Transacciones
│   ├── START TRANSACTION
│   ├── COMMIT
│   ├── ROLLBACK
│   └── ACID
│
└── Seguridad Avanzada
    ├── Auditoría
    ├── Backups (completo/diferencial/incremental)
    ├── Restauración
    ├── Encriptación
    └── Anonimización
```

---

## 💻 comandos Prácticos

```sql
-- Crear usuario con privilegios
CREATE USER 'desarrollador' IDENTIFIED BY 'pass';
GRANT SELECT, INSERT, UPDATE ON mi_bd.* TO 'desarrollador';

-- Transacción segura
START TRANSACTION;
UPDATE cuentas SET saldo = saldo - 500 WHERE id = 1;
UPDATE cuentas SET saldo = saldo + 500 WHERE id = 2;
-- Verificar y confirmar
COMMIT;  -- o ROLLBACK si hay error

-- Ver usuarios
SELECT user FROM mysql.user;

-- Privilegios de usuario
SHOW GRANTS FOR 'desarrollador';
```

---

## ⚠️ Mejores Prácticas

| Práctica | Descripción |
|---------|-------------|
| **Usuario propio** | Cada persona/app con su usuario |
| **Mínimo privilegio** | Solo lo necesario |
| **Transacciones** | Siempre en operaciones mehrere |
| **Backups regulares** | Probar restauración |
| **Contraseñas fuertes** | No usar 'password123' |
| **Auditoría** | Registrar acciones sensibles |

---

## ✅ Conclusión Fácil de Recordar

1. **Usuario = quién**, **Privilegio = qué puede hacer**, **Rol = grupo de privilegios**
2. **GRANT = dar**, **REVOKE = quitar**
3. **Transacción = o todo o nada** (COMMIT/ROLLBACK)
4. **ACID = propiedades de transacción**
5. **Auditoría = quién hizo qué**
6. **Backup = seguro ante desastres**
7. **Probar restauración = mandatory**
8. **Encriptación = protección extra**

---

> 📚 **Recursos**: "Database Security" - Basta & Zgola, "High Performance MySQL" - Schwartz