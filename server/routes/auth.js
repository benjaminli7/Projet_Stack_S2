const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const authenticateToken = require('../middlewares/auth.middleware');


// Route pour la connexion
router.post('/login', authController.login);

// // Route pour l'inscription
router.post('/register', authController.register);

// // Route pour la vérification de l'e-mail
router.get('/verify-email/:token', authController.verifyEmail);

// // Route pour la réinitialisation du mot de passe
router.post('/forgot-password', authController.forgotPassword);

// // Route pour la réinitialisation du mot de passe
router.post('/reset-password', authController.resetPassword);


module.exports = router;



