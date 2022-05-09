
class World {
    /**
     * 
     * @param {*} particles  [{ position:{x, y}, size}]
     */
    constructor(self, particles) {
        this.particles = particles
        this.self = self
        this.p = null
        this.scaler = 10
    }

    showdistance(position, objective, distance) {
        this.p.push()
        this.p.fill(0)
        this.p.line(position.x, position.y, objective.x, objective.y)
        this.p.translate((position.x + objective.x) / 2, (position.y + objective.y) / 2)
        this.p.rotate(this.p.atan2(objective.y - position.y, objective.x - position.x))
        this.p.text(this.p.nfc(distance.toString(), 1), 0, -5)
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

    nearby(self, particles) {
        if (particles.length > 0) {
            particles.forEach(particle => {
                this.showdistance(self.position, particle.position, particle.distance)
            })
        }
    }

    inside(particle, thingLocation) {
        let distance = p5.Vector.dist(particle.position, thingLocation)
        if (distance < particle.size) return true
        else return false
    }

    position(particle) {
        let x = this.self.position.x + (particle.position.x) * this.scaler
        let y = this.self.position.y + (particle.position.y) * this.scaler
        return this.p.createVector(x, y)
    }

    center(){
        this.self.position = {}
        this.self.position.x = this.p.width / 2
        this.self.position.y = this.p.height / 2
    }

    spin() {
        this.center()
        this.display(this.self)
        this.particles.forEach(particle => {
            if(!particle.positioned) {
                particle.position = this.position(particle)
                particle.positioned = true
            }
            this.display(particle)
            this.showdistance(this.self.position, particle.position, particle.distance)
        })

    }
}