const express = require("express");
const router = express.Router();
const { createListing } = require("../controllers/listingController");
const Listing = require("../models/Listing");

// POST: Create listing
router.post("/create", createListing);

// ✅ GET: Get all listings
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

module.exports = router;
