// const express = require("express");
// const app = express();
// require('dotenv').config();
// require('module-alias/register')

// const db = require("@models/");



// // const db = require("./models");

// // Middleware pour parser les requêtes au format JSON
// // allow all CORS requests
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "*"); 
//   res.header("Access-Control-Allow-Methods", "*");
//   next();
// });
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Connexion à la base de données MongoDB
// // db.mongoose
// //   .connect(process.env.DB_URL, {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true
// //   })
// //   .then(() => {
// //     console.log("Connexion réussie à MongoDB.");
// //   })
// //   .catch(err => {
// //     console.error("Erreur de connexion", err);
// //   });

// db.sequelize.sync({
//   alter: true
// })
// .then(() => {
//   console.log('finish alter tables')
// })
// .catch(e => {
//   console.log('dnjncjdkn',e)
// })


// // Routeur pour les routes d'authentification
// app.use('/auth', require('./routes/auth.routes'));

// // Routeur pour les routes d'utilisateur
// app.use('/user', require('./routes/user.routes'));


// // Routeur /me

// // Démarrage du serveur
// app.listen(process.env.PORT, () => {
//   console.log(`Le serveur écoute sur le port ${process.env.PORT}.`);
// });

const express = require("express");
const app = express();
//const GenericRouter = require("./routes/genericCRUD");
//const GenericController = require("./controllers/genericCRUD");
// const userService = require("./services/user");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
var users = require('./routes/user')
var friends = require('./routes/friend')
var auth = require('./routes/auth')

app.use(cors());
app.use(function (req, res, next) {
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    if (!req.is("application/json")) {
      return res.sendStatus(400);
    }
  }

// const db = require("./models");

// Middleware pour parser les requêtes au format JSON
// allow all CORS requests
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "*");
//   res.header("Access-Control-Allow-Methods", "*");
// >>>>>>> dev
//   next();
// });

app.use(express.json());

app.use('/users', users)
// app.use('/friends', friends)
app.use('/auth', auth)

app.get("/", (req, res) => {
  res.send("Hello world");
});


app.use(errorHandler);

app.listen(3000, () => console.log("Serverr started on port 3000")); 

// const express = require("express");

// app.use(express.urlencoded({ extended: true }));

// // Connexion à la base de données MongoDB
// db.mongoose
//   .connect(process.env.DB_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => {
//     console.log("Connexion réussie à MongoDB.");
//   })
//   .catch(err => {
//     console.error("Erreur de connexion", err);
//   });

// // Routeur pour les routes d'authentification
// app.use('/auth', require('./routes/auth.routes'));

// // Routeur pour les routes d'utilisateur
// app.use('/user', require('./routes/user.routes'));

// // Routeur /me

// // Démarrage du serveur
// const server = app.listen(process.env.PORT, () => {
//   console.log(`Le serveur écoute sur le port ${process.env.PORT}.`);
// });

// const io = require('socket.io')(server, {
//   cors: {
//     origin: '*',
//   }
// })

// io.on("connection", function (socket) {
//   io.emit("connection",  `${socket.id} is connected`)

//   // Handle disconnections
//   socket.on("disconnect", () => {
//     io.emit("disconnection", `${socket.id} disconnected `);
//   });

//   socket.on("sendMessage", (message) => {
//     io.emit("message", message)
//   })
// });