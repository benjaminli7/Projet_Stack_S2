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

const getByAuthenticatedUser = async (req, res) => {
  try {
    const user = req.user.infos;
    const username = user.username;

    const rawStats = await GameStats.aggregate([
      {
        $match: {
          $or: [
            { "player_1.username": username },
            { "player_2.username": username }
          ]
        }
      },
      {
        $addFields: {
          currentPlayer: {
            $cond: [
              { $eq: ["$player_1.username", username] },
              "$player_1",
              "$player_2"
            ]
          }
        }
      },
      {
        $project: {
          player_1: 0,
          player_2: 0
        }
      },
      {
        $sort: { date: -1 }
      }
    ]);

    const totalGames = rawStats.length;
    const victories = rawStats.filter(stat => stat.currentPlayer.outcome.toLowerCase() === 'win').length;
    const defeats = rawStats.filter(stat => stat.currentPlayer.outcome.toLowerCase() === 'lose').length;
    const winRate = totalGames ? (victories / totalGames * 100).toFixed(2) : 0;
    const lastGame = rawStats[0];

    let closestGuessDistance = Infinity;
    let closestGuess = null;
    let closestGuessPosition = null;
    let highestScore = -Infinity;

    rawStats.forEach(stat => {
      stat.currentPlayer.guesses.forEach((guess, index) => {
        const position = stat.positions[index];
        const distance = Math.sqrt(Math.pow(position.lat - guess.lat, 2) + Math.pow(position.lng - guess.lng, 2));
        if(distance < closestGuessDistance) {
          closestGuessDistance = distance;
          closestGuess = guess;
          closestGuessPosition = position;
        }
      });

      if(stat.currentPlayer.score > highestScore) {
        highestScore = stat.currentPlayer.score;
      }
    });

    const aggregatedStats = {
      totalGames,
      victories,
      defeats,
      winRate,
      lastGame,
      closestGuess,
      closestGuessPosition,
      highestScore,
      gameHistory: rawStats
    };

    res.status(200).json(aggregatedStats);

  } catch (err) {
    res.status(500).json({ message: "Error retrieving game stats" });
  }
};

const countGame = async (req, res) =>{
  try {
    const count = await GameStats.countDocuments();
    return  res.status(200).json(count);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error" });
  } 
}
module.exports = {
  create,
  getByUsername,
  getAll,
  getByAuthenticatedUser,
  countGame
};
