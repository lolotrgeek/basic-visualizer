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
    if (typeof msg === 'object') {

        if (typeof msg.world === 'object') {
            if (msg.world.id && msg.world.distances) {

                let self = {}
                self.id = msg.world.id
                self.size = 20

                world.self = self
                world.center()

                let particleMap = Object.keys(msg.world.distances).map(key => new Particle(world.p, self.position.x, self.position.y, msg.world.distances[key].distance, 10, key, []))
                let particles = particleMap.map((particle, index) => {
                    particle.others = particleMap.filter(other => other.id !== particle.id)
                    // particle.others = particleMap
                    return particle
                })

                // remove particles
                world.particles.forEach((world_particle, inWorld) => {
                    if (world_particle) {
                        let outWorld = particles.findIndex(particle => world_particle.id === particle.id)
                        if (outWorld === -1) remove_particle(inWorld)
                    }
                })

                // update or add new particles
                particles.forEach(particle => {
                    if (particle) {
                        let inWorld = world.particles.findIndex(world_particle => world_particle.id === particle.id)
                        if (inWorld > -1) update_particle(particle, inWorld)
                        else add_particle(particle)
                    }
                })

            }
        }

    }
    else if (msg === "CLOSED") {
        stopsketch(world) // from sketch.js
    }
})

function add_particle(particle) {
    world.particles = [...world.particles, particle]
    return
}

function update_particle(particle, index) {
    world.particles[index].distance = particle.distance
}
function remove_particle(index) {
    world.particles.splice(index, 1)
}