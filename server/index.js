const express = require("express");
const app = express();
require('dotenv').config();



const db = require("./models");

// Middleware pour parser les requêtes au format JSON
// allow all CORS requests
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à la base de données MongoDB
db.mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connexion réussie à MongoDB.");
  })
  .catch(err => {
    console.error("Erreur de connexion", err);
  });

// Routeur pour les routes d'authentification
app.use('/auth', require('./routes/auth.routes'));

// Routeur pour les routes d'utilisateur
app.use('/user', require('./routes/user.routes'));

// Routeur /me

// Démarrage du serveur
const server = app.listen(process.env.PORT, () => {
  console.log(`Le serveur écoute sur le port ${process.env.PORT}.`);
});

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
})

io.on("connection", function (socket) {
  io.emit("connection", "A NEW USER CONNECTED")

  // Handle disconnections
  socket.on("disconnect", () => {
    io.emit("disconnection", "A USER DISCONNECTED")
  });

  socket.on("sendMessage", (message) => {
    io.emit("message", message)
  })
});
