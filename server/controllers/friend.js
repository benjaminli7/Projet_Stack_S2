const { User, Friend } = require("../db");
const { Op } = require("sequelize");

const createFriend = async (req, res) => {
  const { userId, friendId } = req.body;

  try {
    const user = await User.findByPk(userId);
    const friend = await User.findByPk(friendId);

    if (!user || !friend) {
      console.log("User or friend not found");
      return res.status(404).json({ message: "User or friend not found" });
    }

    if (userId === friendId) {
      console.log("You can't add yourself as a friend");
      return res.status(400).json({ message: "You can't add yourself as a friend" });
    }

    const existingFriend = await Friend.findOne({
      where: {
        [Op.or]: [
          {
            userId: friendId,
            friendId: userId,
            status: { [Op.in]: ["pending", "accepted"] },
          },
          {
            userId: userId,
            friendId: friendId,
            status: { [Op.in]: ["pending", "accepted"] },
          },
        ],
      },
    });

    if (existingFriend) {
      console.log("There is already a pending or accepted friend request between the users");
      return res.status(400).json({ message: "There is already a pending or accepted friend request between the users" });
    }

    await Friend.create({ userId, friendId, status: "pending", actionUserId: userId });

    return res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
  
const getAllFriendsByUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        
        const friends = await Friend.findAll({
          where: { id: user.id },
          include: [{ model: User, as: "friend" }] // Include the associated friend's details
        });
        
        res.status(200).json(friends);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      }
};

const getReceivedFriendRequests = async (req, res) => {
  try {
      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: "Utilisateur introuvable" });
      }

      const pendingRequests = await Friend.findAll({
        where: { userId: user.id, status: "pending" },
        include: [{ model: User, as: "user" }] // Include the associated user's details
      });

      res.status(200).json(pendingRequests);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

const acceptFriendRequest = async (req, res) => {
try {
    const { userId, friendId } = req.body;

    // check if the friend request exists
    const existingFriendRequest = await Friend.findOne({
      where: { userId: friendId, friendId: userId, status: "pending" }
    });

    if (!existingFriendRequest) {
      return res.status(404).json({ error: "Demande d'ami introuvable" });
    }


    const updatedRows = await Friend.update(
      { status: "accepted", actionUserId: userId },
      { where: { userId: friendId, friendId: userId, status: "pending" } }
    );


    res.status(200).json({ message: "Demande d'ami acceptée avec succès" });
} catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur interne du serveur" });
}
};

const declineFriendRequest = async (req, res) => {
try {
    const { userId, friendId } = req.body;

    const existingFriendRequest = await Friend.findOne({
      where: { userId: friendId, friendId: userId, status: "pending" }
    });

    if (!existingFriendRequest) {
      return res.status(404).json({ error: "Demande d'ami introuvable" });
    }

    const deletedRows = await Friend.destroy({
    where: { userId: friendId, friendId: userId, status: "pending" }
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
    const { userId, friendId } = req.body;

    const deletedRows = await Friend.destroy({
      where: { userId: userId, friendId: friendId, status: "pending" }
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
    const { userId, friendId } = req.body;

    const deletedRows = await Friend.destroy({
      where: {
        [Op.or]: [
          {
            userId: friendId,
            friendId: userId,
            status: { [Op.in]: ["accepted"] },
          },
          {
            userId: userId,
            friendId: friendId,
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
