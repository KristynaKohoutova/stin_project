const router = require("express").Router()
const { generateMessage } = require('../utils/messages')
const {processMessage}  = require('../utils/functions')

var messageType = "text"
router.post('/', (req, res) => {
    var answer = ""

    answer = processMessage(req.body.data)
    var generatedMessage = generateMessage(answer, messageType)
    console.log(generatedMessage)
    res.json({
        response: generatedMessage
    }) 
    messageType = "text"
})

module.exports = router