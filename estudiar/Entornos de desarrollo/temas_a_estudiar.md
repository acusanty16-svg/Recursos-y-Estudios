# Temas a Estudiar - Entornos de Desarrollo

## Resultado del examen: 25/30 (83%)

---

## Temas con Fallos (Repasar)

### 1. Diagrama de Estados UML
- **Transiciones**: Flechas que conectan estados, se disparan por eventos específicos
- **No es**: "Una relación de herencia entre clases"
- **Estados inicial**: Exactamente UNO (círculo relleno)
- **Estados final**: CERO O MÁS (círculo relleno dentro de otro)

### 2. Objetivo del Sprint en Scrum
- **Objetivo**: Producir un incremento potencialmente entregable del producto
- **Duración**: 2-4 semanas (tiempo fijo)
- **Resultado**: Software testeable y potencialmente shippable
- **No es**: "Documentar exhaustivamente toda la arquitectura del sistema"

### 3. Pruebas de Integración
- **Objetivo**: Validar la comunicación y compatibilidad entre diferentes módulos
- **Diferencia**: Las pruebas unitarias verifican componentes aislados
- **No es**: "Verificar que cada función individual funciona correctamente de manera aislada"

### 4. Product Owner en Scrum
- **Responsabilidades**: Definir prioridades del producto, gestionar backlog, optimizar valor entregado
- **No es**: "Desarrollo directo del código y supervisión técnica"
- **Representa**: Los intereses del cliente dentro del equipo

---

## Temas dominados

- **UML**: Diagramas de actividad, clases, secuencia, casos de uso
- **Git**: clone (descarga repositorio), pull (descarga + integra), push (envía cambios), commit (confirma cambios)
- **Patrones**: Singleton (instancia única), Builder (objetos complejos)
- **Pruebas**: Unitarias (aisladas), Integración (módulos juntos), Aceptación (cliente)
- **Refactorización**: Mejorar código sin cambiar comportamiento
- **Code smells**: Señales de problemas en diseño
- **Análisis de requisitos**: Identificar necesidades del cliente
- **Ciclo de vida**: Análisis → Diseño → Implementación → Pruebas → Mantenimiento
- **Lenguajes**: Alto nivel (abstracción hardware) vs bajo nivel

---

## Comandos Git esenciales

- `git clone url` → Descargar repositorio completo
- `git pull` → Descargar cambios remotos e integrar
- `git push` → Enviar cambios al repositorio remoto
- `git commit -m "mensaje"` → Confirmar cambios localmente
- `git add` → Preparar archivos para commit

---

## Patrones de Diseño

### Singleton
- Garantiza una única instancia
- Útil para: conexiones BBDD, configuración global, logger

### Builder
- Simplifica creación de objetos complejos
- Evita constructores sobrecargados

---

## Diagramas UML

| Diagrama | Tipo | Uso |
|----------|------|-----|
| Clases | Estático | Estructura del sistema |
| Secuencia | Dinámico | Interacción entre objetos |
| Casos de uso | Requisitos | Funcionalidades desde usuario |
| Actividad | Procesos | Flujo de trabajo |
| Estados | Comportamiento | Ciclo de vida de objetos |

---

## Notas del Examen

- Tuviste 5 fallos: transiciones, sprint, pruebas integración, estados UML, Product Owner
- Puntuación: 83% (muy bien!)
- Falta reforzar: UML específico y Scrum