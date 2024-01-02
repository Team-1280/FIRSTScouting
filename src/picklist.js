document.addEventListener("DOMContentLoaded", async function () {
    // Fetch picklist related configs
    let configs = await fetch("/picklistData")
    let { teams, weights, weightRanges } = await configs.json()

    let weightValues = {}
    for (let weight of weights) {
        weightValues[weight] =
            (weightRanges[weight][0] - weightRanges[weight][1]) / 2
    }
    console.log(weightValues)

    // Create sliders for each weight
    for (let weight of weights) {
        let containerDiv = document.createElement("div")
        containerDiv.style = "margin: 0.4rem;"

        let slider = document.createElement("input")
        slider.type = "range"
        slider.step =
            Math.abs(weightRanges[weight][0] - weightRanges[weight][1]) / 10
        slider.max = Math.max(...weightRanges[weight])
        slider.min = Math.min(...weightRanges[weight])
        if (slider.min < 0) {
            slider.style.direction = "rtl"
        }
        slider.value = weightValues[weight]
        slider.id = weight
        slider.classList.add("weight-slider")
        slider.margin = "0.4rem"
        slider.oninput = function () {
            weightValues[weight] = this.value
            updatePicklist(weightValues)
        }

        containerDiv.appendChild(slider)

        let label = document.createElement("label")
        label.innerText = weight
            .replace("-", " ")
            .replace("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (s) => s.toUpperCase())
        label.htmlFor = weight
        containerDiv.appendChild(label)

        document.getElementById("weights").appendChild(containerDiv)
    }

    // Add team names to teams table
    let teamsContainer = document.getElementById("teams")
    let teamsTable = document.createElement("table")
    teamsTable.id = "teamsTable"
    let header = document.createElement("tr")
    for (let weight of ["Add To List", "Team"].concat(weights)) {
        let headerCell = document.createElement("th")
        headerCell.innerHTML = weight
        header.appendChild(headerCell)
    }
    teamsTable.appendChild(header)
    for (let team in teams) {
        let row = document.createElement("tr")
        let name = document.createElement("td")
        name.innerHTML = team
        let addToListButtonData = document.createElement("td")
        let addButton = document.createElement("button")
        addToListButtonData.classList.add("add-button")
        addButton.innerHTML = "+"
        addButton.onclick = function () {
            addToList(team, weightValues)
        }
        addToListButtonData.appendChild(addButton)
        row.appendChild(addToListButtonData)
        row.appendChild(name)
        for (let weight of weights) {
            let cell = document.createElement("td")
            cell.innerHTML =
                teams[team]["avg"][weight] != null
                    ? teams[team]["avg"][weight]
                    : "No Data"
            row.appendChild(cell)
        }
        teamsTable.appendChild(row)
    }
    teamsContainer.appendChild(teamsTable)

    updatePicklist(weightValues)
})

function updatePicklist(weights) {
    // Sort table based on weights
    let teamsTable = document.getElementById("teamsTable")
    let rows = Array.from(teamsTable.getElementsByTagName("tr"))
    rows.shift() // Remove header row

    rows.sort((a, b) => {
        let aValue = 0
        let bValue = 0
        for (let weight in weights) {
            let i = Object.keys(weights).indexOf(weight) + 2
            if (a.children[i].innerHTML != "No Data") {
                aValue += weights[weight] * a.children[i].innerHTML
            }
            if (b.children[i].innerHTML != "No Data") {
                bValue += weights[weight] * b.children[i].innerHTML
            }
        }
        return bValue - aValue
    })

    // Clear existing rows
    while (teamsTable.rows.length > 1) {
        teamsTable.deleteRow(1)
    }

    // Append sorted rows back to the table
    rows.forEach((row) => teamsTable.appendChild(row))
}

function addToList(team, weights) {
    console.log(team, weights)

    // Remove team from table
    let teamsTable = document.getElementById("teamsTable")
    let rows = Array.from(teamsTable.getElementsByTagName("tr"))
    let teamRow
    rows.shift() // Remove header row

    for (let i = 0; i < rows.length; i++) {
        if (rows[i].children[1].innerHTML == team) {
            teamRow = rows[i]
            rows[i].remove()
            break
        }
    }

    let header = document.createElement("tr")

    for (let weight of ["Team"].concat(Object.keys(weights))) {
        let headerCell = document.createElement("th")
        headerCell.innerHTML = weight
        header.appendChild(headerCell)
    }

    let picklist = document.getElementById("picklist")
    if (Array.from(picklist.getElementsByTagName("tr")).length == 0) {
        picklist.children[0].appendChild(header)
    }

    // Remove "add to list" button from row
    teamRow.querySelector(".add-button").remove()
    teamRow.id = "picklist-team-" + team
    picklist.children[1].appendChild(teamRow)

    if (Array.from(picklist.children[1].children).length == 1) {
        sortable("#pbody", {
            items: "tr",
            placeholder: `<tr>${header.innerHTML}</tr>`,
            forcePlaceholderSize: false
        })
    } else {
        sortable("#pbody", "reload")
    }
}

function saveList() {
    let teamsTable = document.getElementById("pbody")
    let rows = Array.from(teamsTable.getElementsByTagName("tr"))
    let header = document.querySelectorAll("#pthead tr")[0]

    let body = {
        teams: [],
        weights: {}
    }
    for (let row of rows) {
        let team = {}
        for (let i = 1; i < rows[0].cells.length; i++) {
            team[header.children[i].innerHTML] = row.cells[i].innerHTML
        }
        body["weights"][row.cells[0].innerHTML] = team
        body["teams"].push(row.cells[0].innerHTML)
    }

    fetch("/savePicklist", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
        .then((response) => response.json())
        .then((data) => {
            if (data["error"]) {
                alert(data["error"])
            }
        })
}

function loadList() {
    if (document.getElementById("pbody").children.length > 0) {
        alert("Reload to clear picklist and then load")
        return
    }

    fetch("/loadPicklist")
        .then((response) => response.json())
        .then((data) => {
            if (data["error"]) {
                alert(data["error"])
            } else {
                let teams = data["teams"]
                let weights = data["weights"]
                for (let team of teams) {
                    addToList(team, weights[team])
                }
            }
        })
}
