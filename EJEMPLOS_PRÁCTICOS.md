# 📚 EJEMPLOS PRÁCTICOS - NEXUS SINCRONIZACIÓN

## Caso 1: Importar Clientes desde Excel

### Tu archivo Excel se ve así:
```
Documento    | Nombre           | Celular1     | Email              | Capital  | Intereses Mora | gestion_historica
1234567890   | Juan García      | 3001234567   | juan@gmail.com     | 500000   | 50000          | 2026-02-15|Contactado\|2026-02-10|Sin Contacto
9876543210   | María López      | 3009876543   | maria@hotmail.com  | 750000   | 75000          | 2026-02-18|Acuerdo
5555555555   | Pedro Martínez   | 3105555555   | pedro@yahoo.com    | 1000000  | 100000         | 2026-02-19|Contactado
```

### Ejecutar importación:
```bash
cd "C:\Users\Cristian Parra\Documents\7. Herramientas COBRO\CRM\App"
npm install
npm start
```

### Resultado:
```
📂 Leyendo archivo: clientes.xlsx
✅ Encontrados 3 registros en Excel

📋 ENCABEZADOS DETECTADOS:
  1. "Documento" → doc
  2. "Nombre" → nombre
  3. "Celular1" → cel1
  4. "Email" → email
  5. "Capital" → capital
  6. "Intereses Mora" → interesesMora
  7. "gestion_historica" → gestion_historica

✅ [1/3] 1234567890 - Juan García
✅ [2/3] 9876543210 - María López
✅ [3/3] 5555555555 - Pedro Martínez

✅ IMPORTACIÓN COMPLETADA
   ✓ Clientes importados: 3
   ⚠️  Errores: 0
```

En Firebase queda:
```json
{
  "clientes": {
    "1234567890": {
      "doc": "1234567890",
      "nombre": "Juan García",
      "cel1": "3001234567",
      "email": "juan@gmail.com",
      "capital": 500000,
      "interesesMora": 50000,
      "deudaTotal": 550000,
      "gestion_historica": "2026-02-15|Contactado|2026-02-10|Sin Contacto"
    }
  }
}
```

---

## Caso 2: Buscar Cliente en Nexus

### Paso 1: Abrir Nexus
- Navegador: `http://localhost/ruta/a/index.html`
- O abrir directamente: `index.html`

### Paso 2: Login
```
Usuario: Admin
Contraseña: 123
```

### Paso 3: Buscar cliente
- Campo de búsqueda: Ingresa `1234567890`
- Presiona Enter

### Lo que ves:
```
┌─────────────────────────────────────────────────────┐
│ NEXUS | Terminal de Gestión Operativa              │
├─────────────────────────────────────────────────────┤
│                                                       │
│ DATOS DEL TITULAR                                    │
│ ├─ Nombre: Juan García                              │
│ ├─ Identificación: 1234567890                       │
│ ├─ Celular: 3001234567   [WhatsApp]                 │
│ └─ Correo: juan@gmail.com                           │
│                                                       │
│ [✎ Editar Datos] [🔄 Sincronizar] [💾 Backup]     │
│             [⬇️ Descargar]                          │
│                                                       │
│ ESTADO FINANCIERO                                    │
│ ├─ Capital Adeudado: $500.000                       │
│ ├─ Intereses Mora: $50.000                          │
│ ├─ Subtotal Deuda: $550.000                         │
│ ├─ Días en Mora: 35                                 │
│ └─ ▼ Detalles Adicionales                           │
│    ├─ Intereses Corrientes: $25.000                 │
│    ├─ Seguros: $10.000                              │
│    └─ Otros: $5.000                                 │
│                                                       │
│ [más secciones...]                                   │
└─────────────────────────────────────────────────────┘
```

---

## Caso 3: Editar Información del Cliente

### Escenario: El deudor cambió de celular

### Paso 1: Clic en "Editar Datos"
- Aparece modal con formulario

### Paso 2: Actualizar datos
```
Modal de Edición:

CELULAR 1
┌──────────────────────────────┐
│ 3001234567 → 3009999999      │
└──────────────────────────────┘

EMAIL
┌──────────────────────────────┐
│ juan@gmail.com               │
│ (sin cambios)                │
└──────────────────────────────┘

TELÉFONO FIJO
┌──────────────────────────────┐
│ 6015551234 → 6015559999      │
└──────────────────────────────┘

[✓ Guardar Cambios] [✗ Cancelar]
```

### Paso 3: Clic "Guardar Cambios"
- Sistema valida datos
- Actualiza Firebase automáticamente
- Muestra: "✓ Datos actualizados exitosamente"

### En Firebase queda:
```json
{
  "clientes": {
    "1234567890": {
      "nombre": "Juan García",
      "cel1": "3009999999",  ← ACTUALIZADO
      "telefonoFijo": "6015559999",  ← ACTUALIZADO
      "email": "juan@gmail.com"
      // ... resto de datos
    }
  }
}
```

---

## Caso 4: Registrar una Gestión

### Escenario: Llamaste al cliente hoy

### En Nexus, sección "Nueva Tipificación":

