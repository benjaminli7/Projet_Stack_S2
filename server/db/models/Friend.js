const { Model, DataTypes } = require("sequelize");

module.exports = function (connection) {
  class Friend extends Model {
    // Add any methods specific to the Friend model if needed
  }

  Friend.init(
    {
      status: {
        type: DataTypes.ENUM("pending", "accepted", "canceled"),
        allowNull: false,
        defaultValue: "pending",
      },
      actionUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize: connection,
      tableName: "friends",
    }
  );

  Friend.associate = function (models) {
    Friend.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Friend.belongsTo(models.User, {
      foreignKey: 'friendId',
      as: 'friend',
    });
    
  };
  

  return Friend;
};
