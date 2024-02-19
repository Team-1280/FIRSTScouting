// Check any teams at CVR who have already participated or are participating in a competition.

const fetch = require('sync-fetch')
require('dotenv').config()
const fs = require('fs')

function retrieveLogs(url, header) {
    return fetch(url, {
        headers: header
    }).json()
}

let cvrTeams = retrieveLogs(
    'https://www.thebluealliance.com/api/v3/event/2024cafr/teams',
    {
        'X-TBA-Auth-Key': process.env.blueAllianceAPIKey
    }
)

let cambTeams = retrieveLogs(
    'https://www.thebluealliance.com/api/v3/event/2024camb/teams',
    {
        'X-TBA-Auth-Key': process.env.blueAllianceAPIKey
    }
)

let teamsWithMatchesPlayed = []

for (let team of cvrTeams) {
    let comps = retrieveLogs(
        `https://www.thebluealliance.com/api/v3/team/${team['key']}/events/2024/statuses`,
        {
            'X-TBA-Auth-Key': process.env.blueAllianceAPIKey
        }
    )
    for (let comp of Object.keys(comps)) {
        try {
            if (
                !comps[comp]['overall_status_str'].includes(
                    'waiting for the event to begin.'
                )
            ) {
                teamsWithMatchesPlayed.push(team['team_number'])
                break
            }
        } catch (err) {
            console.log(comps)
        }
    }
}

for (let team of cambTeams) {
    let comps = retrieveLogs(
        `https://www.thebluealliance.com/api/v3/team/${team['key']}/events/2024/statuses`,
        {
            'X-TBA-Auth-Key': process.env.blueAllianceAPIKey
        }
    )
    for (let comp of Object.keys(comps)) {
        try {
            if (
                !comps[comp]['overall_status_str'].includes(
                    'waiting for the event to begin.'
                )
            ) {
                teamsWithMatchesPlayed.push(team['team_number'])
                break
            }
        } catch (err) {
            continue
        }
    }
}

console.log(teamsWithMatchesPlayed)

fs.writeFileSync(
    './scripts/teamsWithMatchesPlayed.json',
    JSON.stringify(teamsWithMatchesPlayed)
)
