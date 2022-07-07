const canvas = document.getElementById("carCanvas")
canvas.width = 200

const networkCanvas = document.getElementById("networkCanvas")
networkCanvas.width = 300

const ctx = canvas.getContext("2d")
const networkCtx = networkCanvas.getContext("2d")

const road = new Road(canvas.width / 2, canvas.width * 0.9)

const mainCarData = {
    speed: 0,
    maxSpeed: 3,
    accl: 0.2,
    friction: 0.05,
    angle: 0,
    pilot: "AI"
}

const car = new Car(road.getLaneCentre(0), 100, 30, 50, "black")

const otherCarData = {
    speed: 0,
    maxSpeed: 3,
    accl: 0.2,
    friction: 0.05,
    angle: 0,
    pilot: "NPC"
}

const otherCarData1 = {
    speed: 0,
    maxSpeed: 2,
    accl: 0.2,
    friction: 0.05,
    angle: 0,
    pilot: "NPC"
}

const traffic = [
    //new Car(road.getLaneCentre(1), 100, 30, 50, "red", otherCarData),
    new Car(road.getLaneCentre(0), 10, 30, 50, "blue", otherCarData1),
    //new Car(road.getLaneCentre(1), 200, 30, 50, "yellow", otherCarData1)
]

//car.draw(ctx)
console.log()
function filterdTraffic(Car) {
    let newArray = []
    traffic.forEach(v => {
        if (v !== Car) {
            newArray.push(v)
        }
    });
    return newArray
}

function animate() {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, [])
        if (traffic[i].sensor) {
            traffic[i].sensor.setVisibility(false)
        }
    }

    car.update(road.borders, traffic)
    canvas.height = window.innerHeight
    networkCanvas.height = window.innerHeight

    ctx.save()
    ctx.translate(0, -car.y + canvas.height * 0.8)

    road.draw(ctx)

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(ctx)
    }

    car.draw(ctx)

    ctx.restore()

    Visualizer.drawNetwork(networkCtx, car.brain)
    requestAnimationFrame(animate)
}

animate()