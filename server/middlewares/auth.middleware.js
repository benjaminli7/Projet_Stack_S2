const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// Fonction middleware pour vérifier et authentifier un jeton JWT
const authenticateToken = (req, res, next) => {
    // Récupère la valeur de l'en-tête d'autorisation de la requête
    const authHeader = req.headers['authorization'];

    // Vérifie si l'en-tête d'autorisation existe et extrait le jeton d'authentification
    const token = authHeader && authHeader.split(' ')[1];

    // console.log(token);
    // authHeader : contient la valeur de l'en-tête d'autorisation de la requête
    // token : contient le jeton d'authentification extrait de l'en-tête d'autorisation
    // Vérification si le jeton est présent    

    if (!token) {
        return res.status(401).json({ error: 'Non autorisé' });
    }

    // Vérification de la validité du jeton
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        let user = await User.findOne({ where: { id: decoded.infos.id } });
        if (err || user.status == 1) {
            return res.status(401).json({ error: 'Jeton invalide, vous êtes peut être ban' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = authenticateToken;
