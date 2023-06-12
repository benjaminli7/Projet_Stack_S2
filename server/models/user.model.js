const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema({
  friendId: String,
  status: Boolean,
});

const userSchema = new mongoose.Schema({
  username: String,
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  status: Boolean,
  roles: Array,
  friends: [friendSchema], // Array of friend objects
});

const User = mongoose.model("User", userSchema);

module.exports = User;
