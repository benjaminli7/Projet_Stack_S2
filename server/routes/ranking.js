const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware');
const rankingController = require('../controllers/rankingController');

router.get('/', rankingController.getAllUsersWithELO);
router.post('/userElo', authenticateToken, rankingController.getUserEloByUsername);

module.exports = router;
