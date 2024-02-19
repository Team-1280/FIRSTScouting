let data2024 = require('../2024/config.json')['PASS']
let data2023 = require('../2023/config.json')
let inGameStages = ['auton', 'endgame', 'teleop']
let totalStages = ['auton', 'endgame', 'teleop', 'prematch', 'postmatch']
let noPrematch = ['auton', 'endgame', 'teleop', 'postmatch']

function calculate(stages) {
    let c23 = 0
    let c24 = 0

    for (let stage of stages) {
        for (let field of data2024[stage]) {
            c24 += 1
        }
    }
    for (let stage of stages) {
        for (let field of data2023[stage]) {
            c23 += 1
        }
    }

    return [c24, c23]
}

let total = calculate(totalStages)
let noPre = calculate(noPrematch)
let inGame = calculate(inGameStages)

console.log('Total:')
console.log('   2024: ' + total[0])
console.log('   2023: ' + total[1])
console.log('In Game:')
console.log('   2024: ' + inGame[0])
console.log('   2023: ' + inGame[1])
console.log('No Prematch:')
console.log('   2024: ' + noPre[0])
console.log('   2023: ' + noPre[1])
