// ARCHIVO: sync-manager.js
// Gestión de sincronización entre Excel y Firebase

const CAMPOS_EDITABLES = {
    cel1: 'Celular 1',
    cel2: 'Celular 2',
    email: 'Email',
    telefonoFijo: 'Teléfono Fijo',
    direccion: 'Dirección',
    empresaTrabaja: 'Empresa donde Trabaja',
    observaciones: 'Observaciones',
    estado: 'Estado del Caso'
};

// Objeto global para almacenar datos del cliente actual
window.clienteActual = null;

/**
 * Abre el modal de edición de cliente
 */
window.abrirEditorCliente = function() {
    if (!window.clienteActual) return;
    
    const modal = document.getElementById('editor-modal');
    const contenido = document.getElementById('editor-contenido');
    
    contenido.innerHTML = `
        <h3 style="color: var(--gk-cyan); margin-bottom: 20px;">Editar Información de ${window.clienteActual.nombre}</h3>
        <div style="max-height: 500px; overflow-y: auto;">
    `;
    
    // Crear campos editables
    for (const [campo, label] of Object.entries(CAMPOS_EDITABLES)) {
        const valor = window.clienteActual[campo] || '';
        contenido.innerHTML += `
            <div style="margin-bottom: 15px;">
                <label style="color: var(--gk-cyan); font-size: 12px; display: block; margin-bottom: 5px; text-transform: uppercase;">${label}</label>
                <input type="text" id="edit-${campo}" value="${valor}" 
                       style="width: 100%; background: rgba(0,0,0,0.3); border: 1px solid var(--border-glass); 
                              padding: 10px; border-radius: 8px; color: white; box-sizing: border-box;">
            </div>
        `;
    }
    
    contenido.innerHTML += `
        </div>
        <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button onclick="guardarCambiosCliente()" style="flex: 1; padding: 12px; background: var(--gk-gradient); 
                   color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                ✓ Guardar Cambios
            </button>
            <button onclick="cerrarEditorCliente()" style="flex: 1; padding: 12px; background: rgba(255,255,255,0.1); 
                   color: white; border: 1px solid var(--border-glass); border-radius: 8px; cursor: pointer;">
                ✗ Cancelar
            </button>
        </div>
    `;
    
    modal.style.display = 'flex';
};

/**
 * Cierra el modal de edición
 */
window.cerrarEditorCliente = function() {
    document.getElementById('editor-modal').style.display = 'none';
};

/**
 * Guarda los cambios del cliente en Firebase
 */
window.guardarCambiosCliente = function() {
    if (!window.clienteActual) return;
    
    const cambios = {};
    let tuvoRespuesta = false;
    
    // Recopilar cambios
    for (const campo of Object.keys(CAMPOS_EDITABLES)) {
        const valor = document.getElementById(`edit-${campo}`).value;
        if (valor !== (window.clienteActual[campo] || '')) {
            cambios[campo] = valor;
            tuvoRespuesta = true;
        }
    }
    
    if (!tuvoRespuesta) {
        mostrarNexusInforma("No hay cambios para guardar.");
        return;
    }
    
    // Guardar en Firebase
    const doc = window.clienteActual.doc;
    const dbRef = ref(db, `clientes/${doc}`);
    
    update(dbRef, cambios)
        .then(() => {
            mostrarNexusInforma("✓ Datos actualizados exitosamente.");
            // Actualizar objeto local
            Object.assign(window.clienteActual, cambios);
            // Refrescar interfaz
            cerrarEditorCliente();
            setTimeout(() => buscarCliente(), 1000);
        })
        .catch((error) => {
            console.error('Error guardando cambios:', error);
            mostrarNexusInforma("✗ Error al guardar los cambios.");
        });
};

/**
 * Descarga datos de Firebase y exporta como CSV
 */
window.exportarDatos = function() {
    if (!window.clienteActual) return;
    
    const datos = window.clienteActual;
    const csv = generarCSV(datos);
    descargarArchivo(csv, `cliente_${datos.doc}.csv`);
};

/**
 * Sincroniza gestiones desde Firebase al historial
 */
