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

    console.log(id);

    const user = await User.findById(id).populate('friends');


    if(!user){
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    const friends = user.friends;
    console.log(friends);

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
  
const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, username} = req.body;

  if(!firstname || !lastname || !email || !id || !username || typeof firstname !== 'string' || typeof lastname !== 'string' || typeof email !== 'string' || typeof id !== 'string' || typeof username !== 'string'){
    return res.status(422).json();
  }
  const findByIdUser = await User.findById(id);
  if(!findByIdUser){
    return res.status(404).json();
  }
  try {
    const user = await User.updateOne({ _id: id }, { $set: { firstname : firstname, lastname : lastname, email : email, username : username } });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json();
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

const getOneUser = async (req, res) => {
  try {
    console.log("AA")
console.log(req.params);

    const { id } = req.params;

    const user = await User.findById(id);

    res.status(200).json(user);
  }
  catch (err) {
    // console.error(err);
    res.status(500).json({ error: 'Erreur interne du seFFrveur' });
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.deleteOne({ _id: id })
    res.status(204).json();
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

module.exports = {
  createFriend,
  getAllFriendsByUser,
  deleteFriend,
  updateProfile,
  getAllUsers,
  getOneUser,
  deleteUser
};
