const { Model, DataTypes } = require("sequelize");

module.exports = function (connection) {
  class Token extends Model {
  }
  Token.init(
    {
        token : {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expiration : {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
      sequelize: connection,
      tableName: "tokens",
    }
  );
    
  Token.associate = function(models) {
    Token.belongsTo(models.User, { 
        foreignKey: {
            allowNull: false
        }
    })
  }
  return Token;
};

