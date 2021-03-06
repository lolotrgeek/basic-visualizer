
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

    showId(id, x, y) {
        this.p.fill('#FFF')
        this.p.text(id, x, y)
    }

    showParticleCount(x, y) {
        this.p.fill('#FFF')
        this.p.text( "Particles: " + this.particles.length, x, y)
    }

    showdistance(position, objective, text) {
        this.p.push()
        this.p.fill('#FFF')
        this.p.stroke('#FFF')
        this.p.line(position.x, position.y, objective.x, objective.y)
        this.p.translate((position.x + objective.x) / 2, (position.y + objective.y) / 2)
        this.p.rotate(this.p.atan2(objective.y - position.y, objective.x - position.x))
        this.p.text(this.p.nfc(text.toString(), 1), 0, -5)
        this.p.pop()
    }

    colorize() {
        let color = "#FFF"
        this.p.fill(color)
    }

    display(particle) {
        this.p.ellipseMode(this.p.CENTER)
        this.colorize(particle)
        this.p.ellipse(particle.position.x, particle.position.y, particle.size, particle.size)
    }
    center() {
        this.self.position = this.p.createVector(this.p.width / 2, this.p.height / 2)
    }

    spin() {
        this.center()
        if (this.self && this.self.position && typeof this.self.size === 'number') this.display(this.self)
        this.showParticleCount(this.p.width - 100, 10)
        this.showId("Self " + this.self.id, 10, 10)
        this.particles.forEach((particle, index) => {
            if (particle) {
                this.showId(particle.id + "  |  Ping: " + particle.distance, 10, 30 + (20 * index))
                this.colorize()
                particle.targeting()
                particle.arrive() //TODO: set target to change node distance along vector
                particle.separate([...this.particles.filter(other => other.id !== particle.id), this.self])
                particle.update()
                if (particle.position && particle.position.x && particle.position.y && typeof particle.size === 'number' && particle.distance) {
                    this.display(particle)
                    this.showdistance(this.self.position, particle.position, particle.distance)
                }
            }

        })
    }
}

class Particle {
    constructor(p, x, y, distance, size, id) {
        this.p = p
        this.position = this.p.createVector(x, y)
        this.distance = distance
        this.previous_distance = 0
        this.size = size
        this.id = id
        this.scaler = 10
        this.maxspeed = 2 // Maximum speed
        this.maxforce = 0.3 // Maximum steering force
        this.acceleration = this.p.createVector(0, 0)
        this.velocity = this.p.createVector(0, 0)
        this.target = this.p.createVector(x + (this.distance * this.scaler) * this.p.random(-1, 1), y + (this.distance * this.scaler) * this.p.random(-1, 1))
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

    targeting() {
        if (this.previous_distance !== this.distance) {
            let x_direction = Math.sign(this.position.x)
            let y_direction = Math.sign(this.position.y)
            let x, y


            if (x_direction === -1) x = this.previous_distance < this.distance ? this.position.x - this.distance : this.position.x + this.distance
            if (x_direction === 1) x = this.previous_distance < this.distance ? this.position.x + this.distance : this.position.x - this.distance

            if (y_direction === -1) y = this.previous_distance < this.distance ? this.position.y - this.distance : this.position.y + this.distance
            if (y_direction === 1) y = this.previous_distance < this.distance ? this.position.y + this.distance : this.position.y - this.distance

            this.target = this.p.createVector(x, y)
        }
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