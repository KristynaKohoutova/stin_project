const dangerousKeyWords = ["eval", "setTimeout", "setInterval", "new Function", "script"]

const availableCommands =  [["what", "name"], 
                            ["what", "time"],
                            ["what", "course", "eur"], 
                            ["what", "history", "eur"], 
                            ["help"], 
                            ["should", "buy", "eur"]
                        ]

function filterUserInput(input){
    var foundCommands = 0
    var foundCommand = ""
    var isNotDangerous = true
    dangerousKeyWords.forEach(word => {
        if(input.includes(word)){
            isNotDangerous = false
            console.log(word)
        }
    })
    if(!input == "" && isNotDangerous){
        input = input.toLowerCase()
        console.log(isNotDangerous)
        availableCommands.forEach(command => {
            var currentCommand = true
            command.forEach(keyWord => {
                if(!input.includes(keyWord)){
                    currentCommand = false
                }
            })
            if(currentCommand){
                command.forEach(word => {
                    foundCommand += word
                })
                foundCommands++
            }
        })
        if(foundCommands != 1){
            return "Bad input"
        }else{
            return foundCommand
        }
    }else{
        return "Bad input"
    }
}

describe("filtering input", () => {
    it("filtering input", () => {
        expect(filterUserInput("<script>")).toBe("Bad input")
        expect(filterUserInput("ahoj")).toBe("Bad input")
        expect(filterUserInput("what is your name?")).toBe("whatname")
        expect(filterUserInput("help")).toBe("help")
    })    
})



