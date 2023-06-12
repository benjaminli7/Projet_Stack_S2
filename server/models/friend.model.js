const mongoose = require("mongoose");
const Friend = mongoose.model(
    "Friend",
    new mongoose.Schema({
        userId: String,
        friendId: String,
        status: Boolean,
    })
);
module.exports = Friend;