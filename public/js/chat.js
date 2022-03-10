const socketChat = io()
const userName = document.querySelector('#username')
const containerMessages = document.querySelector('#messages')
const messageText = document.querySelector('#message')
const btnMessage = document.querySelector('#btn-message')
const divMessages = document.querySelector('#messages')


const message = {}

socket.on('index', () => {
    renderChat()
})

btnMessage.addEventListener('click',async (e) => {
    e.preventDefault()
    if(!messageText.value){
        return
    }
    if(!userName.value){
        return alert('El campo email no puede estar vacio')
    }
    
    message.name = userName.value
    message.date = Date.now(),
    message.message = messageText.value
    message.id = socket.id
    await fetch(`${form.baseURI}api/mensajes`, {
        method: 'POST',
        body: formData
    })

    socket.emit('message', message)
    messageText.value = null
})

socket.on('new-messages', ()=>{
        renderChat()
})


function renderChat(){
    fetch('/static/database/messages.json')
    .then((res) => {
        return res.json()
    })
    .then((msgs) => {
        divMessages.innerHTML= ""
        msgs.forEach(msg => {
            //create elements
            const divUser = document.createElement('div')
            const divData = document.createElement('div')
            const divMessage = document.createElement('div')
            const messageText = document.createElement('p')
            const spanName = document.createElement('span')
            const spanDate = document.createElement('span')

            //assign class & value
            messageText.className = 'message-text'
            messageText.innerHTML = msg.message
            divData.className = 'message-data'
            spanName.className = 'user'
            spanDate.className = 'date-time'
            spanDate.innerHTML = ` [${new Date(msg.date).toLocaleString()}]: `
            divMessage.className = 'message-body'
            
            // assign user Local or Remote
            if(msg.name == userName.value && msg.id === socket.id ){
                divUser.className = 'local' 
                spanName.innerHTML = 'Yo'
                divData.appendChild(spanDate)
                divData.appendChild(spanName)
                divMessage.appendChild(messageText)
                divUser.appendChild(divData)
                divUser.appendChild(divMessage)
            }else{
                divUser.className = 'remote' 
                spanName.innerHTML = msg.name
                divData.appendChild(spanName)
                divData.appendChild(spanDate)
                divMessage.appendChild(messageText)
                divUser.appendChild(divData)
                divUser.appendChild(divMessage)
            }
            
            divMessages.appendChild(divUser)
            divMessages.scrollTop = divMessages.scrollHeight
        })
    })

}