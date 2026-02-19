# 🔄 GUÍA DE SINCRONIZACIÓN - NEXUS SISTEMA COMPLETO

## 📊 Flujo de Datos: Excel → Firebase → Nexus

```
┌─────────────────────────────────────────────────────────────────┐
│                     TU ARCHIVO EXCEL                            │
│  (Clientes, valores, gestiones con fechas, números con "|")    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                             ↓
                   (npm start / import.js)
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                   FIREBASE REALTIME DATABASE                    │
│  (Base de datos en la nube con sincronización automática)       │
│                                                                 │
│  ├─ clientes/                                                  │
│  │  ├─ 1234567890                                              │
│  │  │  ├─ nombre, doc, cel1, email                             │
│  │  │  ├─ deudaTotal, diasMora, gestion_historica              │
│  │  │  └─ ... (45+ campos)                                     │
│  │  ├─ 9876543210                                              │
│  │  └─ ...                                                     │
│  └─ clientes_backup/ (Respaldos automáticos)                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                             ↓
                (Búsqueda, edición, gestión)
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                      NEXUS TERMINAL                             │
│  (Interfaz visual con edición en tiempo real)                   │
│  (Actualiza automáticamente Firebase)                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 PASO 1: PREPARAR Y IMPORTAR DATOS DESDE EXCEL

### Estructura esperada del Excel:

Tu archivo `clientes.xlsx` debe tener:

| Documento | Nombre Completo | Celular1 | Email | Capital | Intereses Mora | ... | gestion_historica |
|-----------|:---------------:|:--------:|:-----:|:-------:|:--------------:|:---:|:-----------------:|
| 1234567890| Juan Pérez      | 3001234567|juan@... | 500000 | 50000        | ... | 2026-02-15\|Contactado... |
| 9876543210| María García    | 3009876543|maria@..| 750000 | 75000        | ... | 2026-02-10\|Sin contacto...| 

**Importante:** Las gestiones con múltiples registros van separadas por `|` en una sola celda.

### Ejecutar importación:

```bash
npm start
```

El script mostrará:
```
✅ Encontrados 150 registros en Excel
✅ [1/150] 1234567890 - Juan Pérez
✅ [2/150] 9876543210 - María García
...
✅ IMPORTACIÓN COMPLETADA
   ✓ Clientes importados: 150
   ⚠️  Errores: 0
