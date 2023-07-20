const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const connection = new Sequelize(process.env.DATABASE_URL);
const db = {
  connection,
};

fs.readdirSync(path.join(__dirname, "models")).forEach((file) => {
  try {
    const model = require(path.join(__dirname, "models", file))(connection);
    db[model.name] = model;
  } catch (error) {
    console.log(error);
  }
});

async function loadFixtures() {
  const fixtures = {};

  fs.readdirSync(__dirname).forEach((file) => {
    const filePath = path.join(__dirname, file);
    const isDirectory = fs.statSync(filePath).isDirectory();

    if (!isDirectory && path.extname(file) === ".json") {
      const fixtureName = path.basename(file, ".json");
      const fixtureData = fs.readFileSync(filePath, "utf-8");
      fixtures[fixtureName] = JSON.parse(fixtureData);
    }
  });

  return fixtures;
}


async function syncDatabaseAndLoadFixtures() {
  try {
    const fixtures = await loadFixtures();

    await db.connection.sync({ force: true });
    console.log("Database synchronized");

    for (const [modelName, fixtureData] of Object.entries(fixtures)) {
      const model = db[modelName];
      if (model) {
        await model.bulkCreate(fixtureData);
        console.log(`Data for "${modelName}" loaded and inserted successfully!`);
      } else {
        console.error(`Model "${modelName}" not found. Skipping fixture data insertion.`);
      }
    }

    db.connection.close();
  } catch (error) {
    console.error("Error during database synchronization:", error);
    db.connection.close();
  }
}

module.exports = {
  ...db,
  syncDatabaseAndLoadFixtures,
};
