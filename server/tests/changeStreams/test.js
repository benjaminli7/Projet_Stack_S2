const mongoose = require('mongoose');
require('dotenv').config();
const { Achievement, User } = require('../../db');
const { Sequelize } = require('sequelize');
const {io, socketUserMap} = require('../../index');
console.log("io", io);



const dbUri = process.env.DB_URL;
const dbName = process.env.DB_NAME;

// Se connecter à MongoDB avec Mongoose
mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'statsTest',
});

const statsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    totalGamesPlayed: {
        type: Number,
        required: true,
        default: 0,
    },
    totalWins: {
        type: Number,
        required: true,
        default: 0,
    },
    totalLosses: {
        type: Number,
        required: true,
        default: 0,
    },
    totalDraws: {
        type: Number,
        required: true,
        default: 0,
    },
    totalPoints: {
        type: Number,
        required: true,
        default: 0,
    },
    totalElo: {
        type: Number,
        required: true,
        default: 500,
    },

});

const Stats = mongoose.model('Stats', statsSchema);

// Créer le change stream
const statsChangeStream = Stats.watch([], { fullDocument: 'updateLookup' });
console.log('waiting for changes...');


statsChangeStream.on('change', (change) => {

  if(change.operationType === 'update') {
    checkAchievements(change.fullDocument);
  }
});



async function checkAchievements(stats) {
    try {
      // Retrieve the relevant achievements from the database
      const achievements = await Achievement.findAll({
        where: {
          type: {
            [Sequelize.Op.in]: ["elo", "gamesPlayed", "connections", "special"],
          },
        },
      });
  
      // Perform checks for each achievement
      achievements.forEach(async (achievement) => {
        if (achievement.type === "elo") {
          if (stats.totalElo >= achievement.targetValue ) {
            newAchievement(achievement, stats.userId);
          }
        } else if (achievement.type === "gamesPlayed") {
          if (stats.totalGamesPlayed >= achievement.targetValue) {
            newAchievement(achievement, stats.userId);
        }
        } else if (achievement.type === "connections") {
          // Implement checks for 'connections' type achievements
          // ...
        } else if (achievement.type === "special") {
          // Implement checks for 'special' type achievements
          // ...
        }
      });
    } catch (error) {
      console.error("Error checking achievements:", error);
    }
}
async function newAchievement(achievement, userId) {
    const user = await User.findByPk(userId);
    const userAchievements = await user.getAchievements();

    const userAchievementsIds = userAchievements.map((achievement) => achievement.id);
    if (userAchievementsIds.includes(achievement.id)) {
        return;
    }

    await user.addAchievement(achievement);
    console.log(socketUserMap);
    //look into socketUserMap to find the socket of the user
    console.log("Key", socketUserMap.keys() , "Value", socketUserMap.values());
    const userSocket = socketUserMap.get(parseInt(userId));

    console.log("userSocket", userSocket);

    if (userSocket) {
        console.log('emitting achievement to user ' + userId + ' socket ' + userSocket )
        //emit to the user socket id
        io.to(userSocket).emit('achievement', { achievement: achievement });
    }    



    // console.log(`Achievement "${achievement.name}" achieved by user "${user.username}"`);
}

  