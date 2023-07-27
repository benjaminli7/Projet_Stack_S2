const { Model, DataTypes } = require("sequelize");
const fs = require("fs");
const path = require("path");

module.exports = function (connection) {
  class Achievement extends Model {}

  Achievement.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["elo", "gamesPlayed","gamesWon","gamesLose", "connections", "special"]],
        },
      },
      targetValue: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image: { 
        type: DataTypes.STRING, 
        allowNull: true,
      },
    },
    {
      sequelize: connection,
      tableName: "achievements",
    }
  );

  return Achievement;
};

// Exportez la fonction de migration directement
module.exports.up = async (queryInterface, Sequelize) => {
  // Chargez les données de la fixture depuis le fichier JSON
  const fixtureData = fs.readFileSync(
    path.join(__dirname, "../fixtures/achievements.json"),
    "utf-8"
  );
  const achievements = JSON.parse(fixtureData);

  // Insérez les données des achievements dans la base de données
  await queryInterface.bulkInsert("achievements", achievements, {});
};

module.exports.down = async (queryInterface, Sequelize) => {
  // Supprimez les données des achievements lors d'un rollback (annulation de la migration)
  await queryInterface.bulkDelete("achievements", null, {});
};
