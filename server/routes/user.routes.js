const express = require('express');
const router = express.Router();
const userControler = require('../controllers/user.controller');
const authenticateToken = require('../middlewares/auth.middleware');

// FRIENDS CRUD
// Route pour la création d'un ami
router.post('/friends', authenticateToken, userControler.createFriend);

// // Route pour la récupération de tous les amis
// router.get('/friends', authenticateToken, authController.getAllFriends);

// // Route pour la récupération d'un ami
// router.get('/friends/:id', authenticateToken, authController.getOneFriend);

// Route pour la SUPPRESSION d'un ami
router.delete('/friends', authenticateToken, userControler.deleteFriend);

// // Route pour la MISE A JOUR d'un ami
// router.put('/friends/:id', authenticateToken, authController.updateFriend);

// Route pour la récupération de tous les amis d'un utilisateur
router.get('/friends/:id', authenticateToken, userControler.getAllFriendsByUser);

// Route pour la récupération de toutes les demandes d'amis en attente d'un utilisateur
router.get('/friends/pending/:id', authenticateToken, userControler.getReceivedFriendRequests);

// Route pour l'acceptation d'une demande d'ami
router.patch('/friends/accept', authenticateToken, userControler.acceptFriendRequest);

// Route pour le refus d'une demande d'ami
router.patch('/friends/reject', authenticateToken, userControler.declineFriendRequest);

// Route pour l'annulation d'une demande d'ami
router.patch('/friends/cancel', authenticateToken, userControler.cancelFriendRequest);



//Route pour la modification du profil
router.patch('/:id', userControler.updateProfile);

// Route pour la récupération de tout les utilisateurs
router.get('/', userControler.getAllUsers);

// Route pour la récupération d'un utilisateur
router.get('/:id', authenticateToken, userControler.getOneUser);

// Route pour la suppression d'un utilisateur
router.delete('/:id', userControler.deleteUser);

module.exports = router;
