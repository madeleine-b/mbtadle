# MBTAdle

A Boston version of the Wordle-inspired NYC Subway daily puzzle game. Contains some source code lifted from the [open-source clone](https://github.com/cwackerfuss/word-guessing-game) by Hannah Park. MBTAdle is a static JavaScript app, written using Create React App with React, Sass, and Semantic UI React. A few Python scripts were written to generate JSON data files used by the app.

See it live at TBD

Inspirations:
* [Subwaydle](https://www.subwaydle.com/)
* [Wordle](https://www.powerlanguage.co.uk/wordle/)
* [Chengyu Wordle](https://cheeaun.github.io/chengyu-wordle/)
* [Nerdle](https://nerdlegame.com/)

## Running locally

`````
brew install yarn
yarn install
yarn start
`````

* *Warning:* viewing the `src/data` can reveal spoilers to the puzzle! All guesses are checked against the keys in the respective `solutions.json` file to be a valid trip, and the `answers.json` contains an array for the answer of each day. The values of the `solutions.json` object contain an example trip of stations that are traveled through for the trip.

## Future Improvements

* Map visualization of the route after the puzzle is revealed
* Silver Line...maybe 
* Key bus routes
* Green line branch transfers  
* Park St / Downtown Crossing concourse...maybe