window.sincronizarGestiones = function() {
    if (!window.clienteActual) {
        mostrarNexusInforma("Debes seleccionar un cliente primero.");
        return;
    }
    
    const doc = window.clienteActual.doc;
    const dbRef = ref(db, `clientes/${doc}`);
    
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            const datos = snapshot.val();
            window.clienteActual = datos;
            
            // Actualizar timeline
            const tl = document.getElementById('c-timeline');
            tl.innerHTML = "";
            const gestiones = (datos.gestion_historica || "Sin historial previo").split('|').reverse();
            gestiones.forEach(g => {
                if (g.trim()) {
                    const div = document.createElement('div');
                    div.className = 'timeline-item';
                    div.innerHTML = `<div class="timeline-date">REGISTRO OPERATIVO</div><div>${g.trim()}</div>`;
                    tl.appendChild(div);
                }
            });
            
            mostrarNexusInforma("✓ Gestiones sincronizadas correctamente.");
        }
    });
};

/**
 * Genera un CSV con los datos del cliente
 */
function generarCSV(datos) {
    const headers = Object.keys(datos);
    const valores = headers.map(h => `"${datos[h] || ''}"`).join(',');
    return headers.join(',') + '\n' + valores;
}

/**
 * Descarga un archivo
 */
function descargarArchivo(contenido, nombre) {
    const blob = new Blob([contenido], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    a.click();
    window.URL.revokeObjectURL(url);
}

/**
 * Importa actualización de datos desde CSV
 */
window.importarActualizacion = function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const csv = event.target.result;
                const lineas = csv.split('\n');
                if (lineas.length < 2) {
                    mostrarNexusInforma("Formato de CSV inválido.");
                    return;
                }
                
                const headers = lineas[0].split(',').map(h => h.trim().replace(/"/g, ''));
                const valores = lineas[1].split(',').map(v => v.trim().replace(/"/g, ''));
                
                const cambios = {};
                headers.forEach((header, index) => {
                    if (valores[index]) {
                        cambios[header] = valores[index];
                    }
                });
                
                // Actualizar en Firebase
                const doc = window.clienteActual.doc;
                const dbRef = ref(db, `clientes/${doc}`);
                update(dbRef, cambios)
                    .then(() => {
                        mostrarNexusInforma("✓ Datos importados correctamente.");
                        buscarCliente();
                    });
                    
            } catch (error) {
                console.error('Error importando CSV:', error);
                mostrarNexusInforma("✗ Error al procesar el archivo.");
            }
        };
        reader.readAsText(file);
    };
    input.click();
};

/**
 * Duplica un cliente (copia todos sus datos)
 */
window.duplicarCliente = function() {
    if (!window.clienteActual) return;
    
    const nuevoDoc = prompt('Ingresa el documento del nuevo cliente:', '');
    if (!nuevoDoc) return;
    
    const datosNuevos = { ...window.clienteActual, doc: nuevoDoc };
    
    set(ref(db, `clientes/${nuevoDoc}`), datosNuevos)
        .then(() => {
            mostrarNexusInforma(`✓ Cliente duplicado como: ${nuevoDoc}`);
        })
        .catch((error) => {
            mostrarNexusInforma("✗ Error al duplicar cliente.");
        });
};

/**
 * Restaura datos de una versión anterior (si existe backup)
 */
window.restaurarCliente = function() {
    if (!window.clienteActual) return;
    
    const doc = window.clienteActual.doc;
    const dbRef = ref(db, `clientes_backup/${doc}`);
    
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            const datosBackup = snapshot.val();
            set(ref(db, `clientes/${doc}`), datosBackup)
                .then(() => {
                    window.clienteActual = datosBackup;
                    mostrarNexusInforma("✓ Cliente restaurado desde backup.");
                    buscarCliente();
                });
        } else {
            mostrarNexusInforma("⚠️ No hay backup disponible para este cliente.");
        }
    });
};

/**
 * Crea un backup automático del cliente
 */
window.crearBackupCliente = function() {
    if (!window.clienteActual) return;
    
    const doc = window.clienteActual.doc;
    const backup = {
        ...window.clienteActual,
        fecha_backup: new Date().toISOString()
    };
    
    set(ref(db, `clientes_backup/${doc}`), backup)
        .then(() => {
            mostrarNexusInforma("✓ Backup creado correctamente.");
        });
};
