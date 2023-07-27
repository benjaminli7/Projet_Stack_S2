const { Model, DataTypes } = require("sequelize");

module.exports = function (connection) {
  class Moderation extends Model {
    // Add any methods specific to the Friend model if needed
  }

    Moderation.init(
        {
            reporterId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            reportedPlayerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            reason: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM("pending", "treated"),
                allowNull: false,
                defaultValue: "pending",
            },
        },
        {
            sequelize: connection,
            tableName: "moderations",
        }
    )
    Moderation.associate = function (models) {
        Moderation.belongsTo(models.User, {
            foreignKey: 'reporterId',
            as: 'reporter',
        });
        
        Moderation.belongsTo(models.User, {
            foreignKey: 'reportedPlayerId',
            as: 'reportedPlayer',
        });
    };
    return Moderation;
};




        


