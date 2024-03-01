///////////////////////////////////////////Variables && Arrays


//Monto de la cuenta principal.
let cuentaPrincipal = 0

//Monto de la cuenta secundaria.
let cuentaSecundaria = 0

//Array para almacenar los movimientos.
const movimientos = []



////////////////////////////////////////////////////////////////////////Funciones



///////////////////////////////////////////Manejo de las cuentas



//Muestra el monto de la cuenta principal en el HTML.
function montoCuentaPrincipal() {
    document.getElementById('cuenta').textContent = `$${cuentaPrincipal.toLocaleString()}`
}

//Cambia y muestra el valor de ambas cuentas en el html.
const botonCambiarValor = document.getElementById('cambiarValor')
const numCuenta = document.getElementById('valorCuentaSecundaria')
const valorCuenta = document.getElementById('cuenta')
let cuentaActual = 'Cuenta 042-006784/0'

//Actualiza el numero de la cuenta en el hmtl.
function actualizarNumeroCuenta() {
    numCuenta.textContent = cuentaActual
    valorCuenta.textContent = '$' + (cuentaActual === 'Cuenta 042-006784/0' ? cuentaPrincipal : cuentaSecundaria).toLocaleString()
}

//Cambia entre las cuentas principal y secundaria.
function cambiarValor() {
    cuentaActual = cuentaActual === 'Cuenta 042-006784/0' ? 'Cuenta 032-007483/0' : 'Cuenta 042-006784/0';
    actualizarNumeroCuenta()
}

//Define la regla para permitir solo numeros en los campos de entrada.
function soloNumeros(event) {
    const tecla = event.key
    return /^\d$/.test(tecla) || tecla === '.' || tecla === ',' || event.code === 'Backspace' || event.code === 'Delete'
}

//Limita la entrada de texto en los campos de ingreso y transferencia.
function limitarEntrada(event) {
    let valor = event.target.value
    if (/[\.,]\d{3,}/.test(valor)) {
        event.target.value = valor.slice(0, -1)
    }
}

//Ingresa el dinero a la cuenta principal, retirando de la cuenta secundaria.
function ingresarDinero() {
    const ingresoDeDineroTexto = parseFloat(document.getElementById('ingreso').value.replace(',', '.'))

    if (isNaN(ingresoDeDineroTexto) || ingresoDeDineroTexto <= 0 || cuentaSecundaria <= 0 || cuentaSecundaria < ingresoDeDineroTexto) {
        document.getElementById('mensajeIng').innerText = cuentaSecundaria <= 0 || cuentaSecundaria < ingresoDeDineroTexto ? 'No se puede realizar el ingreso. Saldo insuficiente en la cuenta 032-007483/0' : 'Por favor, ingrese una cantidad válida'
        return
    }

    cuentaPrincipal += ingresoDeDineroTexto
    cuentaSecundaria -= ingresoDeDineroTexto

    const ingresoRedondeado = ingresoDeDineroTexto.toFixed(2)

    document.getElementById('mensajeIng').innerText = `Se han ingresado $${ingresoRedondeado} en la cuenta 042-006784/0`

    movimientos.push({ accion: 'Ingreso realizado a la cuenta 042-006784/0', resultado: ingresoDeDineroTexto })

    montoCuentaPrincipal()
    almacenaEnLocalStorage()
    mostrandoMovimientos()
    guardarCuentas()
    actualizarNumeroCuenta()
}

//Transfiere el dinero a la cuenta secundaria, retirando de la cuenta principal.
function transferirDinero() {
    const transferirDineroTexto = parseFloat(document.getElementById('transferir').value.replace(',', '.'))

    if (isNaN(transferirDineroTexto) || transferirDineroTexto <= 0 || transferirDineroTexto > cuentaPrincipal) {
        document.getElementById('mensajeTransf').innerText = transferirDineroTexto > cuentaPrincipal ? 'No se puede realizar la transferencia. Saldo insuficiente en la cuenta 042-006784/0' : 'Por favor, ingrese una cantidad válida'
        return
    }

    cuentaPrincipal -= transferirDineroTexto
    cuentaSecundaria += transferirDineroTexto

    const tranferenciaRedondeada = transferirDineroTexto.toFixed(2)

    document.getElementById('mensajeTransf').innerText = `Se han transferido $${tranferenciaRedondeada} en la cuenta 032-007483/0`

    movimientos.push({ accion: 'Transferencia realizada a la cuenta 032-007483/0', resultado: transferirDineroTexto })

    montoCuentaPrincipal()
    almacenaEnLocalStorage()
    mostrandoMovimientos()
    guardarCuentas()
    actualizarNumeroCuenta()
}



