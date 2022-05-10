require('./src/functions')
const { run } = require('./src/server')
const { listen, send } = require('./src/router')
const { Node } = require('basic')

const observer = new Node()
let id =  observer.core.getIdentity()

observer.identifier = message => {
    // console.log(message)
    send("WORLD", { self: id, world: message })
}

observer.removed = peer => {
    send("WORLD", {removed: peer})
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
