# ![Logo](./images/C-Biscuit.png) Scouting

A(n unofficial) scouting application for Team 1280.

## Setup

After cloning, run:

```
yarn
yarn build
node . <ScoutPASS config file path> <host address>
# eg. node . ./pass/2023/CU_config.js 192.168.0.174
```

`yarn build` creates `data/data.json` and `data/key.json` (and a gitignore file). `data.json` stores the data, and `key.json` converts the data keys into a readable key. For example:

```json
{
    "s": "Scouter Initials",
    "e": "Event",
    "l": "Match Level",
    "m": "Match #",
    "r": "Robot",
    "t": "Team #",
    .
    .
    .
}
```

`key.json` is automatically generated when you run the program, and you never need to edit it.

## Screenshots/Videos

![Screenshot of the data viewing page](./images/dataPage.png)
![Screenshot of ScoutingPASS integration](./images/generatePage.png)
![Demo GIF of the application](./images/demo.gif)
