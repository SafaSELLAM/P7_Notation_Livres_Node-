const express = require("express");
const router = express.Router();

const Book = require("../models/Book");

router.get("/", (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
  next();
});

router.get("//:id", (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(thing))
    .catch((error) => res.status(404).json({ error }));
  next();
});

// auth requis

router.post("/", (req, res, next) => {
  const book = new Book({
    ...req.body,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "livre enregistré!" }))
    .catch((error) => res.status(400).json({ error }));
  next();
});

router.put("/:id", (req, res, next) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Livre Modifié!" }))
    .catch((error) => res.status(400).json({ error }));
  next();
});

router.delete("/:id", (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "livre supprimé!" }))
    .catch((error) => res.status(400).json({ error }));
  next();
});

module.exports = router;
