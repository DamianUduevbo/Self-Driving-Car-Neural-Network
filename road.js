class Road {
    constructor(x, width, laneCount = 3) {
        this.x = x
        this.width = width
        this.laneCount = laneCount

        this.left = x - width / 2
        this.right = x + width / 2

        const inifity = 1000000

        this.top = -inifity
        this.bottom = inifity

        const topLeft = {x: this.left, y: this.top}
        const topRight = {x: this.right, y: this.top}
        const bottomLeft = {x: this.left, y: this.bottom}
        const bottomRight = {x: this.right, y: this.bottom}
        
        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ]
    }

    getLaneCentre(index) {
        if (index < 0) {
            index = 0
        }
        const laneWidth = this.width / this.laneCount
        return this.left + laneWidth / 2 + Math.min(index, this.laneCount - 1) * laneWidth;
    }

    draw(context) {
        context.lineWidth = 5
        context.strokeStyle = "white"

        for (let i = 1; i <= this.laneCount - 1; i++) {
            const x = lerp(this.left, this.right, i / this.laneCount)

            context.setLineDash([20, 20])
            
            context.beginPath()
            context.moveTo(x, this.top)
            context.lineTo(x, this.bottom)
            context.stroke()
        }

        context.setLineDash([])
        this.borders.forEach(v => {
            context.beginPath()
            context.moveTo(v[0].x, v[0].y)
            context.lineTo(v[1].x, v[1].y)
            context.stroke()
        })
        /*
        */
    }
}

