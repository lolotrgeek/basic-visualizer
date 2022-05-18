require('./src/functions')
const { run } = require('./src/server')
const { listen, send } = require('./src/router')
const { Node } = require('basic')

const observer = new Node()
let id =  observer.core.getIdentity()

/**
 * fires when a peer identifies themselves
 * @param {*} message 
 * @note peers must be pinging each other in order to update distances
 */
observer.identifier = message => {
    // console.log("id", message.id, "distance",message.distances[id].distance)
    // console.log(observer.distances)
    send("WORLD", { self: id, world: message })
    // console.log("-----------------------------------------------------------------------------------")
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
            // ping peers and request that all peers identify themselves
            observer.update()
        }, 2000)
    }
})

run()
