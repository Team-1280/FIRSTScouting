var config_data = `{
    "auton": [],
    "dataFormat": "tsv",
    "endgame": [],
    "page_title": "Crescendo",
    "pitConfig": "true",
    "postmatch": [],
    "prematch": [
        {
            "code": "t",
            "name": "Team Number",
            "type": "number"
        },
        {
            "code": "wid",
            "defaultValue": "0",
            "name": "Width",
            "type": "number"
        },
        {
            "code": "wei",
            "defaultValue": "0",
            "name": "Weight",
            "type": "number"
        },
        {
            "choices": {
                "b": "Butterfly/Grashopper<br>",
                "m": "Mechanum<br>",
                "o": "Other",
                "s": "Swerve<br>",
                "w": "West Coast/Tank<br>"
            },
            "code": "drv",
            "defaultValue": "o",
            "name": "Drivetrain",
            "type": "radio"
        },
        {
            "code": "odt",
            "maxSize": 50,
            "name": "Other Drivetrain",
            "size": 20,
            "type": "text"
        },
        {
            "choices": {
                "1": "L1 (8.14:1)<br>",
                "2": "L2 (6.75:1)<br>",
                "3": "L3 (6.12:1)<br>",
                "4": "L4 (5.14:1)<br>",
                "o": "Other ratio (put in comments)<br>",
                "x": "Not Swerve"
            },
            "code": "sr",
            "defaultValue": "x",
            "name": "Swerve Ratio",
            "type": "radio"
        },
        {
            "choices": {
                "c": "CIM<br>",
                "f": "Falcon<br>",
                "n": "Neo<br>",
                "x": "Other<br>"
            },
            "code": "mot",
            "defaultValue": "x",
            "name": "Drivetrain Motor",
            "type": "radio"
        },
        {
            "code": "nob",
            "name": "# of Batteries",
            "type": "number"
        },
        {
            "code": "fpu",
            "name": "Floor pickup Notes",
            "type": "bool"
        },
        {
            "code": "co",
            "maxSize": 250,
            "name": "Comments",
            "size": 20,
            "type": "text"
        }
    ],
    "teleop": [],
    "title": "Scouting PASS 2024"
}`