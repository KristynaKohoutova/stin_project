const path = require('path')
const http = require('http')
const https = require('https')
const fs = require('fs')
const express = require('express')
const socketio = require('socket.io')
const { generateMessage } = require('./utils/messages')

const striptags = require('striptags')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})

app.use(express.static(publicDirectoryPath))
app.use(express.json({limit: '1mb'}))

var messageType = "text"
app.post('/', async (req, res) => {
    var answer = ""

    answer = processMessage(req)
    var generatedMessage = generateMessage(answer, messageType)
    console.log(generatedMessage)
    res.json({
        response: generatedMessage
    }) 
    messageType = "text"
})


function processMessage(req){
    var messageToAnswer = "default message :D"
    console.log()
    var recievedMessage = req.body.data
    recievedMessage = striptags(String(recievedMessage))
    console.log("recievedMessage")
    console.log(recievedMessage)
    switch(recievedMessage){
        case "whatname":
            messageToAnswer = "My name is ChatBot007"
            break;
        case "whattime":
            const time =  new Date().getTime()
            messageToAnswer = time
            messageType = "time"
            break;
        case "help":
            messageToAnswer = "Available commands: what name, what time, what course EUR, what history EUR and help"
            break;
        case "whatcourseeur":
            dowloadFile()
            var parsedData = readFromDownloadedFile("downloadedFile.txt", "EUR")
            messageToAnswer = "EUR " + parsedData[1] + " " + parsedData[0]
            break;
        case "whathistoryEUR":
            messageToAnswer = "History is not supported yet"
            messageType = "table"
            break;
        default: 
            messageToAnswer = "from default"
    }
    return messageToAnswer 
}

function dowloadFile(){
    const file = fs.createWriteStream("./downloadedFile.txt")
    dataUrl = getURL("https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt?date=")
    const request = https.get(dataUrl, 
        function(response){
            response.pipe(file)
            file.on("finish", () => {
                file.close()
                console.log("download completed")
            })
        })
}

function getURL(urlAdress){
    var d = new Date()
    var year = d.getFullYear()
    var month = d.getMonth() + 1
    var day = d.getDate()
    var finalDate = urlAdress
    finalDate += (day < 10) ? "0" + day.toString() + ".": day.toString() + "."
    finalDate += (month < 10) ? "0" + month.toString() + "." : month.toString() + "."
    finalDate += year.toString()
    console.log(finalDate) 
    return finalDate
}

function readFromDownloadedFile(filename, cName){
    var toReturn = ["nothing"]
    var readData = fs.readFileSync("./src/downloadedFile.txt", 'utf-8', (err, data) => {
        if(err){
            console.error(err)
            return
        }
    })
    var parsedData = parseFileData(readData)
    for(i = 0; i < parsedData[1].length; i++){
        if(parsedData[1][i].includes(cName)){
            toReturn = [parsedData[0], parsedData[1][i][4]]
        }
    }
    return toReturn
}

function parseFileData(data){
    var date = ""
    var dataArray = []
    var splittedData = data.split("\n")
    date = (splittedData[0].split(" "))[0]
    for(i = 2; i < splittedData.length -1; i++){
        var splitted = splittedData[i].split("|")
        dataArray.push(splitted)
    }
    return [date, dataArray]
}