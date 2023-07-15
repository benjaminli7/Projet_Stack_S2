// // var express = require('express');
// // var router = express.Router();
// const friendController = require("../controllers/friend");

// // const use = fn => (req,res,next)=>
// //   Promise.resolve(fn(req, res, next)).catch(next)


// // router.post('/', use(userController.post));
// // router.get('/', use(userController.cget));

// // module.exports = router;
// const express = require('express');
// const router = express.Router();

// const authenticateToken = require('../middlewares/auth.middleware');

// // FRIENDS CRUD
// // Route pour la création d'un ami
// router.post('/', authenticateToken, friendController.createFriend);

// // // Route pour la récupération de tous les amis
// router.get('/', authenticateToken, friendController.getAllFriends);

// // // Route pour la récupération d'un ami
// router.get('/:id', authenticateToken, friendController.getOneFriend);

// // Route pour la SUPPRESSION d'un ami
// router.delete('/', authenticateToken, friendController.deleteFriend);

// // // Route pour la MISE A JOUR d'un ami
// router.put('/:id', authenticateToken, friendController.updateFriend);

// // Route pour la récupération de tous les amis d'un utilisateur
// router.get('/:id', friendController.getAllFriendsByUser);

// module.exports = router;