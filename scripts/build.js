const fs = require('fs')
const inquirer = require('inquirer')

if (process.argv.length < 3) {
    console.log('Usage: yarn build <config>')
    process.exit(1)
}

let config = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
let prompts = []

if (fs.existsSync(config['PASSConfigPath'])) {
    prompts.push({
        message:
            config['PASSConfigPath'] +
            ' already exists. Overwrite it? (if no, the "PASS" entry in your config file will be updated to match)',
        name: 'overwritePASS',
        type: 'confirm'
    })
}
if (fs.existsSync(config['data'])) {
    prompts.push({
        message: config['data'] + ' already exists. Overwrite it?',
        name: 'overwriteData',
        type: 'confirm'
    })
}

inquirer.prompt(prompts).then((answers) => {
    let PASSConfigWrite = `var config_data = \`${JSON.stringify(
        config['PASS'],
        null,
        4
    )}\``
    let dataWrite = `{}`
    let configWrite = config

    if (!answers['overwritePASS']) {
        PASSConfigWrite = fs.existsSync(config['PASSConfigPath'])
            ? fs.readFileSync(config['PASSConfigPath'], 'utf8')
            : PASSConfigWrite

        if (fs.existsSync(config['PASSConfigPath'])) {
            configWrite['PASS'] = JSON.parse(
                fs.readFileSync(config['PASSConfigPath'], 'utf8').split('`')[1]
            )
        }
    }
    if (!answers['overwriteData'] && fs.existsSync(config['data'])) {
        dataWrite = fs.readFileSync(config['data'], 'utf8')
    }

    fs.writeFileSync(config['PASSConfigPath'], PASSConfigWrite)
    fs.writeFileSync(config['data'], dataWrite)
    fs.writeFileSync(process.argv[2], JSON.stringify(configWrite, null, 4))
})
