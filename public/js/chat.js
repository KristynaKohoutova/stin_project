const socket = io() 

//elements
const $messageForm = document.querySelector("#message-form")
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML

socket.on('message', (message) => {
    console.log(message)
    var html = ""
    switch(message.messageType){
        case "text":
            html = Mustache.render(messageTemplate, {
                message: message.text,
                createdAt: moment(message.createdAt).format('k:mm a')
            })
            break;
        case "time":
            html =  Mustache.render(messageTemplate, {
                message: "It is currently " +moment(message.text).format('k:mm a, MMMM Do YYYY'),
                createdAt: moment(message.createdAt).format('k:mm a')
            })  
            break;
        default:
            html = ""
    }    
    $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (message, answer) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        console.log('The message was delivered!', message)
        
    })
})

