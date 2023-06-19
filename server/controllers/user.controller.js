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
    const { id } = req.params;

    const user = await User.findById(id);

    res.status(200).json(user);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
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
