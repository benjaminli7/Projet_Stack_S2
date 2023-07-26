const mongoose = require('mongoose');

const stats = new mongoose.Schema({
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

const StatsGames = mongoose.model('StatsGames', stats, 'stats');

module.exports = StatsGames;
