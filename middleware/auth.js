require("dotenv").config();
const jwt = require("jsonwebtoken");

// Middleware pour la vérification du token d'authentification
module.exports = (req, res, next) => {
  try {
    // Extraction du token d'authentification de l'en-tête Authorization de la requête
    const token = req.headers.authorization.split(" ")[1];
    // Vérification du token d'authentification en utilisant la clé secrète stockée dans la variable d'environnement
    const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
    // Extraction de l'ID de l'utilisateur à partir du token décodé
    const userId = decodedToken.userId;
    // Ajout de l'ID de l'utilisateur à la requête pour qu'il puisse etre exploiter.
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
