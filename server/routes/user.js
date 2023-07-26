


const express = require('express');
const router = express.Router();
const userController = require("../controllers/user");
const friendController = require("../controllers/friend");
const authenticateToken = require('../middlewares/auth.middleware');


// Route pour la récupération de tout les amis d'un utilisateur
router.get("/friends", authenticateToken , friendController.getAllFriendsByUser);

router.get("/friend-requests", authenticateToken , friendController.getReceivedFriendRequests);


//Route pour la modification du profil
router.patch("/", authenticateToken, userController.patch);

//Route pour la modification d'un role
router.patch("/role/:id", authenticateToken, userController.patchRole);

// Route pour la récupération de tout les utilisateurs
router.get('/', authenticateToken, userController.cget);

// Route pour la récupération d'un utilisateur
//router.get('/:id', authenticateToken, userControler.getOneUser);
router.get('/:id', userController.get);
// Route pour la suppression d'un utilisateur
router.delete('/:id', userController.delete);

router.get('/:id/achievements', authenticateToken, userController.getUserAchievements);


module.exports = router;