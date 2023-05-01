const Book = require("../models/Book");
const fs = require("fs");
const jwt = require("jsonwebtoken");

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    ratings: [],
    averageRating: 0,
  });
  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Livre ajouté!" });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => console.log(error));
};
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};
exports.updateBook = (req, res) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "unauthorized request" });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Livre Modifié!" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
exports.deleteBook = (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "unauthorized" });
      } else {
        const filename = book.imageUrl.split("/images")[1];
        fs.unlink(`images/${filename}`, () => {
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
    res.status(200).json(console.log(books));
  })
  .catch((error) => {
    res.status(400).json(console.log(error));
  });
};

exports.postRating = (req, res) => {
  const userIdRatings = req.body.userId;
  const grade = req.body.rating;
  console.log(userIdRatings, grade, req.params.id);

  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const userId = decodedToken.userId;

  // Vérifier si la note est comprise entre 0 et 5
  if (grade < 0 || grade > 5) {
    return res
      .status(400)
      .json({ message: "La note doit être comprise entre 0 et 5" });
  }

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      const alreadyRated = book.ratings.find(
        (rating) => rating.userId === userIdRatings
      );

      if (alreadyRated || userId !== userIdRatings) {
        res.status(403).json({ message: "Livré déjà noté" });
      } else {
        const totalRating = book.ratings.reduce(
          (acc, rating) => acc + rating.grade,
          0
        );
        const averageRating = (totalRating + grade) / (book.ratings.length + 1);
        book.averageRating = averageRating;
 Book.updateOne(
          { _id: req.params.id },
          {
            averageRating: averageRating,
            $push: { ratings: { userId: userIdRatings, grade: grade } },
          }
        )
          .then(() => {
            res.status(201).json({ message: "Note ajoutée avec succès" });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
