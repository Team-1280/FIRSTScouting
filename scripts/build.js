const fs = require("fs")

// Create data/data.json and key.json
fs.mkdirSync("data")
fs.writeFileSync("data/data.json", "{}")
fs.writeFileSync("data/key.json", "{}")
fs.writeFileSync("data/.gitignore", "*")
