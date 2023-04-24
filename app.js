const express = require("express");
const mongoose = require("mongoose");
const Book = require("./models/Book");

mongoose
  .connect(
    "mongodb+srv://User_20:UnzpLH3ghGvR8h1z@cluster0.hugilbo.mongodb.net/test",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée!"));

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,x-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.post("/api/auth/signup", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: "connecté!",
  });
  next();
});

app.post("/api/auth/login", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: "okay!",
  });
  next();
});

app.get("/api/books", (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
  next();
});

app.get("/api/books/bestrating", (req, res, next) => {
  res.send("rating okay!");
  next();
});

app.get("/api/books/:id", (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(thing))
    .catch((error) => res.status(404).json({ error }));
  next();
});

// auth requis

app.post("/api/books", (req, res, next) => {
  const book = new Book({
    ...req.body,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "livre enregistré!" }))
    .catch((error) => res.status(400).json({ error }));
  next();
});

app.put("/api/books/:id", (req, res, next) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Livre Modifié!" }))
    .catch((error) => res.status(400).json({ error }));
  next();
});

app.delete("/api/books/:id", (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "livre supprimé!" }))
    .catch((error) => res.status(400).json({ error }));
  next();
});

app.post("/api/books/:id/rating", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({ message: "ok!" });
  next();
});

module.exports = app;
