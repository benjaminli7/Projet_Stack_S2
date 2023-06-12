const User = require('../models').user;

const createFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    const friend = {
      friendId,
      status: false,
    };



    const user = await User.findById(userId);
    const friendExists = user.friends.find((friend) => friend.friendId === friendId);
    if (friendExists) {
      return res.status(409).json({ error: 'Demande d\'ami déjà envoyée' });
    }

    user.friends.push(friend);
    await user.save();

    res.status(201).json(friend);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const getAllFriendsByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const friends = user.friends;
    res.status(200).json(friends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const deleteFriend = async (req, res) => {
    try {
      const { friendId, userId } = req.body;
  
      const user = await User.findById(userId);
      user.friends = user.friends.filter((friend) => friend.friendId !== friendId);
      await user.save();
  
      res.status(200).json({ message: 'Ami supprimé avec succès' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  };
  

module.exports = {
  createFriend,
  getAllFriendsByUser,
  deleteFriend,
};
