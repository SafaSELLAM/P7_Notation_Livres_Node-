const express = require("express");
const mongoose = require("mongoose");
const bookRoutes = require("./Routes/book");
const userRoutes = require("./Routes/user");
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

app.get("/api/books/bestrating", (req, res, next) => {
  res.send("rating okay!");
  next();
});

// auth requis

app.post("/api/books/:id/rating", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({ message: "ok!" });
  next();
});

app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);
module.exports = app;