///////////////////////////////////////////LocalStorage



//Guardar cuentas en el LocalStorage.
function guardarCuentas() {
    localStorage.setItem('cuentaPrincipal', cuentaPrincipal)
    localStorage.setItem('cuentaSecundaria', cuentaSecundaria)
}

//Obtiene las cuentas guardadas del LocalStorage.
function obtenerCuentasGuardadas() {
    const cuentaPrincipalGuardada = localStorage.getItem('cuentaPrincipal')
    const cuentaSecundariaGuardada = localStorage.getItem('cuentaSecundaria')
    return {
        cuentaPrincipal: parseFloat(cuentaPrincipalGuardada),
        cuentaSecundaria: parseFloat(cuentaSecundariaGuardada)
    };
}

//Obtiene las cuentas por defecto del archivo JSON.
function obtenerCuentasPorDefecto(data) {
    return {
        cuentaPrincipal: data.cuentas.cuentaPrincipal,
        cuentaSecundaria: data.cuentas.cuentaSecundaria
    };
}

//Obtiene los movimientos almacenados del LocalStorage.
function obtenerMovimientosAlmacenados() {
    const movimientosRecuperadosEnJson = localStorage.getItem('movimientosGuardados')
    try {
        return JSON.parse(movimientosRecuperadosEnJson) || []
    } catch (error) {
        console.error('Error al parsear los movimientos almacenados:', error)
        return []
    }
}



///////////////////////////////////////////Manejo del historial/Movimientos



//Limpiar Movimientos Almacenados.
function limpiarMovimientos() {
    movimientos.length = 0
    almacenaEnLocalStorage()
    mostrandoMovimientos()
}

//Devuelve un numero en formato de cadena de texto.
function formatearNumero(numero) {
    return numero.toLocaleString('es-ES', { maximumFractionDigits: 2 })
}

//Genera el contenido de los movimientos a mostrar en el TextArea.
function generarContenidoEnMovimientos(movimientos) {
    if (movimientos.length > 0) {
        Toastify({

            text: "Nuevo Movimiento Guardado",

            duration: 3000

        }).showToast();
        return movimientos.map(item => `${item.accion} = $${formatearNumero(item.resultado)}`).join('\n')
    } else {
        return 'Los movimientos almacenados son nulos.'
    }
}

//Muestra los movimientos almacenados en el TextArea.
function mostrandoMovimientos() {
    const textArea = document.getElementById('movimientos')
    const movimientosRecuperados = obtenerMovimientosAlmacenados()
    const contenidoMovimientos = generarContenidoEnMovimientos(movimientosRecuperados)
    textArea.value = contenidoMovimientos.toLocaleString('es-ES', { maximumFractionDigits: 2 })
}



///////////////////////////////////////////JSON



//Carga las cuentas desde el archivo JSON.
function cargarCuentas() {
    // Obtiene las cuentas almacenadas en el localStorage.
    const cuentasGuardadas = obtenerCuentasGuardadas()

    // Verifica si las cuentas guardadas son válidas.
    if (!isNaN(cuentasGuardadas.cuentaPrincipal) && !isNaN(cuentasGuardadas.cuentaSecundaria)) {
        cuentaPrincipal = cuentasGuardadas.cuentaPrincipal
        cuentaSecundaria = cuentasGuardadas.cuentaSecundaria
        montoCuentaPrincipal()
        return;
    }

    // Si no hay cuentas válidas almacenadas, carga desde el JSON.
    fetch('../json/index.json')
        .then(response => response.json())
        .then(data => {
            const cuentasPorDefecto = obtenerCuentasPorDefecto(data)
            cuentaPrincipal = cuentasPorDefecto.cuentaPrincipal
            cuentaSecundaria = cuentasPorDefecto.cuentaSecundaria
            montoCuentaPrincipal()
        })
        .catch(error => console.error('Error al cargar las cuentas:', error))
}

