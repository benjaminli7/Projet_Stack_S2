const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const authenticateToken = require('../middlewares/auth.middleware');


// Route pour la connexion
router.post('/login', authController.login);

// // Route pour l'inscription
router.post('/register', authController.register);

// // Route pour la vérification de l'e-mail
router.get('/verify-email', authController.verifyEmail);

// // Route pour la déconnexion
router.delete('/logout', authController.logout);

module.exports = router;



