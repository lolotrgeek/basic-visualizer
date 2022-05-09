let div = document.getElementById("sketch")
let x = div.offsetWidth
let y = div.offsetHeight
let scalar = 10
let world = new World({},[])
let cnv

function startsketch(world) {
    let sketch = function (p) {
        world.p = p
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

    let myp5 = new p5(sketch)
}
function stopsketch(world) {
    console.log('stopping')
    world.p.remove()
}

startsketch(world)

listen(msg => {
    if (typeof msg === 'object') {

        if (typeof msg.world === 'object') {
            if (msg.world.id && msg.world.distances) {
                let particles = Object.keys(msg.world.distances).map(key => {
                    let particle = {}
                    particle.id = key
                    particle.size = 2
                    particle.distance = msg.world.distances[key].distance
                    particle.position = { x: msg.world.distances[key].distance, y: msg.world.distances[key].distance }
                    return particle
                })
                let self = {}
                self.id = msg.world.id
                self.size = 10

                console.log(particles)

                world.self = self
                world.particles = particles
            }
            // node = circle
            // distance = length of line + text
            // click on node = show distances for that node -> redraw

        }

    }
    else if (msg === "CLOSED") {
        stopsketch(world) // from sketch.js
    }
})

