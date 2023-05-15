const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10) //hasher le mot de passe avec bcrypt
    .then((hash) => {
      //création nouvel user et récupère email + mdp caché
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé!" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  //recherche user avec l'email fournie
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "paire login/mot de passes incorrecte" });
      }
      bcrypt
        .compare(req.body.password, user.password) //si user existe, comparé mdp fourni avec le mdp hashé
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "paire login/mot de passes incorrecte" });
          }
          //si email et mdp corects, crée un token JWT et envoit le dans la réponse
          res.status(200).json({
            userId: user._id,
            //sign pour génèrer un nouveau token JWT
            token: jwt.sign(
              { userId: user._id },
              //deuxième argument est une clé secrète
              process.env.RANDOM_TOKEN_SECRET,
              {
                expiresIn: "24h",
              }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
