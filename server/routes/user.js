// var express = require('express');
// var router = express.Router();
const userController = require("../controllers/user");

// const use = fn => (req,res,next)=>
//   Promise.resolve(fn(req, res, next)).catch(next)


// router.post('/', use(userController.post));
// router.get('/', use(userController.cget));

// module.exports = router;
const express = require('express');
const router = express.Router();
//const userControler = require('../controllers/user.controller');
const authenticateToken = require('../middlewares/auth.middleware');

// FRIENDS CRUD
// Route pour la création d'un ami
// router.post('/friends', authenticateToken, userControler.createFriend);

// // Route pour la récupération de tous les amis
// router.get('/friends', authenticateToken, authController.getAllFriends);

// // Route pour la récupération d'un ami
// router.get('/friends/:id', authenticateToken, authController.getOneFriend);

// Route pour la SUPPRESSION d'un ami
// router.delete('/friends', authenticateToken, userControler.deleteFriend);

// // Route pour la MISE A JOUR d'un ami
// router.put('/friends/:id', authenticateToken, authController.updateFriend);

// Route pour la récupération de tous les amis d'un utilisateur
// router.get('/friends/:id', authenticateToken, userControler.getAllFriendsByUser);

//Route pour la modification du profil
router.patch('/:id', userController.patch);

// Route pour la récupération de tout les utilisateurs
router.get('/', userController.cget);

// Route pour la récupération d'un utilisateur
//router.get('/:id', authenticateToken, userControler.getOneUser);
router.get('/:id', userController.get);
// Route pour la suppression d'un utilisateur
router.delete('/:id', userController.delete);

module.exports = router;