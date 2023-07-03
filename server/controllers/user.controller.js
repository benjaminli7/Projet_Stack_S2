const User = require('../models').user;

const createFriend = async (req, res) => {
  const { userId, friendId } = req.body;
  // console.log(req.body);
  try {
    // Find the user and friend by their IDs
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    //can't add yourself as a friend
    if (userId === friendId) {
      console.log('You can\'t add yourself as a friend');
      return res.status(400).json({ message: 'You can\'t add yourself as a friend' });
    }

    if (!user || !friend) {
      console.log('User or friend not found');
      return res.status(404).json({ message: 'User or friend not found' });
    }

    // Check if the friend is already in the user's friends list
    const existingFriend = user.friends.find(f => f.friendId.toString() === friendId);
    if (existingFriend) {
      console.log('Friend already added');
      return res.status(400).json({ message: 'Friend already added' });
    }

    // Add the friend to the user's friends list with the provided status
    user.friends.push({ friendId, status: false });
    await user.save();
    console.log('Friend added successfully');

    return res.status(200).json({ message: 'Friend added successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getAllFriendsByUser = async (req, res) => { 
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate('friends.friendId', 'username firstname lastname email');
    
    if(!user){
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    const friends = user.friends.map(friend => friend.friendId);
    // also get the status of the friend
    friends.forEach((friend, index) => {
      friend.status = user.friends[index].status;
    });    

    res.status(200).json(friends);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const getReceivedFriendRequests = async (req, res) => {
  try {
    const { id } = req.params;

    const usersWithPendingRequests = await User.find({
      'friends.friendId': id,
      'friends.status': 0
    });

    const pendingRequests = usersWithPendingRequests.map(user => {
      return {
        _id: user._id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      };
    });
    
    res.status(200).json(pendingRequests);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    //  console.log(userId, friendId);
    // find the friend request in the friend's friends list
    const friend = await User.findById(friendId);
    // console.log(friend);
    const friendRequest = friend.friends.find(friend => friend.friendId.toString() === userId);
    if(!friendRequest){
      return res.status(404).json({ error: 'Demande d\'ami introuvable' });
    }
    // update the status of the friend request
    friendRequest.status = true;
    
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }
    // check if the friend is already in the user's friends list
    const existingFriend = user.friends.find(friend => friend.friendId.toString() === friendId);
    if(existingFriend){
      return res.status(400).json({ error: 'Ami déjà ajouté' });
    }
    // add the friend to the user's friends list
    user.friends.push({ friendId, status: true });

    await friend.save();
    await user.save();

    res.status(200).json({ message: 'Demande d\'ami acceptée avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const declineFriendRequest = async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    // remove the friend request from the friend's friends list
    const friend = await User.findById(friendId);
    const updatedFriends = friend.friends.filter(friend => friend.friendId.toString() !== userId);
    if(updatedFriends.length === friend.friends.length){
      return res.status(404).json({ error: 'Demande d\'ami introuvable' });
    }
    friend.friends = updatedFriends;
    await friend.save();

    res.status(200).json({ message: 'Demande d\'ami refusée avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const cancelFriendRequest = async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    // remove the friend request from the user's friends list
    const user = await User.findById(userId);
    const updatedFriends = user.friends.filter(friend => friend.friendId.toString() !== friendId);
    if(updatedFriends.length === user.friends.length){
      return res.status(404).json({ error: 'Demande d\'ami introuvable' });
    }
    user.friends = updatedFriends;
    await user.save();
    res.status(200).json({ message: 'Demande d\'ami annulée avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const deleteFriend = async (req, res) => {
    try {
      const { userId, friendId } = req.body;
  
      const user = await User.findById(userId).catch(err => {
        throw new Error(err);      
      });

      if(!user){
        return res.status(404).json({ error: 'Utilisateur introuvable' });
      }
      const updatedFriends = user.friends.filter(friend => friend.friendId.toString() !== friendId);

      if( updatedFriends.length === user.friends.length ){
        return res.status(404).json({ error: 'Ami introuvable ou déjà supprimé' });
      }

      //remove the user from the friend's friends list
      const friend = await User.findById(friendId).catch(err => {
        throw new Error(err);
        
      });
      if(!friend){
        return res.status(404).json({ error: 'Ami introuvable' });
      }
      const updatedFriendFriends = friend.friends.filter(friend => friend.friendId.toString() !== userId);
      friend.friends = updatedFriendFriends;
    
      user.friends = updatedFriends;

      await friend.save();
      await user.save();
  
      res.status(200).json({ message: 'Ami supprimé avec succès' });
    } catch (err) {
      res.status(500).json({ error: err.message });
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
//     console.log("AA")
// console.log(req.params);

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
  deleteUser,
  getReceivedFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  cancelFriendRequest,
};
