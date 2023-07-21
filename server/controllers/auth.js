require('dotenv').config()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const {User, Token} = require('../db');
const { validationResult } = require('express-validator');
const SendinBlueTransport = require('nodemailer-sendinblue-transport');
const exp = require('constants');


// Fonction de connexion
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérification des erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Extraction des messages d'erreur
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    // Recherche de l'utilisateur dans la base de données
    const user = await User.findOne({where : {'email' : email}});

    // Vérification du mot de passe
    if ( user && await bcrypt.compare(password, user.password) && user.isVerified){
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

      return res.status(200).json({ 
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
    }   
    return res.status(401).json({ error: 'Identifiants invalides' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// Fonction d'inscription
const register = async (req, res) => {

  try {
    console.log(req.body);
    const { username, firstname, lastname, email, password } = req.body;

    // Vérification si le nom d'utilisateur est déjà pris
    const existingUser = await User.findOne({where: {'username' : username} });

    if (existingUser) {
      return res.status(400).json({ error: 'Ce nom d\'utilisateur est déjà pris' });
    }

    // Hashage du mot de passe
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Création d'un token de vérification
    const verificationToken = crypto.randomBytes(20).toString('hex');

    await User.create({
      firstname : firstname,
      lastname : lastname,
      username : username,
      email : email,
      password : password,
      roles : ["user"],
      status : 0,
      friends : [],
      verificationToken : verificationToken,
      isVerified : false
    });
    
    // Configuration de Nodemailer
    let transporter = nodemailer.createTransport(
        new SendinBlueTransport({
          apiKey: process.env.SENDINBLUE_API_KEY,
        })
    );

    // Configuration du message
    let mailOptions = {
      from: 'semainechallenge@gmail.com',
      to: email,
      subject: 'Vérification de l\'email',
      text: `Merci de vous être inscrit. Veuillez cliquer sur le lien suivant pour vérifier votre email: http://127.0.0.1:5173/verify-email?token=${verificationToken}`
    };

    // Envoi de l'email
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info);
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
    const { token } = req.params;


    // Vérifier le token et mettre à jour le statut de l'utilisateur, supprimer le token si l'utilisateur est trouvé
    // const user = await db.user.findOneAndUpdate(
    //     { verificationToken: token },
    //     { $set: { isVerified: true, verificationToken: null } },
    //     { new: true }
    // );

    const user = await User.findOne({where: {'verificationToken' : token} });

    if (!user) {
      return res.status(404).json({ error: 'Token invalide ou utilisateur non trouvé' });
    }

    console.log("User found: ", user);
    try{
      await User.update({isVerified : true, verificationToken : null}, {where: {'id' : user.id} });
      res.status(200).json({ message: 'L\'e-mail a été vérifié avec succès' });
    }
    catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({where: {'email' : email} });
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    // Configuration de Nodemailer

    let transporter = nodemailer.createTransport(
      new SendinBlueTransport({
        apiKey: process.env.SENDINBLUE_API_KEY,
      })
    );
    const verificationToken = crypto.randomBytes(20).toString('hex');

    let today = new Date();
    let expiration = today.setDate(today.getDate() + 1);
    await Token.create({
      UserId : user.id,
      token : verificationToken,
      expiration : expiration
    });

    // Configuration du message
    let mailOptions = {
      from: 'semainechallenge@gmail.com',
      to: user.email,
      subject: 'Changement de mot de passe',
      text: `Vous souhaitez changer votre mot de passe ? Allez sur  http://127.0.0.1:5173/forgetPassword?token=${verificationToken}`
    };

    // Envoi de l'email
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info+ ' ' + verificationToken);
      }
    });
    return res.status(200).json({ message: 'Un email vous a été envoyé' });

    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const resetPassword = async (req, res) => {
  try {

    let { token, password } = req.body;

    const tokenFound = await Token.findOne({where: {'token' : token} });
    if (!tokenFound) {
      return res.status(404).json({ error: 'Token invalide' });
    }
    try{
      password = await bcrypt.hash(password, 10);
      await User.update({password : password}, {where: {'id' : tokenFound.UserId} });
      return res.status(200).json({ message: 'Mot de passe changé avec succès' });
    }
    catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
 
}
module.exports = {
  login,
  register,
  verifyEmail,
  forgotPassword,
  resetPassword
};
