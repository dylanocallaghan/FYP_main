const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");

const {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getListingsByOwner // ✅ import this
} = require("../controllers/listingController");

// ✅ More specific route must come first
router.get("/owner", verifyToken, getListingsByOwner);
router.get("/", getAllListings);
router.get("/:id", getListingById);
router.post("/", verifyToken, createListing);
router.put("/:id", verifyToken, updateListing);
router.delete("/:id", verifyToken, deleteListing);

module.exports = router;
