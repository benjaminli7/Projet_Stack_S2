const User = require('../models').user;

const createFriend = async (req, res) => {
  const { userId, friendId } = req.body;

  try {
    // Find the user and friend by their IDs
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }

    // Check if the friend is already in the user's friends list
    const existingFriend = user.friends.find(f => f.friendId.toString() === friendId);
    if (existingFriend) {
      return res.status(400).json({ message: 'Friend already added' });
    }

    // Add the friend to the user's friends list with the provided status
    user.friends.push({ friendId, status: false });
    await user.save();

    return res.status(200).json({ message: 'Friend added successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getAllFriendsByUser = async (req, res) => { 
  try {
    const { id } = req.params;

    //console.log(id);

    const user = await User.findById(id).populate('friends.friendId', 'username firstname lastname email');
    
    // console.log(user);
    if(!user){
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    const friends = user.friends.map(friend => friend.friendId);

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
  updateProfile,
  getAllUsers,
  getOneUser,
  deleteUser
};
