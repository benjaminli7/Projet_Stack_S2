const mongoose = require("mongoose");
require("dotenv").config();
const db = {};

const dbUri = process.env.DB_URL;
mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "challenge",
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to MongoDB", err);
})

db.mongoose = mongoose;
db.gameStats = require("./gameStats.model.js");

module.exports = db;
