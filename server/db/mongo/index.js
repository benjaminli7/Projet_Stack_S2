const mongoose = require('mongoose');
require('dotenv').config();


const dbUri = process.env.DB_URL;
mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Stats',
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});

const statsSchema = new mongoose.Schema({
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
    totalPoints: {
        type: Number,
        required: true,
        default: 0,
    },
    elo: {
        type: Number,
        required: true,
        default: 500,
        min: 0,
    },
});
const Stats = mongoose.model('UserStats', statsSchema);

module.exports = {
    Stats,
}


