const express = require("express");
const app = express();
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
var users = require("./routes/user");
var friends = require("./routes/friend");
var auth = require("./routes/auth");
const { getRandomPositions, calculateScore } = require("./utils");

app.use(cors());
app.use(express.json());

app.use("/users", users);
app.use("/friends", friends);
app.use("/auth", auth);

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

      if (player1Score > player2Score) {
        io.to(room.player1.id).emit("gameFinished", {
          score: player1Score,
          opponentScore: player2Score,
          outcome: RESULTS.WIN,
          data: room,
          currentPlayer: room.player1.username,
          winner: room.player1.username,
          loser: room.player2.username,
        });
        io.to(room.player2.id).emit("gameFinished", {
          score: player2Score,
          opponentScore: player1Score,
          outcome: RESULTS.LOSE,
          data: room,
          currentPlayer: room.player2.username,
          winner: room.player1.username,
          loser: room.player2.username,
        });
      } else if (player1Score < player2Score) {
        io.to(room.player1.id).emit("gameFinished", {
          score: player1Score,
          opponentScore: player2Score,
          outcome: RESULTS.LOSE,
          data: room,
          currentPlayer: room.player1.username,
          winner: room.player2.username,
          loser: room.player1.username,
        });
        io.to(room.player2).emit("gameFinished", {
          score: player2Score,
          opponentScore: player1Score,
          outcome: RESULTS.WIN,
          data: room,
          currentPlayer: room.player2.username,
          winner: room.player2.username,
          loser: room.player1.username,
        });
      } else {
        io.to(room.player1).emit("gameFinished", {
          score: player1Score,
          opponentScore: player2Score,
          outcome: RESULTS.DRAW,
          data: room,
          currentPlayer: room.player1.username,
          
        });
        io.to(room.player2).emit("gameFinished", {
          score: player2Score,
          opponentScore: player1Score,
          outcome: RESULTS.DRAW,
          data: room,
          currentPlayer: room.player2.username,
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
});
