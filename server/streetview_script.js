const fs = require("fs");
const axios = require("axios");

function getRandomCoordinate(min, max) {
  return Math.random() * (max - min) + min;
}

async function checkStreetViewAvailability(lat, lng) {
  const apiKey = "AIzaSyCbLt9n8uP7nYBvhEhLmdMCcX1h-oI9bnM"; // Replace with your actual API key
  const url = `https://maps.googleapis.com/maps/api/streetview/metadata?location=${lat},${lng}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data.status === "OK";
  } catch (error) {
    return false;
  }
}

async function generateStreetViewPositions() {
  const validPositions = [];

  // generate 1000 random positions
  while (validPositions.length < 1000) {
    const lat = getRandomCoordinate(-90, 90);
    const lng = getRandomCoordinate(-180, 180);

    const isAvailable = await checkStreetViewAvailability(lat, lng);
    if (isAvailable) {
      validPositions.push({ lat, lng });
    }
  }

  return validPositions;
}

(async () => {
  try {
    const positions = await generateStreetViewPositions();

    const jsonData = JSON.stringify(positions, null, 2);

    fs.writeFile("streetview_positions.json", jsonData, (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      } else {
        console.log(
          "Street View positions have been saved to streetview_positions.json"
        );
      }
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
})();
