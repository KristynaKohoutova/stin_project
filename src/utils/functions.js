const path = require('path')
const https = require('https')
const fs = require('fs')
const express = require('express')

const striptags = require('striptags')
var messageType = "text"

function processMessage(req){
    var messageToAnswer = "default message :D"
    var recievedMessage = req
    recievedMessage = striptags(String(recievedMessage))
    switch(recievedMessage){
        case "whatname":
            messageToAnswer = "My name is Bot007"
            readFromDownloadedFile("EUR", "./src/downloadedFile.txt")  
            messageType = "text"
            break;
        case "whattime":
            const time =  new Date().getTime()
            messageToAnswer = time
            messageType = "time"
            break;
        case "help":
            messageToAnswer = "Available commands: what name, what time, what course EUR, what history EUR and help"
            messageType = "text"
            break;
        case "whatcourseeur":
            var data = parseHistFileData(readFromHistFile("./src/history.txt"))
            console.log(data)
            var parsedData = data[data.length-1]
            messageToAnswer = parsedData[1] + " " + parsedData[2] + " " + parsedData[0]
            messageType = "text"
            break;
        case "whathistoryeur":
            var data = parseHistFileData(readFromHistFile("./src/history.txt"))
            messageToAnswer = data
            messageType = "table"
            break;
        default: 
            messageToAnswer = "Not supported"
    }
    return [messageToAnswer, messageType]
}


function dowloadFile(){
    const file = fs.createWriteStream("./src/downloadedFile.txt")
    dataUrl = createURL("https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt?date=")
    const request = https.get(dataUrl, 
        function(response){
            // response.pipe(file)
            // file.on("finish", () => {
            //     file.close()
            // })
        })
        return true
}


function getURL(urlAdress, year, month, day){    
    var finalDate = urlAdress
    finalDate += (day < 10) ? "0" + day.toString() + ".": day.toString() + "."
    finalDate += (month < 10) ? "0" + month.toString() + "." : month.toString() + "."
    finalDate += year.toString()
    console.log(finalDate) 
    return finalDate
}

function createURL(urlAdress){
    var d = new Date()
    var year = d.getFullYear()
    var month = d.getMonth() + 1
    var day = d.getDate()
    return getURL(urlAdress, year, month, day)
}

function readFromDownloadedFile(cName, location){
    var toReturn = ["nothing"]
    try {
        var readData = fs.readFileSync(location, 'utf-8', (err, data) => {})
    }catch(err){
        return ["bad file"]
    }
    var parsedData = parseFileData(readData)
    for(i = 0; i < parsedData[1].length; i++){
        if(parsedData[1][i].includes(cName)){
            toReturn = [parsedData[0], parsedData[1][i][4]]
        }
    }
    console.log(toReturn)
    return toReturn
}

function writeToFile(data, path){
    var stringToWrite = data[0] + "|" + data[1] + "|" + data[2] + "\r\n"
    fs.writeFileSync(path, stringToWrite, {flag:'a+'})
    return stringToWrite
}

function readFromHistFile(historyPath){
    var readData = fs.readFileSync(historyPath, 'utf-8')
    console.log(readData)
    return readData
}

function parseHistFileData(readData){
    console.log(readData)
    var finalDataSet = []
    var splittedLines = readData.toString().split("\r\n")
    for(i = 0; i < splittedLines.length; i++){
        var splitted = splittedLines[i].split("|")
        if(splitted.length > 1)
            finalDataSet.push(splitted)
    }
    console.log("finaldataset")
    console.log(finalDataSet)
    return finalDataSet
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

module.exports = {
     parseFileData, parseHistFileData, writeToFile, readFromHistFile, readFromDownloadedFile, dowloadFile, processMessage, createURL, getURL
} 