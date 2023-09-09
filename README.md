# Scouting Application

An (unofficial) scouting application for team 1280.

## Usage

Make sure you have nodejs installed, and run:

```sh
node .
```

Go to http://localhost:3000/ and upload an image of a qr code or scan one with your camera generated from https://github.com/PWNAGERobotics/ScoutingPASS and you'll be redirected to the data table. All data is logged in `data/data.json`. `data/key.json` contains a key of values for the qr code. For example the "s" value is the "scouter", or the "e" value is the "event", etc. The entire program works offline (as does ScoutingPASS). Because the data is stored in the JSON file, multiple scouters can scout at once, and the data can be combined at the end by just combining the JSON files, assuming they uset eh same key. If not, the keys can be combined easily.

## TODO

-   [ ] Code alternative to ScoutingPASS, for faster data collection (or integrate ScoutingPASS)
-   [ ] Better website UI
-   [ ] Documentation?
-   [ ] Upload JSON from different Scouter to add to the database, or to replace existing data.
