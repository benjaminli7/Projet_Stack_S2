const mongoose = require("mongoose");

const gameStatsSchema = mongoose.Schema({
  player_1: {
    username: {
      type: String,
      required: true,
    },
    guesses: {
      type: Array,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    outcome: {
      type: String,
      required: true,
    },
  },
  player_2: {
    username: {
      type: String,
      required: true,
    },
    guesses: {
      type: Array,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    outcome: {
      type: String,
      required: true,
    },
  },
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  positions: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("gameStats", gameStatsSchema);
