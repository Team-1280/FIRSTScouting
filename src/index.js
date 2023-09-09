const http = require("http")
const fs = require("fs")
const url = require("url")

const server = http.createServer((req, res) => {
    // Host index.html on server
    if (req.url === "/") {
        fs.readFile("./src/index.html", (err, data) => {
            if (err) throw err
            res.writeHead(200, { "Content-Type": "text/html" })
            res.write(data)
            return res.end()
        })
    } else if (url.parse(req.url).pathname === "/data") {
        const params = url.parse(req.url, true).query

        res.writeHead(200, { "Content-Type": "text/plain" })
        res.write("params")
        res.end()

        let data = require("../data/data.json")

        data[Object.keys(data).length.toString()] = params

        fs.writeFile("./data/data.json", JSON.stringify(data), (err) => {
            if (err) throw err
        })
    } else if (url.parse(req.url).pathname === "/rawdata") {
        fs.readFile("./data/data.json", (err, data) => {
            if (err) throw err
            res.writeHead(200, { "Content-Type": "text/plain" })
            res.write(data)
            return res.end()
        })
    } else if (url.parse(req.url).pathname === "/view") {
        fs.readFile("./src/view.html", (err, data) => {
            if (err) throw err
            res.writeHead(200, { "Content-Type": "text/html" })
            res.write(data)
            return res.end()
        })
    } else if (req.url === "/view.js") {
        fs.readFile("./src/view.js", (err, data) => {
            if (err) throw err
            res.writeHead(200, { "Content-Type": "text/javascript" })
            res.write(data)
            return res.end()
        })
    } else if (url.parse(req.url).pathname === "/keynames") {
        fs.readFile("./data/key.json", (err, data) => {
            if (err) throw err
            res.writeHead(200, { "Content-Type": "text/plain" })
            res.write(data)
            return res.end()
        })
    } else if (url.parse(req.url).pathname === "/style.css") {
        fs.readFile("./src/style.css", (err, data) => {
            if (err) throw err
            res.writeHead(200, { "Content-Type": "text/css" })
            res.write(data)
            return res.end()
        })
    }
})

server.listen(3000, () => {
    console.log("Website serving on http://localhost:3000")
})
