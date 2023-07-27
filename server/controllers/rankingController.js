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
                    [Op.ne]: null  // S'assurer que l'utilisateur a un ELO.
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



