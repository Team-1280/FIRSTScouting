const http = require('http')
const fs = require('fs')
const QRCode = require('qrcode')
const url = require('url')
const brotli = require('brotli-wasm')

let host = 'localhost'

if (process.argv.length < 3) {
    throw new Error('Usage: node index.js <config> <host> <port>')
}

if (process.argv.length > 3) {
    host = process.argv[3]
}

let config = process.argv[2]

const config_data = JSON.parse(fs.readFileSync(config, 'utf8'))

const server = http.createServer((req, res) => {
    const urlPath = url.parse(req.url).pathname
    let rawData = JSON.parse(fs.readFileSync(config_data['data'], 'utf8'))

    switch (urlPath) {
        case '/':
            fs.readFile('./src/dataCollector/index.html', (err, data) => {
                if (err) throw err
                res.writeHead(200, { 'Content-Type': 'text/html' })
                res.write(data)
                return res.end()
            })
            break
        case '/data':
            const params = url.parse(req.url, true).query
            res.writeHead(200, { 'Content-Type': 'text/plain' })
            res.write('params')
            res.end()
            rawData[Object.keys(rawData).length.toString()] = params
            fs.writeFileSync(config_data['data'], JSON.stringify(rawData))
            break
        case '/rawdata':
            res.writeHead(200, { 'Content-Type': 'text/plain' })
            res.write(JSON.stringify(rawData))
            res.end()
            break
        case '/view':
            fs.readFile('./src/dataCollector/view.html', (err, data) => {
                if (err) throw err
                res.writeHead(200, { 'Content-Type': 'text/html' })
                res.write(data)
                return res.end()
            })
            break
        case '/team':
            let teamNo = url.parse(req.url, true).query.team

            let teamAverage = config_data['averages']

            let lookupTeamData = {
                team: teamNo,
                games: [],
                averages: {}
            }

            for (let average of teamAverage) {
                Object.assign(lookupTeamData, {
                    [average[0]]: []
                })
            }

            for (let game in rawData) {
                if (rawData[game]['t'] == teamNo) {
                    lookupTeamData['games'].push(rawData[game])
                }

                for (let average of teamAverage) {
                    lookupTeamData[average[0]].push(rawData[game][average[0]])
                }
            }

            for (let average of teamAverage) {
                lookupTeamData[average[0]] =
                    teamData[average[0]].reduce((a, b) => a + b) /
                    teamData['games'].length
            }

            res.writeHead(200, { 'Content-Type': 'text/plain' })
            res.write(JSON.stringify(lookupTeamData))
            res.end()

            break
        case '/teams':
            // Get all games with each team
            let teams = JSON.parse(url.parse(req.url, true).query.teams)

            let averages = config_data['averages']

            let teamData = {
                r: {
                    1: {
                        team: teams.r[0],
                        games: [],
                        averages: {}
                    },
                    2: {
                        team: teams.r[1],
                        games: [],
                        averages: {}
                    },
                    3: {
                        team: teams.r[2],
                        games: [],
                        averages: {}
                    },
                    overall: {}
                },
                b: {
                    1: {
                        team: teams.b[0],
                        games: [],
                        averages: {}
                    },
                    2: {
                        team: teams.b[1],
                        games: [],
                        averages: {}
                    },
                    3: {
                        team: teams.b[2],
                        games: [],
                        averages: {}
                    },
                    overall: {}
                },
                noGames: [],
                weights: {
                    ...config_data['weights']
                }
            }

            for (let game in Object.keys(rawData)) {
                for (var team = 0; team < 3; team++) {
                    if (rawData[game]['t'] == teams.r[team]) {
                        teamData['r'][team + 1]['games'].push(rawData[game])
                    }
                    if (rawData[game]['t'] == teams.b[team]) {
                        teamData['b'][team + 1]['games'].push(rawData[game])
                    }
                }
            }

            for (let alliance in teamData) {
                if (alliance == 'noGames' || alliance == 'weights') continue
                for (let team in teamData[alliance]) {
                    if (team == 'overall') continue

                    let data = {}

                    for (let average of averages) {
                        Object.assign(data, {
                            [average[0]]: []
                        })
                    }

                    if (teamData[alliance][team]['games'].length == 0) {
                        teamData['noGames'].push(
                            teamData[alliance][team]['team']
                        )
                        continue
                    }

                    for (let game in teamData[alliance][team]['games']) {
                        for (let average of averages) {
                            let value =
                                teamData[alliance][team]['games'][game][
                                    average[0]
                                ]
                            if (
                                [
                                    'x',
                                    'below-avg',
                                    'avg',
                                    'good',
                                    'excellent'
                                ].includes(value)
                            ) {
                                data[average[0]].push(
                                    [
                                        'x',
                                        'below-avg',
                                        'avg',
                                        'good',
                                        'excellent'
                                    ].indexOf(value)
                                )
                            } else if (value == 'N' || value == 'Y') {
                                data[average[0]].push(value == 'N' ? 0 : 1)
                            } else if (!isNaN(value)) {
                                data[average[0]].push(Number(value))
                            } else {
                                console.log(value)
                                throw new Error(
                                    `Unknown type: ${value} \n Should be number; one of ['x', 'below-avg', 'avg', 'good', 'excellent']; one of 'N' or 'Y'`
                                )
                            }
                        }
                    }
                    // Calculate averages
                    for (let average of averages) {
                        Object.assign(teamData[alliance][team]['averages'], {
                            [average[1]]:
                                data[average[0]].reduce((a, b) => a + b) /
                                data[average[0]].length
                        })

                        let current = teamData[alliance]['overall'][
                            average[1] + 'list'
                        ]
                            ? teamData[alliance]['overall'][average[1] + 'list']
                            : []

                        current.push(...data[average[0]])

                        Object.assign(teamData[alliance]['overall'], {
                            [average[1] + 'list']: current,
                            [average[1]]:
                                current.reduce((a, b) => a + b) / current.length
                        })
                    }
                }
            }

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(teamData))
            break
        case '/analysis':
            fs.readFile('./src/dataCollector/analysis.html', (err, data) => {
                if (err) throw err
                res.writeHead(200, { 'Content-Type': 'text/html' })
                res.write(data)
                return res.end()
            })
            break
        case '/bulk':
            // Generate a bulk QR code
            let bulkData = ''

            for (let scout in rawData) {
                for (let key in rawData[scout]) {
                    bulkData += `${key}=${rawData[scout][key]};`
                }
                bulkData += '//'
            }
            // Remove the last //
            bulkData = bulkData.slice(0, -2)
            let brotliData = brotli.compress(Buffer.from(bulkData), {
                quality: 11
            })
            QRCode.toFileStream(res, Buffer.from(brotliData).toString('hex'))
            break
        case '/receiveBulk':
            let receivedData = url.parse(req.url, true).query.data
            let compressedData = new Uint8Array(
                receivedData.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
            )
            let decompressedData = Buffer.from(
                brotli.decompress(compressedData)
            ).toString('utf8')
            let entries = decompressedData.split('//')
            for (let entry of entries) {
                if (entry != '') {
                    let fields = entry.split(';')
                    let index = Object.keys(rawData).length.toString()
                    rawData[index] = {}
                    for (let field of fields) {
                        let [key, value] = field.split('=')
                        rawData[index][key] = value
                    }
                    fs.writeFileSync(
                        config_data['data'],
                        JSON.stringify(rawData, null, 2)
                    )
                }
            }
            break
        case '/semiBulk':
            let rows = url.parse(req.url, true).query.rows.split(',')
            let semiBulkData = ''

            for (let row of rows) {
                for (let key in rawData[row]) {
                    semiBulkData += `${key}=${rawData[row][key]};`
                }
                semiBulkData += '//'
            }
            semiBulkData = semiBulkData.slice(0, -2)
            brotliSemiData = brotli.compress(Buffer.from(semiBulkData), {
                quality: 11
            })
            QRCode.toFileStream(
                res,
                Buffer.from(brotliSemiData).toString('hex')
            )
            break
        case '/keynames':
            res.writeHead(200, { 'Content-Type': 'text/plain' })
            res.write(
                JSON.stringify({
                    keys: config_data['keys'],
                    headers: config_data['headers']
                })
            )
            res.end()
            break
        case '/picklistData':
            let picklistData = {
                weights: Object.keys(config_data['picklist']),
                teams: {},
                weightRanges: config_data['picklist']
            }

            for (let game in rawData) {
                let gameData = {}
                let avg = picklistData['teams'][rawData[game]['t']]
                    ? picklistData['teams'][rawData[game]['t']]['avg']
                    : {}
                for (let weight of picklistData['weights']) {
                    gameData[weight] = rawData[game][weight]

                    avg[weight] =
                        avg[weight] && parseFloat(rawData[game][weight])
                            ? avg[weight] + parseFloat(rawData[game][weight])
                            : parseFloat(rawData[game][weight])
                }

                if (!picklistData['teams'][rawData[game]['t']]) {
                    picklistData['teams'][rawData[game]['t']] = {
                        games: [],
                        avg: avg
                    }
                }
                picklistData['teams'][rawData[game]['t']]['games'].push(
                    gameData
                )
                picklistData['teams'][rawData[game]['t']]['avg'] = avg
            }

            for (let team in picklistData['teams']) {
                for (let weight of picklistData['weights']) {
                    picklistData['teams'][team]['avg'][weight] =
                        picklistData['teams'][team]['avg'][weight] /
                        picklistData['teams'][team]['games'].length
                }
            }

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(picklistData))
            break
        case '/picklist':
            fs.readFile('./src/dataCollector/picklist.html', (err, data) => {
                if (err) throw err
                res.writeHead(200, { 'Content-Type': 'text/html' })
                res.write(data)
                return res.end()
            })
            break
        case '/loadPicklist':
            fs.readFile(config_data['picklistFile'], (err, data) => {
                if (err) throw err
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.write(data)
                return res.end()
            })
            break
        case '/savePicklist':
            // Get body of request
            let body = ''
            req.on('data', (chunk) => {
                body += chunk
            })

            req.on('end', () => {
                let picklistData = JSON.parse(body)
                fs.writeFileSync(
                    config_data['picklistFile'],
                    JSON.stringify(picklistData, null, 2)
                )
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.write(JSON.stringify({ success: true }))
                res.end()
            })
            break
        case '/jsonDataRecieve':
            let recieveData = JSON.parse(url.parse(req.url, true).query.data)

            // Add data to rawData
            for (let row in recieveData) {
                rawData[Object.keys(rawData).length.toString()] =
                    recieveData[row]
            }

            fs.writeFileSync(
                config_data['data'],
                JSON.stringify(rawData, null, 2)
            )

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: true }))
            break
        case '/sortable.min.js':
            fs.readFile('./src/dataCollector/sortable.min.js', (err, data) => {
                if (err) throw err
                res.writeHead(200, { 'Content-Type': 'text/javascript' })
                res.write(data)
                return res.end()
            })
            break
        case '/view.js':
            fs.readFile('./src/dataCollector/view.js', (err, data) => {
                if (err) throw err
                res.writeHead(200, { 'Content-Type': 'text/javascript' })
                res.write(data)
                return res.end()
            })
            break
        case '/C-Biscuit.png':
            fs.readFile('./src/dataCollector/C-Biscuit.png', (err, data) => {
                if (err) throw err
                res.writeHead(200, { 'Content-Type': 'image/png' })
                res.write(data)
                return res.end()
            })
            break
        case '/water.css':
            fs.readFile('./src/dataCollector/water.css', (err, data) => {
                if (err) throw err
                res.writeHead(200, { 'Content-Type': 'text/css' })
                res.write(data)
                return res.end()
            })
            break
        case '/html5-qrcode.min.js':
            fs.readFile(
                './src/dataCollector/html5-qrcode.min.js',
                (err, data) => {
                    if (err) throw err
                    res.writeHead(200, { 'Content-Type': 'text/js' })
                    res.write(data)
                    return res.end()
                }
            )
            break
        case '/analysis.js':
            fs.readFile('./src/dataCollector/analysis.js', (err, data) => {
                if (err) throw err
                res.writeHead(200, { 'Content-Type': 'text/javascript' })
                res.write(data)
                return res.end()
            })
            break
        case '/picklist.js':
            fs.readFile('./src/dataCollector/picklist.js', (err, data) => {
                if (err) throw err
                res.writeHead(200, { 'Content-Type': 'text/javascript' })
                res.write(data)
                return res.end()
            })
            break
        case '/lookup.js':
            fs.readFile('./src/dataCollector/lookup.js', (err, data) => {
                if (err) throw err
                res.writeHead(200, { 'Content-Type': 'text/javascript' })
                res.write(data)
                return res.end()
            })
            break
        case '/generateLink.js':
            fs.readFile('./src/dataCollector/generateLink.js', (err, data) => {
                if (err) throw err
                res.writeHead(200, { 'Content-Type': 'text/javascript' })
                res.write(data)
                return res.end()
            })
            break
        case '/lookup':
            fs.readFile('./src/dataCollector/lookup.html', (err, data) => {
                if (err) throw err
                res.writeHead(200, { 'Content-Type': 'text/html' })
                res.write(data)
                return res.end()
            })
            break
        default:
            res.writeHead(404)
            res.end()
            break
    }
})

server.listen(3000, host, () => {
    console.log(`Server running at http://${host}:3000/`)
})

const finalhandler = require('finalhandler')
const serveStatic = require('serve-static')

const serve = serveStatic('./pass/')

const scoutingPASSServer = http.createServer(function (req, res) {
    const done = finalhandler(req, res)
    serve(req, res, done)
})

const offlineviewer = serveStatic('./src/offlineViewer/')

const offlineViewerServer = http.createServer(function (req, res) {
    const done = finalhandler(req, res)
    offlineviewer(req, res, done)
})

scoutingPASSServer.listen(8000, host, () => {
    console.log(`Scouting P.A.S.S. Server running at http://${host}:8000/`)
})

offlineViewerServer.listen(1280, host, () => {
    console.log(`Offline Viewer Server running at http://${host}:1280/`)
})