//Convierte el array 'movimientos' a JSON y lo almacenado en el localStorage.
function almacenaEnLocalStorage() {
    //El array 'movimientos' se convierte en JSON.
    const movimientosJSON = JSON.stringify(movimientos)
    //Almacena en el localStorage, clave 'movimientosGuardados' y valor 'movimientosJSON'.
    localStorage.setItem('movimientosGuardados', movimientosJSON)
}



///////////////////////////////////////////Manejo Pago de Tarjetas



//Establece un valor en un campo de entrada(input) con un formato especifico.
function setInputValueMaster(value) {
    // Formatear el valor con puntos y comas.
    const formattedValue = value.toLocaleString('es-ES')

    // Establecer el valor formateado en el campo de entrada.
    document.getElementById('uniqueId1').value = formattedValue

    // Mostrar el símbolo de pesos en un elemento adicional.
    document.getElementById('pesos').textContent = '$'
}

//Variable para el contado de pago Minimo Tarjeta Master.
let contadorPagosMaster = 0;

//Paga la Tarjeta Master.
function pagarMaster() {
    let monto = parseFloat(document.getElementById('uniqueId1').value.replace('.', '').replace(',', '.'))

    if (cuentaPrincipal < monto) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Revisa tu saldo en la cuenta",
        });
        document.getElementById('btnMaster').innerText = 'Saldo Insuficiente'
        return
    }

    if (isNaN(monto)) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ingresa un numero valido",
        });
        return
    }

    cuentaPrincipal -= monto;

    // Agregar el pago a los movimientos.
    const accion = `Pago realizado Tarjeta Master`
    movimientos.push({ accion, resultado: monto })

    // Almacenar en el local storage.
    montoCuentaPrincipal()
    almacenaEnLocalStorage()
    mostrandoMovimientos()
    guardarCuentas()
    actualizarNumeroCuenta()

    if (monto === 50000) {
        contadorPagosMaster++;
        if (contadorPagosMaster === 6) {
            // Cambiar el texto del botón a "Pagado"
            document.getElementById('btnMaster').innerText = 'Pagado'

            // Desactivar el botón
            document.getElementById('btnMaster').disabled = true
            localStorage.setItem('estadoBoton', 'pagado')
        }
    }
    // Desactivar el botón
    if (monto == 300000) {
        document.getElementById('btnMaster').innerText = 'Pagado'
        document.getElementById('btnMaster').disabled = true
        localStorage.setItem('estadoBoton', 'pagado')
    }
}

////Establece un valor en un campo de entrada(input) con un formato especifico.
function setInputValueVisa(value) {
    // Formatear el valor con puntos y comas.
    const formattedValue = value.toLocaleString('es-ES')

    // Establecer el valor formateado en el campo de entrada.
    document.getElementById('uniqueId2').value = formattedValue

    // Mostrar el símbolo de pesos en un elemento adicional.
    document.getElementById('pesos2').textContent = '$'
}

//Variable que controla cantidad de pagos Minimo Visa.
let contadorPagosVisa = 0;

