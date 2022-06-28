class Car {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.speed = 0
        this.acceleration = 0.2
        this.maxSpeed = 3
        this.friction = 0.05
        this.angle = 0
        
        this.damaged = false

        this.sensor = new Sensor(this)
        this.controls = new Controls()
    }


    update(roadBorders) {
        this.#move()
        this.polygon = this.#createPolygon()
        this.damaged = this.#assesDamage(roadBorders)
        this.sensor.update(roadBorders)
    }

    #move() {
        if (this.controls.forward) {
            this.speed = this.speed + this.acceleration
        }

        if (this.controls.back) {
            this.speed = this.speed - this.acceleration
        }

        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed
        }
        if (this.speed < -this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2
        }

        if (this.speed > 0) {
            this.speed -= this.friction
        }
        if (this.speed < 0) {
            this.speed += this.friction
        }
        
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0
        }

        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1
            if (this.controls.left) {
                this.angle += 0.03 * flip
            }
            if (this.controls.right) {
                this.angle -= 0.03 * flip
            }
        }

        this.x -= Math.sin(this.angle) * this.speed
        this.y -= Math.cos(this.angle) * this.speed
    }

    #assesDamage(roadBorders) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true
            }
        }
        return false
    }

    #createPolygon() {
        const points = []
        const radius = Math.hypot(this.width, this.height) / 2
        const alpha = Math.atan2(this.width, this.height)

        points.push({
            x: this.x - Math.sin(this.angle - alpha) * radius,
            y: this.y - Math.cos(this.angle - alpha) * radius
        })

        points.push({
            x: this.x - Math.sin(this.angle + alpha) * radius,
            y: this.y - Math.cos(this.angle + alpha) * radius
        })

        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * radius,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * radius
        })

        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * radius,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * radius
        })

        return points
    }

    #disableCar() {

    }

    draw(context) {
        if (this.damaged == true) {
            ctx.fillStyle = "gray"
            this.maxSpeed = 0
        }
        else {
            ctx.fillStyle = "black"
        }
        context.beginPath();

        context.moveTo(this.polygon[0].x, this.polygon[0].y)

        for (let i = 1; i < this.polygon.length; i++) {
            context.lineTo(this.polygon[i].x, this.polygon[i].y)
        }

        context.fill()
        /*
        context.save()
        context.translate(this.x, this.y)
        context.rotate(-this.angle)

        context.beginPath();
        context.rect(
            - this.width / 2,
            - this.height / 2,
            this.width,
            this.height
        );
        context.fill();
        context.restore()
        */

        this.sensor.draw(context)
    }
}