const http = require("http")
const fs = require("fs")
const url = require("url")

const server = http.createServer((req, res) => {
    const urlPath = url.parse(req.url).pathname

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
        case "/keynames":
            fs.readFile("./data/key.json", (err, data) => {
                if (err) throw err
                res.writeHead(200, { "Content-Type": "text/plain" })
                res.write(data)
                return res.end()
            })
            break
        case "/style.css":
            fs.readFile("./src/style.css", (err, data) => {
                if (err) throw err
                res.writeHead(200, { "Content-Type": "text/css" })
                res.write(data)
                return res.end()
            })
            break
        default:
            // Handle default case or send a 404 response
            break
    }
})

server.listen(3000, () => {
    console.log("Website serving on http://localhost:3000")
})

const finalhandler = require("finalhandler")
const serveStatic = require("serve-static")

const serve = serveStatic("./pass/")

const scoutingPASSServer = http.createServer(function (req, res) {
    const done = finalhandler(req, res)
    serve(req, res, done)
})

scoutingPASSServer.listen(8000)
