const path = require('path')
const https = require('https')
const fs = require('fs')

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
            messageToAnswer = "Available commands: what name, what time, what course EUR, what history EUR, should buy EUR and help"
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
        case "shouldbuyeur":
            var data = parseHistFileData(readFromHistFile("./src/history.txt"))
            messageType = "text"
            messageToAnswer = checkIfBuy(data)
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
            response.pipe(file)
            file.on("finish", () => {
                file.close()
            })
        })
        return true
}

function checkIfBuy(data){
    var index = data.length
    if(index < 3){
        return "Can not recommend, not enough data"
    }
    var valuesArray = [parseFloat((data[index-3][2]).replace(",", ".")),
     parseFloat((data[index-2][2]).replace(",", ".")),
     parseFloat((data[index-1][2]).replace(",", "."))]

    console.log("valuesArray")
    console.log(valuesArray)
    if(isLowering(valuesArray)){
        var sum = sumArray(valuesArray)
        var avg = average(sum, 3)
        var tenPrcnt = tenPercent(avg)
        return "You should buy EUR because the price is lowering for last three days, average is: " + avg
    }else{
        var result = isLessThanTenPercent(valuesArray)
        console.log(result)
        if(result[0]){
            return "You could buy EUR, because the difference of the price is not greater than 10%, the average is " 
            + String(parseFloat(result[1]).toFixed(3)) + ", the difference less than 10% by value "  + String(Math.abs(parseFloat(result[2]).toFixed(3)))  
        }else{
            return "You should NOT buy EUR, because the difference of the price is greater than 10%, the average is " 
            + String(result[1]) + ", the difference is greater than 10% by value "  + String(result[2]) 
        }
    }
}

function isLowering(valuesArray){
    if(valuesArray[2] < valuesArray[1] && valuesArray[1] < valuesArray[0]){
        return true
    }
    return false
}

function isLessThanTenPercent(valuesArray){
    var isLess = true
    var sum = sumArray(valuesArray)
    var avg = average(sum, 3)
    var tenPrcnt = tenPercent(avg)
    var [fAndS, diff1] = returnDifference(valuesArray[0], valuesArray[1], tenPrcnt)
    var [sAndT, diff2] = returnDifference(valuesArray[1], valuesArray[2], tenPrcnt)
    var diff = 0
    console.log(diff1)
    if(fAndS == false || sAndT == false){
        diff = Math.max(parseFloat(diff1), parseFloat(diff2))
        isLess = false
    }else{
        diff = Math.max(parseFloat(diff1), parseFloat(diff2))
    }
    console.log(sum)
    console.log(diff)
    return [isLess, avg, diff]
}

function sumArray(values){
    var sumResult = 0
    values.forEach(value => {
        sumResult += parseFloat(value)
    });
    return sumResult
}

function average(sum, numOfElements){
    return sum / numOfElements
}

function tenPercent(averageValue){
    return parseFloat(averageValue / 10)
}

function returnDifference(val1, val2, tenPrcnt){
    var difference = val2 - val1
    if(difference <= tenPrcnt && difference > -tenPrcnt){
        return [true, (Math.abs(difference) - tenPrcnt)]
    }else{
        return [false, (Math.abs(difference) - tenPrcnt)]
    }
        
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
     parseFileData, parseHistFileData, writeToFile, readFromHistFile,
     readFromDownloadedFile, dowloadFile, processMessage, createURL,
     getURL, isLowering, sumArray, tenPercent, average, returnDifference, 
     isLessThanTenPercent, checkIfBuy
} 