const router = require("express").Router()
const { generateMessage } = require('../utils/messages')
const {processMessage}  = require('../utils/functions')

router.post('/', (req, res) => {
    var answer = ""

    answer = processMessage(req.body.data)
    var generatedMessage = generateMessage(answer[0], answer[1])
    console.log(generatedMessage)
    res.json({
        response: generatedMessage
    }) 
})

module.exports = router