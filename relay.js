require('./src/functions')
LOGGING = 'debug'
const { listen, send } = require('./src/router')
const { Node } = require('basic')

const node = new Node("observer")
let id = node.core.getIdentity()
let peers = []

function listener() {
    let new_peers = Object.values(node.core.getPeers()).map(peer => peer.name).filter(peer => peer)
    if (new_peers.length > peers) {
        console.log("New Peers", new_peers)
        node.core.removeAllListeners()
        node.listen("*", (state, from) => {
            if (isNaN(parseInt(from)) === false) {
                console.log(`Heard: ${state}, From: ${from}`)
                send("WORLD", { world: { state, from } })
            }
        })
        peers = new_peers
    }
}


node.core.on("disconnect", (id, name) => {
    send("WORLD", { removed: name })
})

let sender
listen(msg => {
    if (msg === "WORLD") {
        console.log(msg)
    }
})

setInterval(listener, 2000)