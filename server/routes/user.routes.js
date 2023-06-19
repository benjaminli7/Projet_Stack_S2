const express = require('express');
const router = express.Router();
const userControleler = require('../controllers/user.controller');
const authenticateToken = require('../middlewares/auth.middleware');

// FRIENDS CRUD
// Route pour la création d'un ami
router.post('/friends', authenticateToken, userControleler.createFriend);

// // Route pour la récupération de tous les amis
// router.get('/friends', authenticateToken, authController.getAllFriends);

// // Route pour la récupération d'un ami
// router.get('/friends/:id', authenticateToken, authController.getOneFriend);

// Route pour la SUPPRESSION d'un ami
router.delete('/friends', authenticateToken, userControleler.deleteFriend);

// // Route pour la MISE A JOUR d'un ami
// router.put('/friends/:id', authenticateToken, authController.updateFriend);

// Route pour la récupération de tous les amis d'un utilisateur
router.get('/friends/:id', authenticateToken, userControleler.getAllFriendsByUser);

module.exports = router;