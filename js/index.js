fetch('json/index.json')
.then(response => response.json())
.then(data => {
    const users = data.users
    document.getElementById('registroForm').addEventListener('submit', function (event) {
        event.preventDefault()
    
        let username = document.getElementById('username').value
        let password = document.getElementById('password').value
    
        if(username.trim() === '' || password.trim() === ''){
            alert('Por favor ingresa un usuario o contrase;a')
            return
        }
    
        const user = users.find(user => user.username === username && user.password === password)
        if(user){
            localStorage.setItem('username', username)
            localStorage.setItem('password', password)
            alert('Usuaria Ingresado correctamente')
            document.getElementById('registroForm').reset()
            window.location.href = 'page/home.html'
        }else{
            alert('Usuario o contrase;a incorrectos')
        }
    })
})
.catch(error => console.error('Error al cargar json', error))