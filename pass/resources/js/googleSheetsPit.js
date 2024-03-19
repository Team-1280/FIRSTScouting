function setUpGoogleSheets() {
    const form = document.querySelector("#scoutingForm")
    const btn = document.querySelector("#submit")

    form.addEventListener("submit", (e) => {
        e.preventDefault()
        btn.disabled = true
        btn.innerHTML = "Sending..."

        let pairs = getData(true).split(';')

        const parsedData = {}
        pairs.forEach((pair) => {
            const [key, value] = pair.split("=")
            parsedData[key] = value
        })

        btn.disabled = false
        btn.innerHTML = "Send to Database"

        // Add the parsed data to the local storage
        let existingData = localStorage.getItem('pitData')

        if (existingData) {
            existingData = existingData.split('\n')

            for (let row in existingData)
                existingData[row] = existingData[row].split(',')
        }
        if (!existingData) existingData = [[]]

        let header = []
        let newRow = []

        for (let row of Object.keys(parsedData)) {
            header.push(row)
            newRow.push(parsedData[row])
        }

        if (header != existingData[0]) existingData[0] = header
        existingData.push(newRow.join(','))

        localStorage.setItem('pitData', existingData.join('\n'))
    })
}
