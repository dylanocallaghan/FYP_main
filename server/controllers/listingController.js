const Listing = require("../models/Listing");
const path = require("path");

const createListing = async (req, res) => {
  try {
    const {
      title,
      location,
      address,
      latitude,
      longitude,
      price,
      description,
      features,
      landlordEmail,
      availableFrom,
      availableUntil,
      propertyType,
      roomType,
      furnishing,
      leaseLength,
      landlordNote,
      rules,
      billsIncluded
    } = req.body;

    const newListing = new Listing({
      title,
      location,
      address,
      latitude,
      longitude,
      price,
      description,
      features: Array.isArray(features) ? features : [features],
      landlordEmail,
      availableFrom,
      availableUntil,
      propertyType,
      roomType,
      furnishing,
      leaseLength,
      landlordNote,
      rules: typeof rules === "string" ? JSON.parse(rules) : rules || {},
      billsIncluded: typeof billsIncluded === "string" ? JSON.parse(billsIncluded) : billsIncluded || {},
      images: req.files.map((file) => file.filename),
    });

    await newListing.save();
    res.status(200).send({ message: "Listing created successfully!" });

  } catch (error) {
    console.error("Failed to create listing:", error);
    res.status(500).send({ message: "Failed to create listing" });
  }
};

module.exports = { createListing };
