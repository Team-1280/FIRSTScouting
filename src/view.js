document.addEventListener("DOMContentLoaded", function () {
    const table = document.getElementById("data")
    const filterDiv = document.getElementById("filter")
    let headersToShow = [
        "Scouter",
        "Event",
        "Level",
        "Match",
        "Robot",
        "Team #"
    ]

    let headers = []

    // Fetch JSON data from the /rawdata endpoint
    fetch("/rawdata")
        .then((response) => response.json())
        .then((data) => {
            // Convert data object into an array of rows
            const rows = Object.values(data)

            if (rows.length === 0) {
                // Handle empty data
                const emptyRow = document.createElement("tr")
                const emptyCell = document.createElement("td")
                emptyCell.colSpan = Object.keys(data[0]).length
                emptyCell.textContent = "No data available"
                emptyRow.appendChild(emptyCell)
                table.appendChild(emptyRow)
                return
            }

            headers = Object.keys(rows[0])

            for (let i = 0; i < headers.length; i++) {
                headers[i] = headers[i]
                    .split("-")
                    .join(" ")
                    .replace(/\w\S*/g, function (txt) {
                        return (
                            txt.charAt(0).toUpperCase() +
                            txt.substr(1).toLowerCase()
                        )
                    })
            }

            // Create table header with sorting indicators for specified columns
            const headerRow = document.createElement("tr")
            headers.forEach((header, index) => {
                const th = document.createElement("th")
                th.textContent = header
                th.dataset.sort = "none" // Initial sorting state
                th.addEventListener("click", () => {
                    sortTable(table, headers.indexOf(header))
                })
                headerRow.appendChild(th)
            })
            table.appendChild(headerRow)

            // Create table rows with data for specified columns
            rows.forEach((rowData) => {
                const row = document.createElement("tr")
                headers.forEach((header) => {
                    const cell = document.createElement("td")
                    cell.textContent = rowData[header]
                    row.appendChild(cell)
                })
                table.appendChild(row)
            })

            // Create filtering input fields dropdown
            const filterContainer = createDropdownContainer(
                headers,
                "filter-container"
            )
            const filterInputs = [] // Define an array to store the filter inputs
            headers.forEach((header) => {
                const input = document.createElement("input")
                input.type = "text"
                input.placeholder = `${header}`
                input.classList.add("filter-input")
                input.addEventListener("input", () => {
                    applyFilters(table, filterInputs)
                })
                filterInputs.push(input) // Store the input in the array
                filterContainer.appendChild(input)
            })

            // Create column selection checkboxes dropdown
            const columnContainer = createDropdownContainer(
                headers,
                "column-container"
            )
            headers.forEach((header, index) => {
                const isHeaderToShow = headersToShow.includes(header)
                const checkbox = document.createElement("input")
                checkbox.type = "checkbox"
                checkbox.checked = isHeaderToShow // Default to checked for specified columns
                checkbox.classList.add("column-checkbox")
                checkbox.addEventListener("change", () => {
                    if (checkbox.checked) {
                        headersToShow.push(header) // Add to headersToShow
                    } else {
                        const index = headersToShow.indexOf(header)
                        if (index !== -1) {
                            headersToShow.splice(index, 1) // Remove from headersToShow
                        }
                    }
                    applyColumnSelection(table)
                })
                const label = document.createElement("label")
                label.textContent = header
                const container = document.createElement("div")
                container.classList.add("checkcontainer")
                container.appendChild(checkbox)
                container.appendChild(label)
                columnContainer.appendChild(container)
                applyColumnSelection(table)
            })

            // Create dropdown toggle buttons
            const filterButton = createToggleButton(
                "Toggle Filters",
                filterContainer
            )
            const columnButton = createToggleButton(
                "Toggle Columns",
                columnContainer
            )

            const buttonContainer = document.createElement("div")
            buttonContainer.classList.add("button-container")
            buttonContainer.appendChild(columnButton)
            buttonContainer.appendChild(filterButton)
            filterDiv.appendChild(buttonContainer)
            filterDiv.appendChild(document.createElement("br"))
            filterDiv.appendChild(document.createElement("br"))
            filterDiv.appendChild(columnContainer)
            filterDiv.appendChild(filterContainer)

            originalRows = Array.from(table.rows).slice(1)
        })
        .catch((error) => console.error("Error fetching data:", error))

    function createToggleButton(text, container) {
        const button = document.createElement("button")
        button.textContent = text
        button.classList.add("toggle-button")
        button.addEventListener("click", () => {
            toggleDropdown(container)
        })
        return button
    }

    function toggleDropdown(container) {
        container.classList.toggle("visible")
    }

    function createDropdownContainer(headers, className) {
        const container = document.createElement("div")
        container.classList.add(className)
        container.classList.add("dropdown-container")
        return container
    }

    function applyFilters(table) {
        const rows = Array.from(table.rows)
        rows.shift() // Remove header row

        const filterInputs = document.querySelectorAll(".filter-input")

        rows.forEach((row) => {
            const rowData = Array.from(row.cells).map((cell) =>
                cell.textContent.toLowerCase()
            )
            const isVisible = Array.from(filterInputs).every((input, index) =>
                rowData[index].includes(input.value.toLowerCase())
            )
            row.style.display = isVisible ? "table-row" : "none"
        })
    }

    function applyColumnSelection(table) {
        const rows = Array.from(table.rows)
        rows.forEach((row) => {
            Array.from(row.cells).forEach((cell, columnIndex) => {
                cell.style.display = headersToShow.includes(
                    headers[columnIndex]
                )
                    ? ""
                    : "none"
            })
        })
    }

    function sortTable(table, columnIndex) {
        const rows = Array.from(table.rows)
        const isAscending = table.classList.toggle("sort-asc")
        rows.shift() // Remove header row
        rows.sort((a, b) => {
            const aValue = a.cells[columnIndex].textContent
            const bValue = b.cells[columnIndex].textContent
            return isAscending
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue)
        })

        // Clear existing rows
        while (table.rows.length > 1) {
            table.deleteRow(1)
        }

        // Append sorted rows back to the table
        rows.forEach((row) => table.appendChild(row))

        // Reset sort indicators and set sort indicator for the current column
        const headers = table.querySelectorAll("th")
        headers.forEach((header, index) => {
            header.dataset.sort = "none"
            header.textContent = header.textContent.replace(/ ⬆| ⬇/, "")
        })

        const sortedHeader = headers[columnIndex]
        sortedHeader.dataset.sort = isAscending ? "asc" : "desc"
        sortedHeader.textContent = `${sortedHeader.textContent} ${
            isAscending ? "⬆" : "⬇"
        }`
    }
})
