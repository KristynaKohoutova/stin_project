const path = require('path')
const https = require('https')
const fs = require('fs')
const express = require('express')

const api = require('./routes/api')

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



var job = new CronJob('0 */5 13-15 * * 1-5', function(){
    controlCourse()   
})
job.start()




