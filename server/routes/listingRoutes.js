const express = require("express");
const multer = require("multer");
const path = require("path");
const Listing = require("../models/Listing");
const { createListing } = require("../controllers/listingController"); // ✅ import controller
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

// ✅ Replaced this route with your working controller logic
router.post("/create", upload.array("images", 10), createListing);

module.exports = router;