```

---

## 📱 PASO 2: USAR NEXUS PARA VER Y EDITAR DATOS

### Login
```
Usuario: Admin
Contraseña: 123
```

### Buscar un cliente
1. Ingresa el número de documento (ej: 1234567890)
2. Presiona Enter
3. Se cargarán todos los datos del cliente desde Firebase

### Secciones visibles:
- **Datos del Titular** ✓ Editable
- **Estado Financiero** (con detalles expandibles)
- **Garantías y Respaldo**
- **Asignación y Trámite**
- **Información de Contacto Adicional** ✓ Editable
- **Información Laboral** ✓ Editable
- **Información del Codeudor**
- **Historial Cronológico** (todas las gestiones)

---

## ✏️ PASO 3: EDITAR INFORMACIÓN DE CLIENTES

Desde Nexus puedes editar:

### Botones de Acción (debajo de Datos del Titular)

#### 🖊️ **Editar Datos**
- Abre modal de edición
- Campos editables:
  - Celular 1 y 2
  - Email
  - Teléfono Fijo
  - Dirección
  - Empresa donde Trabaja
  - Observaciones
  - Estado del Caso
- Los cambios se guardan **directamente en Firebase**
- ✅ Sincronización automática

Ejemplo:
```javascript
// Valores originales → Firebase
{
  cel1: "3001234567" → "3009999999"
  email: "juan@old.com" → "juan@new.com"
}
```

#### 🔄 **Sincronizar**
- Recarga los datos más recientes desde Firebase
- Útil después de cambios realizados desde otras fuentes
- Actualiza el historial de gestiones

#### 💾 **Backup**
- Crea una copia de seguridad del cliente
- Se guarda en: `clientes_backup/{documento}`
- Puedes restaurar en cualquier momento

#### ⬇️ **Descargar**
- Exporta datos del cliente como CSV
- Archivo: `cliente_{documento}.csv`

---

## 📝 PASO 4: REGISTRAR GESTIONES

### En la sección "Nueva Tipificación":

1. Selecciona un **Agrupador** (ej: "Contactado")
2. Selecciona una **Clase** (ej: "Posible acuerdo")
3. Agrega **Comentarios** opcionales
4. Clic en **"Guardar Gestión"**

### Lo que sucede automáticamente:
- Se registra la fecha y hora actual
- Se agrega al historial del cliente
- Se sincroniza con Firebase
- Aparece inmediatamente en "Historial Cronológico"

Formato de registro:
```
2026-02-19 15:30 [Contactado - Posible acuerdo] | Coment.: Cliente interesado en acuerdo
2026-02-15 10:00 [Sin Contacto - No Contesta] | Coment.: N/A
```

---

## 🔀 PASO 5: BIDIRECCIONALIDAD (Excel ↔ Firebase ↔ Nexus)

### Escenario: Cambios en Excel
```
1. Modificas datos en Excel
2. Ejecutas: npm start
3. Actualiza Firebase automáticamente
4. Nexus refleja los cambios al buscar
```

### Escenario: Cambios en Nexus
```
1. Editas datos en Nexus
2. Clic en "Editar Datos" → "Guardar Cambios"
3. Se actualiza Firebase automáticamente
4. El cliente ve los cambios reflejados
```

### Escenario: Cambios en Firebase directamente
```
1. (Cambios manuales en Firebase Console)
2. En Nexus, clic en "Sincronizar"
3. Descarga los datos más recientes
4. La interfaz se actualiza
```

---

## 💾 ESTRUCTURA DE DATOS EN FIREBASE

### Cliente completo en Firebase:
```json
{
  "clientes": {
    "1234567890": {
      "tipoDoc": "Cédula",
      "doc": "1234567890",
      "nombre": "Juan Pérez García",
      "cel1": "3001234567",
      "cel2": "3187654321",
      "email": "juan@email.com",
      "telefonoFijo": "6015551234",
      "direccion": "Calle Principal 123",
      "deudaTotal": 615000,
      "interesesMora": 75000,
      "capital": 500000,
      "interesesCorrientes": 25000,
      "seguros": 10000,
      "otros": 5000,
      "diasMora": 45,
      "fechaIniciMora": "2024-01-15",
      "franja_mora": "30-60 días",
      "entidad": "Banco ABC",
      "instancia": "Cobranza Administrativa",
      "abogado": "Dr. Carlos López",
      "estado": "En Cobranza",
      "noCredito": "C-2024-001",
      "nitEmpresa": "890123456-7",
      "empresaTrabaja": "TechCorp S.A.S.",
      "tipoGarantia": "Automóvil",
      "placa": "ABC-123X",
      "codeudor": "María García López",
      "cedulaCod": "9876543210",
      "celularCod": "3009876543",
      "observaciones": "Cliente trabajador...",
      "gestion_historica": "2026-02-19 15:30 [Contactado - Acuerdo] | ... | 2026-02-10 10:00 [Sin Contacto - No Contesta] | ...",
      "fecha_backup": "2026-02-19T15:30:00Z"
    }
  },
  
  "clientes_backup": {
    "1234567890": {
      "... datos completos del cliente ...",
      "fecha_backup": "2026-02-19T14:00:00Z"
    }
  }
}
```

---

## 🔐 SEGURIDAD Y RESPALDOS

### Backups automáticos:
```javascript
// Clic en "Backup" en Nexus
↓
Guarda en: clientes_backup/{documento}
↓
Se conservan versiones anteriores
↓
Puedes restaurar en cualquier momento
```

### Recuperar desde backup:
```javascript
// En Nexus (función disponible):
if (responderConfirmacion("¿Restaurar desde backup?")) {
    restaurarCliente()
    // Se restauran todos los datos del backup
}
```

---

## 📊 CAMPOS SINCRONIZADOS

### Siempre sincronizados (automático):
- ✅ Todos los datos personales (nombre, celular, email)
- ✅ Información financiera (deuda, intereses, días mora)
- ✅ Garantías y respaldos
- ✅ Información laboral
- ✅ Historial de gestiones (con fechas)
- ✅ Observaciones y notas

### Se actualizan en tiempo real:
- Cuando editas en Nexus → Firebase se actualiza al instante
- Cuando registras gestión → Se agrega al historial automáticamente
- Cuando sincronizas → Se traen datos frescos de Firebase

---

## 🚨 SOLUCIÓN DE PROBLEMAS

### Problema: Los cambios no se guardan
**Solución:**
1. Verifica conexión a internet
2. Revisa que Firebase esté accesible
3. Verifica que firebase-service-account.json exista
4. Abre consola (F12) busca mensajes de error

### Problema: Datos desactualizados en Nexus
**Solución:**
1. Clic en botón "Sincronizar"
2. Espera a que se carguen datos frescos
3. Si aún no funciona, busca el cliente nuevamente

### Problema: Gestiones no guarda
**Solución:**
1. Asegúrate de haber seleccionado tipificación
2. Verifica que el documento del cliente sea válido
3. Intenta nuevamente

### Problema: No puedo editar ciertos campos
**Solución:**
Los campos editables en Nexus son:
- ✅ Celular 1 y 2
- ✅ Email
- ✅ Teléfono Fijo
- ✅ Dirección
- ✅ Empresa
- ✅ Observaciones
- ✅ Estado

Otros campos se deben actualizar desde Excel + importación.

---

## 📈 FLUJO COMPLETO DE UN CASO

```
1. IMPORTACIÓN (Excel → Firebase)
   └─ npm start
   └─ Se cargan 150 clientes con toda su información