//Paga la Tarjeta Visa.
function pagarVisa() {
    let monto = parseFloat(document.getElementById('uniqueId2').value.replace('.', '').replace(',', '.'))

    if (cuentaPrincipal < monto) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Revisa tu saldo en la cuenta",
        });
        document.getElementById('btnVisa').innerText = 'Saldo Insuficiente'
        return;
    }

    if (isNaN(monto)) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ingresa un numero valido",
        });
        return;
    }

    cuentaPrincipal -= monto;

    // Agregar el pago a los movimientos.
    const accion = `Pago realizado Tarjeta Visa`
    movimientos.push({ accion, resultado: monto })

    // Almacenar en el local storage.
    montoCuentaPrincipal()
    almacenaEnLocalStorage()
    mostrandoMovimientos()
    guardarCuentas()
    actualizarNumeroCuenta()
    
    if (monto === 100000) {
        contadorPagosVisa++
        if (contadorPagosVisa === 6) {
            // Cambiar el texto del botón a "Pagado".
            document.getElementById('btnVisa').innerText = 'Pagado'

            // Desactivar el botón.
            document.getElementById('btnVisa').disabled = true;
            localStorage.setItem('estadoBotonVisa', 'pagado')
        }
    }
    // Desactivar el botón.
    if (monto == 600000) {
        document.getElementById('btnVisa').innerText = 'Pagado'
        document.getElementById('btnVisa').disabled = true
        localStorage.setItem('estadoBotonVisa', 'pagado')
    }
}



///////////////////////////////////////////Api Dolar Oficial


//Llama la api
async function obtenerDolarOficial() {
    try {
        const response = await fetch("https://dolarapi.com/v1/dolares/oficial")
        const data = await response.json()
        
        // Acceder a las propiedades necesarias del objeto de datos
        const compra = data.compra
        const venta = data.venta
        const fechaActualizacion = data.fechaActualizacion

        // Mostrar la información en el HTML
        mostrarDolarOficial(compra, venta, fechaActualizacion)
    } catch (error) {
        console.error('Error al obtener el valor del dólar oficial:', error)
    }
}

//Muestra la api en el hmtl
function mostrarDolarOficial(compra, venta, fechaActualizacion) {
    // Crear un objeto Date a partir de la fecha de actualización
    const fecha = new Date(fechaActualizacion)

    // Obtener los componentes de la fecha y hora
    const dia = fecha.getDate()
    const mes = fecha.getMonth() + 1 // Se suma 1 porque los meses comienzan en 0
    const anio = fecha.getFullYear()
    const hora = fecha.getHours()
    const minutos = fecha.getMinutes()

    // Formatear la fecha y hora para que sean más legibles
    const fechaFormateada = `${dia}/${mes}/${anio}`
    const horaFormateada = `${hora}:${minutos}`

    // Mostrar la información en el HTML
    const valorDolarElemento = document.getElementById('valorDolar')
    valorDolarElemento.innerHTML = `
        <h4>Valor del dólar oficial</h4>
        <ul>
            <li>Compra: ${compra}</li>
            <li>Venta: ${venta}</li>
            <li>Fecha de actualización: ${fechaFormateada} - ${horaFormateada}</li>
        </ul>
    `
}

obtenerDolarOficial()



///////////////////////////////////////////Pagar Impuestos



//Paga el impuesto Aysa.
function pagarAysa() {
    // Obtener el elemento que contiene el monto de Aysa.
    const montoElement = document.getElementById('aysaMonto')

    // Obtener el texto del monto y eliminar el símbolo de dólar y las comas.
    const montoTexto = montoElement.textContent.replace('$', '').replace('.', '')

    // Convertir la cadena a un número flotante.
    const monto = parseFloat(montoTexto)

    // Verificar si el monto es mayor que el saldo disponible en la cuenta principal.
    if (cuentaPrincipal < monto) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Revisa tu saldo en la cuenta",
        });
        const botonPagar = montoElement.nextElementSibling; // El siguiente elemento es el botón.
        botonPagar.innerText = 'Saldo Insuficiente'
        return; // Salir de la función si el saldo es insuficiente.
    }

    // Restar el monto de Aysa del valor de la cuenta principal.
    cuentaPrincipal -= monto

    const accion = `Pago del servicio AYSA por`
    movimientos.push({ accion, resultado: monto })

    // Desactivar el botón de pago y cambiar su texto a "Pagado".
    document.getElementById('btnAysa').innerText = 'Pagado'
    document.getElementById('btnAysa').disabled = true

    // Guardar el estado del botón en el localStorage.
    localStorage.setItem('estadoBotonAysa', 'pagado')

    // Actualizar la visualización del monto en la cuenta principal.
    montoCuentaPrincipal()
    almacenaEnLocalStorage()
    mostrandoMovimientos()
    guardarCuentas()
    actualizarNumeroCuenta()
}

