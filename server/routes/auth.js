const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const authenticateToken = require('../middlewares/auth.middleware');


router.get('/google/url', authController.googleAuth);

router.get('/google/callback', authController.googleAuthCallback);
// Route pour la connexion
router.post('/setGooglepwd', authenticateToken, authController.setGooglePassword);

router.post('/login', authController.login);


// // Route pour l'inscription
router.post('/register', authController.register);

// // Route pour la vérification de l'e-mail
router.get('/verify-email/:token', authController.verifyEmail);

// // Route pour la réinitialisation du mot de passe
router.post('/forgot-password', authController.forgotPassword);

// // Route pour la réinitialisation du mot de passe
router.post('/reset-password', authController.resetPassword);
//Route pour update le password à partir de l'ancien
router.patch('/password',authenticateToken, authController.changePassword);


module.exports = router;



