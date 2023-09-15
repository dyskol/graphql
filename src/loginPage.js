

export function loginPage(router){
    let JWToken = sessionStorage.getItem('JWToken')
    if (JWToken != null && JWToken != undefined){
        router.navigate("/")
        return
    }
    let app = document.getElementById("app")
    app.innerHTML = ""
    
    

    let container = document.createElement('div')
    container.className = "container"
    app.append(container)

    let content = document.createElement('div')
    content.className = "content"
    container.append(content)

    let title = document.createElement("h2")
    title.innerHTML = "Login"
    content.append(title)

    let form = document.createElement("form")
    form.id = "loginForm"
    content.append(form)
    
    let username = document.createElement("input")
    username.type = "text"
    username.name = "username"
    username.required = true
    username.placeholder = "Enter your username"

    let password = document.createElement("input")
    password.type = "password"
    password.name = "password"
    password.required = true
    password.placeholder = "Enter your password"

    let button = document.createElement("button")
    button.type = "submit"
    button.name = "username"
    button.innerHTML = "submit"

    form.append(username,password,button)

    form.addEventListener("submit", async function(e){
        e.preventDefault();
        const cred = btoa(`${username.value}:${password.value}`)

        const response = await fetch('https://01.kood.tech/api/auth/signin',{
            method:'POST',
            headers:{
                'Authorization': `Basic ${cred}`
            }
        });

        if(response.ok){
            const data = await response.json();
            sessionStorage.setItem("JWToken",data);
            router.navigate('/')
        }else{
            
            (response.status === 403 ? (alert('Incorrect password'),password.value = '') : (alert('User doesnt exist'),form.reset()))
        }
    })

    
}