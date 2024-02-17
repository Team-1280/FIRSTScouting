// Check any teams at CVR who have already participated or are participating in a competition.

const fetch = require('sync-fetch')
require('dotenv').config()

function retrieveLogs(url, header) {
    return fetch(url, {
        headers: header
    }).json()
}

let teams = retrieveLogs(
    'https://www.thebluealliance.com/api/v3/event/2024cafr/teams',
    {
        'X-TBA-Auth-Key': process.env.blueAllianceAPIKey
    }
)

let teamsAtCVR = []

for (let team of teams) {
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
                teamsAtCVR.push(team['team_number'])
                break
            }
        } catch (err) {
            console.log(comp)
        }
    }
}
console.log(teamsAtCVR)
