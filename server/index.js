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
const GenericRouter = require("./routes/genericCRUD");
const GenericController = require("./controllers/genericCRUD");
const userService = require("./services/user");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
var users = require('./routes/user2')


app.use(cors());
app.use(function (req, res, next) {
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    if (!req.is("application/json")) {
      return res.sendStatus(400);
    }
  }
  next();
});

app.use(express.json());
app.use('/users', users)
// app.use(require("./routes/security")(userService));

// app.use("/users", require("./routes/user"));
// app.use("/users2", new GenericRouter(new GenericController(userService)));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/", (req, res) => {
  res.json(req.body);
});

app.use(errorHandler);

app.listen(3000, () => console.log("Server started on port 3000"));
