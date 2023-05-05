const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split("").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

const fileFilter = (req, file, callback) => {
  if (MIME_TYPES[file.mimetype]) {
    callback(null, true);
  } else {
    callback(new Error("Invalid file type"));
  }
};

const upload = multer({ storage, fileFilter }).single("image");

exports.uploadImage = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: "File too large" });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Redimensionnement et compression de l'image
    const image = sharp(req.file.path);
    await image
      .resize({ width: 800 })
      .jpeg({ quality: 80 })
      .toFile(
        path.join(__dirname, "..", "public", "images", req.file.filename)
      );

    next();
  });
};
module.exports = multer({ storage }).single("image");
