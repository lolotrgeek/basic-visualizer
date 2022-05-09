require('./src/functions')
const { run } = require('./src/server')
const { listen, send } = require('./src/router')
const { Node } = require('basic')

const observer = new Node()

observer.identifier = message => {
    // console.log(message)
    send("WORLD", { world: message })
}

let sender
listen(msg => {
    if (msg === "WORLD") {
        console.log(msg)
        if (sender) clearInterval(sender)
        sender = setInterval(() => {
            observer.identify_all()
        }, 2000)
    }
})

run()
