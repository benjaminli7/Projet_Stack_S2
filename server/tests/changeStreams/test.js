const mongoose = require('mongoose');
require('dotenv').config();

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
const statsChangeStream = Stats.watch();

// Écouter les changements sur le change stream
statsChangeStream.on('change', (change) => {
  // Processus de changement et vérification des achievements
  if(change.operationType === 'update') {
    const stats = change.updateDescription.updatedFields;
    checkAchievements(stats);
  }
});



function checkAchievements(stats) {
    // log stats
    console.log(stats);
}
