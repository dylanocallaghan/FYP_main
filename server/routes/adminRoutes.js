const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Listing = require("../models/Listing");
const Application = require("../models/Application");
const Group = require("../models/Group");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Dashboard Stats
router.get("/stats", verifyToken, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalListings = await Listing.countDocuments();
    const totalApplications = await Application.countDocuments();
    const recentListings = await Listing.find().sort({ createdAt: -1 }).limit(5);
    res.json({ totalUsers, totalListings, totalApplications, recentListings });
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
});

// Get all users with additional stats
router.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const applications = await Application.find();
    const listings = await Listing.find();
    const groups = await Group.find();

    const usersWithStats = users.map((u) => {
      const id = u._id.toString();
      const appCount = applications.filter((a) => a.applicantId?.toString() === id).length;
      const listingCount = listings.filter((l) => l.landlordEmail === u.email).length;
      const group = groups.find((g) => g.creator.toString() === id || g.members.includes(id));

      return {
        ...u.toObject(),
        applicationCount: appCount,
        listingCount,
        groupStatus: group ? (group.creator.toString() === id ? "Creator" : "Member") : "None"
      };
    });

    res.json(usersWithStats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Update admin note
router.patch("/users/:id/note", verifyToken, isAdmin, async (req, res) => {
  try {
    const { note } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { adminNote: note }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to update admin note" });
  }
});

// Delete a user
router.delete("/users/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// Change user role
router.patch("/user/:id/role", verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { accountType: req.body.role }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to update user role" });
  }
});

// Get all listings
router.get("/listings", verifyToken, isAdmin, async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch listings" });
  }
});

// Delete a listing
router.delete("/listings/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: "Listing deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete listing" });
  }
});

// Edit listing
router.patch("/listing/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: "Failed to update listing" });
  }
});

// Get all applications
router.get("/applications", verifyToken, isAdmin, async (req, res) => {
  try {
    const apps = await Application.find()
      .populate("applicantId", "username")
      .populate("groupId", "name")
      .populate("listingId", "title");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

// Delete application
router.delete("/applications/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: "Application deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete application" });
  }
});

module.exports = router;
