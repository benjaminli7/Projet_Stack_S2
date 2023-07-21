const { User, Friend } = require("../db");
const { Op } = require("sequelize");

const createFriend = async (req, res) => {
  try {
    const { username, friendUsername } = req.body;


    if (username === friendUsername) {
      console.log("You can't add yourself as a friend");
      return res.status(400).json({ message: "You can't add yourself as a friend" });
    }
    const user = await User.findOne({ where:{ username: username } })
    const friend = await User.findOne({ where: { username: friendUsername } })

    if (!user || !friend) {
      console.log("User or friend not found");
      return res.status(404).json({ message: "User or friend not found" });
    }

    const existingFriend = await Friend.findOne({
      where: {
        [Op.or]: [
          {
            userId: friend.id,
            friendId: user.id,
            status: { [Op.in]: ["pending", "accepted"] },
          },
          {
            userId: user.id,
            friendId: friend.id,
            status: { [Op.in]: ["pending", "accepted"] },
          },
        ],
      },
    });

    if (existingFriend) {
      console.log("There is already a pending or accepted friend request between the users");
      return res.status(400).json({ message: "There is already a pending or accepted friend request between the users" });
    }

    await Friend.create({ userId: user.id, friendId: friend.id, status: "pending", actionUserId: user.id });

    return res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
  
const getAllFriendsByUser = async (req, res) => {
  try {
    const { username } = req.query;
    console.log("Username:", username);

    const user = await User.findOne({ where: { username: username } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const friends = await Friend.findAll({
      where: {
        [Op.or]: [
          { userId: user.id, status: "accepted" },
          { actionUserId: user.id },
        ],
      },
      include: [
        { model: User, as: 'user' },
        { model: User, as: 'friend' },
      ],
    });

    //if friends.user included user infos return friends.friend else return friends.user but keep request params
    const friendsList = friends.map((friend) => {
      if (friend.user.id === user.id) {
        return {
          status: friend.status,
          actionUserId: friend.actionUserId,
          user: {
            id: friend.friend.id,
            username: friend.friend.username,
            email: friend.friend.email,
          },
        };
      } else {
        return {
          status: friend.status,
          actionUserId: friend.actionUserId,
          user: {
            id: friend.user.id,
            username: friend.user.username,
            email: friend.user.email,
          },
        };
      }
    });
    


    res.status(200).json(friendsList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getReceivedFriendRequests = async (req, res) => {
  try {
    const { username } = req.query;
    console.log("Username:", username);

    const test = await User.findOne({ where: { username: username } });

    if (!test) {
      return res.status(404).json({ error: "User not found" });
    }
    const pendingRequests = await Friend.findAll({
      where: {
        friendId: test.id,
        status: "pending",
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
        },
      ],
    });
    res.status(200) .json(pendingRequests);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};


const acceptFriendRequest = async (req, res) => {
try {
    const { username, friendUsername } = req.body;

    const user = await User.findOne({ where: { username: username } });
    const friend = await User.findOne({ where: { username: friendUsername } });

    // check if the friend request exists
    const existingFriendRequest = await Friend.findOne({
      where: { userId: friend.id, friendId: user.id, status: "pending" }
    });

    if (!existingFriendRequest) {
      return res.status(404).json({ error: "Demande d'ami introuvable" });
    }


    const updatedRows = await Friend.update(
      { status: "accepted", actionUserId: user.id },
      { where: { userId: friend.id, friendId: user.id, status: "pending" } }
    );


    res.status(200).json({ message: "Demande d'ami acceptée avec succès" });
} catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur interne du serveur" });
}
};

const declineFriendRequest = async (req, res) => {
try {
    const { username, friendUsername } = req.body;

    const user = await User.findOne({ where: { username: username  } });
    const friend = await User.findOne({ where: { username: friendUsername  } });
    
    const existingFriendRequest = await Friend.findOne({
      where: { userId: friend.id, friendId: user.id, status: "pending" }
    });

    if (!existingFriendRequest) {
      return res.status(404).json({ error: "Demande d'ami introuvable" });
    }

    const deletedRows = await Friend.destroy({
    where: { userId: friend.id, friendId: user.id, status: "pending" }
    });

    if (deletedRows === 0) {
    return res.status(404).json({ error: "Demande d'ami introuvable" });
    }

    res.status(200).json({ message: "Demande d'ami refusée avec succès" });
} catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur interne du serveur" });
}
};

const cancelFriendRequest = async (req, res) => {
try {
    const { username, friendUsername } = req.body;

    console.log("Username:", username);
    console.log("FriendUsername:", friendUsername);
    const user = await User.findOne({ where: { username: username  } });
    const friend = await User.findOne({ where: { username: friendUsername } });

    const deletedRows = await Friend.destroy({
      where: { userId: user.id, friendId: friend.id, status: "pending" }
    });

    if (deletedRows === 0) {
      return res.status(404).json({ error: "Demande d'ami introuvable" });
    }

    res.status(200).json({ message: "Demande d'ami annulée avec succès" });
} catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur interne du serveur" });
}
};

const deleteFriend = async (req, res) => {
try {
    const { username, friendUsername } = req.body;

    
    const user = await User.findOne({ where: { username: username  } });
    const friend = await User.findOne({ where: { username: friendUsername } });

    const deletedRows = await Friend.destroy({
      where: {
        [Op.or]: [
          {
            userId: user.id,
            friendId: friend.id,
            status: { [Op.in]: ["accepted"] },
          },
          {
            userId: friend.id,
            friendId: user.id,
            status: { [Op.in]: ["accepted"] },
          },
        ],
      },
    });

    if (deletedRows === 0) {
    return res.status(404).json({ error: "Ami introuvable ou déjà supprimé" });
    }

    res.status(200).json({ message: "Ami supprimé avec succès" });
} catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
}
};
module.exports = {
    createFriend,
    getAllFriendsByUser,
    getReceivedFriendRequests,
    acceptFriendRequest,
    declineFriendRequest,
    cancelFriendRequest,
    deleteFriend
};
