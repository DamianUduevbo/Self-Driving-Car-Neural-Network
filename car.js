const defaultDriveData = {
    speed: 0,
    maxSpeed: 8,
    accl: 0.2,
    friction: 0.05,
    angle: 0,
    pilot: "AI"
}


class Car {
    constructor(x, y, width, height, colour, driveData = {...defaultDriveData}) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.colour = colour

        this.speed = driveData.speed
        this.acceleration = driveData.accl
        this.maxSpeed = driveData.maxSpeed
        this.friction = driveData.friction
        this.angle = driveData.angle
        
        this.damaged = false

        this.useBrain = driveData.pilot=="AI"

        if (driveData.pilot.toLowerCase() != "npc") {
            this.sensor = new Sensor(this)
            this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4])
        }
        /* my guess implementation
        + First level this.sensor.rayCount is the number of rays coming from the car
        + Second level this.sensor.readings.length is the number of readings coming from the car's sensor
        RESULT: incorrect implementation
        this.brain = new NeuralNetwork([this.sensor.rayCount, this.sensor.readings.length])
        */
        this.controls = new Controls(driveData.pilot)
    }

    update(roadBorders, traffic) {
        if (!this.damaged) {
            this.#move()
            this.polygon = this.#createPolygon()
            this.damaged = this.#assesDamage(roadBorders, traffic)
        }
        if (this.sensor) {
            this.sensor.update(roadBorders, traffic)
            /*
            const offsets = this.sensor.readings.map(v => {
                v == null ? 0 : 1 - 0;
                console.log(v)
            })
            */
            const offsets = this.sensor.readings.map(v => v == null ? 0 : 1 - v.offset)
            const outputs = NeuralNetwork.feedForward(offsets, this.brain)
            console.log(outputs)

            if (this.useBrain) {
                this.controls.forward = outputs[0]
                this.controls.left = outputs[1]
                this.controls.right = outputs[2]
                this.controls.back = outputs[3]
            }
        }
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

    #assesDamage(roadBorders, traffic) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true
            }
        }

        for (let i = 0; i < traffic.length; i++) {
            if (polysIntersect(this.polygon, traffic[i].polygon)) {
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
            ctx.fillStyle = this.colour
        }
        context.beginPath();

        context.moveTo(this.polygon[0].x, this.polygon[0].y)

        for (let i = 1; i < this.polygon.length; i++) {
            context.lineTo(this.polygon[i].x, this.polygon[i].y)
        }

        context.fill()

        if (this.sensor) {
            this.sensor.draw(context)
        }
    }
}