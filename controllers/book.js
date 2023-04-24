const Book = require("../models/Book");

exports.createBook = (req, res, next) => {
  const book = new Book({
    ...req.body,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "livre enregistré!" }))
    .catch((error) => res.status(400).json({ error }));
  next();
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
  next();
};
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(thing))
    .catch((error) => res.status(404).json({ error }));
  next();
};
exports.updateBook = (req, res, next) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Livre Modifié!" }))
    .catch((error) => res.status(400).json({ error }));
  next();
};
exports.deleteBook = (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "livre supprimé!" }))
    .catch((error) => res.status(400).json({ error }));
  next();
};

exports.getRatings = (req, res, next) => {
  res.send("rating okay!");
  next();
};

exports.postRatings = (req, res) => {
  console.log(req.body);
  res.status(201).json({ message: "ok!" });
};
