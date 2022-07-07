class NeuralNetwork {
    // list of numbers per layer
    constructor(neuronCounts) {
        this.levels = []

        // my attempt implementation + logic
        /*
        neuronCounts = [3, 5, 6] len:3
        levels = [
            new evel[0]: (3, 5)
            new Level[1]: (5, 6)
        ]
        */
        // my implementatin is correct
        for (let i = 0; i < neuronCounts.length - 1; i++) {
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]))
        }
    }

    static feedForward(givenInputs, network) {
        let outputs = Level.feedForward(givenInputs, network.levels[0])

        for (let i = 1; i < network.levels.length; i++) {
            outputs = Level.feedForward(outputs, network.levels[i])
        }
        return outputs
    }
}
/* NOTES:
    + negative weights mean dont go somewhere
    * inputs are values from car sensors
    + outputs come from weights and biases
*/
class Level {
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount)
        this.outputs = new Array(outputCount)

        // every output neuron has a bias
        this.biases = new Array(outputCount)

        // every input connects to an output
        // every connection has a weight

        this.weights = []
        for (let i = 0; i < inputCount; i++) {
            // each input node has outputCount connections
            this.weights[i] = new Array(outputCount)
        }

        // realistic values for weights / biases 
        Level.#randomize(this)
    }

    static #randomize(level) {
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1
            }
        }

        for (let i = 0; i < level.inputs.length; i++) {
            level.biases[i] = Math.random() * 2 - 1
        }
    }

    // given some inputs, set the level inputs to these
    static feedForward(givenInputs, level) {
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i]
        }

        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0
            /* this is my attempt
            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j]
            }
            */

            // this is the correct implementation
            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i]
            }

            // sum = -0.32; bias = -1 then dont go somewhere 
            if (sum > level.biases[i]) {
                level.outputs[i] = 1
            }
            else {
                level.outputs[i] = 0
            }
        }

        return level.outputs
    }
}