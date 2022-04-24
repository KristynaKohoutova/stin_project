const socket = io() 

//elements
const $messageForm = document.querySelector("#message-form")
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML

const availableCommands =  [["what","name"], 
                            ["what", "time"],
                            ["what", "course", "eur"], 
                            ["what", "history", "eur"], 
                            ["help"]
                        ]

const dangerousKeyWords = ["eval", "setTimeout", "setInterval", "new Function", "script"]

$messageFormButton.addEventListener('click', async function(e){
    
    sendMessageToServer()
    e.preventDefault();
})

async function sendMessageToServer(){
    var data = $messageFormInput.value
    var filteredInput = filterUserInput(data)
    console.log(filteredInput)
    if(!(filteredInput == "Bad input")){
        console.log(data)
        const options = {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            }, 
            body: JSON.stringify({"data": filteredInput})
        }
        try{
            const response = await fetch('/', options).then(response => {
                console.log(response)
                return response
            })
            const answer = await response.json()
            console.log("in try")
            console.log(answer.response.message)
            responseToShow = processResponse(answer.response)
            setMessageText(responseToShow)
        
        }catch(e){
            console.log("not send")
            console.log(e)
        }
    }else{
        setMessageText("Bad input, can not process this message")
    }
    
    
}

function filterUserInput(input){
    var foundCommands = 0
    var foundCommand = ""
    var isNotDangerous = true
    dangerousKeyWords.forEach(word => {
        if(input.includes(word)){
            isNotDangerous = false
            console.log(word)
        }
    })
    if(!input == "" && isNotDangerous){
        input = input.toLowerCase()
        console.log(isNotDangerous)
        availableCommands.forEach(command => {
            var currentCommand = true
            command.forEach(keyWord => {
                if(!input.includes(keyWord)){
                    currentCommand = false
                }
            })
            if(currentCommand){
                command.forEach(word => {
                    foundCommand += word
                })
                foundCommands++
            }
        })
        if(foundCommands != 1){
            return "Bad input"
        }else{
            return foundCommand
        }
    }else{
        return "Bad input"
    }
}

function setMessageText(messageBody){
    var html = ""
    html = Mustache.render(messageTemplate, {
        message: messageBody,
        // createdAt: moment(message.createdAt).format('k:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    $messageFormInput.value = ''
    $messageFormInput.focus()

}

function processResponse(resObj){
    if(resObj.messageType == "text"){
        return resObj.message
    }else if(resObj.messageType == "time"){
        return "It is currently " +moment(resObj.message).format('k:mm a, MMMM Do YYYY')
    }else if(resObj.messageType == "table"){
        return "not supported yet"
    }else{
        return "not supported message type"
    }
}

// socket.on('message', (message) => {
//     console.log(message)
//     var html = ""
//     switch(message.messageType){
//         case "text":
//             html = Mustache.render(messageTemplate, {
//                 message: message.text,
//                 createdAt: moment(message.createdAt).format('k:mm a')
//             })
//             break;
//         case "time":
//             html =  Mustache.render(messageTemplate, {
//                 message: "It is currently " +moment(message.text).format('k:mm a, MMMM Do YYYY'),
//                 createdAt: moment(message.createdAt).format('k:mm a')
//             })  
//             break;

//         case "help":
//             html = Mustache.render(messageTemplate, {
//                 message: message.text,
//                 createdAt: moment(message.createdAt).format('k:mm a')
//             })
//             break;
//         default:
//             html = ""
//     }    
//     $messages.insertAdjacentHTML('beforeend', html)
// })

// $messageForm.addEventListener('submit', (e) => {
//     e.preventDefault()

//     $messageFormButton.setAttribute('disabled', 'disabled')
//     const message = e.target.elements.message.value

//     socket.emit('sendMessage', message, (message, answer) => {
//         $messageFormButton.removeAttribute('disabled')
//         $messageFormInput.value = ''
//         $messageFormInput.focus()

//         console.log('The message was delivered!', message)
        
//     })
// })

