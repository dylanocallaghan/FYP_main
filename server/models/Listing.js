const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  features: [String], // e.g., ["WiFi", "Washer", "Heating"]
  availableFrom: { type: Date, default: Date.now },
  landlordEmail: String,
  landlordId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Listing", listingSchema);