### Paso 1: Seleccionar categoría
```
Categorías disponibles:
[Contactado]  [Sin Contacto]  [Contacto Indirecto]
[Gestion Realizada]  [Acuerdo de Pago]  [Paz y Salvo]
```
→ Haces clic en: **"Contactado"**

### Paso 2: Seleccionar tipo
```
Tipos para "Contactado":
[Contacto sin acuerdo] [Posible acuerdo] 
[Volver a llamar] [Renuente] [Reclamación]
```
→ Haces clic en: **"Posible acuerdo"**

### Paso 3: Agregar comentario
```
Comentarios de la llamada...
┌────────────────────────────────────────┐
│ Cliente interesado en acuerdo de pago  │
│ pero necesita 10 días para consultar   │
│ con su familia. Llamar nuevamente      │
│ el 2026-03-01                          │
└────────────────────────────────────────┘
```

### Paso 4: Guardar
- Clic en: **"Guardar Gestión"**

### Lo que sucede automáticamente:
```
1. Se registra la gestión con:
   - Fecha exacta: 2026-02-19
   - Hora exacta: 15:35
   - Categoría: Contactado
   - Tipo: Posible acuerdo
   - Comentarios: "Cliente interesado..."

2. Se agrega al historial:
   "2026-02-19 15:35 [Contactado - Posible acuerdo] | 
    Coment.: Cliente interesado..."

3. Se sincroniza con Firebase:
   gestion_historica: 
   "2026-02-19 15:35 [Contactado - Posible acuerdo]... | 
    2026-02-15 10:00 [Sin Contacto - No Contesta]..."

4. En el historial de Nexus aparece:
┌──────────────────────────────────────┐
│ HISTORIAL CRONOLÓGICO                │
├──────────────────────────────────────┤
│ 📌 REGISTRO GESTIÓN                  │
│    2026-02-19 15:35                  │
│    [Contactado - Posible acuerdo]    │
│    Cliente interesado en acuerdo...  │
│                                      │
│ 📌 REGISTRO GESTIÓN                  │
│    2026-02-15 10:00                  │
│    [Sin Contacto - No Contesta]      │
│                                      │
│ ... más gesiones ...                 │
└──────────────────────────────────────┘
```

### En Firebase:
```json
{
  "clientes": {
    "1234567890": {
      "nombre": "Juan García",
      "gestion_historica": "2026-02-19 15:35 [Contactado - Posible acuerdo] | Coment.: Cliente interesado... | 2026-02-15 10:00 [Sin Contacto - No Contesta] | Coment.: N/A",
      // ... otros datos
    }
  }
}
```

---

## Caso 5: Sincronizar Gestiones Recientes

### Escenario: Otro asesor actualizó el cliente en Firebase

### Paso 1: En Nexus, cliente 1234567890
- Clic en: **"Sincronizar"**

### Paso 2: Sistema automáticamente:
```
1. Se conecta a Firebase
2. Descarga datos más recientes
3. Actualiza:
   - Historial de gestiones
   - Información personal
   - Estado financiero
4. Muestra: "✓ Gestiones sincronizadas correctamente"
```

### Historial se actualiza:
```
Antes de sincronizar (local):
- 2026-02-19 15:35 [Contactado - Posible acuerdo]
- 2026-02-15 10:00 [Sin Contacto - No Contesta]

Después de sincronizar (desde Firebase):
- 2026-02-19 16:20 [Acuerdo de Pago - Acuerdo de Pago] ← NUEVA
- 2026-02-19 15:35 [Contactado - Posible acuerdo]
- 2026-02-15 10:00 [Sin Contacto - No Contesta]
```

---

## Caso 6: Crear Backup de Cliente

### Escenario: Antes de una actualización importante

### En Nexus:
- Clic en: **"Backup"**

### Sistema:
```
1. Toma TODOS los datos del cliente
2. Crea copia exacta en: clientes_backup/1234567890
3. Incluye timestamp: 2026-02-19T15:35:00Z
4. Muestra: "✓ Backup creado correctamente"
```

### En Firebase quedan:
```json
{
  "clientes": {
    "1234567890": {
      // Datos actuales del cliente
    }
  },
  
  "clientes_backup": {
    "1234567890": {
      // COPIA EXACTA de los datos
      "fecha_backup": "2026-02-19T15:35:00Z"
    }
  }
}
```

### Si necesitas restaurar:
- Sistema tiene función: `restaurarCliente()`
- Se puede implementar botón fácilmente
- Traería datos del backup a clientes

---

## Caso 7: Exportar Datos de Cliente a CSV

### Escenario: Necesitas enviar datos a otro sistema

### En Nexus:
- Clic en: **"Descargar"**

### Resultado:
```
Descargue: cliente_1234567890.csv

Contenido del archivo:
"doc","nombre","cel1","cel2","email","telefonoFijo","...","gestion_historica"
"1234567890","Juan García","3001234567","3187654321","juan@gmail.com","6015551234","...","2026-02-19 15:35..."
```

### Puedes:
- Abrir en Excel
- Enviar por email
- Integrar con otros sistemas
- Hacer respaldos locales

