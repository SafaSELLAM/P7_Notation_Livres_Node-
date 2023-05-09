const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const bookCtrl = require("../controllers/book");

router.get("/", bookCtrl.getAllBooks);
router.get("/bestrating", bookCtrl.getRatings);
router.post("/", auth, multer.upload, multer.resizeImage, bookCtrl.createBook);
router.get("/:id", bookCtrl.getOneBook);

router.put(
  "/:id",
  auth,
  multer.upload,
  multer.resizeImage,
  bookCtrl.updateBook
);
// router.put("/:id", auth, upload, resizeImage, bookCtrl.updateBook);
router.delete("/:id", auth, bookCtrl.deleteBook);
router.post("/:id/rating", auth, bookCtrl.postRating);

module.exports = router;
