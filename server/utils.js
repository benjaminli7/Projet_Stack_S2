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

// calculate the score
function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadiusKm * c;

  return distance;
}

function toRad(degrees) {
  return (degrees * Math.PI) / 180;
}

function calculateScore(actualLat, actualLon, guessedLat, guessedLon) {
  const maxScore = 5000; // Maximum score for a perfect guess
  const maxDistance = 20000; // Maximum distance (in km) for the minimum score

  const distance = calculateDistance(
    actualLat,
    actualLon,
    guessedLat,
    guessedLon
  );

  // Calculate the score based on the distance and maximum distance
  let score = Math.max(0, maxScore * (1 - distance / maxDistance));

  return Math.round(score);
}

module.exports = {
  getRandomPositions,
  calculateScore,
};