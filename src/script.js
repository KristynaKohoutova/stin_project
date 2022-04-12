const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { generateMessage } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

var messageType = "text"
io.on('connection', (socket) => {
    console.log('New WebSocket connection')
    socket.emit('message', generateMessage('Welcome!', "text"))

    socket.on('sendMessage', (message, callback) => {

        const processedMessage = processMessage(message)

        socket.emit('message', generateMessage(processedMessage, messageType))
        callback(processedMessage) 
        messageType = "text"  
    })
    socket.on('disconnect', () => {
        socket.emit('message', generateMessage('A user has left!', "text"))
    })

})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})

function processMessage(message){

    if(message.includes("what") && message.includes("name")){
        return ('My name is ChatBot007 :D')
    }
    else if(message.includes("what") && message.includes("time")){
        const time =  new Date().getTime()
        messageType = "time"
        return (time)
    }

    return (message)
}