2. BÚSQUEDA (Nexus → Firebase)
   └─ Ingresas documento: 1234567890
   └─ Se descargan datos completos de Firebase
   └─ Se muestran en interfaz Nexus

3. EDICIÓN (Nexus → Firebase)
   └─ Editas: Email, Celular
   └─ Clic "Guardar Cambios"
   └─ Se actualiza Firebase automáticamente

4. GESTIÓN (Nexus → Firebase)
   └─ Tipificas como "Contactado - Acuerdo"
   └─ Agregas comentario
   └─ Clic "Guardar Gestión"
   └─ Se registra en historial con fecha/hora

5. SINCRONIZACIÓN (Firebase → Nexus)
   └─ Clic "Sincronizar"
   └─ Se traen datos frescos incluyendo nuevas gestiones
   └─ Se actualiza interfaz

6. RESPALDO (Nexus → Firebase)
   └─ Clic "Backup"
   └─ Se guarda copia en clientes_backup
   └─ Puedes restaurar en cualquier momento
```

---

## ⚙️ CONFIGURACIÓN AVANZADA

### Agregar más campos editables:

En `sync-manager.js`, sección `CAMPOS_EDITABLES`:

```javascript
const CAMPOS_EDITABLES = {
    cel1: 'Celular 1',
    cel2: 'Celular 2',
    email: 'Email',
    telefonoFijo: 'Teléfono Fijo',
    direccion: 'Dirección',
    empresaTrabaja: 'Empresa donde Trabaja',
    observaciones: 'Observaciones',
    estado: 'Estado del Caso',
    
    // AGREGA MÁS AQUÍ:
    // miCampo: 'Mi etiqueta',
};
```

### Personalizar reglas de validación:

En la función `guardarCambiosCliente()` en `sync-manager.js`:

```javascript
// Agregavalidaciones personalizadas
if (cambios.cel1 && !validarCelular(cambios.cel1)) {
    mostrarNexusInforma("Celular inválido");
    return;
}
```

---

## 📞 CONTACTO Y SOPORTE

Si experimentas problemas:

1. **Verificaclave de Firebase**: 
   - Descarga nueva desde Firebase Console
   
2. **Limpia caché del navegador**:
   - Ctrl+Shift+Delete → Vaciar todo

3. **Reinicia Nexus**:
   - Cierra navegador y abre nuevamente

4. **Revisa logs de Firebase**:
   - Firebase Console > Database > Reglas > Logs

---

## ✅ CHECKLIST FINAL

- ☐ Excel preparado con datos completos
- ☐ firebase-service-account.json descargado
- ☐ npm install ejecutado
- ☐ npm start completó exitosamente
- ☐ Todos los clientes importados a Firebase
- ☐ Nexus busca y carga clientes correctamente
- ☐ Edición de campos funciona
- ☐ Gestiones se registran con fecha
- ☐ Sincronización trae datos actualizados
- ☐ Backups se crean exitosamente

---

**¡Sistema listo para producción! 🚀**

Disfruta de tu sistema de gestión de cobranza con sincronización bidireccional completa.
