const { Model, DataTypes } = require("sequelize");

module.exports = function (connection) {
    class PurchasedItem extends Model {}

    PurchasedItem.init(
        {
            itemId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            itemName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            amount: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            purchaseDate: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize: connection,
            tableName: "purchased_items",
        }
    );

    PurchasedItem.associate = function (models) {
        PurchasedItem.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
        });
    };

    return PurchasedItem;
};
