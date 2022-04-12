const generateMessage = (text, messageType) => {
    return{
        text,
        createdAt: new Date().getTime(),
        messageType
    }
}

module.exports = {
    generateMessage
}