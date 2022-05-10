
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

    showId(id, x, y){
        this.p.fill('#FFF')
        this.p.text(id, x, y)
    }

    showdistance(position, objective, text) {
        this.p.push()
        this.p.fill('#FFF')
        this.p.line(position.x, position.y, objective.x, objective.y)
        this.p.translate((position.x + objective.x) / 2, (position.y + objective.y) / 2)
        this.p.rotate(this.p.atan2(objective.y - position.y, objective.x - position.x))
        this.p.text(this.p.nfc(text.toString(), 1), 0, -5)
        this.p.pop()
    }

    colorize(particle) {
        let color = "#FFF"
        this.p.stroke(color)
        this.p.fill(color)
    }

    display(particle) {
        this.p.ellipseMode(this.p.CENTER)
        this.colorize(particle)
        this.p.ellipse(particle.position.x, particle.position.y, particle.size, particle.size)
    }
    center() {
        this.self.position = {}
        this.self.position.x = this.p.width / 2
        this.self.position.y = this.p.height / 2
    }

    spin() {
        this.center()
        if (this.self && this.self.position && typeof this.self.size === 'number') this.display(this.self)
        this.showId("Self " + this.self.id, 10, 10 )
        this.particles.forEach((particle, index) => {
            if (particle) {
                this.showId(particle.id, 10, 30 + (10 *index))
                this.colorize()
                particle.arrive()
                particle.separate(this.particles.filter(other => other.id !== particle.id))
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
        this.size = size
        this.id = id
        this.maxspeed = 2 // Maximum speed
        this.maxforce = 0.2 // Maximum steering force
        this.acceleration = this.p.createVector(0, 0)
        this.velocity = this.p.createVector(0, 0)
        this.target = this.p.createVector(x + distance, y + distance)
    }

    separate(others) {
        let desiredseparation = this.size * 10
        let sum = this.p.createVector()
        let count = 0
        for (let i = 0; i < others.length; i++) {
            let d = this.p.Vector.dist(this.position, others[i].position)
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
        let desired = this.p.Vector.sub(this.target, this.position) // A vector pointing from the location to the target
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