//Paga el impuesto Edenor.
function pagarEdenor() {
    // Obtener el elemento que contiene el monto de Aysa.
    const montoElement = document.getElementById('edenorMonto')

    // Obtener el texto del monto y eliminar el símbolo de dólar y las comas.
    const montoTexto = montoElement.textContent.replace('$', '').replace('.', '')

    // Convertir la cadena a un número flotante.
    const monto = parseFloat(montoTexto)

    // Verificar si el monto es mayor que el saldo disponible en la cuenta principal.
    if (cuentaPrincipal < monto) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Revisa tu saldo en la cuenta",
        });
        const botonPagar = montoElement.nextElementSibling; // El siguiente elemento es el botón.
        botonPagar.innerText = 'Saldo Insuficiente'

        return; // Salir de la función si el saldo es insuficiente.
    }

    // Restar el monto de Aysa del valor de la cuenta principal.
    cuentaPrincipal -= monto;

    const accion = `Pago del servicio Edenor por`
    movimientos.push({ accion, resultado: monto })

    // Desactivar el botón de pago y cambiar su texto a "Pagado".
    document.getElementById('btnEdenor').innerText = 'Pagado'
    document.getElementById('btnEdenor').disabled = true

    // Guardar el estado del botón en el localStorage.
    localStorage.setItem('estadoBotonEdenor', 'pagado')

    // Actualizar la visualización del monto en la cuenta principal.
    montoCuentaPrincipal()
    almacenaEnLocalStorage()
    mostrandoMovimientos()
    guardarCuentas()
    actualizarNumeroCuenta()
}

//Pagar Metro Gas.
function pagarMetroGas() {
    // Obtener el elemento que contiene el monto de Aysa.
    const montoElement = document.getElementById('metroGasMonto')

    // Obtener el texto del monto y eliminar el símbolo de dólar y las comas.
    const montoTexto = montoElement.textContent.replace('$', '').replace('.', '')

    // Convertir la cadena a un número flotante.
    const monto = parseFloat(montoTexto)

    // Verificar si el monto es mayor que el saldo disponible en la cuenta principal.
    if (cuentaPrincipal < monto) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Revisa tu saldo en la cuenta",
        });
        const botonPagar = montoElement.nextElementSibling; // El siguiente elemento es el botón. 
        botonPagar.innerText = 'Saldo Insuficiente'
        return; // Salir de la función si el saldo es insuficiente.
    }

    // Restar el monto de Aysa del valor de la cuenta principal.
    cuentaPrincipal -= monto

    const accion = `Pago del servicio Metro Gas por`
    movimientos.push({ accion, resultado: monto })

    // Desactivar el botón de pago y cambiar su texto a "Pagado".
    document.getElementById('btnMetroGas').innerText = 'Pagado'
    document.getElementById('btnMetroGas').disabled = true

    // Guardar el estado del botón en el localStorage.
    localStorage.setItem('estadoBotonMetroGas', 'pagado')

    // Actualizar la visualización del monto en la cuenta principal.
    montoCuentaPrincipal()
    almacenaEnLocalStorage()
    mostrandoMovimientos()
    guardarCuentas()
    actualizarNumeroCuenta()
}



montoCuentaPrincipal()



////////////////////////////////////////////////////////////////////////EventListener



//Evento para mostrar los movimientos al cargar la pagina.
document.addEventListener('DOMContentLoaded', function () {
    const movimientosRecuperadosEnJson = localStorage.getItem('movimientosGuardados')
    if (movimientosRecuperadosEnJson) {
        try {
            const movimientosRecuperados = JSON.parse(movimientosRecuperadosEnJson)
            movimientos.push(...movimientosRecuperados)
        } catch (error) {
            console.error('Error al parsear el historial recuperado', error)
        }
    }
    mostrandoMovimientos()
})

//Evento para mostrat los movimientos en el LocalStorage al cargar la pagina.
document.addEventListener('DOMContentLoaded', almacenaEnLocalStorage)

