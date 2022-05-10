let div = document.getElementById("sketch")
let x = div.offsetWidth
let y = div.offsetHeight
let scalar = 10
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
            // each incoming message is a node with all it's peers
            let particles = particlize(msg)
        }
    }
    else if (typeof msg === 'object' && typeof msg.removed === 'string') {
        let inWorld = world.particles.findIndex(world_particle => world_particle.id === msg.removed)
        if(inWorld > -1) remove_particle(inWorld)
    }
    else if (msg === "CLOSED") {
        stopsketch(world) // from sketch.js
    }
    else {
        console.log(msg)
    }
})

function particlize(msg) {
    // let particleMap = Object.keys(msg.world.distances).map(key => {
    //     return new Particle(world.p, world.self.position.x, world.self.position.y, msg.world.distances[key].distance, 10, key, [])
    // })
    let inWorld = world.particles.findIndex(world_particle => world_particle.id === msg.world.id)
    if(inWorld === -1) {
        let particle = new Particle(world.p, world.self.position.x, world.self.position.y, msg.world.distances[world.self.id].distance, 10, msg.world.id)
        world.particles.push(particle)
    }
    else {
        // update particle
        let inWorld = world.particles.findIndex(world_particle => world_particle.id === msg.world.id)
        if (inWorld > -1) world.particles[inWorld].distance = msg.world.distances[world.self.id].distance
    }

}

function add_particle(particle) {
    world.particles.push(particle)
}

function update_particle(particle, index) {
    world.particles[index].distance = particle.distance
}
function remove_particle(index) {
    world.particles.splice(index, 1)
}
