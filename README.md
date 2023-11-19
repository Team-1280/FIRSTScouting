# ![Logo](./images/C-Biscuit.png) Scouting

A(n unofficial) scouting application for Team 1280.

## Setup

After cloning, run:

```
yarn
yarn build
node .
```

`yarn build` creates `data/data.json` and `data/key.json` (and a gitignore file). `data.json` stores the data, and `key.json` converts the data keys into a readable key. For example:

```
{
    "s": "Scouter",
    "e": "Event",
    "l": "Level",
    "m": "Match #",
    "r": "Robot",
    "t": "Team"
}
```

## Screenshots/Videos

![Screenshot of the data viewing page](./images/dataPage.png)
![Screenshot of ScoutingPASS integration](./images/generatePage.png)
![Demo GIF of the application](./images/demo.gif)
