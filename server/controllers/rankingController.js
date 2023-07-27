const { User } = require("../db");

exports.getAllUsersWithELO = async (req, res) => {
    try {
        const users = await User.find().select('username elo');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs.' });
    }
};
