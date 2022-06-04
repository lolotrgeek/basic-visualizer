
class World {
    /**
     * 
     * @param {*} particles  [{ position:{x, y}, size}]
     */
    constructor(self, particles) {
        this.particles = particles
        this.self = self
        this.p = null
        this.vec = null
    }

    listId(id, x, y) {
        this.p.fill('#FFF')
        this.p.text(id, x, y)
    }

    showParticleCount(x, y) {
        this.p.fill('#FFF')
        this.p.text( "Particles: " + this.particles.length, x, y)
    }

    showId(x,y, id) {
        this.p.fill('#000')
        this.p.text(id, x, y)
    }

    colorize(particle) {
        let color = "#FFF"
        if(particle.state === '1') color = "#ff4d4f"
        if(particle.previous_state === particle.state) color = "#ffe14d"
        this.p.fill(color)
    }

    display(particle) {
        this.p.ellipseMode(this.p.CENTER)
        this.colorize(particle)
        this.p.ellipse(particle.position.x, particle.position.y, particle.size, particle.size)
    }

    spin() {
        this.showParticleCount(this.p.width - 100, 10)
        this.particles.forEach((particle, index) => {
            if (particle) {
                this.listId(particle.id + "  |  State: " + particle.state, 10, 30 + (20 * index))
                this.colorize(particle)
                particle.arrive()
                particle.separate([...this.particles.filter(other => other.id !== particle.id)])
                particle.update()
                if (particle.position && particle.position.x && particle.position.y && typeof particle.size === 'number' && particle.state) {
                    this.display(particle)
                    this.showId(particle.position.x, particle.position.y, particle.id)
                }   
            }

        })
    }
}

class Particle {
    constructor(p, state, size, id) {
        this.p = p
        this.position = this.p.createVector(x, y)
        this.state = state
        this.previous_state = 0
        this.size = size
        this.id = id
        this.scaler = this.size
        this.maxspeed = 2 // Maximum speed
        this.maxforce = 0.3 // Maximum steering force
        this.acceleration = this.p.createVector(0, 0)
        this.velocity = this.p.createVector(0, 0)
        this.x = this.p.width / 2
        this.y = this.p.height / 2
        this.target = this.p.createVector(this.x + this.p.random(-1, 1), this.y + this.p.random(-1, 1))
    }

    separate(others) {
        let sum = this.p.createVector()
        let count = 0
        for (let i = 0; i < others.length; i++) {
            let d = this.p.Vector.dist(this.position, others[i].position)
            let desiredseparation = this.size + others[i].size
            if ((d > 0) && (d < desiredseparation)) {
                // Calculate vector pointing away from neighbor
                let diff = this.p.Vector.sub(this.position, others[i].position)
                diff.normalize()
                diff.div(d) // Weight by distance
                sum.add(diff)
                count++ // Keep track of how many
            }
        }
        // Average -- divide by how many
        if (count > 0) {
            sum.div(count)
            // Our desired vector is the average scaled to maximum speed
            sum.normalize()
            sum.mult(this.maxspeed)
            // Implement Reynolds: Steering = Desired - Velocity
            let steer = this.p.Vector.sub(sum, this.velocity)
            steer.limit(this.maxforce)
            this.acceleration.add(steer)
        }
    }

    arrive(target) {
        let desired = this.p.Vector.sub(target ? target : this.target, this.position) // A vector pointing from the location to the target
        let d = desired.mag()
        // Scale with arbitrary damping within 100 pixels
        if (d < 100) {
            var m = this.p.map(d, 0, 100, 0, this.maxspeed)
            desired.setMag(m)
        } else {
            desired.setMag(this.maxspeed)
        }

        // Steering = Desired minus Velocity
        let steer = p5.Vector.sub(desired, this.velocity)
        steer.limit(this.maxforce)  // Limit to maximum steering force
        this.acceleration.add(steer)
    }

    update() {
        // Update velocity
        this.velocity.add(this.acceleration)
        // Limit speed
        this.velocity.limit(this.maxspeed)
        this.position.add(this.velocity)
        // Reset accelertion to 0 each cycle
        this.acceleration.mult(0)
    }

}