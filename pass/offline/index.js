window.onload = function () {
    function receiveMessage(e) {
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

    // Empty the table
    while (table.firstChild) {
        table.removeChild(table.firstChild)
    }

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

function onScanSuccess(decodedText, decodedResult) {
    const data = decodedText

    // Split the data into individual key-value pairs
    const pairs = data.split(';')

    // Create an object to store the parsed key-value pairs
    const parsedData = {}
    pairs.forEach((pair) => {
        const [key, value] =
            pair.split('=').length == 1 ? [pair, true] : pair.split('=')
        parsedData[key] = value
    })

    // Add the parsed data to the local storage
    let fieldData = localStorage.getItem('fieldData')
        ? localStorage.getItem('fieldData').split('\n')
        : []

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

    JSONData[JSONData.length] = parsedData

    let existingData = localStorage.getItem('fieldData')

    if (existingData) existingData = existingData.split('\n')
    else existingData = []

    for (let row in existingData) {
        existingData[row] = existingData[row].split(',')
    }

    let newRow = []
    let headerRow = []

    for (let key in parsedData) {
        newRow.push(parsedData[key])
        headerRow.push(key)
    }

    if (headerRow != existingData[0]) existingData[0] = headerRow

    existingData.push(newRow.join(','))

    localStorage.setItem('fieldData', existingData.join('\n'))

    displayData(localStorage.getItem('fieldData'), 'fieldScouting')
}

document.getElementById('start').addEventListener('click', () => {
    let html5QrcodeScanner = new Html5QrcodeScanner(
        'reader',
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
    )
    html5QrcodeScanner.render(onScanSuccess, () => {
        return
    })

    document.getElementById('start').style.display = 'none'
})

function download(filename, text) {
    let element = document.createElement('a')
    element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
    )
    element.setAttribute('download', filename)

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
}

document.getElementById('exportPit').addEventListener('click', () => {
    download('pitScouting.csv', localStorage.getItem('pitData'))
})

document.getElementById('exportField').addEventListener('click', () => {
    download('fieldScouting.csv', localStorage.getItem('fieldData'))
})
