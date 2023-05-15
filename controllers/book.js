const Book = require("../models/Book");
const fs = require("fs");

exports.createBook = (req, res, next) => {
  // Récupère l'objet book envoyé dans la requête sous forme de chaîne de caractères
  const bookObject = JSON.parse(req.body.book);
  // Suppression de _id et _userId de l'objet book, pour éviter toute modification non autorisée
  delete bookObject._id;
  delete bookObject._userId;

  const book = new Book({
    ...bookObject,
    //On récupère le user id vérifié
    userId: req.auth.userId,
    // Enregistre l'URL de l'image en utilisant le protocole, le nom d'hôte et le nom de fichier généré
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Livre ajouté!" });
    })
    .catch((error) => {
      res.status(401).json({ error });
    });
};

exports.getAllBooks = (req, res) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(404).json({ error }));
};

exports.getOneBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.updateBook = (req, res) => {
  // 2 possibilités de modification : une avec modification image et l'autre sans.
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  //eviter les modifications par un utilisateur malveillant
  delete bookObject._userId;
  //sélectionne le livre à modifier
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "unauthorized request" });
      } else {
        //si la modification concerne l'image
        if (req.file) {
          //récupère le nom du fichier de l'image à supprimer
          const filename = book.imageUrl.split("/images")[1];
          // Supprimer l'ancienne image
          fs.unlink(`images/${filename}`, () => {});
        }

        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => {
            res.status(200).json({ message: "Livre Modifié!" });
          })
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  //sélectionne le livre à supprimer
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      //vérifie l'authentification du user
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "unauthorized" });
      } else {
        //supprime l'image du backend
        const filename = book.imageUrl.split("/images")[1];
        fs.unlink(`images/${filename}`, () => {
          //supprime le livre
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre supprimé!" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getRatings = (req, res) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json(error);
    });
};

exports.postRating = (req, res) => {
  // Récupérer l'ID de l'utilisateur et la note donnée.
  const userIdRatings = req.body.userId;
  const grade = req.body.rating;

  // Recherche le livre correspondant à l'ID fourni dans la requête.
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Vérifier si l'utilisateur a déjà soumis une évaluation pour ce livre.
      const alreadyRated = book.ratings.find(
        (rating) => rating.userId === userIdRatings
      );

      // Si l'utilisateur a déjà évalué le livre ou si l'ID de l'utilisateur ne correspond pas à celui fourni dans la requête, renvoyer un message d'erreur.
      if (alreadyRated || req.auth.userId !== userIdRatings) {
        res.status(403).json({ message: "non autorisé" });
      } else {
        // Calculer la note moyenne du livre en utilisant les notes précédentes et la note actuelle.
        const totalRating = book.ratings.reduce(
          (acc, rating) => acc + rating.grade,
          0
        );
        const averageRating = parseFloat(
          ((totalRating + grade) / (book.ratings.length + 1)).toFixed(2)
        );
        // Mettre à jour la note moyenne du livre dans la base de données.
        book.averageRating = averageRating;
        Book.updateOne(
          { _id: req.params.id },
          {
            averageRating: averageRating,
            // Ajoute la nouvelle note aux notes existantes pour ce livre.
            $push: { ratings: { userId: userIdRatings, grade: grade } },
          }
        )
          .then(() => {
            res.status(201).json(book);
          })
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
