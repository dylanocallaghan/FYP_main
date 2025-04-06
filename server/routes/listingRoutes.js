const express = require("express");
const multer = require("multer");
const path = require("path");
const Listing = require("../models/Listing");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // Path to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique file name
  }
});


const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find(); // Fetch listings from the database
    res.status(200).json(listings); // Send the listings as a JSON response
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch listings" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.json(listing);
  } catch (err) {
    console.error("Error fetching listing:", err);
    res.status(500).json({ error: "Failed to fetch listing" });
  }
});

router.post("/create", upload.array("images", 5), async (req, res) => {
  try {
    const { title, location, price, description, features, landlordEmail, availableFrom, availableUntil, propertyType } = req.body;
    const images = req.files.map(file => file.path);  // Store image paths in DB

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
      images  // Save image paths in the DB
    });

    await newListing.save();
    res.status(201).json({ message: "Listing created successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create listing." });
  }
});

module.exports = router;
