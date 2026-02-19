# 📊 GUÍA: Importar Clientes desde Excel a Nexus

## 🎯 Requisitos Previos
- **Node.js** instalado (descárgalo de https://nodejs.org/)
- Tu archivo Excel (`clientes.xlsx`) con los datos de clientes
- Archivo de configuración de Firebase (`firebase-service-account.json`)

---

## 📋 PASO 1: Preparar tu archivo Excel

Tu Excel debe tener **obligatoriamente** la columna `Documento` que será la clave para identificar cada cliente.

**Encabezados esperados:**
```
TIPO_DOC | Documento | Nombre Completo | Entidad | Instancia | Abogado | Estado | No.Crédito
Capital | Intereses Corrientes | Seguros | Intereses de mora | Otros | SubTotal
F. inicio de mora | # Días en mora | TAREAS | Dirección | Celular1 | Celular2
Teléfono fijo | Correo electrónico | NIT empresa donde labora act | Empresa donde trabaja act
Garantía | Tipo de Garantía | No. Matrícula Inmobiliaria / No. Placa | Fondo de Garantías
Cédula Codeudor | Nombre Codeudor | Dirección Codeudor | Celular Codeudor | Teléfono fijo Codeudor
Correo electrónico Codeudor | Observaciones | Fecha de Asignación | CONTAR | FRANJA MORA
Fecha Gestión | Telefóno | MEJOR EFECTO | Estado2 | Tipificación | Gestión | Tipo Gestión
```

**NOTA:** Si tus encabezados son ligeramente diferentes, edita el archivo `import.js` en la sección `COLUMN_MAPPING` para hacer coincidir los nombres exactos de tus columnas.

---

## 🔑 PASO 2: Obtener la Clave de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto **cobranzas-gk**
3. Ve a **⚙️ Configuración del Proyecto** (arriba a la derecha)
4. Haz clic en la pestaña **"Cuentas de Servicio"**
5. Haz clic en **"Generar nueva clave privada"**
6. Se descargará un archivo JSON → **Guárdalo en tu carpeta de proyecto como `firebase-service-account.json`**

⚠️ **SEGURIDAD:** Este archivo contiene credenciales. No lo subas a GitHub ni lo compartas.

---

## 💻 PASO 3: Instalar Dependencias

Abre PowerShell o CMD en tu carpeta de proyecto y ejecuta:

```bash
npm install
```

Esto instalará:
- `firebase-admin` (para conectarse a Firebase)
- `xlsx` (para leer archivos Excel)

---

## 🚀 PASO 4: Ejecutar la Importación

Coloca tu archivo `clientes.xlsx` en la carpeta del proyecto y ejecuta:

```bash
npm start
```

O también puedes ejecutar:

```bash
node import.js
```

---

## 📊 ¿Qué pasará?

El script mostrará:
1. ✅ Los encabezados detectados en Excel
2. ✅ Los campos que serán mapeados a Firebase
3. ✅ El progreso de importación cliente por cliente
4. ✅ Un resumen final con cantidad de clientes importados

**Ejemplo de salida:**
```
📂 Leyendo archivo: clientes.xlsx
✅ Encontrados 150 registros en Excel

📋 ENCABEZADOS DETECTADOS EN EXCEL:
-----------------------------------
  1. "Documento" → doc
  2. "Nombre Completo" → nombre
  3. "Celular1" → cel1
  ...
-----------------------------------

✅ [1/150] 1234567890 - Juan Pérez
✅ [2/150] 9876543210 - María García
...

==================================================
✅ IMPORTACIÓN COMPLETADA
   ✓ Clientes importados: 150
   ⚠️  Errores: 0
==================================================
```

---

## 🔄 ¿Qué se importa?

Cada cliente en tu Excel se guardará en Firebase con estos campos:

| Campo Excel | Campo Firebase | Uso |
|---|---|---|
| Documento | `doc` | Identificador único del cliente |
| Nombre Completo | `nombre` | Nombre del deudor |
| Celular1 | `cel1` | Celular principal |
| Celular2 | `cel2` | Celular secundario (opcional) |
| Correo electrónico | `email` | Email del cliente |
| SubTotal | `deudaTotal` | Deuda total |
| Intereses de mora | `interesesMora` | Intereses acumulados |
| # Días en mora | `diasMora` | Días de mora |
| Entidad | `entidad` | Banco o entidad que origina la deuda |
| Instancia | `instancia` | Nivel de cobranza |
| Abogado | `abogado` | Abogado asignado |
| Garantía | `garantia` | Tipo de garantía |
| Nombre Codeudor | `codeudor` | Nombre completo del codeudor |
| Capital | `capital` | Capital adeudado |
| Intereses Corrientes | `interesesCorrientes` | Intereses no vencidos |
| Seguros | `seguros` | Gastos de seguros |
| Otros | `otros` | Otros gastos |
| Dirección | `direccion` | Dirección del cliente |
| Teléfono fijo | `telefonoFijo` | Teléfono de casa |
| NIT empresa donde labora act | `nitEmpresa` | NIT de empresa |
| Empresa donde trabaja act | `empresaTrabaja` | Nombre de empresa |
| Tipo de Garantía | `tipoGarantia` | Tipo de bien en garantía |
| No. Matrícula Inmobiliaria / No. Placa | `placa` | Placa o matrícula |
| Cédula Codeudor | `cedulaCod` | Documento del codeudor |
| Dirección Codeudor | `direccionCod` | Dirección del codeudor |
| Celular Codeudor | `celularCod` | Celular del codeudor |
| Teléfono fijo Codeudor | `telefonoFijoCod` | Teléfono casa codeudor |
| Correo electrónico Codeudor | `correoCod` | Email codeudor |
| Observaciones | `observaciones` | Notas adicionales |
| Fecha de Asignación | `fechaAsignacion` | Cuándo se asignó el caso |
| FRANJA MORA | `franja_mora` | Rango de días en mora |
| Fecha Gestión | `fechaGestion` | Última gestión realizada |
| Estado | `estado` | Estado actual del caso |

---

## 🆘 Solución de Problemas

### ❌ Error: "No se encontró firebase-service-account.json"
**Solución:** Descarga el archivo desde Firebase Console como se explica en PASO 2.

### ❌ Error: "ENOENT: no such file or directory, open 'clientes.xlsx'"
**Solución:** Asegúrate que `clientes.xlsx` esté en la misma carpeta donde ejecutas el comando.

### ❌ Error: "Sheet ... not found"
**Solución:** Verifica que tu archivo Excel tenga datos en la primera hoja.

### ❌ Se importaron algunos con errores
**Solución:** Revisa que la columna `Documento` tenga valores únicos y sin espacios en blanco.

### ✅ Importación exitosa pero no veo los datos en Nexus
**Solución:** 
1. Abre Nexus y haz login (Admin / 123)
2. Intenta buscar un cliente por su número de documento
3. Si aún no aparece, revisa en Firebase Console > Base de datos para confirmar que se guardó

---

## 📝 Personalizar el Mapeo

Si tus encabezados de Excel son diferentes, edita el archivo `import.js`:

```javascript
// Busca esta sección (línea ~30):
const COLUMN_MAPPING = {
    'Documento': 'doc',
    'Nombre Completo': 'nombre',
    // ... más campos
};
```

Cambia los nombres **exactos** de las izquierda (encabezados de Excel) según lo que veas en tu archivo.

---

## ✨ ¡Listo!

Después de importar, puedes:
- ✅ Buscar clientes en Nexus
- ✅ Registrar gestiones
- ✅ Ver historial de llamadas
- ✅ Exportar reportes

¿Dudas? Verifica la consola del navegador (F12 > Console) para mensajes de error detallados.
