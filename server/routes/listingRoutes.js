const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // e.g., .jpg, .png
    const name = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, name);
  }
});

const upload = multer({ storage }); // ✅ USE diskStorage, not dest: "uploads/"

const { verifyToken } = require("../middleware/authMiddleware");
const {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getListingsByOwner
} = require("../controllers/listingController");

router.get("/owner", verifyToken, getListingsByOwner);
router.get("/", getAllListings);
router.get("/:id", getListingById);

// ✅ Correct upload middleware in place
router.post("/", verifyToken, upload.array("images"), createListing);

router.put("/:id", verifyToken, updateListing);
router.delete("/:id", verifyToken, deleteListing);

module.exports = router;
