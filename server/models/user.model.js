const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  username: String,
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  status: Boolean,
  roles: Array,
  friends: [{
    friendId:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: Boolean,
  }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
