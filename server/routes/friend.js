
const friendController = require("../controllers/friend");
const express = require('express');
const router = express.Router();

// Later add the authentication middleware
router.post("/", friendController.createFriend);
router.put("/friend-requests/accept", friendController.acceptFriendRequest);
router.put("/friend-requests/decline", friendController.declineFriendRequest);
router.put("/friend-requests/cancel", friendController.cancelFriendRequest);
router.delete("/", friendController.deleteFriend);

module.exports = router;
