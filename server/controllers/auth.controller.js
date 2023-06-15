const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const db = require('../models');
const { validationResult } = require('express-validator');
const SendinBlueTransport = require('nodemailer-sendinblue-transport');


// Fonction de connexion
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // console.log(req.body);

    // Vérification des erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Extraction des messages d'erreur
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    // Recherche de l'utilisateur dans la base de données
    const user = await db.user.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    // Vérification du mot de passe
    const isPasswordValid = bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.status(200).json({ 
      token: token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        roles: user.roles,
        status: user.status,
        friends: user.friends
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// Fonction d'inscription
const register = async (req, res) => {
  try {
    console.log(req.body);
    const { username, firstname, lastname, email, password } = req.body;

    // Vérification si le nom d'utilisateur est déjà pris
    const existingUser = await db.user.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: 'Ce nom d\'utilisateur est déjà pris' });
    }

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création d'un token de vérification
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Création d'un nouvel utilisateur
    const newUser = new db.user({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      roles: ["user"],
      status: 0,
      friends: [],
      verificationToken: verificationToken,
      isVerified: false
    });

    await newUser.save();

    // Configuration de Nodemailer
    let transporter = nodemailer.createTransport(
        new SendinBlueTransport({
          apiKey: process.env.SENDINBLUE_API_KEY,
        })
    );

    // Configuration du message
    let mailOptions = {
      from: 'semainechallenge@gmail.com',
      to: newUser.email,
      subject: 'Vérification de l\'email',
      text: `Merci de vous être inscrit. Veuillez cliquer sur le lien suivant pour vérifier votre email: http://127.0.0.1:5173/verify-email?token=${verificationToken}`
    };

    // Envoi de l'email
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    console.log("Token from request: ", token);

    // Vérifier le token et mettre à jour le statut de l'utilisateur
    const user = await db.user.findOneAndUpdate(
        { verificationToken: token },
        { $set: { isVerified: true } },
        { new: true }
    );

    console.log("User found: ", user);

    if (!user) {
      return res.status(404).json({ error: 'Token invalide ou utilisateur non trouvé' });
    }

    res.status(200).json({ message: 'L\'e-mail a été vérifié avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// Fonction de déconnexion
const logout = (req, res) => {
  // A FAIRE
  res.status(200).json({ message: 'Déconnexion réussie' });
};

module.exports = {
  login,
  register,
  logout,
  verifyEmail
};
