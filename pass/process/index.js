const textarea = document.getElementById('pastebin')
const output = document.getElementById('out')

const convert = () => {
    const data = textarea.value
    const entries = data.split('\n')
    let cols = new Set();

    for (let entry of entries) {
        const fields = entry.split(';')
        for (let field of fields) {
            const col = field.split('=')[0]
            cols.add(col)
        }
    }

    cols = Array.from(cols)
    let list = []
    for (let entry of entries) {
        let entryData = []
        const fields = entry.split(';')
        let fieldNames = fields.map(f => f.split('=')[0])

        for (let col of cols) {
            if (fieldNames.includes(col)) {
                const field = fields[fieldNames.indexOf(col)]
                const value = field.split('=')[1]
                entryData.push(value.replace(/\,/g, '%2C'))
            } else {
                entryData.push(null)
            }
        }

        list.push(entryData)
    }

    let csv = cols.toString() + '\n'
    for (let entry of list) {
        csv += entry.toString() + '\n'
    }
    output.innerText = csv
}

const copy = () => navigator.clipboard.writeText(out.innerText)
