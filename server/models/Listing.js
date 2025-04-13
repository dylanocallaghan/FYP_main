const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  price: { type: Number, required: true },
  description: { type: String, default: "" },
  features: { type: [String], default: [] },

  availableFrom: { type: Date, default: Date.now },
  availableUntil: { type: Date },
  leaseLength: { type: String, default: "" },

  propertyType: { type: String, default: "" },
  roomType: { type: String, default: "" },
  furnishing: { type: String, default: "" },

  billsIncluded: {
    internet: { type: Boolean, default: false },
    electricity: { type: Boolean, default: false },
    water: { type: Boolean, default: false },
  },

  rules: {
    noPets: { type: Boolean, default: false },
    noSmoking: { type: Boolean, default: false },
  },

  landlordNote: { type: String, default: "" },
  landlordEmail: { type: String, default: "" },
  landlordId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  createdAt: { type: Date, default: Date.now },
  images: { type: [String], default: [] },
});

module.exports = mongoose.model('Listing', listingSchema);