//Evento para mostrar los movimientos al cargar la pagina.
document.addEventListener('DOMContentLoaded', mostrandoMovimientos)

//Evento para cargar las cuentas al cargar la pagina.
document.addEventListener('DOMContentLoaded', function () {
    cargarCuentas()
    almacenaEnLocalStorage()
    mostrandoMovimientos()
})

//Evento para limpiar los movimientos al hacer clic en un boton.
document.addEventListener('DOMContentLoaded', function () {
    const btnLimpiar = document.getElementById('limpiarMovimientos')
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', limpiarMovimientos)
    }
})

//Eventos para limitar la entrada de texto en los campos de ingreso y tranferencia.
const ingresoInput = document.getElementById('ingreso')
ingresoInput.addEventListener('input', limitarEntrada)

const transferenciaInput = document.getElementById('transferir')
transferenciaInput.addEventListener('input', limitarEntrada)

//Eventos para borrar contenido de los campos de ingreso y transferencia al hacer clic en un boton.
document.getElementById('borrarTrans').addEventListener('click', function () {
    document.getElementById('transferir').value = ''
})

document.getElementById('borrarIng').addEventListener('click', function () {
    document.getElementById('ingreso').value = ''
})

// Evento para Cambiar el valor del boton 'pagar' la Tarjeta Master.
document.addEventListener('DOMContentLoaded', function () {
    // Verificar si el estado del botón está guardado en el localStorage.
    const estadoBoton = localStorage.getItem('estadoBoton')
    if (estadoBoton === 'pagado') {
        // Cambiar el texto del botón a "Pagado".
        document.getElementById('btnMaster').innerText = 'Pagado'

        // Desactivar el botón.
        document.getElementById('btnMaster').disabled = true
    }
});

//Evento para cambiar el valor del boton 'pagar' Tarjeta Visa.
document.addEventListener('DOMContentLoaded', function () {
    // Verificar si el estado del botón está guardado en el localStorage.
    const estadoBoton = localStorage.getItem('estadoBotonVisa')
    if (estadoBoton === 'pagado') {
        // Cambiar el texto del botón a "Pagado".
        document.getElementById('btnVisa').innerText = 'Pagado'

        // Desactivar el botón.
        document.getElementById('btnVisa').disabled = true
    }
});

//Evento para cambiar el valor del boton 'pagar' Impuesto Aysa.
document.addEventListener('DOMContentLoaded', function () {
    // Verificar si el estado del botón está guardado en el localStorage
    const estadoBoton = localStorage.getItem('estadoBotonAysa')
    if (estadoBoton === 'pagado') {
        // Cambiar el texto del botón a "Pagado".
        document.getElementById('btnAysa').innerText = 'Pagado'

        // Desactivar el botón.
        document.getElementById('btnAysa').disabled = true
    }
});

//Evento para cambiar el valor del boton 'pagar' Impuesto Edenor.
document.addEventListener('DOMContentLoaded', function () {
    // Verificar si el estado del botón está guardado en el localStorage.
    const estadoBoton = localStorage.getItem('estadoBotonEdenor')
    if (estadoBoton === 'pagado') {
        // Cambiar el texto del botón a "Pagado".
        document.getElementById('btnEdenor').innerText = 'Pagado'

        // Desactivar el botón
        document.getElementById('btnEdenor').disabled = true
    }
});

//Evento para cambiar el valor del boton 'pagar' Impuesto Metro Gas.
document.addEventListener('DOMContentLoaded', function () {
    // Verificar si el estado del botón está guardado en el localStorage.
    const estadoBoton = localStorage.getItem('estadoBotonMetroGas')
    if (estadoBoton === 'pagado') {
        // Cambiar el texto del botón a "Pagado".
        document.getElementById('btnMetroGas').innerText = 'Pagado'

        // Desactivar el botón
        document.getElementById('btnMetroGas').disabled = true
    }
});

//Evento al boton para cambiar entre cuentas.
botonCambiarValor.addEventListener('click', cambiarValor)