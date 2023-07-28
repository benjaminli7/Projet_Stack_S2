const { User } = require("../db");
const { Op } = require('sequelize');

exports.getAllUsersWithELO = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['username', 'elo'],
            where: {
                [Op.or]: [
                    { isVerified: true },
                    { isGoogle: true }
                ],
                elo: {
                    [Op.ne]: null
                }
            },
            order: [['elo', 'DESC']]
        });
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs.' });
    }
};
exports.getUserEloByUsername = async (req, res) => {
    try {
        const usernameFromToken = req.user.infos.username;

        if (!usernameFromToken) {
            return res.status(400).json({ message: 'Le nom d\'utilisateur est requis.' });
        }

        const userData = await User.findOne({
            attributes: ['username', 'elo'],
            where: { username: usernameFromToken }
        });

        if (!userData) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        res.status(200).json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'ELO de l\'utilisateur.' });
    }
};




