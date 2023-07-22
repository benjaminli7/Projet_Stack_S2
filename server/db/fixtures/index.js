const fs = require("fs");
const path = require("path");

// Create an object to store all fixtures
const fixtures = {};

// Load all fixture files and store them in the object
fs.readdirSync(__dirname).forEach((file) => {
  if (file !== "index.js") {
    const fixtureName = path.basename(file, path.extname(file));
    const fixtureData = fs.readFileSync(path.join(__dirname, file), "utf-8");
    fixtures[fixtureName] = JSON.parse(fixtureData);
  }
});

// Export all fixtures
module.exports = fixtures;
