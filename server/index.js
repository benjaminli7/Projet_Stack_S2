const express = require("express");
const app = express();
require("dotenv").config();

const db = require("./models");

// Middleware pour parser les requêtes au format JSON
// allow all CORS requests
app.use(function (req, res, next) {
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
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connexion réussie à MongoDB.");
  })
  .catch((err) => {
    console.error("Erreur de connexion", err);
  });

// Routeur pour les routes d'authentification
app.use("/auth", require("./routes/auth.routes"));

// Routeur pour les routes d'utilisateur
app.use("/user", require("./routes/user.routes"));

// Routeur /me

// Démarrage du serveur
const server = app.listen(process.env.PORT, () => {
  console.log(`Le serveur écoute sur le port ${process.env.PORT}.`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

let availablePlayers = [];

io.on("connection", function (socket) {
  socket.on("playerJoined", (username) => {
    availablePlayers.push({
      id: socket.id,
      username: username,
    });
  });

  socket.on("findOpponent", () => {
    if (availablePlayers.length >= 2) {
      const player1 = availablePlayers.shift();
      const player2 = availablePlayers.shift();

      console.log(player1);
      console.log(player2);

      // Create a game room
      const roomName = `${Date.now()}`;

      console.log(roomName);

      // Notify the players to join the room
      io.to(player1.id).emit("joinRoom", roomName);
      io.to(player2.id).emit("joinRoom", roomName);

      const socketIds = availablePlayers.filter(player => {
        return player.username === player1.username || player.username === player2.username
      })
      io.to(socketIds).emit("gameStarting");



      // Remove the players from the available players list
      availablePlayers = availablePlayers.filter(
        (player) => player !== player1 && player !== player2
      );
    }
  });

  socket.on("joinRoom", (roomName) => {
    socket.join(roomName);
    // You can perform additional actions here, such as starting the game

    // Notify the players that the game is starting
  });

  // Remove the disconnected player from the players array
  socket.on("disconnect", () => {
    players = availablePlayers.filter((player) => player.id !== socket.id);
  });

  socket.on("joinRoom", (roomName) => {
    socket.join(roomName);
  });
});
