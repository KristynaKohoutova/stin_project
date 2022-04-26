const generateMessage = (text, messageType) => {
    return{
        message: text,
        createdAt: new Date().getTime(),
        messageType
    }
}

module.exports = {
    generateMessage
}