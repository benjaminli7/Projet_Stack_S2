
const friendController = require("../controllers/friend");
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware');

// Later add the authentication middleware
router.post("/",authenticateToken, friendController.createFriend);
router.put("/friend-requests/accept",authenticateToken, friendController.acceptFriendRequest);
router.put("/friend-requests/decline",authenticateToken, friendController.declineFriendRequest);
router.put("/friend-requests/cancel",authenticateToken, friendController.cancelFriendRequest);
router.delete("/",authenticateToken, friendController.deleteFriend);

module.exports = router;
