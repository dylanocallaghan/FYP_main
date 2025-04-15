const Listing = require("../models/Listing");

// Get all listings
const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (err) {
    console.error("Error fetching listings:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get single listing by ID
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.json(listing);
  } catch (err) {
    console.error("Error fetching listing:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const createListing = async (req, res) => {
  try {
    req.body.billsIncluded = JSON.parse(req.body.billsIncluded || "{}");
    req.body.rules = JSON.parse(req.body.rules || "{}");

    if (typeof req.body.features === "string") {
      req.body.features = [req.body.features];
    }

    // ✅ Save just the filename instead of full path
    req.body.images = req.files.map(file => file.filename);

    const newListing = new Listing(req.body);
    await newListing.save();

    res.status(201).json(newListing);
  } catch (err) {
    console.error("❌ Error creating listing:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a listing
const updateListing = async (req, res) => {
  try {
    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Listing not found" });
    res.json(updated);
  } catch (err) {
    console.error("Error updating listing:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a listing
const deleteListing = async (req, res) => {
  try {
    const deleted = await Listing.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Listing not found" });
    res.json({ message: "Listing deleted" });
  } catch (err) {
    console.error("Error deleting listing:", err);
    res.status(500).json({ error: "Server error" });
  }
};


const getListingsByOwner = async (req, res) => {
  try {
    const landlordEmail = req.user.email;
    const listings = await Listing.find({ landlordEmail });
    res.json(listings);
  } catch (err) {
    console.error("Error fetching owner's listings:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getListingsByOwner, // ✅ Must be included
};


module.exports = {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getListingsByOwner, // ✅ include this
};
