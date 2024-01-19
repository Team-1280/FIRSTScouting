var config_data = `{
    "title": "Scouting PASS 2024",
    "page_title": "Crescendo",
    "checkboxAs": "10",
    "prematch": [
        {
            "name": "Scouter Initials",
            "code": "s",
            "type": "scouter",
            "size": 5,
            "maxSize": 5,
            "required": "true"
        },
        {
            "name": "Event",
            "code": "e",
            "type": "event",
            "defaultValue": "2024camb",
            "required": "true"
        },
        {
            "name": "Match Level",
            "code": "l",
            "type": "level",
            "choices": {
                "qm": "Quals<br>",
                "sf": "Semifinals<br>",
                "f": "Finals"
            },
            "defaultValue": "qm",
            "required": "true"
        },
        {
            "name": "Match #",
            "code": "m",
            "type": "match",
            "min": 1,
            "max": 150,
            "required": "true"
        },
        {
            "name": "Robot",
            "code": "r",
            "type": "robot",
            "choices": {
                "r1": "Red-1",
                "b1": "Blue-1<br>",
                "r2": "Red-2",
                "b2": "Blue-2<br>",
                "r3": "Red-3",
                "b3": "Blue-3"
            },
            "required": "true"
        },
        {
            "name": "Team #",
            "code": "t",
            "type": "team",
            "min": 1,
            "max": 99999
        }
    ],
    "auton": [
        {
            "name": "Leave Starting Zone",
            "code": "al",
            "type": "bool"
        },
        {
            "name": "Amp Scores",
            "code": "aas",
            "type": "counter"
        },
        {
            "name": "Speaker Scores",
            "code": "ass",
            "type": "counter"
        }
    ],
    "teleop": [
        {
            "name": "Amp Scores",
            "code": "tas",
            "type": "counter"
        },
        {
            "name": "Speaker Scores",
            "code": "tss",
            "type": "counter"
        },
        {
            "name": "Times Amplified",
            "code": "tta",
            "type": "counter"
        }
    ],
    "endgame": [
        {
            "name": "Stage Timer",
            "code": "dt",
            "type": "timer"
        },
        {
            "name": "Final Status",
            "code": "fs",
            "type": "radio",
            "choices": {
                "0": "Not attempted",
                "1": "Attempted but failed<br>",
                "2": "Parked<br>",
                "3": "Onstage<br>",
                "4": "Onstage (Spotlit)<br>",
                "5": "Harmony<br>",
                "6": "Harmony (Spotlit)<br>"
            },
            "defaultValue": "x"
        },
        {
            "name": "Note in Trap",
            "code": "nit",
            "type": "bool"
        }
    ],
    "postmatch": [
        {
            "name": "Driver Skill",
            "code": "ds",
            "type": "radio",
            "choices": {
                "0": "Not Effective<br>",
                "1": "Average<br>",
                "2": "Very Effective<br>"
            },
            "defaultValue": "1"
        },
        {
            "name": "Defense Rating",
            "code": "dr",
            "type": "radio",
            "choices": {
                "0": "Did not play defense",
                "1": "Below Average<br>",
                "2": "Average<br>",
                "3": "Good<br>",
                "4": "Excellent<br>"
            },
            "defaultValue": "x"
        },
        {
            "name": "Speed Rating",
            "code": "sr",
            "type": "radio",
            "choices": {
                "1": "1 (slow)<br>",
                "2": "2<br>",
                "3": "3<br>",
                "4": "4<br>",
                "5": "5 (fast)"
            },
            "defaultValue": "3"
        },
        {
            "name": "Died/Immobilized",
            "code": "die",
            "type": "bool"
        },
        {
            "name": "Tippy<br>(almost tipped over)",
            "code": "tip",
            "type": "bool"
        },
        {
            "name": "Dropped Notes (>2)",
            "code": "dn",
            "type": "bool"
        },
        {
            "name": "Make good<br>alliance partner?",
            "tooltip": "Would you want this robot on your alliance in eliminations?",
            "code": "all",
            "type": "bool"
        },
        {
            "name": "Total Score",
            "type": "counter",
            "defaultValue": "0",
            "code": "ts"
        },
        {
            "name": "Comments",
            "code": "co",
            "type": "text",
            "size": 15,
            "maxSize": 55
        }
    ]
}`