///////////////////////////////////Variables && Arrays

let cuentaPrincipal = 0
let cuentaSecundaria = 100000000
const movimientos = []


///////////////////////////////////////////////////////////Funciones



///////////////////////////////////Manejo de las cuentas



//Cargar cuentas JSON
function cargarCuentas(){
    fetch('../json/index.json')
    .then(response => response.json())
    .then(data => {
        cuentaPrincipal = data.cuentas.cuentaPrincipal
        cuentaSecundaria = data.cuentas.cuentaSecundaria

        const cuentaPrincipalGuardada = localStorage.getItem('cuentaPrincipal')
        const cuentaSecundariaGuardada = localStorage.getItem('cuentaSecundaria')

        if(cuentaPrincipalGuardada !== null && cuentaSecundariaGuardada !== null){
            cuentaPrincipal = parseFloat(cuentaPrincipalGuardada)
            cuentaSecundaria = parseFloat(cuentaSecundariaGuardada)
        }
        montoCuentaPrincipal()
    })
    .catch(error => console.error('Error al cargar las cuentas:', error))
}


//Guardar cuentas en el LocalStorage
function guardarCuentas(){
    localStorage.setItem('cuentaPrincipal', cuentaPrincipal.toLocaleString())
    localStorage.setItem('cuentaSecundaria', cuentaSecundaria.toString())
}


//Muestra el monto de la cuenta principal
function montoCuentaPrincipal() {
    let montoCuenta = document.getElementById('cuenta')
    montoCuenta.textContent = '$' + cuentaPrincipal
}
montoCuentaPrincipal()



//Ingresa el dinero a la cuenta principal, sacando de la cuenta secundaria
function ingresarDinero() {
    let ingresoDeDineroTexto = document.getElementById('ingreso').value
    let ingresoDeDineroNumerico = parseFloat(ingresoDeDineroTexto.replace(/[^\d.]/g, ''))

    if (cuentaSecundaria <= 0) {
        document.getElementById('mensajeIng').innerText = 'No se puede realizar el ingreso. Saldo insuficuente en la cuenta.'
        return
    }

    if (!isNaN(ingresoDeDineroNumerico)) {
        cuentaPrincipal += ingresoDeDineroNumerico
        cuentaSecundaria -= ingresoDeDineroNumerico
        document.getElementById('mensajeIng').innerText = "Se han ingresado $" + ingresoDeDineroNumerico.toLocaleString() + " en la cuenta 042-006784/0"
        let resultado = cuentaPrincipal
        let accion = ingresoDeDineroTexto
        movimientos.push({accion,resultado})
        montoCuentaPrincipal()
        almacenaEnLocalStorage()
        mostrandoMovimientos()
        guardarCuentas()
    } else {
        document.getElementById('mensajeIng').innerText = "Por favor, ingrese una cantidad valida."
    }
}


//Transfiere el dinero a la cuenta secundaria, sacando de la cuenta principal
function transferirDinero() {
    let transferirDineroTexto = document.getElementById('transferir').value
    let transferirDineroNumerico = parseFloat(transferirDineroTexto.replace(/[^\d.]/g, ''))

    if (cuentaPrincipal <= 0) {
        document.getElementById('mensajeTransf').innerText = 'No se puede realizar la transferencia. Saldo insuficiente en la cuenta 042-006784/0'
        return
    }

    if (!isNaN(transferirDineroNumerico)) {
        cuentaPrincipal -= transferirDineroNumerico
        cuentaSecundaria += transferirDineroNumerico
        document.getElementById('mensajeTransf').innerText = 'Se han transferido $' + transferirDineroNumerico.toLocaleString() + ' en la cuenta 032-007483/0'
        let resultado = cuentaPrincipal
        let accion = 'Transferencia realizada'
        movimientos.push({accion,resultado})
        montoCuentaPrincipal()
        almacenaEnLocalStorage()
        mostrandoMovimientos()
        guardarCuentas()
    } else {
        document.getElementById('mensajeTransf').innerText = 'Por favor, ingrese una cantidad valida'
    }
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
function limpiarMovimientos(){
    movimientos.length = 0
    almacenaEnLocalStorage()
    mostrandoMovimientos()
}

////////////////////////////////////Manejo del historial/Movimientos



//Pasaje del array 'movimientos' a JSON y Almacenado en el localStorage
function almacenaEnLocalStorage(){
    //El array 'movimientos' se convierte en JSON.
    const movimientosJSON = JSON.stringify(movimientos)
    //Almacena en el localStorage, clave 'movimientosGuardados' y valor 'movimientosJSON'
    localStorage.setItem('movimientosGuardados', movimientosJSON)
}


//Mostrar localStorage como movimientos
function mostrandoMovimientos(){
    const textArea = document.getElementById('movimientos')
    const movimientosRecuperadosEnJson = localStorage.getItem('movimientosGuardados')
    if(movimientosRecuperadosEnJson !== null){
        try{
            const movimientosRecuperados = JSON.parse(movimientosRecuperadosEnJson)
            if(Array.isArray(movimientosRecuperados) && movimientosRecuperados.length > 0){
                const contenidoMovimientosRecuperados = movimientosRecuperados.map(item => `${item.movimiento} = ${item.resultado}`).join('\n')
                textArea.value = contenidoMovimientosRecuperados
            } else{
                textArea.value = 'Los movimientos almacenados son nulos.'
            }
        } catch (error) {
            textArea.value = 'Error al parsear los movimientos almacenados.'
        }
    }else {
        textArea.value = 'No hay movimientos almacenados'
    }
}

montoCuentaPrincipal()

//Pusheo al textArea los movimientos
document.addEventListener('DOMContentLoaded', function(){
    const movimientosRecuperadosEnJson = localStorage.getItem('movimientosGuardados')
    if(movimientosRecuperadosEnJson){
        try{
            const movimientosRecuperados = JSON.parse(movimientosRecuperadosEnJson)
            movimientos.push(...movimientosRecuperados)
        }catch (error){
            console.error('Error al parsear el historial recuperado', error)
        }
    }
    mostrandoMovimientos()
})



document.addEventListener('DOMContentLoaded', function(){
    const btnLimpiar = document.getElementById('limpiarMovimientos')
    if(btnLimpiar){
        btnLimpiar.addEventListener('click', limpiarMovimientos)
    }
})

document.addEventListener('DOMContentLoaded', almacenaEnLocalStorage)

document.addEventListener('DOMContentLoaded', mostrandoMovimientos)

document.addEventListener('DOMContentLoaded', function(){
    cargarCuentas()
    almacenaEnLocalStorage()
    mostrandoMovimientos()
})
