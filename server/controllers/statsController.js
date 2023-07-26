const StatsGame = require('../db/models/statsModel');


exports.getStats = async (req, res) => {
    try {
        const stats = await StatsGame.find();
        res.json(stats);
    } catch (error) {
        console.error("Error fetching stats:", error.message, "\nStack Trace:", error.stack);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

