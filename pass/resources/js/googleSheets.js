function setUpGoogleSheets() {
    const scriptURL = `http://${
        window.location.hostname.split(":")[0]
    }:3000/data`
    const form = document.querySelector("#scoutingForm")
    const btn = document.querySelector("#submit")

    const recieverWindow = document.querySelector("#reciever").contentWindow;

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
        const fd = new URLSearchParams(
            parsedData
        ).toString()
        
        fetch(scriptURL + "?" + fd, {
            mode: "no-cors"
        })

        btn.disabled = false
        btn.innerHTML = "Send to Database"

        recieverWindow.postMessage(JSON.stringify(parsedData), "http://1280scoutinglocal.vercel.app")
    })
}
