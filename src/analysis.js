// Get teams when form is submitted
document
    .getElementById("alliances")
    .addEventListener("submit", async function (e) {
        e.preventDefault()
        let teams = {
            r: [],
            b: []
        }
        for (let i = 1; i <= 3; i++) {
            let ri = document.getElementById("red" + i).value
            let bi = document.getElementById("blue" + i).value

            if (ri == "" || bi == "") {
                alert("Please fill in all fields")
                return
            }

            teams.b.push(bi)
            teams.r.push(ri)
        }
        // Fetch team data from server
        console.log("/teams?teams=" + JSON.stringify(teams))

        let data = fetch("/teams?teams=" + JSON.stringify(teams))
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                document.getElementById("redPredictions").innerHTML = ""
                document.getElementById("bluePredictions").innerHTML = ""

                let rPreHTML = "<div id='rNoGames'>"
                let bPreHTML = "<div id='bNoGames'>"

                if (data["noGames"].length > 0) {
                    // Find teams corresponding alliances
                    let noGames = data["noGames"]
                    for (let team of noGames) {
                        if (teams.r.includes(team)) {
                            rPreHTML +=
                                "<strong>Team " +
                                team +
                                " has no games</strong><br>"
                        } else if (teams.b.includes(team)) {
                            bPreHTML +=
                                "<strong>Team " +
                                team +
                                " has no games</strong><br>"
                        }
                    }
                }

                rPreHTML +=
                    "</div><div style='display:flex;justify-content:center;'>"
                bPreHTML +=
                    "</div><div style='display:flex;justify-content:center;'>"

                for (let i = 1; i <= 3; i++) {
                    let r = data["r"][i]
                    let b = data["b"][i]

                    rPreHTML +=
                        "<div class='team' id='red" +
                        r["team"] +
                        "'><h3>Team " +
                        r["team"] +
                        "</h3><ul>"
                    bPreHTML +=
                        "<div class='team' id='blue" +
                        b["team"] +
                        "'><h3>Team " +
                        b["team"] +
                        "</h3><ul>"

                    for (let average in r["averages"]) {
                        rPreHTML +=
                            "<li> Avg. " +
                            average +
                            ": " +
                            r["averages"][average] +
                            "</li>"
                    }
                    for (let average in b["averages"]) {
                        bPreHTML +=
                            "<li> Avg. " +
                            average +
                            ": " +
                            b["averages"][average] +
                            "</li>"
                    }

                    rPreHTML += "</ul></div>"
                    bPreHTML += "</ul></div>"
                }

                rPreHTML +=
                    "</div><h3 style='text-align:center'>Alliance Stats</h3><div id='rAllianceStats'><div>"
                bPreHTML +=
                    "</div><h3 style='text-align:center'>Alliance Stats</h3><div id='bAllianceStats'><div>"

                wp = 0
                nf = 0
                wpWeights = data["weights"]

                for (let average in data["b"]["overall"]) {
                    if (average.endsWith("list")) continue

                    bPreHTML +=
                        "<li> Avg. " +
                        average +
                        ": " +
                        Math.round(
                            Number(data["b"]["overall"][average]) * 100
                        ) /
                            100 +
                        "</li>"

                    rPreHTML +=
                        "<li> Avg. " +
                        average +
                        ": " +
                        Math.round(
                            Number(data["r"]["overall"][average]) * 100
                        ) /
                            100 +
                        "</li>"

                    wp += wpWeights[average]
                        ? wpWeights[average] *
                          (Number(data["b"]["overall"][average]) -
                              Number(data["r"]["overall"][average]))
                        : 0
                }
                let bwp = 1 / (1 + Math.pow(Math.E, -wp))
                let rwp = 1 - bwp

                rPreHTML += `</div>
                <div class='progress-container'>
                    <h4>Win Probability</h4>
                    <div class='progress-bar'>
                        <div data-size='${rwp * 100}' class='progress'>${(
                    rwp * 100
                ).toFixed(2)}%</div>
                    </div>
                    </div>
                </div>`
                bPreHTML += `</div>
                <div class='progress-container'>
                    <h4>Win Probability</h4>
                    <div class='progress-bar'>
                        <div data-size='${bwp * 100}' class='progress'>${(
                    bwp * 100
                ).toFixed(2)}%</div>
                    </div>
                    </div>
                </div>`

                document.getElementById("redPredictions").innerHTML = rPreHTML
                document.getElementById("bluePredictions").innerHTML = bPreHTML

                const progress_bars = document.querySelectorAll(".progress")

                progress_bars.forEach((bar) => {
                    const { size } = bar.dataset
                    bar.style.width = `${size}%`
                })
            })
    })
