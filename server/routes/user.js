


const express = require('express');
const router = express.Router();
const userController = require("../controllers/user");
const friendController = require("../controllers/friend");
const authenticateToken = require('../middlewares/auth.middleware');
const adminToken = require('../middlewares/admin.middleware');


// Route pour la récupération de tout les amis d'un utilisateur
router.get("/friends", authenticateToken , friendController.getAllFriendsByUser);

router.get("/friend-requests", authenticateToken , friendController.getReceivedFriendRequests);


//Route pour la modification du profil
router.patch("/", authenticateToken, userController.patch);

//Route pour la modification d'un role
router.patch("/role/:id", adminToken, userController.patchRole);

// Route pour la récupération de tout les utilisateurs
router.get('/', adminToken, userController.cget);

// Route pour la récupération d'un utilisateur
//router.get('/:id', authenticateToken, userControler.getOneUser);
// Route pour la suppression d'un utilisateur
router.delete('/:id', adminToken, userController.delete);

router.get('/:id/achievements', authenticateToken, userController.getUserAchievements);

router.post('/report', authenticateToken, userController.reportUser);

router.get('/report/list', adminToken, userController.reportList);
router.post('/ban', adminToken, userController.banUser);
router.post('/unban', adminToken, userController.unbanUser);
router.patch('/report/archiver', adminToken, userController.archiverReport);
router.get('/admin', authenticateToken, userController.isUserAdmin);

router.get('/:id', authenticateToken, userController.get);



module.exports = router;