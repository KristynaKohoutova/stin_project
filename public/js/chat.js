//elements
const $messageForm = document.querySelector("#message-form")
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const messageTemplateMe = document.querySelector('#message-template-me').innerHTML
 

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
    setMessageText(data, messageTemplateMe)
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
            setMessageText(responseToShow, messageTemplate)
        
        }catch(e){
            console.log("not send")
            console.log(e)
        }
    }else{
        setMessageText("Bad input, can not process this message", messageTemplate)
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

function setMessageText(messageBody, template){
    var html = ""
    if (messageBody.includes("tr")){
        html = messageBody
    }else{
        html = Mustache.render(template, {
            message: messageBody
        })
    }
    
    $messages.insertAdjacentHTML('beforeend', html)
    $messageFormInput.value = ''
    $messageFormInput.focus()

}

function processResponse(resObj){
    if(resObj.messageType == "text"){
        return resObj.message
    }else if(resObj.messageType == "time"){
        return "It is currently " + moment(resObj.message).format('k:mm a, MMMM Do YYYY')
    }else if(resObj.messageType == "table"){
        dataToProcess = resObj.message
        return (createHTML(dataToProcess))
       
    }else{
        return "not supported message type"
    }
}

function createHTML(data){
    finalString = "<div class='message'><table id='history-table'>"
    finalString += "<tr><td>Date</td><td>Course</td></tr>"
    data.forEach(record => {
        toAppend = "<tr><td>" + record[0] + "</td>"
        toAppend += "<td>" + record[2] + "</td></tr>"
        finalString += toAppend
        toAppend = ""
    })
    finalString += "</table></div>"
    console.log(finalString)
    return finalString
}