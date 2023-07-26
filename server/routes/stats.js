const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const StatsGame = require('../db/models/statsModel');
const statsController = require('../controllers/statsController');

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'statsTest'
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Failed to connect to MongoDB", err);
});

router.get('/stats', statsController.getStats);

module.exports = router;
