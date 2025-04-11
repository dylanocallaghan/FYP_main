const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true }, // New
  latitude: { type: Number },                // New
  longitude: { type: Number },               // New
  price: { type: Number, required: true },
  description: String,
  features: [String],
  availableFrom: { type: Date, default: Date.now },
  landlordEmail: String,
  landlordId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  images: [String],
});


module.exports = mongoose.model('Listing', listingSchema);
