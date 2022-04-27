const path = require('path')
const https = require('https')
const fs = require('fs')
const express = require('express')

const api = require('./routes/api')
const scriptjs = require("../src/utils/functions")
const CronJob = require('cron').CronJob


const app = express()

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.listen(port, () => {
    // console.log(`Server is up on port ${port}!`)
})

app.use(express.static(publicDirectoryPath))
app.use(express.json({limit: '1mb'}))
app.use("/", api)



var job = new CronJob('0 */5 13-16 * * 1-5', function(){
    controlCourse()   
})
job.start()

function controlCourse(){
    scriptjs.dowloadFile()
    var fromDFile = scriptjs.readFromDownloadedFile("EUR", "./src/downloadedFile.txt")  
    var histData = scriptjs.parseHistFileData(scriptjs.readFromHistFile("./src/history.txt"))
    var histDate = histData[histData.length-1][0]
    var histCourse = histData[histData.length-1][2]
    if(histDate != fromDFile[0] && histCourse != fromDFile[1]){
        scriptjs.writeToFile([fromDFile[0], "EUR" ,fromDFile[1]], "./src/history.txt")
    }
}




