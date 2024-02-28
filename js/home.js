///////////////////////////////////Variables && Arrays

let cuentaPrincipal = 0
let cuentaSecundaria = 0
const movimientos = []


///////////////////////////////////////////////////////////Funciones



///////////////////////////////////Manejo de las cuentas



//Cargar cuentas JSON
function cargarCuentas() {
    fetch('../json/index.json')
        .then(response => response.json())
        .then(data => {
            const cuentas = data.cuentas
            cuentaPrincipal = data.cuentas.cuentaPrincipal
            cuentaSecundaria = data.cuentas.cuentaSecundaria

            const cuentaPrincipalGuardada = localStorage.getItem('cuentaPrincipal')
            const cuentaSecundariaGuardada = localStorage.getItem('cuentaSecundaria')

            if (cuentaPrincipalGuardada !== null && cuentaSecundariaGuardada !== null) {
                cuentaPrincipal = parseFloat(cuentaPrincipalGuardada)
                cuentaSecundaria = parseFloat(cuentaSecundariaGuardada)
            } else {
                cuentaPrincipal = cuentas.cuentaPrincipal
                cuentaSecundaria = cuentas.cuentaSecundaria
            }
            montoCuentaPrincipal()
        })
        .catch(error => console.error('Error al cargar las cuentas:', error))
}


//Guardar cuentas en el LocalStorage
function guardarCuentas() {
    localStorage.setItem('cuentaPrincipal', cuentaPrincipal)
    localStorage.setItem('cuentaSecundaria', cuentaSecundaria.toString())
}


//Muestra el monto de la cuenta principal
function montoCuentaPrincipal() {
    let montoCuenta = document.getElementById('cuenta')
    montoCuenta.textContent = '$' + cuentaPrincipal.toFixed(2)
}




//Ingresa el dinero a la cuenta principal, sacando de la cuenta secundaria
function ingresarDinero() {
    let ingresoDeDineroTexto = document.getElementById('ingreso').value
    let ingresoDeDineroNumerico = parseFloat(ingresoDeDineroTexto.replace(/[^\d.]/g, ''))

    if (isNaN(ingresoDeDineroNumerico) || ingresoDeDineroNumerico <= 0) {
        document.getElementById('mensajeIng').innerText = 'Por favor, ingrese una cantidad valida'
        return
    }

    if (cuentaSecundaria <= 0 || cuentaSecundaria < ingresoDeDineroNumerico) {
        document.getElementById('mensajeIng').innerText = 'No se puede realizar el ingreso.Saldo insuficiente en la cuenta'
        return
    }
    cuentaPrincipal += ingresoDeDineroNumerico
    cuentaSecundaria -= ingresoDeDineroNumerico
    document.getElementById('mensajeIng').innerText = "Se han ingresado $" + ingresoDeDineroNumerico.toLocaleString() + " en la cuenta 042-006784/0"
    let resultado = ingresoDeDineroNumerico
    let accion = 'Ingreso realizado a la cuenta 042-006784/0'
    movimientos.push({ accion, resultado })
    montoCuentaPrincipal()
    almacenaEnLocalStorage()
    mostrandoMovimientos()
    guardarCuentas()
    actualizarNumeroCuenta()
}


//Transfiere el dinero a la cuenta secundaria, sacando de la cuenta principal
function transferirDinero() {
    let transferirDineroTexto = document.getElementById('transferir').value
    let transferirDineroNumerico = parseFloat(transferirDineroTexto.replace(/[^\d.]/g, ''))

    if (isNaN(transferirDineroNumerico) || transferirDineroNumerico <= 0) {
        document.getElementById('mensajeTransf').innerText = 'Por favor, ingrese una cantidad valida'
        return
    }

    if (cuentaPrincipal < transferirDineroNumerico) {
        document.getElementById('mensajeTransf').innerText = 'No se puede realizar la transferencia. Saldo insuficiente en la cuenta 042-006784/0'
        return
    }
    cuentaPrincipal -= transferirDineroNumerico
    cuentaSecundaria += transferirDineroNumerico
    document.getElementById('mensajeTransf').innerText = 'Se han transferido $' + transferirDineroNumerico.toLocaleString() + ' en la cuenta 032-007483/0'
    let resultado = transferirDineroNumerico
    let accion = 'Transferencia realizada a la cuenta 032-007483/0'
    movimientos.push({ accion, resultado })
    montoCuentaPrincipal()
    almacenaEnLocalStorage()
    mostrandoMovimientos()
    guardarCuentas()
    actualizarNumeroCuenta()
}




