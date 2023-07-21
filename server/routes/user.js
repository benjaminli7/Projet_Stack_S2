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