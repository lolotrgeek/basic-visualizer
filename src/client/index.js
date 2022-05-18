let div = document.getElementById("sketch")
let x = div.offsetWidth
let y = div.offsetHeight
let scalar = 20
let world = new World({}, [])
let cnv

function startsketch() {
    const sketch = p => {
        world.p = p
        world.p.Vector = p5.Vector
        console.log(p)
        p.setup = function () {
            cnv = p.createCanvas(div.offsetWidth, div.offsetHeight)
            cnv.style('display', 'block')
            cnv.parent("sketch")
            // noLoop()
        }

        p.draw = function () {
            p.background(000)
            world.spin()
        }
    }

    let p5instance = new p5(sketch)
}
function stopsketch(world) {
    console.log('stopping')
    world.p.remove()
}

startsketch()

listen(msg => {
    if (typeof msg === 'object' && typeof msg.self === 'string' && typeof msg.world === 'object') {
        world.self = { id: msg.self, size: 20 }
        world.center()
        if (msg.world.id && msg.world.distances) {
            // each incoming message is a node with all it's peer distances
            particlize(msg)
        }
        // TODO: change particle color when message is received
    }
    else if (typeof msg === 'object' && typeof msg.removed === 'string') {
        let inWorld = world.particles.findIndex(world_particle => world_particle.id === msg.removed)
        if (inWorld > -1) remove_particle(inWorld)
    }
    else if (msg === "CLOSED") {
        stopsketch(world) // from sketch.js
    }
    else {
        console.log(msg)
    }
})

function particlize(msg) {
    let inWorld = world.particles.findIndex(world_particle => world_particle.id === msg.world.id)
    if (inWorld === -1) {
        add_particle(msg)
    }
    else if (inWorld > -1) {
        // let inWorld = world.particles.findIndex(world_particle => world_particle.id === msg.world.id)
        update_particle(msg, inWorld)
    }

}

function add_particle(msg) {
    let particle = new Particle(world.p, world.self.position.x, world.self.position.y, msg.world.distances[world.self.id].distance, 10, msg.world.id)
    particle.arrive()
    world.particles.push(particle)
}

function remove_particle(inWorld) {
    world.particles.splice(inWorld, 1)
}

function update_particle(msg, inWorld) {
    world.particles[inWorld].previous_distance = world.particles[inWorld].distance
    world.particles[inWorld].distance = msg.world.distances[world.self.id].distance
}