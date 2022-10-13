require('./src/functions')
LOGGING = 'debug'
const { listen, send } = require('./src/router')
const { Node } = require('basic-messaging')

const node = new Node("observer")
let peers = []

node.listen("*", message => {
    if (typeof message === 'object' && message.state && isNaN(parseInt(message.from)) === false) {
        console.log(`Heard: ${message.state}, From: ${message.from}`)
        send("WORLD", { world: message })
    }
})

node.listen("disconnect", (id, name) => {
    send("WORLD", { removed: name })
})

let sender
listen(msg => {
    if (msg === "WORLD") {
        console.log(msg)
    }
})

