class Controls {
    constructor(controlType) {
        this.forward = false
        this.back = false
        this.left = false
        this.right = false

        /*
        if (controlType != "NPC") {
            this.#addKeyBoardListeners()
        }
        else {
            this.forward = true
        }
        */

        /*
        */
        switch(controlType.toLowerCase()) {
            case "user":
                this.#addKeyBoardListeners()
                break
            case "npc":
                this.forward = true
                break
            case "ai":
                //this.#addKeyBoardListeners()
                break
            default:
                this.forward = true
                break
        }
        console.log("ENGSN:" + controlType.toLowerCase())
        
    }

    #addKeyBoardListeners() {
        document.onkeydown = (e) => {
            switch(e.key) {
                case "w":
                    this.forward = true
                    break
                case "s":
                    this.back = true
                    break
                case "a":
                    this.left = true
                    break
                case "d":
                    this.right = true
                    break
            }
        }

        document.onkeyup = (e) => {
            switch(e.key) {
                case "w":
                    this.forward = false
                    break
                case "s":
                    this.back = false
                    break
                case "a":
                    this.left = false
                    break
                case "d":
                    this.right = false
                    break
            }
        }
    }
}
