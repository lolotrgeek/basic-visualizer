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
    
    if (typeof msg === 'object' && typeof msg.world === 'object') {
        if (msg.world.state && msg.world.from) {
            // each incoming message is a node with all it's peer states
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
    let inWorld = world.particles.findIndex(world_particle => world_particle.id === msg.world.from)
    if (inWorld === -1) {
        add_particle(msg)
    }
    else if (inWorld > -1) {
        // let inWorld = world.particles.findIndex(world_particle => world_particle.id === msg.world.id)
        update_particle(msg, inWorld)
    }

}

function add_particle(msg) {
    let particle = new Particle(world.p, msg.world.state, 30, msg.world.from)
    particle.arrive()
    world.particles.push(particle)
}

function remove_particle(inWorld) {
    world.particles.splice(inWorld, 1)
}

function update_particle(msg, inWorld) {
    world.particles[inWorld].previous_state = world.particles[inWorld].state
    world.particles[inWorld].state = msg.world.state
}