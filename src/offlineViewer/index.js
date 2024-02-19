window.onload = function () {
    function receiveMessage(e) {
        if (e.origin !== `http://${window.location.host.split(':')[0]}:8000`)
            return

        let data = JSON.parse(e.data)
        let existingData = localStorage.getItem('fieldData')

        if (existingData) {
            existingData = existingData.split('\n')

            for (let row in existingData)
                existingData[row] = existingData[row].split(',')
        }
        if (!existingData) existingData = [[]]

        let header = []
        let newRow = []

        for (let row of Object.keys(data)) {
            header.push(row)
            newRow.push(data[row])
        }

        if (header != existingData[0]) existingData[0] = header
        existingData.push(newRow.join(','))

        localStorage.setItem('fieldData', existingData.join('\n'))
    }
    window.addEventListener('message', receiveMessage)
}

// Load CSV data from local storage and display it in a table
let fieldData = localStorage.getItem('fieldData')

if (fieldData) {
    displayData(fieldData, 'fieldScouting')
}

let pitData = localStorage.getItem('pitData')

if (pitData) {
    displayData(pitData, 'pitScouting')
}

function displayData(data, tableID) {
    let table = document.getElementById(tableID)
    let rows = data.split('\n')
    for (let row of rows) {
        let cells = row.split(',')
        let tr = document.createElement('tr')
        for (let cell of cells) {
            let td = document.createElement('td')
            td.innerHTML = cell
            tr.appendChild(td)
        }
        table.appendChild(tr)
    }
}

document.getElementById('showFieldDataJSON').addEventListener('click', () => {
    let fieldData = localStorage.getItem('fieldData').split('\n')

    for (let row in fieldData) {
        fieldData[row] = fieldData[row].split(',')
    }
    let header = fieldData.shift()
    let JSONData = {}

    for (let row in fieldData) {
        let data = {}
        for (let cell in fieldData[row]) {
            data[header[cell]] = fieldData[row][cell]
        }
        JSONData[row] = data
    }

    document.getElementById('fieldDataJSON').innerHTML = JSON.stringify(
        JSONData,
        null,
        2
    )
})

document.getElementById('showPitDataJSON').addEventListener('click', () => {
    let pitData = localStorage.getItem('pitData').split('\n')

    for (let row in pitData) {
        pitData[row] = pitData[row].split(',')
    }
    let header = pitData.shift()
    let JSONData = {}

    for (let row in pitData) {
        let data = {}
        for (let cell in pitData[row]) {
            data[header[cell]] = pitData[row][cell]
        }
        JSONData[row] = data
    }

    document.getElementById('pitDataJSON').innerHTML = JSON.stringify(
        JSONData,
        null,
        2
    )
})
