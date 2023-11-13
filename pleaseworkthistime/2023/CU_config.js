var config_data = `
{
  "title": "Scouting PASS 2023",
  "page_title": "Charged Up",
  "checkboxAs": "YN",
  "enable_google_sheets": "true",
  "prematch": [
    { "name": "Scouter Initials",
      "code": "s",
      "type": "scouter",
      "gsCol": "scouter",
      "size": 5,
      "maxSize": 5,
      "required": "true"
    },
    { "name": "Event",
      "code": "e",
      "type": "event",
      "gsCol": "event",
      "defaultValue": "2023camb",
      "required": "true",
      "disabled": "true"
    },
    { "name": "Match Level",
      "code": "l",
      "type": "level",
      "gsCol": "level",
      "choices": {
        "qm": "Quals<br>",
        "de": "Double Elimination<br>",
        "f": "Finals"
      },
      "defaultValue": "quals",
      "required": "true"
    },
    { "name": "Match #",
      "code": "m",
      "type": "match",
      "gsCol": "match",
      "min": 1,
      "max": 100,
      "required": "true"
    },
    { "name": "Robot",
      "code": "r",
      "type": "robot",
      "gsCol": "robot",
      "choices": {
        "r1": "Red-1",
        "b1": "Blue-1<br>",
        "r2": "Red-2",
        "b2": "Blue-2<br>",
        "r3": "Red-3",
        "b3": "Blue-3"
      },
      "required":"true"
    },
    { "name": "Team #",
      "code": "t",
      "type": "team",
      "gsCol": "team",
      "min": 1,
      "max": 99999
    },
    { "name": "Auto Start Position",
      "code": "as",
      "type": "clickable_image",
      "gsCol": "autoStart",
      "filename": "2023/field_image.png",
      "clickRestriction": "one",
      "shape": "circle 5 black red true"
    }
  ],
  "auton": [
    { "name": "Auto Scoring",
      "code": "auto-scoring",
      "type": "clickable_image",
      "gsCol": "autoScore",
      "filename": "2023/grid_image.png",
      "dimensions": "9 4",
      "clickRestriction": "onePerBox",
      "toggleClick": "true",
      "showFlip": "false",
      "showUndo": "false",
      "shape": "circle 12 black red true"
    },
    { "name": "Mobility?",
      "code": "mobility",
      "type": "bool",
      "gsCol": "mobility"
    },
    { "name": "Docked",
      "code": "docked",
      "type":"radio",
      "gsCol": "docked",
      "choices": {
        "docked": "Docked (not Engaged)<br>",
        "engaged": "Engaged<br>",
        "attempted-failed": "Attempted but failed<br>",
        "x": "Not attempted"
      },
      "defaultValue": "x"
    }
  ],
  "teleop": [
    { "name": "No cycle timer",
      "code": "cycle-timer",
      "type": "cycle",
      "gsCol": "cycle"
    },
    { "name": "Cones scored",
      "code": "cone-count",
      "type": "counter",
      "gsCol": "cones",
      "cycleTimer": "tct"
    },
    { "name": "Cubes scored",
      "code": "cube-count",
      "type": "counter",
      "gsCol": "cubes",
      "cycleTimer": "tct"
    },
    { "name": "Smart Placement<br>(creates Links)",
      "code": "smart-placement",
      "type": "bool",
      "gsCol": "smartPlacement"
    },
    { "name": "Floor Pickup",
      "code": "floor-pickup",
      "type": "radio",
      "gsCol": "floor",
      "choices": {
        "cone": "Cones<br>",
        "cube": "Cubes<br>",
        "both": "Both<br>",
        "x": "Not Attempted"
      },
      "defaultValue": "x"
    }
  ],
  "endgame": [
    { "name": "Docking Timer",
      "code": "docking-timer",
      "type": "timer",
      "gsCol": "dockingTime"
    },
    { "name": "Final Status",
      "code": "final-status",
      "type":"radio",
      "gsCol": "finalStatus",
      "choices": {
        "park": "Parked<br>",
        "dock": "Docked (Not Engaged)<br>",
        "engage": "Engaged<br>",
        "failed": "Attempted but failed<br>",
        "x": "Not attempted"
      },
      "defaultValue": "x"
    },
    { "name": "Total # of alliance<br>robots docked/engaged",
      "code": "total-alliance-docked-or-engaged",
      "type": "counter",
      "gsCol": "totalDocked"
    }
  ],
  "postmatch": [
    { "name": "Driver Skill",
      "code": "driver-skill",
      "type": "radio",
      "gsCol": "skill",
      "choices": {
        "not-eff": "Not Effective<br>",
        "avg": "Average<br>",
        "very-eff": "Very Effective<br>",
        "x": "Not Observed"
      },
      "defaultValue": "x"
    },
    { "name": "Links Scored",
      "code": "links-scored",
      "type": "counter",
      "gsCol": "links"
    },
    { "name": "Defense Rating",
      "code": "defense",
      "type": "radio",
      "gsCol": "defenseRating",
      "choices": {
        "below-avg": "Below Average<br>",
        "avg": "Average<br>",
        "good": "Good<br>",
        "excellent": "Excellent<br>",
        "x": "Did not play defense"
      },
      "defaultValue": "x"
    },
    { "name": "Swerve drive?",
      "code": "swerve",
      "type": "bool",
      "gsCol": "swerve"
    },
    { "name": "Speed Rating",
      "code": "speed",
      "type": "radio",
      "gsCol": "speed",
      "choices": {
        "1": "1 (slow)<br>",
        "2": "2<br>",
        "3": "3<br>",
        "4": "4<br>",
        "5": "5 (fast)"
      },
      "defaultValue":"3"
    },
    { "name": "Died/Immobilized",
      "code": "died",
      "type": "bool",
      "gsCol": "died"
    },
    { "name": "Tippy<br>(almost tipped over)",
      "code": "tipped",
      "type": "bool",
      "gsCol": "tipping"
    },
    { "name": "Dropped Cones (>2)",
      "code": "dropped-cones",
      "type": "bool",
      "gsCol": "droppedCones"
    },
    { "name": "Make good<br>alliance partner?",
      "tooltip": "Would you want this robot on your alliance in eliminations?",
      "code": "alliance",
      "type": "bool",
      "gsCol": "alliance"
    },
    { "name": "Comments",
      "code": "comments",
      "type": "text",
      "gsCol": "comments",
      "size": 15,
      "maxSize": 50
    }
  ]
}`;
