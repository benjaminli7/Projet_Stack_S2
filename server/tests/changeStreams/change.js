
const mongoose = require('mongoose');
require('dotenv').config();

const dbUri = process.env.DB_URL;
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
        default: 0,
        min: 0,
    },

});
const Stats = mongoose.model('Stats', statsSchema);

async function addGamePlayed() {
    try{
        // Se connecter à MongoDB avec Mongoose

        // Remplacez les valeurs ci-dessous par les informations appropriées pour votre utilisateur
        const userId = '1';
        const username = 'SebYlc';

        // créer un random pour une victoire, une défaite ou un match nul et ajouter aussi incrémenter de 1 totalgamesplayed et ajouter des points entre 10000 et 25000
        const random = Math.floor(Math.random() * 3);
        const randomPoints = Math.floor(Math.random() * (25000 - 10000 + 1) + 10000);


        // Mettre à jour les statistiques de l'utilisateur
        
        const stats = await Stats.findOneAndUpdate(
            { userId: userId },
            {
                $inc: {
                    totalGamesPlayed: 1,
                    totalPoints: randomPoints,
                    totalWins: random === 0 ? 1 : 0,
                    totalLosses: random === 1 ? 1 : 0,
                    totalDraws: random === 2 ? 1 : 0,
                    totalElo: random === 0 ? 15 : random === 1 ? 0 : -15,
                },
            },
            { upsert: true, new: true }

        );

        
    } catch(err) {
        console.error(err);
    }
   
}

// execute the async function every 1 second
setInterval(addGamePlayed, 1000);

  