const sharp = require("sharp");
const multer = require("multer");

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
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

const upload = multer({ storage: storage }).single("image");

//  redimension l'image
const resizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const imageBuffer = await sharp(req.file.path)
      .resize({ width: 206, height: 260, fit: "fill" })
      .jpeg({ quality: 80 })
      .toBuffer();

    await sharp(imageBuffer).toFile(`images/${req.file.filename}`);

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

module.exports = { upload, resizeImage };
