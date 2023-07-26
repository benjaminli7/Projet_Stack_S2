const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/auth.middleware");
const gameStatsController = require("../controllers/gameStats");

router.post("/", authenticateToken, gameStatsController.create);
router.get("/", authenticateToken, gameStatsController.getAll);


module.exports = router;