//Tanto como en los cuadros de ingresa y transferir dinero, crea la regla de solo numeros
function soloNumeros(event) {
    let tecla = event.which || event.keyCode
    if (tecla == 8 || tecla == 46) {
        return true
    }
    if (tecla < 48 || tecla > 57) {
        return false
    }
    return true
}


//Limpiar Movimientos Almacenados
function limpiarMovimientos() {
    movimientos.length = 0
    almacenaEnLocalStorage()
    mostrandoMovimientos()
}

////////////////////////////////////Manejo del historial/Movimientos



//Pasaje del array 'movimientos' a JSON y Almacenado en el localStorage
function almacenaEnLocalStorage() {
    //El array 'movimientos' se convierte en JSON.
    const movimientosJSON = JSON.stringify(movimientos)
    //Almacena en el localStorage, clave 'movimientosGuardados' y valor 'movimientosJSON'
    localStorage.setItem('movimientosGuardados', movimientosJSON)
}


//Mostrar localStorage como movimientos
function mostrandoMovimientos() {
    const textArea = document.getElementById('movimientos')
    const movimientosRecuperadosEnJson = localStorage.getItem('movimientosGuardados')
    if (movimientosRecuperadosEnJson !== null) {
        try {
            const movimientosRecuperados = JSON.parse(movimientosRecuperadosEnJson)
            if (Array.isArray(movimientosRecuperados) && movimientosRecuperados.length > 0) {
                const contenidoMovimientosRecuperados = movimientosRecuperados.map(item => `${item.accion} = $${item.resultado}`).join('\n')
                textArea.value = contenidoMovimientosRecuperados
            } else {
                textArea.value = 'Los movimientos almacenados son nulos.'
            }
        } catch (error) {
            textArea.value = 'Error al parsear los movimientos almacenados.'
        }
    } else {
        textArea.value = 'No hay movimientos almacenados'
    }
}

montoCuentaPrincipal()

//Pusheo al textArea los movimientos
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



document.addEventListener('DOMContentLoaded', function () {
    const btnLimpiar = document.getElementById('limpiarMovimientos')
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', limpiarMovimientos)
    }
})

document.addEventListener('DOMContentLoaded', almacenaEnLocalStorage)

document.addEventListener('DOMContentLoaded', mostrandoMovimientos)

document.addEventListener('DOMContentLoaded', function () {
    cargarCuentas()
    almacenaEnLocalStorage()
    mostrandoMovimientos()
})

//No mas de 2 numeros despues del .
/* const ingresoInput = document.getElementById('ingreso')
ingresoInput.addEventListener('input', function (event) {
    let valor = event.target.value
    if (/\.\d{3,}/.test(valor)) {
        event.target.value = valor.slice(0, -1)
    }
})
const transferenciaInput = document.getElementById('transferir')
transferenciaInput.addEventListener('input', function (event) {
    let valor = event.target.value
    if (/\.\d{3,}/.test(valor)) {
        event.target.value = valor.slice(0, -1)
    }
}) */

function limitarEntrada(event){
    let valor = event.target.value
    if(/\.\d{3,}/.test(valor)) {
        event.target.value = valor.slice(0, -1)
    }
}

const ingresoInput = document.getElementById('ingreso')
const transferenciaInput = document.getElementById('transferir')



//Cambiar y muestra el valor de ambas cuentas en el html
const botonCambiarValor = document.getElementById('cambiarValor')
const numCuenta = document.getElementById('valorCuentaSecundaria')
const valorCuenta = document.getElementById('cuenta')
let numCuentaPrincipal = 'Cuenta 042-006784/0'
let valorInicialCuenta = cuentaPrincipal
function actualizarNumeroCuenta() {
    if (numCuenta.textContent === numCuentaPrincipal) {
        numCuenta.textContent = 'Cuenta 042-006784/0'
    } else {
        numCuenta.textContent = numCuentaPrincipal
    }
}
function cambiarValor() {
    if (numCuenta.textContent === numCuentaPrincipal && valorCuenta.textContent === '$' + cuentaPrincipal.toFixed(2)) {
        numCuenta.textContent = 'Cuenta 032-007483/0'
        valorCuenta.textContent = '$' + cuentaSecundaria.toFixed(2)
    } else {
        numCuenta.textContent = numCuentaPrincipal
        valorCuenta.textContent = '$' + cuentaPrincipal.toFixed(2)
    }
}



///////////////////////////////////////////addEventListener



ingresoInput.addEventListener('input', limitarEntrada)
transferenciaInput.addEventListener('input', limitarEntrada)
document.getElementById('borrarTrans').addEventListener('click', function(){
    document.getElementById('transferir').value = ''
})
document.getElementById('borrarIng').addEventListener('click', function(){
    document.getElementById('ingreso').value = ''
})
botonCambiarValor.addEventListener('click', cambiarValor)