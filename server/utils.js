// retrieve 5 random positions from the streetview_positions.json file
function getRandomPositions(numberOfPositions) {
    const positions = require("./streetview_positions.json");

    const randomPositions = [];

    while (randomPositions.length < numberOfPositions) {
        const randomIndex = Math.floor(Math.random() * positions.length);
        const randomPosition = positions.splice(randomIndex, 1)[0];
        randomPositions.push(randomPosition);
    }

    return randomPositions;
}

module.exports = getRandomPositions;