const Listing = require("../models/Listing");
const multer = require("multer");
const path = require("path");

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Only images (jpeg, jpg, png, gif) are allowed!");
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
}).single("image"); // Single image upload

const createListing = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: err });
    }

    const { title, location, price, description, features, landlordEmail, availableFrom, availableUntil, propertyType } = req.body;
    const images = req.files.map(file => `uploads/${path.basename(file.path)}`); // Save relative paths

    const newListing = new Listing({
      title,
      location,
      price,
      description,
      features,
      landlordEmail,
      availableFrom,
      availableUntil,
      propertyType,
      images // This now contains the relative image path
    });

    try {
      await newListing.save();
      res.status(200).send({ message: "Listing created successfully!" });
    } catch (error) {
      res.status(500).send({ message: "Failed to create listing" });
    }
  });
};

module.exports = { createListing };
