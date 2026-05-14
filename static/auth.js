const registerForm = document.getElementById('registerForm')
const loginForm = document.getElementById('loginForm')

registerForm?.addEventListener('submit', (event)=>{
    console.log('sub')
    event.preventDefault()
    const {NicknameEnter, passwordEnter, passwordRepeat} = registerForm

    console.log(passwordEnter.value)

    if(passwordEnter.value !== passwordRepeat.value) return alert("Паролі не співпадають")

    const user = JSON.stringify({
        login: NicknameEnter.value,
        password: passwordEnter.value
    })

    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/register')
    xhr.send(user)
    xhr.onload = ()=> alert(xhr.response)
})



loginForm?.addEventListener('submit', (event)=>{
    console.log('sub')
    event.preventDefault()
    const {NicknameEnter, passwordEnter} = loginForm

    console.log(passwordEnter.value)


    const user = JSON.stringify({
        login: NicknameEnter.value,
        password: passwordEnter.value
    })

    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/login')
    xhr.send(user)
    xhr.onload = ()=> {
        if(xhr.status === 200){
            const token = xhr.response
            document.cookie = `token=${token}`
            window.location.assign('/')
        }
        else{
            return alert(xhr.response)
        }
    }
})