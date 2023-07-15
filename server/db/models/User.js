const { Model, DataTypes } = require("sequelize");

module.exports = function (connection) {
  class User extends Model {
    async checkPassword(password) {
      const bcrypt = require("bcryptjs");
      return bcrypt.compare(password, this.password);
    }

    generateToken() {
      const jwt = require("jsonwebtoken");
      return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: "1y",
      });
    }
  }

  User.init(
    {
      username: DataTypes.STRING,
      lastname: DataTypes.STRING,
      firstname: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
          isNotNull: function (value) {
            if (value === null) {
              throw new Error("Email cannot be null");
            }
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          min: 8,
          //is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        },
      },
      roles: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: ["user"],
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      friends: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
        defaultValue: [],
      },
      verificationToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize: connection,
      tableName: "users",
    }
  );

  async function encryptPassword(user, options) {
    if (!options?.fields.includes("password")) {
      return;
    }
    const bcrypt = require("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
  }

  User.addHook("beforeCreate", encryptPassword);
  User.addHook("beforeUpdate", encryptPassword);

  return User;
};

