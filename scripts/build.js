const fs = require("fs")
const inquirer = require("inquirer")

let config = JSON.parse(fs.readFileSync("./data/config.json", "utf8"))
let prompts = []

if (fs.existsSync(config["PASSConfigPath"])) {
    prompts.push({
        message: config["PASSConfigPath"] + " already exists. Overwrite it?",
        name: "overwritePASS",
        type: "confirm"
    })
}
if (fs.existsSync("./data/data.json")) {
    prompts.push({
        message: "./data/data.json already exists. Overwrite it?",
        name: "overwriteData",
        type: "confirm"
    })
}

inquirer.prompt(prompts).then((answers) => {
    if (!fs.existsSync("./data/")) {
        fs.mkdirSync("./data/")
    }

    let PASSConfigWrite = `var config_data = \`${JSON.stringify(
        config["PASS"],
        null,
        4
    )}\``
    let dataWrite = `{}`
    let configWrite = config

    if (!answers["overwritePASS"]) {
        PASSConfigWrite = fs.existsSync(config["PASSConfigPath"])
            ? fs.readFileSync(config["PASSConfigPath"], "utf8")
            : PASSConfigWrite

        if (fs.existsSync(config["PASSConfigPath"])) {
            configWrite["PASS"] = JSON.parse(
                fs.readFileSync(config["PASSConfigPath"], "utf8").split("`")[1]
            )
        }
    }
    if (!answers["overwriteData"] && fs.existsSync("./data/data.json")) {
        dataWrite = fs.readFileSync("./data/data.json", "utf8")
    }

    fs.writeFileSync(config["PASSConfigPath"], PASSConfigWrite)
    fs.writeFileSync("./data/data.json", dataWrite)
    fs.writeFileSync("./data/config.json", JSON.stringify(configWrite, null, 4))
})
