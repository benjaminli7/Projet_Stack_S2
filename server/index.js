const express = require("express");
const app = express();
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
app.use(cors({
  origin: "*",
}));
var users = require('./routes/user')
var friends = require('./routes/friend')
var auth = require('./routes/auth')
var stripeRoutes = require('./routes/stripe');
const { getRandomPositions, calculateScore } = require("./utils");

// view engine setup

app.set('view engine', 'ejs');

<<<<<<< HEAD

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
}));
app.use(function (req, res, next) {
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    if (!req.is("application/json")) {
      return res.sendStatus(400);
    }
  }
  next();
});

=======
>>>>>>> dev

app.use(express.json());

app.use('/users', users)
app.use('/friends', friends)
app.use('/auth', auth)
app.use('/stripe', stripeRoutes);

app.use(function (req, res, next) {
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    if (!req.is("application/json")) {
      return res.sendStatus(400);
    }
  }
  next();
});
app.get("/", (req, res) => {
  res.send("Hello world");
});


app.use(errorHandler);

// Démarrage du serveur
const server = app.listen(process.env.PORT, () => {
  console.log(
    `Le serveur écoute sur le port ${process.env.PORT}.`
  );
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

let availablePlayers = [];
const rooms = new Map();
const RESULTS = {
  WIN: "WIN",
  LOSE: "LOSE",
  DRAW: "DRAW",
}

io.on("connection", function (socket) {

  socket.on("playerJoined", (username) => {
    if (availablePlayers.some((player) => player.username === username)) {
      return;
    }
    availablePlayers.push({
      id: socket.id,
      username: username,
    });
  });

  socket.on("findOpponent", () => {
    const positions = getRandomPositions(5);
    if (availablePlayers.length >= 2) {
      const player1 = availablePlayers.shift();
      const player2 = availablePlayers.shift();

      // Create a game room
      const roomName = `${Date.now()}`;


      rooms.set(roomName, {
        player1: {
          id: player1.id,
          username: player1.username,
        },
        player2: {
          id: player2.id,
          username: player2.username,
        },
        player1_guesses: [],
        player2_guesses: [],
        player1_score: 0,
        player2_score: 0,
        positions: positions
      });

      socket.join(roomName);

      const socketIds = availablePlayers.filter((player) => {
        return (
          player.username === player1.username ||
          player.username === player2.username
        );
      });


      io.to(socketIds).emit("gameStarting", positions, roomName);

      // Remove the players from the available players list
      availablePlayers = availablePlayers.filter(
        (player) => player !== player1 && player !== player2
      );
    }
  });

  // Remove the disconnected player from the players array
  socket.on("disconnect", () => {
    players = availablePlayers.filter((player) => player.id !== socket.id);
  });

  socket.on("playerGuess", (roomName, guess, round) => {

    const room = rooms.get(roomName);
    const currentPlayer = room.player1.id === socket.id ? room.player1.username : room.player2.username;

    let score = calculateScore(room.positions[round].lat, room.positions[round].lng, guess.lat, guess.lng);

    if (currentPlayer === room.player1.username) {
      room.player1_guesses.push({
        lat: guess.lat,
        lng: guess.lng,
        score: score,
      });
    } else {
      room.player2_guesses.push({
        lat: guess.lat,
        lng: guess.lng,
        score: score,
      });
    }
    console.log(room);


    if (
      room.player1_guesses.length === 2 &&
      room.player2_guesses.length === 2
    ) {
      const player1Score = room.player1_guesses.reduce(
        (total, guess) => total + guess.score,
        0
      );
      const player2Score = room.player2_guesses.reduce(
        (total, guess) => total + guess.score,
        0
      );

      room.player1_score = player1Score;
      room.player2_score = player2Score;

      if (player1Score > player2Score) {
        io.to(room.player1.id).emit("gameFinished", {
          score: player1Score,
          opponentScore: player2Score,
          outcome: RESULTS.WIN,
          data: room,
          currentPlayer: "player1",
          winner: room.player1.username,
          loser: room.player2.username,
        });
        io.to(room.player2.id).emit("gameFinished", {
          score: player2Score,
          opponentScore: player1Score,
          outcome: RESULTS.LOSE,
          data: room,
          currentPlayer: "player2",
          winner: room.player1.username,
          loser: room.player2.username,
        });
      } else if (player1Score < player2Score) {
        io.to(room.player1.id).emit("gameFinished", {
          score: player1Score,
          opponentScore: player2Score,
          outcome: RESULTS.LOSE,
          data: room,
          currentPlayer: "player1",
          winner: room.player2.username,
          loser: room.player1.username,
        });
        io.to(room.player2.id).emit("gameFinished", {
          score: player2Score,
          opponentScore: player1Score,
          outcome: RESULTS.WIN,
          data: room,
          currentPlayer: "player2",
          winner: room.player2.username,
          loser: room.player1.username,
        });
      } else {
        io.to(room.player1.id).emit("gameFinished", {
          score: player1Score,
          opponentScore: player2Score,
          outcome: RESULTS.DRAW,
          data: room,
          currentPlayer: "player1",
        });
        io.to(room.player2.id).emit("gameFinished", {
          score: player2Score,
          opponentScore: player1Score,
          outcome: RESULTS.DRAW,
          data: room,
          currentPlayer: "player2",
        });
      }
    }

    if (
      room.player1_guesses.length !== room.player2_guesses.length
    ) {
      socket.emit("waitingGuess");
    } else {
      io.to(room.player1.id).emit("nextRound");
      io.to(room.player2.id).emit("nextRound");
    }

  });

  socket.on('authenticate', (userId) => {
    console.log(`User ${userId} authenticated.`);
    socket.join(userId);
    socketUserMap.set( userId, socket.id);
    console.log(socketUserMap);
  });

  socket.on('disconnect', () => {
    const userId = socketUserMap.get(socket.id);
    if (userId) {
      socketUserMap.delete(socket.id);
      console.log(`User ${userId} disconnected.`);
    }
  });

  socket.on('sendMessage', (message) => {
    io.emit('message', message);
  });

  socket.on('sendFriendRequest', (message) => {
    io.emit('friendRequest', message);
  });

});


const socketUserMap = new Map();

io.on('connection', function (socket) {
  io.emit('connection', `${socket.id} is connected`);
});


module.exports = {
  io,
  socketUserMap
}
require('./tests/changeStreams/test')




