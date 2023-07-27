const dbMongo = require("../db/mongoModels");
const gameStats = dbMongo.gameStats;


const { Achievement, User } = require('../db');
const { Sequelize } = require('sequelize');
const {io, socketUserMap} = require('../index');


const statsChangeStream = gameStats.watch();



statsChangeStream.on('change', (change) => {

  if(change.operationType === 'insert') {
     changeStreams(change.fullDocument);
  }
});


const changeStreams = async (document) => {

    try {

    const players = await User.findAll({
        where: {
            username: {
                [Sequelize.Op.in]: [document.player_1.username, document.player_2.username],
            },
        },
    });
    // console.log(players);
    if(players.length !== 2) {
        throw new Error("Couldn't find both players");
        }
    // add the id of the players to the document document into the player_1 and player_2 properties

    document.player_1.userId = players[0].id;
    document.player_1.totalElo = players[0].elo;
    document.player_2.userId = players[1].id;
    document.player_2.totalElo = players[1].elo;

    const rawStats1 = await gameStats.aggregate([
        {
        $match: {
            $or: [
                { "player_1.username": document.player_1.username },
                { "player_2.username": document.player_1.username }
            ]
        }
        },
        {
        $addFields: {
            currentPlayer: {
            $cond: [
                { $eq: ["$player_1.username", document.player_1.username] },
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
        }
    ]);

    document.player_1.totalGames = rawStats1.length;
    document.player_1.victories = rawStats1.filter(stat => stat.currentPlayer.outcome.toLowerCase() === 'win').length;
    document.player_1.defeats = rawStats1.filter(stat => stat.currentPlayer.outcome.toLowerCase() === 'lose').length;
    document.player_1.lastGame = rawStats1[0];

    const rawStats2 = await gameStats.aggregate([
        {
        $match: {
            $or: [
            { "player_1.username": document.player_2.username },
            { "player_2.username": document.player_2.username }
            ]
        }
        },
        {
        $addFields: {
            currentPlayer: {
                $cond: [
                    { $eq: ["$player_1.username", document.player_2.username] },
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
        }
    ]);

    document.player_2.totalGames = rawStats2.length;
    document.player_2.victories = rawStats2.filter(stat => stat.currentPlayer.outcome.toLowerCase() === 'win').length;
    document.player_2.defeats = rawStats2.filter(stat => stat.currentPlayer.outcome.toLowerCase() === 'lose').length;
    document.player_2.lastGame = rawStats2[0];

    // console.log(document.player_1);
    await checkAchievements(document.player_1);
    await checkAchievements(document.player_2);

    return;
    } catch (error) {
        console.error("Error checking achievements:", error);
    }
}
// changeStreams();

const checkAchievements = async (document) => {
    try {

        const achievements = await Achievement.findAll({
            where: {
                type: {
                    [Sequelize.Op.in]: ["elo", "gamesPlayed","gamesWon","gamesLose", "connections", "special"],
                },
            },
        });

        // Perform checks for each achievement
        achievements.forEach(async (achievement) => {
            if (achievement.type === "elo") {
                if (document.totalElo >= achievement.targetValue) {
                    newAchievement(achievement, document.userId);
                }
            } else if (achievement.type === "gamesPlayed") {
                if (document.totalGames >= achievement.targetValue) {
                    newAchievement(achievement, document.userId);
                }
            } else if (achievement.type === "gamesWon") {
                if (document.victories >= achievement.targetValue) {
                    newAchievement(achievement, document.userId);
                }
            } else if (achievement.type === "gamesLose") {
                if (document.defeats >= achievement.targetValue) {
                    newAchievement(achievement, document.userId);
                }
            } else if (achievement.type === "elo") {
                if (document.totalElo >= achievement.targetValue) {
                    newAchievement(achievement, document.userId);
                }
            } else if (achievement.type === "special" && achievement.name === "Champion ultime") {
                if(document.score == 25000) {
                    newAchievement(achievement, document.userId);
                }
            }
        });

    } catch (error) {
        console.error("Error checking achievements:", error);
    }
}
async function newAchievement(achievement, userId) {

    try {
        console.log("L'utilisateur " + userId + " a obtenu le succès " + achievement.name + " !");

        const user = await User.findByPk(userId);

        const userAchievements = await user.getAchievements();
        const userAchievementsIds = userAchievements.map((achievement) => achievement.id);
        if (userAchievementsIds.includes(achievement.id)) {
            return;
        }

        await user.addAchievement(achievement);
        const userSocket = socketUserMap.get(parseInt(userId));

        if (userSocket) {
            io.to(userSocket).emit('achievement', { achievement: achievement, userId: userId });
        }
    } catch (error) {
        console.error("Error adding achievement:", error);
    }
}
module.exports = {
    changeStreams
}