---

## Caso 8: Sincronización Bidireccional Completa

### Flujo completo en una jornada laboral:

```
08:00 - IMPORTACIÓN (MAÑANA)
├─ Ejecutas: npm start
├─ Importa 150 clientes desde Excel
└─ Firebase queda actualizado

09:00 - TRABAJO EN NEXUS (TODO EL DÍA)
├─ Buscas: Juan García (1234567890)
├─ Ves todos sus datos
├─ Editas: Celular (actualiza Firebase)
├─ Registras: Gestión "Contactado - Posible acuerdo"
└─ Se guarda en Firebase automáticamente

11:00 - OTRO ASESOR HACE CAMBIOS
├─ Actualiza Firebase directamente
├─ (Cambios hechos desde otro lugar)
└─ Tú lo sincronizas en Nexus

14:00 - EDICIÓN DE DATOS MASIVA
├─ Editas: Dirección, Empresa
├─ Clic: "Guardar Cambios"
└─ Se sincroniza: Nexus → Firebase

15:00 - GESTIONES NUEVAS
├─ Registras: "Acuerdo de Pago - Acuerdo"
├─ Agregas: "Cliente pactó X cuotas"
├─ Fecha/Hora: Automática (15:00)
└─ Firebase: Actualizado en tiempo real

16:00 - RESPALDO DIARIO
├─ Todas las noches: "Backup"
├─ Se guardan: clientes_backup
└─ Recuperación disponible si hay error

17:00 - CIERRE
├─ Exportas: Descargar CSV
├─ Ciclo completo: Excel → Firebase → Nexus → Excel
└─ ✓ TODO SINCRONIZADO
```

---

## Caso 9: Manejo de Gestiones con Múltiples Registros

### Tu Excel tiene:
```
Documento: 1234567890
gestion_historica: 2026-02-15|Contactado|2026-02-10|Sin Contacto|2026-02-05|Acuerdo
```

### Se importa como:
```
gestion_historica: "2026-02-15|Contactado|2026-02-10|Sin Contacto|2026-02-05|Acuerdo"
```

### En Nexus Historial se muestra:
```
┌────────────────────────────────────┐
│ HISTORIAL CRONOLÓGICO              │
├────────────────────────────────────┤
│ 📌 REGISTRO OPERATIVO              │
│    2026-02-15|Contactado           │
│                                    │
│ 📌 REGISTRO OPERATIVO              │
│    2026-02-10|Sin Contacto         │
│                                    │
│ 📌 REGISTRO OPERATIVO              │
│    2026-02-05|Acuerdo              │
└────────────────────────────────────┘
```

### Cuando registras NUEVA gestión:
```
Agregar: "2026-02-19 15:35 [Contactado - Posible acuerdo] | Coment.: ..."

gestion_historica queda:
"2026-02-19 15:35 [Contactado - Posible acuerdo] | ... | 
 2026-02-15|Contactado| 
 2026-02-10|Sin Contacto| 
 2026-02-05|Acuerdo"
```

---

## Caso 10: Actualización desde Excel sin Perder Gestiones

### Escenario: Necesitas actualizar datos pero PRESERVAR gestiones

### INCORRECTO ❌
```bash
# NO HAGAS ESTO: Sobrescribe TODO
npm start
```

### CORRECTO ✅
```bash
# Opción 1: Editar en Nexus (preserva gestiones)
1. Buscar cliente
2. Clic "Editar Datos"
3. Cambiar información
4. Guardar → Firebase actualiza, gestiones intactas

# Opción 2: Actualizar desde Excel de forma inteligente
1. En Excel: edita datos pero MANTÉN gestion_historica
2. En import.js: agrega lógica para MERGE
3. npm start → Actualiza datos, preserva gestiones
```

### En Firebase (después de actualización inteligente):
```json
{
  "clientes": {
    "1234567890": {
      "nombre": "Juan García ACTUALIZADO",  ← NUEVO
      "cel1": "3009999999",  ← NUEVO
      "deudaTotal": 600000,  ← NUEVO (si cambió)
      "gestion_historica": "2026-02-19 15:35...|2026-02-15|Contactado|..." ← PRESERVADO
    }
  }
}
```

---

## ✨ RESUMEN DE CAPACIDADES

| Acción | Excel | Nexus | Firebase | Resultado |
|--------|-------|-------|----------|-----------|
| Importar | ✅ | - | ✅ | Clientes en FB |
| Editar datos | ❌ | ✅ | ✅ | Datos actualizados |
| Registrar gestión | ❌ | ✅ | ✅ | Historial completo |
| Sincronizar | - | ✅ | ✅ | Datos frescos |
| Respaldar | ❌ | ✅ | ✅ | Copia segura |
| Restaurar | ❌ | ✅ | ✅ | Recuperación |
| Exportar | - | ✅ | ✅ | CSV disponible |
| Ver historial | ❌ | ✅ | ✅ | Todas las gestiones |

---

**¡Todo listo para usar! 🎉**

Tienes un sistema de gestión completo, bidireccional y profesional.
