const express = require("express");
const app = express();
//const GenericRouter = require("./routes/genericCRUD");
//const GenericController = require("./controllers/genericCRUD");
// const userService = require("./services/user");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
var users = require("./routes/user");
var friends = require("./routes/friend");
var auth = require("./routes/auth");
const { getRandomPositions } = require("./utils");

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

      // Create a game room
      const roomName = `${Date.now()}`;

      // Notify the players to join the room
      io.to(player1.id).emit("joinRoom", roomName);
      io.to(player2.id).emit("joinRoom", roomName);

      const socketIds = availablePlayers.filter((player) => {
        return (
          player.username === player1.username ||
          player.username === player2.username
        );
      });

      const positions = getRandomPositions(5);

      io.to(socketIds).emit("gameStarting", positions);

      // Remove the players from the available players list
      availablePlayers = availablePlayers.filter(
        (player) => player !== player1 && player !== player2
      );
    }
  });

  socket.on("joinRoom", (roomName) => {

    socket.join(roomName);
    if (!rooms.has(roomName)) {
      rooms.set(roomName, {
        player1: socket.id,
        player2: null,
        player1_guesses: [],
        player2_guesses: [],
      });
    } else {
      rooms.get(roomName).player2 = socket.id;
    }
  });

  // Remove the disconnected player from the players array
  socket.on("disconnect", () => {
    players = availablePlayers.filter((player) => player.id !== socket.id);
  });

  socket.on("playerGuess", (roomName, guess, round) => {

    const room = rooms.get(roomName);
    const currentPlayer = room.player1 === socket.id ? "player1" : "player2";
    if (currentPlayer === "player1") {
      room.player1_guesses.push(guess);
    } else {
      room.player2_guesses.push(guess);
    }

    if (
      room.player1_guesses.length === 2 &&
      room.player2_guesses.length === 2
    ) {
      io.to(room.player1).emit("gameFinished");
      io.to(room.player2).emit("gameFinished");
    }

    if (
      room.player1_guesses.length !== room.player2_guesses.length
    ) {
      socket.emit("waitingGuess");
    } else {
      io.to(room.player1).emit("nextRound");
      io.to(room.player2).emit("nextRound");
    }

  });
});
