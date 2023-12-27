const http = require("http")
const fs = require("fs")
const QRCode = require("qrcode")
const url = require("url")
const brotli = require("brotli-wasm")

let host = "localhost"

if (process.argv.length < 3) {
    throw new Error("Usage: node index.js <config> <host> <port>")
}

if (process.argv.length > 3) {
    host = process.argv[3]
}

let config = process.argv[2]

let stages = ["prematch", "auton", "teleop", "endgame"]
const config_data = JSON.parse(fs.readFileSync(config, "utf8").split("`")[1])
let key = {}

for (let stage of stages) {
    for (let field of config_data[stage]) {
        key[field.code] = field.name.replace("<br>", " ")
    }
}

fs.writeFileSync("data/key.json", JSON.stringify(key, null, 2))

const server = http.createServer((req, res) => {
    const urlPath = url.parse(req.url).pathname
    let rawData = JSON.parse(fs.readFileSync("./data/data.json", "utf8"))

    switch (urlPath) {
        case "/":
            fs.readFile("./src/index.html", (err, data) => {
                if (err) throw err
                res.writeHead(200, { "Content-Type": "text/html" })
                res.write(data)
                return res.end()
            })
            break
        case "/data":
            const params = url.parse(req.url, true).query
            res.writeHead(200, { "Content-Type": "text/plain" })
            res.write("params")
            res.end()
            let data = require("../data/data.json")
            data[Object.keys(data).length.toString()] = params
            fs.writeFile("./data/data.json", JSON.stringify(data), (err) => {
                if (err) throw err
            })
            break
        case "/rawdata":
            fs.readFile("./data/data.json", (err, data) => {
                if (err) throw err
                res.writeHead(200, { "Content-Type": "text/plain" })
                res.write(data)
                return res.end()
            })
            break
        case "/view":
            fs.readFile("./src/view.html", (err, data) => {
                if (err) throw err
                res.writeHead(200, { "Content-Type": "text/html" })
                res.write(data)
                return res.end()
            })
            break
        case "/view.js":
            fs.readFile("./src/view.js", (err, data) => {
                if (err) throw err
                res.writeHead(200, { "Content-Type": "text/javascript" })
                res.write(data)
                return res.end()
            })
            break
        case "/C-Biscuit.png":
            fs.readFile("./src/C-Biscuit.png", (err, data) => {
                if (err) throw err
                res.writeHead(200, { "Content-Type": "image/png" })
                res.write(data)
                return res.end()
            })
            break
        case "/keynames":
            fs.readFile("./data/key.json", (err, data) => {
                if (err) throw err
                res.writeHead(200, { "Content-Type": "text/plain" })
                res.write(data)
                return res.end()
            })
            break
        case "/water.css":
            fs.readFile("./src/water.css", (err, data) => {
                if (err) throw err
                res.writeHead(200, { "Content-Type": "text/css" })
                res.write(data)
                return res.end()
            })
            break
        case "/html5-qrcode.min.js":
            fs.readFile("./src/html5-qrcode.min.js", (err, data) => {
                if (err) throw err
                res.writeHead(200, { "Content-Type": "text/js" })
                res.write(data)
                return res.end()
            })
            break
        case "/bulk":
            // Generate a bulk QR code
            let bulkData = ""

            for (let scout in rawData) {
                for (let key in rawData[scout]) {
                    bulkData += `${key}=${rawData[scout][key]};`
                }
                bulkData += "//"
            }
            // Remove the last //
            bulkData = bulkData.slice(0, -2)
            let brotliData = brotli.compress(Buffer.from(bulkData), {
                quality: 11
            })
            QRCode.toFileStream(res, Buffer.from(brotliData).toString("hex"))
            break
        case "/receiveBulk":
            let receivedData = url.parse(req.url, true).query.data
            let compressedData = new Uint8Array(
                receivedData.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
            )
            let decompressedData = Buffer.from(
                brotli.decompress(compressedData)
            ).toString("utf8")
            let entries = decompressedData.split("//")
            for (let entry of entries) {
                if (entry != "") {
                    let fields = entry.split(";")
                    let data = require("../data/data.json")
                    let index = Object.keys(data).length.toString()
                    data[index] = {}
                    for (let field of fields) {
                        let [key, value] = field.split("=")
                        data[index][key] = value
                    }
                    fs.writeFileSync(
                        "./data/data.json",
                        JSON.stringify(data, null, 2)
                    )
                }
            }
            break
        case "/semiBulk":
            let rows = url.parse(req.url, true).query.rows.split(",")
            let semiBulkData = ""

            for (let row of rows) {
                for (let key in rawData[row]) {
                    semiBulkData += `${key}=${rawData[row][key]};`
                }
                semiBulkData += "//"
            }
            semiBulkData = semiBulkData.slice(0, -2)
            brotliSemiData = brotli.compress(Buffer.from(semiBulkData), {
                quality: 11
            })
            QRCode.toFileStream(
                res,
                Buffer.from(brotliSemiData).toString("hex")
            )
            break
        default:
            // Handle default case or send a 404 response
            break
    }
})

server.listen(3000, host, () => {
    console.log(`Server running at http://${host}:3000/`)
})

const finalhandler = require("finalhandler")
const serveStatic = require("serve-static")

const serve = serveStatic("./pass/")

const scoutingPASSServer = http.createServer(function (req, res) {
    const done = finalhandler(req, res)
    serve(req, res, done)
})

scoutingPASSServer.listen(8000, host)
