const admin = require('firebase-admin');
const XLSX = require('xlsx');
const path = require('path');

// Obtén la ruta del archivo de configuración
const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');

try {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://cobranzas-gk-default-rtdb.firebaseio.com'
    });
} catch (error) {
    console.error('Error cargando firebase-service-account.json');
    console.error('Descárgalo de Firebase Console > Configuración > Cuentas de servicio');
    process.exit(1);
}

const db = admin.database();

// MAPEO DE COLUMNAS DE EXCEL A CAMPOS DE FIREBASE
// Actualiza estos nombres según tus encabezados exactos de Excel
const COLUMN_MAPPING = {
    'TIPO_DOC': 'tipoDoc',
    'Documento': 'doc',
    'Nombre Completo': 'nombre',
    'Entidad': 'entidad',
    'Instancia': 'instancia',
    'Abogado': 'abogado',
    'Estado': 'estado',
    'No.Crédito': 'noCredito',
    'Capital': 'capital',
    'Intereses Corrientes': 'interesesCorrientes',
    'Seguros': 'seguros',
    'Intereses de mora': 'interesesMora',
    'Otros': 'otros',
    'SubTotal': 'deudaTotal',
    'F. inicio de mora': 'fechaIniciMora',
    '# Días en mora': 'diasMora',
    'TAREAS': 'tareas',
    'Dirección': 'direccion',
    'Celular1': 'cel1',
    'Celular2': 'cel2',
    'Teléfono fijo': 'telefonoFijo',
    'Correo electrónico': 'email',
    'NIT empresa donde labora act': 'nitEmpresa',
    'Empresa donde trabaja act': 'empresaTrabaja',
    'Garantía': 'garantia',
    'Tipo de Garantía': 'tipoGarantia',
    'No. Matrícula Inmobiliaria / No. Placa': 'placa',
    'Fondo de Garantías': 'fondoGarantias',
    'Cédula Codeudor': 'cedulaCod',
    'Nombre Codeudor': 'codeudor',
    'Dirección Codeudor': 'direccionCod',
    'Celular Codeudor': 'celularCod',
    'Teléfono fijo Codeudor': 'telefonoFijoCod',
    'Correo electrónico Codeudor': 'correoCod',
    'Observaciones': 'observaciones',
    'Fecha de Asignación': 'fechaAsignacion',
    'CONTAR': 'contar',
    'FRANJA MORA': 'franja_mora',
    'Fecha Gestión': 'fechaGestion',
    'Telefóno': 'telefonoAlterno',
    'MEJOR EFECTO': 'mejorEfecto',
    'Estado2': 'estado2',
    'Tipificación': 'tipificacion',
    'Gestión': 'gestion',
    'Tipo Gestión': 'tipoGestion'
};

async function importarClientes() {
    try {
        const archivoExcel = 'clientes.xlsx'; // Cambia si tu archivo tiene otro nombre
        
        if (!require('fs').existsSync(archivoExcel)) {
            console.error(`❌ No se encontró ${archivoExcel}`);
            console.error('Por favor coloca tu archivo Excel en la carpeta del proyecto.');
            process.exit(1);
        }

        console.log(`📂 Leyendo archivo: ${archivoExcel}`);
        const workbook = XLSX.readFile(archivoExcel);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const datos = XLSX.utils.sheet_to_json(worksheet);

        console.log(`✅ Encontrados ${datos.length} registros en Excel\n`);

        if (datos.length === 0) {
            console.warn('⚠️  El Excel está vacío o sin datos');
            process.exit(0);
        }

        // Mostrar encabezados encontrados
        console.log('📋 ENCABEZADOS DETECTADOS EN EXCEL:');
        console.log('-----------------------------------');
        const encabezadosExcel = Object.keys(datos[0]);
        encabezadosExcel.forEach((header, index) => {
            const mapeado = COLUMN_MAPPING[header] || '❌ NO MAPEADO';
            console.log(`  ${index + 1}. "${header}" → ${mapeado}`);
        });
        console.log('-----------------------------------\n');

        let contador = 0;
        let errores = 0;

        for (const fila of datos) {
            try {
                // Normalizar el documento (clave principal)
                const doc = String(fila['Documento'] || fila['doc'] || '').trim();
                
                if (!doc) {
                    console.warn('⚠️  Fila sin documento, saltando...');
                    errores++;
                    continue;
                }

                // Mapear columnas de Excel a estructura de Firebase
                const clienteData = {};
                
                for (const [columnaExcel, campoFirebase] of Object.entries(COLUMN_MAPPING)) {
                    const valor = fila[columnaExcel];
                    if (valor !== undefined && valor !== null && valor !== '') {
                        // Convertir números si es necesario
                        if (typeof valor === 'number') {
                            clienteData[campoFirebase] = valor;
                        } else {
                            clienteData[campoFirebase] = String(valor).trim();
                        }
                    }
                }

                // Asegurar que el documento esté incluido
                clienteData.doc = doc;

                // Agregar historial de gestión si no existe
                if (!clienteData.gestion_historica) {
                    clienteData.gestion_historica = 'IMPORTADO DESDE EXCEL';
                }

                // Convertir Subtotal a número
                if (clienteData.deudaTotal && typeof clienteData.deudaTotal === 'string') {
                    clienteData.deudaTotal = parseFloat(clienteData.deudaTotal.replace(/[^\d.-]/g, '')) || 0;
                }

                // Guardar en Firebase
                await db.ref(`clientes/${doc}`).set(clienteData);
                contador++;
                console.log(`✅ [${contador}/${datos.length}] ${doc} - ${clienteData.nombre || 'Sin nombre'}`);

            } catch (error) {
                errores++;
                console.error(`❌ Error procesando fila:`, error.message);
            }
        }

        console.log(`\n${'='.repeat(50)}`);
        console.log(`✅ IMPORTACIÓN COMPLETADA`);
        console.log(`   ✓ Clientes importados: ${contador}`);
        console.log(`   ⚠️  Errores: ${errores}`);
        console.log(`${'='.repeat(50)}\n`);
        
        process.exit(0);

    } catch (error) {
        console.error('❌ Error fatal en la importación:', error);
        process.exit(1);
    }
}

importarClientes();
