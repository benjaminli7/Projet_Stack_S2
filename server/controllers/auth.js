require('dotenv').config()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const {User, Token} = require('../db');
const { validationResult } = require('express-validator');
const SendinBlueTransport = require('nodemailer-sendinblue-transport');
const exp = require('constants');
const { oauth2Client, url } = require('../services/Google/google-auth');
const { google } = require('googleapis');



// Fonction de connexion
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Veuillez saisir tous les champs' });
    }

    // Vérification des erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Extraction des messages d'erreur
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    // Recherche de l'utilisateur dans la base de données
    const user = await User.findOne({ where: { email: email } });


    // Vérification du mot de passe
    if ( user && await bcrypt.compare(password, user.password) && user.isVerified){
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

      console.log("User found: ", user.id);

      return res.status(200).json({ 
        token: token,
        user: {
          id: user.id,
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
    const { username, firstname, lastname, email, password } = req.body;

    // Vérification si le nom d'utilisateur est déjà pris
    const existingUser = await User.findOne({where: {'username' : username} });

    if (existingUser) {
      return res.status(400).json({ error: 'Ce nom d\'utilisateur est déjà pris' });
    }

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
}

const googleAuth = async (req, res) => {
  try {
    const authUrl = url;
    res.status(200).json({ authUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const googleAuthCallback = async (req, res) => {
  try {
    const { code } = req.query;

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2',
    });
    const { data } = await oauth2.userinfo.get();

    const { email, given_name, family_name } = data;
    // console.log(data);
    // Vérifier si l'utilisateur existe déjà dans la base de données
    const existingUser = await User.findOne({where : {'email' : email}});

    if (existingUser === null) {
      // Créer un nouvel utilisateur
      const newUser = new User({
        firstname: given_name,
        lastname: family_name,
        username: given_name +" "+ family_name,
        email: email,
        password: null,
        roles: ["user"],
        status: 0,
        friends: [],
        isVerified: true,
        isGoogle: true,
      });
      // create a random password 10 characters minimum
      const randomPassword = crypto.randomBytes(10).toString('hex');
      newUser.password = randomPassword;
      await newUser.save();

      
      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET);

      return res.status(201).json({
        token: token,
        user: {
          id: newUser.id,
          firstname: newUser.firstname,
          username: newUser.username,
          lastname: newUser.lastname,
          email: newUser.email,
          roles: newUser.roles,
          status: newUser.status,
          friends: newUser.friends
        }
      });
    } 

    const token = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET);

    return res.status(200).json({
      token: token,
      user: {
        id: existingUser.id,
        username: existingUser.username,
        firstname: existingUser.firstname,
        lastname: existingUser.lastname,
        email: existingUser.email,
        roles: existingUser.roles,
        status: existingUser.status,
        friends: existingUser.friends,
      }
    });
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

const setGooglePassword = async (req, res) => {
  try {
      const { user , password } = req.body;

      const existingUser = await User.findOne({where : {'email' : user.email}});
      if (existingUser === null) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      existingUser.password = password;
      await existingUser.save();

      res.status(200).json({ message: 'Mot de passe enregistré avec succès' });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
  verifyEmail,
  googleAuth,
  googleAuthCallback,
  setGooglePassword
}
