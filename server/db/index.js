// const mongoose = require('mongoose');
// const mongooseDb = {};

// mongooseDb.mongoose = mongoose;
// mongooseDb.user = require("./user.model");

// module.exports = db;

// const fs = require("fs");
// const path = require("path");
// const Sequelize = require("sequelize");
// const connection = new Sequelize(process.env.DATABASE_URL);
// const db = {
//   connection,
// };

// fs.readdirSync(path.join(__dirname,"models")).forEach((file) => {
//   const model = require(path.join(__dirname,"models", file))(connection);
//   db[model.name] = model;
// });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// console.log(db);
// module.exports = db;

// 'use strict';

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const basename = path.basename(__filename);
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const connection = new Sequelize(process.env.DATABASE_URL);
const db = {
  connection,
};

fs.readdirSync(path.join(__dirname, "models")).forEach((file) => {
  try {
    const model = require(path.join(__dirname, "models", file))(connection);
    console.log(model.name, model.prototype.constructor.name);
    db[model.name] = model;
  } catch (error) {
    console.log(error);
  }

});

module.exports = db;