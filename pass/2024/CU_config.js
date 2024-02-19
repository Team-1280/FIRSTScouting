var config_data = `{
    "auton": [
        {
            "code": "al",
            "name": "Leave Starting Zone",
            "type": "bool"
        },
        {
            "code": "aas",
            "name": "Amp Scores",
            "type": "counter"
        },
        {
            "code": "ass",
            "name": "Speaker Scores",
            "type": "counter"
        }
    ],
    "checkboxAs": "10",
    "endgame": [
        {
            "code": "dt",
            "name": "Stage Timer",
            "type": "timer"
        },
        {
            "choices": {
                "0": "Not attempted<br>",
                "1": "Attempted but failed<br>",
                "2": "Parked<br>",
                "3": "Onstage<br>",
                "4": "Onstage (Spotlit)<br>",
                "5": "Harmony<br>",
                "6": "Harmony (Spotlit)"
            },
            "code": "fs",
            "defaultValue": "x",
            "name": "Final Status",
            "type": "radio"
        },
        {
            "code": "nit",
            "name": "Note in Trap",
            "type": "bool"
        }
    ],
    "page_title": "Crescendo",
    "postmatch": [
        {
            "choices": {
                "0": "Did not play defense<br>",
                "1": "Below Average<br>",
                "2": "Average<br>",
                "3": "Good<br>",
                "4": "Excellent<br>"
            },
            "code": "dr",
            "defaultValue": "x",
            "name": "Defense Rating",
            "type": "radio"
        },
        {
            "code": "die",
            "name": "Died/Immobilized",
            "type": "bool"
        },
        {
            "code": "tip",
            "name": "Tippy<br>(almost tipped over)",
            "type": "bool"
        },
        {
            "code": "ts",
            "defaultValue": "0",
            "name": "Total Score",
            "type": "counter"
        },
        {
            "code": "co",
            "maxSize": 55,
            "name": "Comments",
            "size": 15,
            "type": "text"
        }
    ],
    "prematch": [
        {
            "code": "s",
            "maxSize": 5,
            "name": "Scouter Initials",
            "required": "true",
            "size": 5,
            "type": "scouter"
        },
        {
            "code": "e",
            "defaultValue": "2024cafr",
            "name": "Event",
            "required": "true",
            "type": "event"
        },
        {
            "choices": {
                "qm": "Quals<br>",
                "sf": "Semifinals<br>",
                "f": "Finals"
            },
            "code": "l",
            "defaultValue": "qm",
            "name": "Match Level",
            "required": "true",
            "type": "level"
        },
        {
            "code": "m",
            "max": 150,
            "min": 1,
            "name": "Match #",
            "required": "true",
            "type": "match"
        },
        {
            "choices": {
                "r1": "Red-1",
                "b1": "Blue-1<br>",
                "r2": "Red-2",
                "b2": "Blue-2<br>",
                "r3": "Red-3",
                "b3": "Blue-3"
            },
            "code": "r",
            "name": "Robot",
            "required": "true",
            "type": "robot"
        },
        {
            "code": "t",
            "max": 99999,
            "min": 1,
            "name": "Team #",
            "type": "team"
        }
    ],
    "teleop": [
        {
            "code": "tas",
            "name": "Amp Scores",
            "type": "counter"
        },
        {
            "code": "tss",
            "name": "Speaker Scores",
            "type": "counter"
        },
        {
            "code": "tta",
            "name": "Times Amplified",
            "type": "counter"
        },
        {
            "code": "coOp",
            "name": "Coopertition Attempts",
            "type": "counter"
        },
        {
            "code": "coOpA",
            "name": "Coopertition Achieved?",
            "type": "bool"
        }
    ],
    "title": "Scouting PASS 2024"
}`