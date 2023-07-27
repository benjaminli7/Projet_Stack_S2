const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/auth.middleware");
const gameStatsController = require("../controllers/gameStats");

router.post("/", authenticateToken, gameStatsController.create);
router.get("/", authenticateToken, gameStatsController.getByAuthenticatedUser);
router.get("/count", authenticateToken, gameStatsController.countGame);
router.get("/last5", authenticateToken, gameStatsController.last5Games);

module.exports = router;
