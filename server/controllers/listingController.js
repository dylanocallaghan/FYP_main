const Listing = require("../models/Listing");

exports.createListing = async (req, res) => {
  try {
    const newListing = new Listing(req.body);
    await newListing.save();
    res.status(201).json({ message: "Listing created", listing: newListing });
  } catch (err) {
    res.status(500).json({ error: "Listing creation failed", details: err });
  }
};
