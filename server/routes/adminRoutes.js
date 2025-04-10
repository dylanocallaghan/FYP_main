const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Listing = require("../models/Listing");
const Message = require("../models/Message");

router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalListings = await Listing.countDocuments();
    const totalMessages = await Message.countDocuments();

    const recentListings = await Listing.find().sort({ createdAt: -1 }).limit(5);
    const recentMessages = await Message.find().sort({ timestamp: -1 }).limit(5);

    res.status(200).json({
      totalUsers,
      totalListings,
      totalMessages,
      recentListings,
      recentMessages,
    });
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
});

module.exports = router;
