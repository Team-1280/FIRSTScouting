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
                document.getElementById("redPredictions").innerHTML = ""
                document.getElementById("bluePredictions").innerHTML = ""

                let rPreHTML = ""
                let bPreHTML = ""

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

                document.getElementById("redPredictions").innerHTML = rPreHTML
                document.getElementById("bluePredictions").innerHTML = bPreHTML
            })
    })
