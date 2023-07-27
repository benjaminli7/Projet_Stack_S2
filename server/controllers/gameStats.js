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

module.exports = {
  create,
};
