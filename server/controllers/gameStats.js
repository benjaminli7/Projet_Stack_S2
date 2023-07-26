const db = require("../db/mongoModels");
const GameStats = db.gameStats;

const create = async (req, res) => {
  try {
    const { player_1, player_2, date, positions } = req.body;
    const gameStats = new GameStats({
      player_1: player_1,
      player_2: player_2,
      date: date,
      positions: positions,
    });

    await gameStats.save();
    res.json({ message: "Game stats created" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

module.exports = {
  create,
};
