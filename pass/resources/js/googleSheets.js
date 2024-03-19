function setUpGoogleSheets() {
    const scriptURL = `http://${
        window.location.hostname.split(":")[0]
    }:3000/data`
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

        // URL encode the parsed data
        // const fd = new URLSearchParams(
        //     parsedData
        // ).toString()
        
        // fetch(scriptURL + "?" + fd, {
        //     mode: "no-cors"
        // })

        btn.disabled = false
        btn.innerHTML = "Send to Database"

        // Add the parsed data to the local storage
        let existingData = localStorage.getItem('fieldData')

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

        localStorage.setItem('fieldData', existingData.join('\n'))
    })
}
