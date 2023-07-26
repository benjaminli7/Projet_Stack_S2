const db = require("../db/mongoModels");
const GameStats = db.gameStats;

const create = async (data) => {
  try {
    const { player_1, player_2, date, positions } = data;
    const gameStats = new GameStats({
      player_1: player_1,
      player_2: player_2,
      date: date,
      positions: positions,
    });

    await gameStats.save();
  } catch (err) {
    console.log(err);
  }
};
const getByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const stats = await GameStats.find({
      $or: [
        { "player_1.username": username },
        { "player_2.username": username }
      ]
    });
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving game stats" });
  }
};
const getAll = async (req, res) => {
  try {
    const stats = await GameStats.find({});
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving all game stats" });
  }
};


module.exports = {
  create,
  getByUsername,
  getAll,
};
